/**
 * Unified Email Service
 * Abstraction layer for multiple email providers with fallback support
 */

import { Resend } from "resend";
import nodemailer from "nodemailer";
import { logger } from "@/lib/utils/logger";

export interface EmailProvider {
  name: string;
  send(data: EmailData): Promise<EmailResult>;
  isConfigured(): boolean;
}

export interface EmailData {
  to: string | string[];
  from?: string;
  subject: string;
  html?: string;
  text?: string;
  attachments?: EmailAttachment[];
  headers?: Record<string, string>;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface EmailAttachment {
  filename: string;
  content: Buffer | string;
  contentType?: string;
  cid?: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  provider: string;
}

export interface EmailTemplate {
  name: string;
  subject: string;
  html: string;
  text?: string;
  variables?: string[];
}

class ResendProvider implements EmailProvider {
  private client: Resend;
  public name = "resend";

  constructor() {
    if (process.env.RESEND_API_KEY) {
      this.client = new Resend(process.env.RESEND_API_KEY);
    }
  }

  isConfigured(): boolean {
    return !!process.env.RESEND_API_KEY;
  }

  async send(data: EmailData): Promise<EmailResult> {
    try {
      if (!this.client) {
        throw new Error("Resend client not configured");
      }

      const result = await this.client.emails.send({
        from: data.from || process.env.SMTP_FROM || "noreply@strive.com",
        to: Array.isArray(data.to) ? data.to : [data.to],
        subject: data.subject,
        html: data.html,
        text: data.text,
        attachments: data.attachments?.map(att => ({
          filename: att.filename,
          content: att.content,
          ...(att.contentType && { content_type: att.contentType }),
        })),
        headers: data.headers,
        tags: data.tags?.map(tag => ({ name: "category", value: tag })),
      });

      return {
        success: true,
        messageId: result.data?.id,
        provider: this.name,
      };
    } catch (error) {
      logger.error("Resend email failed", { error: error.message, data });
      return {
        success: false,
        error: error.message,
        provider: this.name,
      };
    }
  }
}

class SMTPProvider implements EmailProvider {
  private transporter: nodemailer.Transporter;
  public name = "smtp";

  constructor() {
    if (this.isConfigured()) {
      this.transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_PORT === "465",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }
  }

  isConfigured(): boolean {
    return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
  }

  async send(data: EmailData): Promise<EmailResult> {
    try {
      if (!this.transporter) {
        throw new Error("SMTP transporter not configured");
      }

      const result = await this.transporter.sendMail({
        from: data.from || process.env.SMTP_FROM,
        to: Array.isArray(data.to) ? data.to.join(",") : data.to,
        subject: data.subject,
        html: data.html,
        text: data.text,
        attachments: data.attachments,
        headers: data.headers,
      });

      return {
        success: true,
        messageId: result.messageId,
        provider: this.name,
      };
    } catch (error) {
      logger.error("SMTP email failed", { error: error.message, data });
      return {
        success: false,
        error: error.message,
        provider: this.name,
      };
    }
  }
}

class EmailService {
  private providers: EmailProvider[] = [];
  private defaultProvider?: EmailProvider;

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    const resend = new ResendProvider();
    const smtp = new SMTPProvider();

    // Add configured providers
    if (resend.isConfigured()) {
      this.providers.push(resend);
      if (!this.defaultProvider) this.defaultProvider = resend;
    }

    if (smtp.isConfigured()) {
      this.providers.push(smtp);
      if (!this.defaultProvider) this.defaultProvider = smtp;
    }

    if (this.providers.length === 0) {
      logger.warn("No email providers configured");
    } else {
      logger.info("Email service initialized", {
        providers: this.providers.map(p => p.name),
        default: this.defaultProvider?.name,
      });
    }
  }

