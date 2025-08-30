import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";
import { Contact } from "@/lib/models/Contact";
import { connectToDatabase } from "@/lib/database/mongodb";

// Validation schema
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

// Create transporter (configure in your .env file)
const createTransporter = () => {
  if (process.env.EMAIL_SERVER_HOST) {
    return nodemailer.createTransporter({
      host: process.env.EMAIL_SERVER_HOST,
      port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });
  }
  return null;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = contactSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = validationResult.data;

    // Connect to database
    await connectToDatabase();

    // Save to database
    const contactSubmission = new Contact({
      name,
      email,
      subject,
      message,
      ipAddress:
        request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
      source: "website",
    });

    await contactSubmission.save();

    // Create transporter
    const transporter = createTransporter();

    if (transporter) {
      // Send email notification
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || "noreply@yourapp.com",
        to: process.env.CONTACT_EMAIL || "contact@yourapp.com",
        subject: `New Contact Form Submission: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">New Contact Form Submission</h2>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Contact Details</h3>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject}</p>
            </div>
            <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
              <h3 style="margin-top: 0;">Message</h3>
              <p style="line-height: 1.6;">${message}</p>
            </div>
            <div style="margin-top: 20px; padding: 15px; background: #e8f4fd; border-radius: 8px;">
              <p style="margin: 0; font-size: 14px; color: #666;">
                This message was sent via the contact form on your website.
              </p>
            </div>
          </div>
        `,
      });

      // Send confirmation email to user
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || "noreply@yourapp.com",
        to: email,
        subject: "Thank you for contacting us",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Thank you for your message!</h2>
            <p>Hi ${name},</p>
            <p>We've received your message and will get back to you as soon as possible, typically within 24 hours.</p>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Your Message Summary</h3>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Message:</strong> ${message}</p>
            </div>
            <p>Best regards,<br>Support Team</p>
          </div>
        `,
      });
    }

    // Log the contact form submission (in production, save to database)
    console.log("Contact form submission:", {
      name,
      email,
      subject,
      timestamp: new Date().toISOString(),
      ip: request.headers.get("x-forwarded-for") || "unknown",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully! We'll get back to you soon.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);

    return NextResponse.json(
      {
        error: "Failed to send message",
        message: "Something went wrong. Please try again later.",
      },
      { status: 500 }
    );
  }
}

// Handle GET requests (optional - for testing)
export async function GET() {
  return NextResponse.json(
    {
      message: "Contact API endpoint is working",
      endpoints: {
        POST: "/api/contact - Submit contact form",
      },
    },
    { status: 200 }
  );
}
