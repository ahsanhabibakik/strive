import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { emailService, EmailData } from "@/lib/email";
import { EmailLog } from "@/lib/models/EmailLog";
import { User } from "@/lib/models/User";
import { RBAC } from "@/lib/rbac";
import connectToDatabase from "@/lib/mongoose";
import { z } from "zod";
import { logger } from "@/lib/utils/logger";

// Validation schema for email sending
const emailSchema = z.object({
  to: z.union([z.string().email(), z.array(z.string().email())]),
  subject: z.string().min(1, "Subject is required"),
  template: z.string().optional(),
  html: z.string().optional(),
  text: z.string().optional(),
  variables: z.record(z.any()).optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
  provider: z.enum(["resend", "smtp"]).optional(),
});

const bulkEmailSchema = z.object({
  emails: z.array(emailSchema).max(100, "Maximum 100 emails per batch"),
  template: z.string().optional(),
  variables: z.record(z.any()).optional(),
  tags: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });

    if (!user || !RBAC.hasPermission(user, "emails:send")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const body = await request.json();
    const isBulk = Array.isArray(body.emails);

    if (isBulk) {
      return await handleBulkEmail(body, user);
    } else {
      return await handleSingleEmail(body, user);
    }
  } catch (error) {
    logger.error("Email API error", { error: error.message });

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function handleSingleEmail(body: any, user: any) {
  try {
    const validatedData = emailSchema.parse(body);

    // Prepare email data
    const emailData: EmailData = {
      to: validatedData.to,
      subject: validatedData.subject,
      html: validatedData.html,
      text: validatedData.text,
      tags: [...(validatedData.tags || []), "api", `user:${user._id}`],
      metadata: {
        ...validatedData.metadata,
        sentBy: user._id,
        sentViaApi: true,
      },
    };

    let result;

    if (validatedData.template) {
      // Send using template
      result = await emailService.sendTemplate(
        validatedData.template,
        emailData,
        validatedData.variables || {}
      );
    } else {
      // Send direct email
      if (!emailData.html && !emailData.text) {
        return NextResponse.json(
          { error: "Either html, text, or template is required" },
          { status: 400 }
        );
      }

      result = await emailService.send(emailData, validatedData.provider);
    }

    // Log the email
    await logEmail(emailData, result, user._id, validatedData.template);

    return NextResponse.json({
      success: result.success,
      messageId: result.messageId,
      provider: result.provider,
      error: result.error,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}

async function handleBulkEmail(body: any, user: any) {
  try {
    const validatedData = bulkEmailSchema.parse(body);
    const results = [];

    // Process emails in batches to avoid overwhelming the system
    const batchSize = 10;
    for (let i = 0; i < validatedData.emails.length; i += batchSize) {
      const batch = validatedData.emails.slice(i, i + batchSize);

      const batchPromises = batch.map(async (emailData, index) => {
        const fullEmailData: EmailData = {
          ...emailData,
          tags: [
            ...(emailData.tags || []),
            ...(validatedData.tags || []),
            "bulk",
            `batch:${Math.floor(i / batchSize) + 1}`,
            `user:${user._id}`,
          ],
          metadata: {
            ...emailData.metadata,
            ...validatedData.variables,
            sentBy: user._id,
            sentViaApi: true,
            bulkIndex: i + index,
          },
        };

        let result;

        if (validatedData.template || emailData.template) {
          const template = emailData.template || validatedData.template!;
          const variables = {
            ...validatedData.variables,
            ...emailData.variables,
          };

          result = await emailService.sendTemplate(template, fullEmailData, variables);
        } else {
          result = await emailService.send(fullEmailData);
        }

        // Log the email
        await logEmail(
          fullEmailData,
          result,
          user._id,
          emailData.template || validatedData.template
        );

        return {
          to: emailData.to,
          success: result.success,
          messageId: result.messageId,
          provider: result.provider,
          error: result.error,
        };
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Small delay between batches to be respectful to email providers
      if (i + batchSize < validatedData.emails.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    const summary = {
      total: results.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
    };

    return NextResponse.json({
      success: true,
      summary,
      results,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid bulk email data", details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}

async function logEmail(emailData: EmailData, result: any, userId: string, template?: string) {
  try {
    const emailLog = new EmailLog({
      to: Array.isArray(emailData.to) ? emailData.to : [emailData.to],
      from: emailData.from || process.env.SMTP_FROM || "noreply@strive.com",
      subject: emailData.subject,
      template,
      provider: result.provider,
      messageId: result.messageId,
      status: result.success ? "sent" : "failed",
      error: result.error,
      tags: emailData.tags,
      metadata: emailData.metadata,
      userId,
      sentAt: new Date(),
    });

    await emailLog.save();
  } catch (logError) {
    logger.error("Failed to log email", { error: logError.message });
    // Don't fail the email send if logging fails
  }
}