  /**
   * Send email with automatic provider fallback
   */
  async send(data: EmailData, preferredProvider?: string): Promise<EmailResult> {
    if (this.providers.length === 0) {
      return {
        success: false,
        error: "No email providers configured",
        provider: "none",
      };
    }

    // Try preferred provider first
    if (preferredProvider) {
      const provider = this.providers.find(p => p.name === preferredProvider);
      if (provider) {
        const result = await provider.send(data);
        if (result.success) {
          await this.trackEmail(data, result);
          return result;
        }
        logger.warn("Preferred provider failed, trying fallbacks", {
          provider: preferredProvider,
          error: result.error,
        });
      }
    }

    // Try all providers until one succeeds
    for (const provider of this.providers) {
      if (preferredProvider && provider.name === preferredProvider) {
        continue; // Already tried above
      }

      const result = await provider.send(data);
      if (result.success) {
        await this.trackEmail(data, result);
        return result;
      }

      logger.warn("Provider failed, trying next", {
        provider: provider.name,
        error: result.error,
      });
    }

    // All providers failed
    const lastResult: EmailResult = {
      success: false,
      error: "All email providers failed",
      provider: "all",
    };

    await this.trackEmail(data, lastResult);
    return lastResult;
  }

  /**
   * Send email using template
   */
  async sendTemplate(
    templateName: string,
    data: EmailData,
    variables: Record<string, any> = {}
  ): Promise<EmailResult> {
    try {
      const template = await this.getTemplate(templateName);

      const processedData: EmailData = {
        ...data,
        subject: this.processTemplate(template.subject, variables),
        html: this.processTemplate(template.html, variables),
        text: template.text ? this.processTemplate(template.text, variables) : undefined,
        tags: [...(data.tags || []), `template:${templateName}`],
        metadata: {
          ...data.metadata,
          template: templateName,
          variables,
        },
      };

      return await this.send(processedData);
    } catch (error) {
      logger.error("Template email failed", {
        template: templateName,
        error: error.message,
      });

      return {
        success: false,
        error: `Template error: ${error.message}`,
        provider: "template",
      };
    }
  }

  /**
   * Process template with variables
   */
  private processTemplate(template: string, variables: Record<string, any>): string {
    let processed = template;

    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
      processed = processed.replace(regex, String(value || ""));
    }

    return processed;
  }

  /**
   * Get email template
   */
  private async getTemplate(name: string): Promise<EmailTemplate> {
    // This would typically load from database or file system
    // For now, we'll use built-in templates
    const templates = await import("./templates");
    const template = templates.default[name];

    if (!template) {
      throw new Error(`Template '${name}' not found`);
    }

    return template;
  }

  /**
   * Track email sending for analytics
   */
  private async trackEmail(data: EmailData, result: EmailResult): Promise<void> {
    try {
      // Store email tracking data
      const trackingData = {
        to: Array.isArray(data.to) ? data.to : [data.to],
        subject: data.subject,
        provider: result.provider,
        success: result.success,
        messageId: result.messageId,
        error: result.error,
        tags: data.tags,
        metadata: data.metadata,
        sentAt: new Date(),
      };

      // Save to database (implement based on your needs)
      await this.saveEmailTracking(trackingData);
    } catch (error) {
      logger.error("Email tracking failed", { error: error.message });
      // Don't fail the email send if tracking fails
    }
  }

  private async saveEmailTracking(data: any): Promise<void> {
    // TODO: Implement database storage for email tracking
    // For now, just log it
    logger.info("Email tracked", data);
  }

  /**
   * Test email configuration
   */
  async testConfiguration(): Promise<
    {
      provider: string;
      configured: boolean;
      working: boolean;
      error?: string;
    }[]
  > {
    const results = [];

    for (const provider of this.providers) {
      const configured = provider.isConfigured();
      let working = false;
      let error: string | undefined;

      if (configured) {
        try {
          // Send a test email to verify configuration
          const testResult = await provider.send({
            to: process.env.TEST_EMAIL || "test@example.com",
            subject: "Email Configuration Test",
            html: "<p>This is a test email to verify email configuration.</p>",
            text: "This is a test email to verify email configuration.",
            tags: ["test", "configuration"],
          });

          working = testResult.success;
          error = testResult.error;
        } catch (testError) {
          error = testError.message;
        }
      }

      results.push({
        provider: provider.name,
        configured,
        working,
        error,
      });
    }

    return results;
  }

  /**
   * Get available providers
   */
  getProviders(): string[] {
    return this.providers.map(p => p.name);
  }

  /**
   * Check if service is ready
   */
  isReady(): boolean {
    return this.providers.length > 0;
  }
}

// Export singleton instance
export const emailService = new EmailService();

// Export types and utilities
export type { EmailData, EmailResult, EmailTemplate, EmailAttachment };
export { EmailService };
