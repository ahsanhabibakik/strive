interface WelcomeEmailProps {
  name: string;
  loginUrl: string;
}

export function WelcomeEmail({ name, loginUrl }: WelcomeEmailProps) {
  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      maxWidth: '600px', 
      margin: '0 auto',
      backgroundColor: '#f9fafb',
      padding: '40px 20px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ 
            color: '#4f46e5', 
            fontSize: '32px', 
            fontWeight: 'bold',
            margin: '0 0 16px 0'
          }}>
            Strive
          </h1>
          <p style={{ color: '#6b7280', fontSize: '16px', margin: 0 }}>
            Welcome to your journey of achievement
          </p>
        </div>

        {/* Main Content */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ 
            color: '#111827', 
            fontSize: '24px', 
            marginBottom: '16px' 
          }}>
            Welcome aboard, {name}! 🎉
          </h2>
          
          <p style={{ color: '#374151', fontSize: '16px', lineHeight: '1.6', marginBottom: '16px' }}>
            Thank you for joining Strive! We're excited to help you achieve your goals and unlock your full potential.
          </p>
          
          <p style={{ color: '#374151', fontSize: '16px', lineHeight: '1.6', marginBottom: '24px' }}>
            Your account is now ready, and you can start setting up your first goals, tracking your progress, and connecting with our community of achievers.
          </p>

          {/* CTA Button */}
          <div style={{ textAlign: 'center', margin: '32px 0' }}>
            <a 
              href={loginUrl}
              style={{
                backgroundColor: '#4f46e5',
                color: '#ffffff',
                padding: '12px 24px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '600',
                display: 'inline-block'
              }}
            >
              Get Started Now
            </a>
          </div>
        </div>

        {/* Features Section */}
        <div style={{ 
          backgroundColor: '#f8fafc', 
          padding: '24px', 
          borderRadius: '6px',
          marginBottom: '32px'
        }}>
          <h3 style={{ 
            color: '#111827', 
            fontSize: '18px', 
            marginBottom: '16px' 
          }}>
            What you can do with Strive:
          </h3>
          
          <ul style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}>Set and track meaningful goals</li>
            <li style={{ marginBottom: '8px' }}>Monitor your progress with beautiful analytics</li>
            <li style={{ marginBottom: '8px' }}>Connect with like-minded achievers</li>
            <li style={{ marginBottom: '8px' }}>Access premium features and insights</li>
          </ul>
        </div>

        {/* Footer */}
        <div style={{ 
          textAlign: 'center',
          borderTop: '1px solid #e5e7eb',
          paddingTop: '24px'
        }}>
          <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>
            Need help getting started?
          </p>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Contact us at{' '}
            <a href="mailto:support@strive.com" style={{ color: '#4f46e5' }}>
              support@strive.com
            </a>
          </p>
        </div>
      </div>

      {/* Email Footer */}
      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <p style={{ color: '#9ca3af', fontSize: '12px' }}>
          © 2024 Strive. All rights reserved.
        </p>
        <p style={{ color: '#9ca3af', fontSize: '12px' }}>
          You're receiving this email because you signed up for Strive.
        </p>
      </div>
    </div>
  );
}

export function generateWelcomeEmailHtml(props: WelcomeEmailProps): string {
  // In a real implementation, you'd use a proper email template engine
  // For now, we'll return a simple HTML string
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to Strive</title>
      </head>
      <body>
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 40px 20px;">
          <div style="background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #4f46e5; font-size: 32px; font-weight: bold; margin: 0 0 16px 0;">Strive</h1>
              <p style="color: #6b7280; font-size: 16px; margin: 0;">Welcome to your journey of achievement</p>
            </div>
            <div style="margin-bottom: 32px;">
              <h2 style="color: #111827; font-size: 24px; margin-bottom: 16px;">Welcome aboard, ${props.name}! 🎉</h2>
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">Thank you for joining Strive! We're excited to help you achieve your goals and unlock your full potential.</p>
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">Your account is now ready, and you can start setting up your first goals, tracking your progress, and connecting with our community of achievers.</p>
              <div style="text-align: center; margin: 32px 0;">
                <a href="${props.loginUrl}" style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 16px; font-weight: 600; display: inline-block;">Get Started Now</a>
              </div>
            </div>
            <div style="background-color: #f8fafc; padding: 24px; border-radius: 6px; margin-bottom: 32px;">
              <h3 style="color: #111827; font-size: 18px; margin-bottom: 16px;">What you can do with Strive:</h3>
              <ul style="color: #374151; font-size: 14px; line-height: 1.6; padding-left: 20px;">
                <li style="margin-bottom: 8px;">Set and track meaningful goals</li>
                <li style="margin-bottom: 8px;">Monitor your progress with beautiful analytics</li>
                <li style="margin-bottom: 8px;">Connect with like-minded achievers</li>
                <li style="margin-bottom: 8px;">Access premium features and insights</li>
              </ul>
            </div>
            <div style="text-align: center; border-top: 1px solid #e5e7eb; padding-top: 24px;">
              <p style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">Need help getting started?</p>
              <p style="color: #6b7280; font-size: 14px;">Contact us at <a href="mailto:support@strive.com" style="color: #4f46e5;">support@strive.com</a></p>
            </div>
          </div>
          <div style="text-align: center; margin-top: 24px;">
            <p style="color: #9ca3af; font-size: 12px;">© 2024 Strive. All rights reserved.</p>
            <p style="color: #9ca3af; font-size: 12px;">You're receiving this email because you signed up for Strive.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}