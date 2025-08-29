interface PasswordResetEmailProps {
  name: string;
  resetUrl: string;
  expiresIn: string;
}

export function generatePasswordResetEmailHtml(props: PasswordResetEmailProps): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Reset Your Password - Strive</title>
      </head>
      <body>
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 40px 20px;">
          <div style="background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #4f46e5; font-size: 32px; font-weight: bold; margin: 0 0 16px 0;">Strive</h1>
              <p style="color: #6b7280; font-size: 16px; margin: 0;">Reset your password</p>
            </div>
            <div style="margin-bottom: 32px;">
              <h2 style="color: #111827; font-size: 24px; margin-bottom: 16px;">Hi ${props.name},</h2>
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">We received a request to reset your password for your Strive account.</p>
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">Click the button below to reset your password. This link will expire in ${props.expiresIn}.</p>
              <div style="text-align: center; margin: 32px 0;">
                <a href="${props.resetUrl}" style="background-color: #dc2626; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 16px; font-weight: 600; display: inline-block;">Reset Password</a>
              </div>
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 24px;">If you didn't request this password reset, you can safely ignore this email. Your password will not be changed.</p>
            </div>
            <div style="background-color: #fef3c7; border: 1px solid #f59e0b; padding: 16px; border-radius: 6px; margin-bottom: 32px;">
              <p style="color: #92400e; font-size: 14px; margin: 0;">
                <strong>Security tip:</strong> Never share your password or reset links with anyone. Strive will never ask for your password via email.
              </p>
            </div>
            <div style="text-align: center; border-top: 1px solid #e5e7eb; padding-top: 24px;">
              <p style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">Need help?</p>
              <p style="color: #6b7280; font-size: 14px;">Contact us at <a href="mailto:support@strive.com" style="color: #4f46e5;">support@strive.com</a></p>
            </div>
          </div>
          <div style="text-align: center; margin-top: 24px;">
            <p style="color: #9ca3af; font-size: 12px;">© 2024 Strive. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}