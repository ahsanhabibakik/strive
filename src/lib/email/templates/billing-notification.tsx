interface BillingNotificationProps {
  name: string;
  type: 'success' | 'failed' | 'canceled';
  amount?: number;
  planName?: string;
  nextBillingDate?: string;
  manageBillingUrl: string;
}

export function generateBillingNotificationEmailHtml(props: BillingNotificationProps): string {
  const getSubject = () => {
    switch (props.type) {
      case 'success':
        return 'Payment Successful';
      case 'failed':
        return 'Payment Failed';
      case 'canceled':
        return 'Subscription Canceled';
      default:
        return 'Billing Update';
    }
  };

  const getContent = () => {
    switch (props.type) {
      case 'success':
        return {
          title: 'Payment Successful! 🎉',
          message: `Your payment of $${props.amount} for the ${props.planName} plan has been processed successfully.`,
          nextAction: props.nextBillingDate ? `Your next billing date is ${props.nextBillingDate}.` : '',
          buttonText: 'View Billing Details',
          buttonColor: '#059669'
        };
      case 'failed':
        return {
          title: 'Payment Failed ⚠️',
          message: `We couldn't process your payment of $${props.amount} for the ${props.planName} plan.`,
          nextAction: 'Please update your payment method to avoid service interruption.',
          buttonText: 'Update Payment Method',
          buttonColor: '#dc2626'
        };
      case 'canceled':
        return {
          title: 'Subscription Canceled',
          message: `Your ${props.planName} subscription has been canceled as requested.`,
          nextAction: 'You can reactivate your subscription anytime.',
          buttonText: 'Manage Subscription',
          buttonColor: '#6b7280'
        };
      default:
        return {
          title: 'Billing Update',
          message: 'There has been an update to your billing information.',
          nextAction: '',
          buttonText: 'View Details',
          buttonColor: '#4f46e5'
        };
    }
  };

  const content = getContent();

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${getSubject()} - Strive</title>
      </head>
      <body>
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 40px 20px;">
          <div style="background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #4f46e5; font-size: 32px; font-weight: bold; margin: 0 0 16px 0;">Strive</h1>
              <p style="color: #6b7280; font-size: 16px; margin: 0;">Billing notification</p>
            </div>
            <div style="margin-bottom: 32px;">
              <h2 style="color: #111827; font-size: 24px; margin-bottom: 16px;">Hi ${props.name},</h2>
              <h3 style="color: #111827; font-size: 20px; margin-bottom: 16px;">${content.title}</h3>
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">${content.message}</p>
              ${content.nextAction ? `<p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">${content.nextAction}</p>` : ''}
              <div style="text-align: center; margin: 32px 0;">
                <a href="${props.manageBillingUrl}" style="background-color: ${content.buttonColor}; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 16px; font-weight: 600; display: inline-block;">${content.buttonText}</a>
              </div>
            </div>
            
            ${props.type === 'success' && props.amount ? `
            <div style="background-color: #f0fdf4; border: 1px solid #10b981; padding: 20px; border-radius: 6px; margin-bottom: 32px;">
              <h4 style="color: #065f46; font-size: 16px; margin: 0 0 12px 0;">Payment Details</h4>
              <div style="color: #047857; font-size: 14px;">
                <p style="margin: 0 0 8px 0;"><strong>Plan:</strong> ${props.planName}</p>
                <p style="margin: 0 0 8px 0;"><strong>Amount:</strong> $${props.amount}</p>
                ${props.nextBillingDate ? `<p style="margin: 0;"><strong>Next billing:</strong> ${props.nextBillingDate}</p>` : ''}
              </div>
            </div>
            ` : ''}
            
            <div style="text-align: center; border-top: 1px solid #e5e7eb; padding-top: 24px;">
              <p style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">Questions about your billing?</p>
              <p style="color: #6b7280; font-size: 14px;">Contact us at <a href="mailto:billing@strive.com" style="color: #4f46e5;">billing@strive.com</a></p>
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