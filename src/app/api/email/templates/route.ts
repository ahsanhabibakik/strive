import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { User } from "@/lib/models/User";
import { RBAC } from "@/lib/rbac";
import connectToDatabase from "@/lib/mongoose";
import { emailService } from "@/lib/email";
import templates from "@/lib/email/templates";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });

    if (!user || !RBAC.hasPermission(user, "emails:read")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const templateName = searchParams.get("name");

    if (templateName) {
      // Get specific template
      const template = templates[templateName];

      if (!template) {
        return NextResponse.json({ error: "Template not found" }, { status: 404 });
      }

      return NextResponse.json({ template });
    }

    // Get all templates (metadata only)
    const templateList = Object.entries(templates).map(([key, template]) => ({
      name: key,
      subject: template.subject,
      variables: template.variables || [],
    }));

    return NextResponse.json({
      templates: templateList,
      count: templateList.length,
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Preview template with sample data
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });

    if (!user || !RBAC.hasPermission(user, "emails:read")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const { templateName, variables = {}, preview = false } = await request.json();

    if (!templateName) {
      return NextResponse.json({ error: "Template name is required" }, { status: 400 });
    }

    const template = templates[templateName];

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    // Default variables for preview
    const defaultVariables = {
      user_name: "John Doe",
      app_name: process.env.NEXT_PUBLIC_APP_NAME || "Strive",
      app_url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      dashboard_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard`,
      support_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/support`,
      unsubscribe_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/unsubscribe`,
      company_name: "Strive Inc.",
      company_address: "123 Innovation Street, Tech City, TC 12345",
      ...variables,
    };

    if (preview) {
      // Generate preview HTML
      const processedHtml = processTemplate(template.html, defaultVariables);
      const processedText = template.text ? processTemplate(template.text, defaultVariables) : "";
      const processedSubject = processTemplate(template.subject, defaultVariables);

      return NextResponse.json({
        template: {
          name: template.name,
          subject: processedSubject,
          html: processedHtml,
          text: processedText,
          variables: template.variables,
        },
        processedVariables: defaultVariables,
      });
    }

    // Send test email
    const testEmail = {
      to: user.email,
      subject: "Test Email - " + template.subject,
      template: templateName,
      variables: defaultVariables,
      tags: ["test", "preview"],
      metadata: {
        testSent: true,
        sentBy: user._id,
      },
    };

    const result = await emailService.sendTemplate(templateName, testEmail, defaultVariables);

    return NextResponse.json({
      success: result.success,
      messageId: result.messageId,
      provider: result.provider,
      error: result.error,
      sentTo: user.email,
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function processTemplate(template: string, variables: Record<string, any>): string {
  let processed = template;

  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    processed = processed.replace(regex, String(value || ""));
  }

  return processed;
}
