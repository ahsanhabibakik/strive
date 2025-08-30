import { Resend } from "resend";
import { logger } from "../monitoring";

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export class EmailService {
  private static instance: EmailService;

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  async send(
    options: EmailOptions
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const { to, subject, html, text, from } = options;

      if (!process.env.RESEND_API_KEY || !resend) {
        logger.warn("RESEND_API_KEY not configured, logging email instead");
        console.warn("📧 Email would be sent:", { to, subject });
        return { success: true, messageId: "dev-mode" };
      }

      const result = await resend.emails.send({
        from: from || process.env.EMAIL_FROM || "noreply@strive.com",
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        text,
      });

      if (result.error) {
        logger.error("Failed to send email", { error: result.error, to, subject });
        return { success: false, error: result.error.message };
      }

      logger.info("Email sent successfully", { messageId: result.data?.id, to, subject });
      return { success: true, messageId: result.data?.id };
    } catch (error) {
      logger.error("Email service error", { error, options });
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async sendWelcome(to: string, name: string): Promise<{ success: boolean; error?: string }> {
    const { html, text } = this.getWelcomeEmailTemplate(name);

    return this.send({
      to,
      subject: "Welcome to Strive!",
      html,
      text,
    });
  }

  async sendPasswordReset(
    to: string,
    name: string,
    resetUrl: string
  ): Promise<{ success: boolean; error?: string }> {
    const { html, text } = this.getPasswordResetTemplate(name, resetUrl);

    return this.send({
      to,
      subject: "Reset Your Password - Strive",
      html,
      text,
    });
  }

  async sendEmailVerification(
    to: string,
    name: string,
    verificationUrl: string
  ): Promise<{ success: boolean; error?: string }> {
    const { html, text } = this.getEmailVerificationTemplate(name, verificationUrl);

    return this.send({
      to,
      subject: "Verify Your Email - Strive",
      html,
      text,
    });
  }

  private getWelcomeEmailTemplate(name: string): { html: string; text: string } {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to Strive</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #4F46E5;">Welcome to Strive, ${name}!</h1>
            <p>Thank you for joining Strive. We're excited to have you on board!</p>
            <p>Your account has been successfully created. You can now access your dashboard and start exploring our features.</p>
            <div style="margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL}/dashboard" 
                 style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Go to Dashboard
              </a>
            </div>
            <p>If you have any questions, feel free to reach out to our support team.</p>
            <p>Best regards,<br>The Strive Team</p>
          </div>
        </body>
      </html>
    `;

    const text = `Welcome to Strive, ${name}!

Thank you for joining Strive. We're excited to have you on board!

Your account has been successfully created. You can now access your dashboard and start exploring our features.

Visit your dashboard: ${process.env.NEXTAUTH_URL}/dashboard

If you have any questions, feel free to reach out to our support team.

Best regards,
The Strive Team`;

    return { html, text };
  }

  private getPasswordResetTemplate(name: string, resetUrl: string): { html: string; text: string } {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Reset Your Password</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #4F46E5;">Reset Your Password</h1>
            <p>Hi ${name},</p>
            <p>You requested to reset your password for your Strive account. Click the button below to reset it:</p>
            <div style="margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p>This link will expire in 1 hour for security reasons.</p>
            <p>If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
            <p>Best regards,<br>The Strive Team</p>
          </div>
        </body>
      </html>
    `;

    const text = `Reset Your Password

Hi ${name},

You requested to reset your password for your Strive account. Click the link below to reset it:

${resetUrl}

This link will expire in 1 hour for security reasons.

If you didn't request this password reset, please ignore this email or contact support if you have concerns.

Best regards,
The Strive Team`;

    return { html, text };
  }

  private getEmailVerificationTemplate(
    name: string,
    verificationUrl: string
  ): { html: string; text: string } {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Verify Your Email</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #4F46E5;">Verify Your Email</h1>
            <p>Hi ${name},</p>
            <p>Thank you for signing up for Strive! To complete your registration, please verify your email address by clicking the button below:</p>
            <div style="margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background-color: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Verify Email
              </a>
            </div>
            <p>This link will expire in 24 hours for security reasons.</p>
            <p>If you didn't create this account, please ignore this email.</p>
            <p>Best regards,<br>The Strive Team</p>
          </div>
        </body>
      </html>
    `;

    const text = `Verify Your Email

Hi ${name},

Thank you for signing up for Strive! To complete your registration, please verify your email address by clicking the link below:

${verificationUrl}

This link will expire in 24 hours for security reasons.

If you didn't create this account, please ignore this email.

Best regards,
The Strive Team`;

    return { html, text };
  }
}

export const emailService = EmailService.getInstance();
