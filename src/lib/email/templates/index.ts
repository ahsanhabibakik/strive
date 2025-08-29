/**
 * Email Templates Collection
 * Centralized email templates for the application
 */

import { EmailTemplate } from "../index";

// Base template for consistent branding
const getBaseTemplate = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ subject }}</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f8fafc;
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 8px; 
            overflow: hidden; 
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
        }
        .header h1 { 
            margin: 0; 
            font-size: 28px; 
            font-weight: 600; 
        }
        .content { 
            padding: 40px 30px; 
        }
        .footer { 
            background: #f8fafc; 
            padding: 30px; 
            text-align: center; 
            font-size: 14px; 
            color: #6b7280; 
            border-top: 1px solid #e5e7eb;
        }
        .btn { 
            display: inline-block; 
            padding: 12px 24px; 
            background: #667eea; 
            color: white; 
            text-decoration: none; 
            border-radius: 6px; 
            font-weight: 500; 
            margin: 20px 0;
        }
        .btn:hover { 
            background: #5a67d8; 
        }
        .alert { 
            padding: 16px; 
            border-radius: 6px; 
            margin: 20px 0; 
        }
        .alert-info { 
            background: #dbeafe; 
            border: 1px solid #93c5fd; 
            color: #1e40af; 
        }
        .alert-warning { 
            background: #fef3c7; 
            border: 1px solid #fbbf24; 
            color: #92400e; 
        }
        .alert-success { 
            background: #d1fae5; 
            border: 1px solid #6ee7b7; 
            color: #065f46; 
        }
        .code { 
            background: #f1f5f9; 
            border: 1px solid #e2e8f0; 
            border-radius: 4px; 
            padding: 12px; 
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace; 
            font-size: 14px; 
            margin: 16px 0;
        }
        .social { 
            text-align: center; 
            margin: 20px 0; 
        }
        .social a { 
            display: inline-block; 
            margin: 0 10px; 
            color: #6b7280; 
            text-decoration: none; 
        }
        @media only screen and (max-width: 600px) {
            .container { 
                margin: 0 10px; 
            }
            .header, .content, .footer { 
                padding: 20px; 
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{{ app_name }}</h1>
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            <div class="social">
                <a href="{{ app_url }}">Visit Website</a>
                <a href="{{ app_url }}/help">Help Center</a>
                <a href="{{ app_url }}/contact">Contact Us</a>
            </div>
            <p>
                You're receiving this email because you have an account with {{ app_name }}.
                <br>
                <a href="{{ unsubscribe_url }}" style="color: #6b7280;">Unsubscribe</a> from these emails.
            </p>
            <p style="font-size: 12px; color: #9ca3af;">
                {{ company_name }} • {{ company_address }}
            </p>
        </div>
    </div>
</body>
</html>`;

const templates: Record<string, EmailTemplate> = {
  // Welcome Email
  welcome: {
    name: "welcome",
    subject: "Welcome to {{ app_name }}! 🎉",
    variables: ["user_name", "app_name", "app_url", "dashboard_url"],
    html: getBaseTemplate(`
      <h2>Welcome {{ user_name }}! 👋</h2>
      <p>We're thrilled to have you join the {{ app_name }} community. You're now part of a platform designed to help you achieve your goals and maximize your productivity.</p>
      
      <div class="alert alert-success">
        <strong>Your account is ready!</strong> You can now start using all the features available in your plan.
      </div>
      
      <h3>What's next?</h3>
      <ul>
        <li>Complete your profile setup</li>
        <li>Create your first project</li>
        <li>Invite team members (if applicable)</li>
        <li>Explore our integrations</li>
      </ul>
      
      <a href="{{ dashboard_url }}" class="btn">Get Started</a>
      
      <h3>Need help?</h3>
      <p>Check out our <a href="{{ app_url }}/help">Help Center</a> or reach out to our support team. We're here to help you succeed!</p>
    `),
    text: `Welcome {{ user_name }}!

We're thrilled to have you join the {{ app_name }} community. You're now part of a platform designed to help you achieve your goals and maximize your productivity.

Your account is ready! You can now start using all the features available in your plan.

What's next?
- Complete your profile setup
- Create your first project
- Invite team members (if applicable)
- Explore our integrations

Get started: {{ dashboard_url }}

Need help? Check out our Help Center at {{ app_url }}/help or reach out to our support team.`,
  },

  // Email Verification
  "email-verification": {
    name: "email-verification",
    subject: "Verify your email address",
    variables: ["user_name", "verification_url", "verification_code", "app_name"],
    html: getBaseTemplate(`
      <h2>Verify Your Email Address</h2>
      <p>Hi {{ user_name }},</p>
      <p>Please verify your email address to complete your {{ app_name }} account setup.</p>
      
      <a href="{{ verification_url }}" class="btn">Verify Email Address</a>
      
      <p>Or use this verification code:</p>
      <div class="code">{{ verification_code }}</div>
      
      <div class="alert alert-info">
        <strong>This link expires in 24 hours.</strong> If you didn't create this account, you can safely ignore this email.
      </div>
    `),
    text: `Verify Your Email Address

Hi {{ user_name }},

Please verify your email address to complete your {{ app_name }} account setup.

Verification link: {{ verification_url }}

Or use this verification code: {{ verification_code }}

This link expires in 24 hours. If you didn't create this account, you can safely ignore this email.`,
  },

  // Password Reset
  "password-reset": {
    name: "password-reset",
    subject: "Reset your password",
    variables: ["user_name", "reset_url", "app_name"],
    html: getBaseTemplate(`
      <h2>Password Reset Request</h2>
      <p>Hi {{ user_name }},</p>
      <p>We received a request to reset your password for your {{ app_name }} account.</p>
      
      <a href="{{ reset_url }}" class="btn">Reset Password</a>
      
      <div class="alert alert-warning">
        <strong>This link expires in 1 hour.</strong> If you didn't request this password reset, you can safely ignore this email.
      </div>
      
      <p>For security reasons, this link can only be used once and expires in 1 hour.</p>
    `),
    text: `Password Reset Request

Hi {{ user_name }},

We received a request to reset your password for your {{ app_name }} account.

Reset your password: {{ reset_url }}

This link expires in 1 hour. If you didn't request this password reset, you can safely ignore this email.`,
  },

  // Password Changed
  "password-changed": {
    name: "password-changed",
    subject: "Your password has been changed",
    variables: ["user_name", "app_name", "support_url"],
    html: getBaseTemplate(`
      <h2>Password Changed Successfully</h2>
      <p>Hi {{ user_name }},</p>
      <p>Your {{ app_name }} account password has been successfully changed.</p>
      
      <div class="alert alert-success">
        <strong>Password Updated!</strong> Your account is now secured with your new password.
      </div>
      
      <div class="alert alert-warning">
        <strong>Didn't make this change?</strong> If you didn't change your password, please contact our support team immediately.
      </div>
      
      <a href="{{ support_url }}" class="btn">Contact Support</a>
    `),
    text: `Password Changed Successfully

Hi {{ user_name }},

Your {{ app_name }} account password has been successfully changed.

If you didn't make this change, please contact our support team immediately at {{ support_url }}.`,
  },

  // Team Invitation
  "team-invitation": {
    name: "team-invitation",
    subject: "{{ inviter_name }} invited you to join {{ team_name }}",
    variables: ["invitee_name", "inviter_name", "team_name", "app_name", "invitation_url", "role"],
    html: getBaseTemplate(`
      <h2>You're Invited! 🎊</h2>
      <p>Hi {{ invitee_name }},</p>
      <p><strong>{{ inviter_name }}</strong> has invited you to join <strong>{{ team_name }}</strong> on {{ app_name }}.</p>
      
      <div class="alert alert-info">
        <strong>Role:</strong> {{ role }}
      </div>
      
      <a href="{{ invitation_url }}" class="btn">Accept Invitation</a>
      
      <h3>What is {{ app_name }}?</h3>
      <p>{{ app_name }} is a powerful platform for managing projects, tracking goals, and collaborating with your team to achieve better results.</p>
      
      <p>This invitation expires in 7 days.</p>
    `),
    text: `You're Invited!

Hi {{ invitee_name }},

{{ inviter_name }} has invited you to join {{ team_name }} on {{ app_name }}.

Role: {{ role }}

Accept invitation: {{ invitation_url }}

This invitation expires in 7 days.`,
  },

  // Subscription Welcome
  "subscription-welcome": {
    name: "subscription-welcome",
    subject: "Welcome to {{ plan_name }}! 🚀",
    variables: [
      "user_name",
      "plan_name",
      "app_name",
      "billing_amount",
      "next_billing_date",
      "features",
    ],
    html: getBaseTemplate(`
      <h2>Welcome to {{ plan_name }}! 🚀</h2>
      <p>Hi {{ user_name }},</p>
      <p>Thank you for upgrading to {{ plan_name }}! Your subscription is now active and you have access to all premium features.</p>
      
      <div class="alert alert-success">
        <strong>Subscription Active</strong><br>
        Plan: {{ plan_name }}<br>
        Amount: ${{ billing_amount }}/month<br>
        Next billing: {{ next_billing_date }}
      </div>
      
      <h3>Your new features:</h3>
      <ul>
        {{ features }}
      </ul>
      
      <a href="{{ dashboard_url }}" class="btn">Explore Premium Features</a>
      
      <p>Questions about your subscription? Visit our <a href="{{ billing_url }}">billing dashboard</a> or contact support.</p>
    `),
    text: `Welcome to {{ plan_name }}!

Hi {{ user_name }},

Thank you for upgrading to {{ plan_name }}! Your subscription is now active and you have access to all premium features.

Subscription Details:
- Plan: {{ plan_name }}
- Amount: ${{ billing_amount }}/month
- Next billing: {{ next_billing_date }}

Start using your new features: {{ dashboard_url }}`,
  },

  // Payment Failed
  "payment-failed": {
    name: "payment-failed",
    subject: "Payment failed - Action required",
    variables: ["user_name", "app_name", "plan_name", "amount", "update_payment_url"],
    html: getBaseTemplate(`
      <h2>Payment Issue - Action Required</h2>
      <p>Hi {{ user_name }},</p>
      <p>We couldn't process your payment for {{ plan_name }} ({{ amount }}).</p>
      
      <div class="alert alert-warning">
        <strong>Action Required</strong><br>
        Please update your payment method to continue using {{ app_name }} without interruption.
      </div>
      
      <a href="{{ update_payment_url }}" class="btn">Update Payment Method</a>
      
      <h3>What happens next?</h3>
      <ul>
        <li>Your account remains active for 3 more days</li>
        <li>After that, your account will be temporarily suspended</li>
        <li>Update your payment method to restore full access</li>
      </ul>
      
      <p>Need help? Contact our support team - we're here to assist you.</p>
    `),
    text: `Payment Issue - Action Required

Hi {{ user_name }},

We couldn't process your payment for {{ plan_name }} (${{ amount }}).

Please update your payment method to continue using {{ app_name }}: {{ update_payment_url }}

Your account remains active for 3 more days, then will be temporarily suspended until payment is updated.`,
  },

  // Weekly Progress Report
  "weekly-report": {
    name: "weekly-report",
    subject: "Your weekly progress report 📊",
    variables: [
      "user_name",
      "week_start",
      "week_end",
      "completed_tasks",
      "total_tasks",
      "achievements",
      "next_week_goals",
    ],
    html: getBaseTemplate(`
      <h2>Your Week in Review 📊</h2>
      <p>Hi {{ user_name }},</p>
      <p>Here's your progress summary for {{ week_start }} - {{ week_end }}:</p>
      
      <div class="alert alert-success">
        <strong>Tasks Completed:</strong> {{ completed_tasks }} / {{ total_tasks }}<br>
        <strong>Completion Rate:</strong> {{ completion_rate }}%
      </div>
      
      <h3>🎉 This Week's Achievements</h3>
      <ul>
        {{ achievements }}
      </ul>
      
      <h3>🎯 Focus for Next Week</h3>
      <ul>
        {{ next_week_goals }}
      </ul>
      
      <a href="{{ dashboard_url }}" class="btn">View Full Report</a>
      
      <p>Keep up the great work! Consistency is the key to achieving your goals.</p>
    `),
    text: `Your Week in Review

Hi {{ user_name }},

Here's your progress summary for {{ week_start }} - {{ week_end }}:

Tasks Completed: {{ completed_tasks }} / {{ total_tasks }}
Completion Rate: {{ completion_rate }}%

This Week's Achievements:
{{ achievements }}

Focus for Next Week:
{{ next_week_goals }}

View full report: {{ dashboard_url }}`,
  },

  // System Notification
  "system-notification": {
    name: "system-notification",
    subject: "{{ notification_title }}",
    variables: [
      "user_name",
      "notification_title",
      "notification_message",
      "action_url",
      "action_text",
    ],
    html: getBaseTemplate(`
      <h2>{{ notification_title }}</h2>
      <p>Hi {{ user_name }},</p>
      
      <div class="alert alert-info">
        {{ notification_message }}
      </div>
      
      {{ #if action_url }}
      <a href="{{ action_url }}" class="btn">{{ action_text }}</a>
      {{ /if }}
      
      <p>This is an automated notification from {{ app_name }}.</p>
    `),
    text: `{{ notification_title }}

Hi {{ user_name }},

{{ notification_message }}

{{ #if action_url }}
{{ action_text }}: {{ action_url }}
{{ /if }}

This is an automated notification from {{ app_name }}.`,
  },

  // Account Deletion Confirmation
  "account-deletion": {
    name: "account-deletion",
    subject: "Account deletion confirmation",
    variables: ["user_name", "app_name", "deletion_date"],
    html: getBaseTemplate(`
      <h2>Account Deletion Confirmation</h2>
      <p>Hi {{ user_name }},</p>
      <p>We're sorry to see you go. Your {{ app_name }} account has been scheduled for deletion.</p>
      
      <div class="alert alert-warning">
        <strong>Account will be permanently deleted on {{ deletion_date }}</strong><br>
        This action cannot be undone. All your data will be permanently removed.
      </div>
      
      <h3>What happens next?</h3>
      <ul>
        <li>Your account is immediately deactivated</li>
        <li>All data will be permanently deleted in 30 days</li>
        <li>You can reactivate your account before {{ deletion_date }}</li>
      </ul>
      
      <a href="{{ reactivate_url }}" class="btn">Reactivate Account</a>
      
      <p>Changed your mind? You can restore your account anytime before the deletion date.</p>
    `),
    text: `Account Deletion Confirmation

Hi {{ user_name }},

Your {{ app_name }} account has been scheduled for deletion on {{ deletion_date }}.

This action cannot be undone. All your data will be permanently removed.

Changed your mind? You can restore your account anytime before the deletion date: {{ reactivate_url }}`,
  },
};

export default templates;
