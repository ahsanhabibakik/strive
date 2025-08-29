import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - Strive',
  description: 'Privacy Policy for Strive - Goal Achievement Platform',
}

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="prose prose-gray max-w-none dark:prose-invert">
        <h1>Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">
          Last updated: {new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>

        <section className="mb-8">
          <h2>1. Introduction</h2>
          <p>
            Welcome to Strive (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We respect your privacy and are committed to 
            protecting your personal data. This privacy policy will inform you about how we look after your 
            personal data and tell you about your privacy rights.
          </p>
        </section>

        <section className="mb-8">
          <h2>2. Information We Collect</h2>
          <h3>Personal Information</h3>
          <p>We may collect the following types of personal information:</p>
          <ul>
            <li><strong>Account Information:</strong> Name, email address, username, password</li>
            <li><strong>Profile Information:</strong> Profile picture, bio, preferences, goals</li>
            <li><strong>Usage Data:</strong> How you interact with our service, features used, time spent</li>
            <li><strong>Device Information:</strong> IP address, browser type, device type, operating system</li>
            <li><strong>Communication Data:</strong> Messages sent through our platform, support requests</li>
          </ul>

          <h3>Automatically Collected Information</h3>
          <p>We automatically collect certain information when you use our Service:</p>
          <ul>
            <li>Log files and usage patterns</li>
            <li>Cookies and similar tracking technologies</li>
            <li>Analytics data about your interactions</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>3. How We Use Your Information</h2>
          <p>We use your personal information to:</p>
          <ul>
            <li>Provide, operate, and maintain our Service</li>
            <li>Improve, personalize, and expand our Service</li>
            <li>Process your transactions and manage your account</li>
            <li>Communicate with you about the Service</li>
            <li>Send you updates, security alerts, and administrative messages</li>
            <li>Provide customer support and respond to your requests</li>
            <li>Analyze usage patterns and optimize user experience</li>
            <li>Prevent fraud and enhance security</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>4. Information Sharing</h2>
          <p>We do not sell, trade, or otherwise transfer your personal information to third parties except:</p>
          <ul>
            <li><strong>Service Providers:</strong> Third-party companies that help us operate our Service</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or asset sale</li>
            <li><strong>Consent:</strong> When you give us explicit consent to share your information</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>5. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal data against 
            unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is 
            100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2>6. Data Retention</h2>
          <p>
            We retain your personal information only for as long as necessary to fulfill the purposes outlined 
            in this Privacy Policy, unless a longer retention period is required by law. When we no longer need 
            your personal information, we will securely delete or anonymize it.
          </p>
        </section>

        <section className="mb-8">
          <h2>7. Your Privacy Rights</h2>
          <p>Depending on your location, you may have the following rights:</p>
          <ul>
            <li><strong>Access:</strong> Request access to your personal information</li>
            <li><strong>Rectification:</strong> Request correction of inaccurate or incomplete data</li>
            <li><strong>Erasure:</strong> Request deletion of your personal information</li>
            <li><strong>Restriction:</strong> Request limitation of processing of your data</li>
            <li><strong>Portability:</strong> Request transfer of your data to another service</li>
            <li><strong>Objection:</strong> Object to processing of your personal information</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>8. Cookies and Tracking</h2>
          <p>
            We use cookies and similar tracking technologies to enhance your experience on our Service. 
            You can control cookie preferences through your browser settings. For more information, 
            please see our Cookie Policy.
          </p>
        </section>

        <section className="mb-8">
          <h2>9. Third-Party Links</h2>
          <p>
            Our Service may contain links to third-party websites. We are not responsible for the privacy 
            practices of these external sites. We encourage you to read their privacy policies.
          </p>
        </section>

        <section className="mb-8">
          <h2>10. Children&apos;s Privacy</h2>
          <p>
            Our Service is not intended for children under 13 years of age. We do not knowingly collect 
            personal information from children under 13. If we become aware that we have collected such 
            information, we will take steps to delete it.
          </p>
        </section>

        <section className="mb-8">
          <h2>11. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than your own. 
            We ensure appropriate safeguards are in place to protect your data in accordance with this 
            Privacy Policy.
          </p>
        </section>

        <section className="mb-8">
          <h2>12. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by 
            posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
          </p>
        </section>

        <section className="mb-8">
          <h2>13. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or our privacy practices, please contact us:
          </p>
          <ul>
            <li>Email: privacy@strive-app.com</li>
            <li>Address: [Your Business Address]</li>
          </ul>
        </section>
      </div>
    </div>
  )
}