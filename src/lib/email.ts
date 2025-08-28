import nodemailer from 'nodemailer';
import { logger } from './monitoring';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content?: string;
    path?: string;
    contentType?: string;
  }>;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private isConfigured = false;

  constructor() {
    this.init();
  }

  private async init() {
    try {
      const {
        SMTP_HOST,
        SMTP_PORT,
        SMTP_USER,
        SMTP_PASSWORD,
        EMAIL_FROM
      } = process.env;

      if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
        logger.warn('Email service not configured - missing SMTP environment variables');
        return;
      }

      this.transporter = nodemailer.createTransporter({
        host: SMTP_HOST,
        port: parseInt(SMTP_PORT),
        secure: parseInt(SMTP_PORT) === 465,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASSWORD,
        },
      });

      // Verify connection
      await this.transporter.verify();
      this.isConfigured = true;
      logger.info('Email service initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize email service:', error as Error);
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.isConfigured || !this.transporter) {
      logger.error('Email service not configured');
      return false;
    }

    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.SMTP_USER,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        attachments: options.attachments,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent successfully to ${options.to}`, { messageId: info.messageId });
      return true;
    } catch (error) {
      logger.error(`Failed to send email to ${options.to}:`, error as Error);
      return false;
    }
  }

  // Pre-built email templates
  welcomeEmail(name: string, email: string): EmailTemplate {
    return {
      subject: 'Welcome to Strive!',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; }
              .button { 
                display: inline-block; 
                background: #4F46E5; 
                color: white; 
                padding: 12px 24px; 
                text-decoration: none; 
                border-radius: 5px; 
                margin: 20px 0; 
              }
              .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Welcome to Strive!</h1>
              </div>
              <div class="content">
                <h2>Hi ${name}!</h2>
                <p>Thank you for joining Strive. We're excited to have you on board!</p>
                <p>Your account has been successfully created with the email address: <strong>${email}</strong></p>
                <p>Get started by exploring our features and setting up your profile.</p>
                <a href="${process.env.NEXTAUTH_URL}/dashboard" class="button">Go to Dashboard</a>
                <p>If you have any questions, feel free to reach out to our support team.</p>
                <p>Best regards,<br>The Strive Team</p>
              </div>
              <div class="footer">
                <p>© 2024 Strive. All rights reserved.</p>
                <p>If you didn't create this account, you can safely ignore this email.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `Welcome to Strive!\n\nHi ${name}!\n\nThank you for joining Strive. We're excited to have you on board!\n\nYour account has been successfully created with the email address: ${email}\n\nGet started by exploring our features and setting up your profile.\n\nVisit: ${process.env.NEXTAUTH_URL}/dashboard\n\nIf you have any questions, feel free to reach out to our support team.\n\nBest regards,\nThe Strive Team`
    };
  }

  resetPasswordEmail(name: string, resetUrl: string): EmailTemplate {
    return {
      subject: 'Reset Your Password',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #DC2626; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; }
              .button { 
                display: inline-block; 
                background: #DC2626; 
                color: white; 
                padding: 12px 24px; 
                text-decoration: none; 
                border-radius: 5px; 
                margin: 20px 0; 
              }
              .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
              .warning { background: #FEF3C7; padding: 15px; border-radius: 5px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Password Reset Request</h1>
              </div>
              <div class="content">
                <h2>Hi ${name}!</h2>
                <p>We received a request to reset your password for your Strive account.</p>
                <p>Click the button below to reset your password:</p>
                <a href="${resetUrl}" class="button">Reset Password</a>
                <div class="warning">
                  <p><strong>Important:</strong> This link will expire in 1 hour for security reasons.</p>
                </div>
                <p>If you didn't request this password reset, you can safely ignore this email. Your password won't be changed.</p>
                <p>For security, this link can only be used once.</p>
                <p>Best regards,<br>The Strive Team</p>
              </div>
              <div class="footer">
                <p>© 2024 Strive. All rights reserved.</p>
                <p>If you're having trouble clicking the button, copy and paste the following URL into your browser:</p>
                <p style="word-break: break-all;">${resetUrl}</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `Password Reset Request\n\nHi ${name}!\n\nWe received a request to reset your password for your Strive account.\n\nReset your password by visiting: ${resetUrl}\n\nImportant: This link will expire in 1 hour for security reasons.\n\nIf you didn't request this password reset, you can safely ignore this email. Your password won't be changed.\n\nBest regards,\nThe Strive Team`
    };
  }

  emailVerificationEmail(name: string, verificationUrl: string): EmailTemplate {
    return {
      subject: 'Verify Your Email Address',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #059669; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; }
              .button { 
                display: inline-block; 
                background: #059669; 
                color: white; 
                padding: 12px 24px; 
                text-decoration: none; 
                border-radius: 5px; 
                margin: 20px 0; 
              }
              .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Verify Your Email</h1>
              </div>
              <div class="content">
                <h2>Hi ${name}!</h2>
                <p>Thank you for signing up with Strive! To complete your registration, please verify your email address.</p>
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
                <p>This verification link will expire in 24 hours.</p>
                <p>If you didn't create an account with us, you can safely ignore this email.</p>
                <p>Best regards,<br>The Strive Team</p>
              </div>
              <div class="footer">
                <p>© 2024 Strive. All rights reserved.</p>
                <p>If you're having trouble clicking the button, copy and paste the following URL into your browser:</p>
                <p style="word-break: break-all;">${verificationUrl}</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `Verify Your Email\n\nHi ${name}!\n\nThank you for signing up with Strive! To complete your registration, please verify your email address.\n\nVerify your email by visiting: ${verificationUrl}\n\nThis verification link will expire in 24 hours.\n\nIf you didn't create an account with us, you can safely ignore this email.\n\nBest regards,\nThe Strive Team`
    };
  }

  subscriptionEmail(name: string, plan: string, amount: string): EmailTemplate {
    return {
      subject: 'Subscription Confirmation',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #7C3AED; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; }
              .plan-details { background: #F3F4F6; padding: 20px; border-radius: 5px; margin: 20px 0; }
              .button { 
                display: inline-block; 
                background: #7C3AED; 
                color: white; 
                padding: 12px 24px; 
                text-decoration: none; 
                border-radius: 5px; 
                margin: 20px 0; 
              }
              .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Subscription Confirmed!</h1>
              </div>
              <div class="content">
                <h2>Hi ${name}!</h2>
                <p>Thank you for subscribing to Strive! Your subscription has been successfully activated.</p>
                <div class="plan-details">
                  <h3>Subscription Details:</h3>
                  <p><strong>Plan:</strong> ${plan}</p>
                  <p><strong>Amount:</strong> ${amount}</p>
                  <p><strong>Status:</strong> Active</p>
                </div>
                <p>You now have access to all premium features. Start exploring!</p>
                <a href="${process.env.NEXTAUTH_URL}/dashboard" class="button">Go to Dashboard</a>
                <p>If you have any questions about your subscription, feel free to contact our support team.</p>
                <p>Best regards,<br>The Strive Team</p>
              </div>
              <div class="footer">
                <p>© 2024 Strive. All rights reserved.</p>
                <p>You can manage your subscription settings in your dashboard.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `Subscription Confirmed!\n\nHi ${name}!\n\nThank you for subscribing to Strive! Your subscription has been successfully activated.\n\nSubscription Details:\nPlan: ${plan}\nAmount: ${amount}\nStatus: Active\n\nYou now have access to all premium features. Start exploring!\n\nVisit your dashboard: ${process.env.NEXTAUTH_URL}/dashboard\n\nBest regards,\nThe Strive Team`
    };
  }

  async sendWelcomeEmail(name: string, email: string): Promise<boolean> {
    const template = this.welcomeEmail(name, email);
    return this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text
    });
  }

  async sendResetPasswordEmail(name: string, email: string, resetUrl: string): Promise<boolean> {
    const template = this.resetPasswordEmail(name, resetUrl);
    return this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text
    });
  }

  async sendEmailVerification(name: string, email: string, verificationUrl: string): Promise<boolean> {
    const template = this.emailVerificationEmail(name, verificationUrl);
    return this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text
    });
  }

  async sendSubscriptionConfirmation(name: string, email: string, plan: string, amount: string): Promise<boolean> {
    const template = this.subscriptionEmail(name, plan, amount);
    return this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text
    });
  }
}

export const emailService = new EmailService();
export default emailService;