import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy - Strive',
  description: 'Cookie Policy for Strive - Goal Achievement Platform',
}

export default function CookiePolicy() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="prose prose-gray max-w-none dark:prose-invert">
        <h1>Cookie Policy</h1>
        <p className="text-sm text-gray-500 mb-8">
          Last updated: {new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>

        <section className="mb-8">
          <h2>1. What Are Cookies</h2>
          <p>
            Cookies are small text files that are placed on your device when you visit our website. 
            They are widely used to make websites work more efficiently and provide information to 
            website owners about how users interact with their sites.
          </p>
        </section>

        <section className="mb-8">
          <h2>2. How We Use Cookies</h2>
          <p>
            Strive uses cookies to enhance your browsing experience, analyze site traffic, and understand 
            where our visitors are coming from. We use cookies for the following purposes:
          </p>
          <ul>
            <li><strong>Essential Cookies:</strong> Necessary for the website to function properly</li>
            <li><strong>Performance Cookies:</strong> Help us understand how visitors interact with our site</li>
            <li><strong>Functionality Cookies:</strong> Remember your preferences and personalize your experience</li>
            <li><strong>Targeting Cookies:</strong> Used to deliver relevant advertisements</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>3. Types of Cookies We Use</h2>
          
          <h3>Essential Cookies</h3>
          <p>These cookies are necessary for the website to function and cannot be switched off:</p>
          <ul>
            <li><strong>Authentication:</strong> Keep you logged in to your account</li>
            <li><strong>Security:</strong> Protect against fraud and security threats</li>
            <li><strong>Session Management:</strong> Maintain your session state</li>
          </ul>

          <h3>Performance and Analytics Cookies</h3>
          <p>These cookies help us understand how our website is being used:</p>
          <ul>
            <li><strong>Google Analytics:</strong> Tracks website usage and performance</li>
            <li><strong>Vercel Analytics:</strong> Monitors site performance and user behavior</li>
            <li><strong>Performance Monitoring:</strong> Helps identify and fix technical issues</li>
          </ul>

          <h3>Functionality Cookies</h3>
          <p>These cookies enhance your user experience:</p>
          <ul>
            <li><strong>Theme Preferences:</strong> Remember your dark/light mode preference</li>
            <li><strong>Language Settings:</strong> Store your preferred language</li>
            <li><strong>User Preferences:</strong> Remember your customization choices</li>
          </ul>

          <h3>Advertising and Marketing Cookies</h3>
          <p>These cookies may be used for advertising purposes:</p>
          <ul>
            <li><strong>Google Tag Manager:</strong> Manages marketing and analytics tags</li>
            <li><strong>Social Media:</strong> Enable social sharing and authentication</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>4. Third-Party Cookies</h2>
          <p>We may use third-party services that place cookies on your device:</p>
          <ul>
            <li><strong>Google Analytics:</strong> Website analytics and reporting</li>
            <li><strong>Google Tag Manager:</strong> Tag management system</li>
            <li><strong>NextAuth.js:</strong> Authentication service</li>
            <li><strong>Social Media Platforms:</strong> Authentication and sharing features</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>5. Cookie Duration</h2>
          <p>Cookies may be temporary or persistent:</p>
          <ul>
            <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
            <li><strong>Persistent Cookies:</strong> Remain on your device until they expire or you delete them</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>6. Managing Your Cookie Preferences</h2>
          <p>You have several options for managing cookies:</p>
          
          <h3>Browser Settings</h3>
          <p>Most browsers allow you to:</p>
          <ul>
            <li>View cookies stored on your device</li>
            <li>Block all cookies</li>
            <li>Block third-party cookies</li>
            <li>Delete cookies when you close your browser</li>
            <li>Delete specific cookies</li>
          </ul>

          <h3>Cookie Consent Tool</h3>
          <p>
            We provide a cookie consent tool that allows you to customize your cookie preferences. 
            You can access this tool through the banner that appears when you first visit our site 
            or through the cookie settings link in our footer.
          </p>

          <h3>Browser-Specific Instructions</h3>
          <ul>
            <li><strong>Chrome:</strong> Settings &gt; Privacy and Security &gt; Cookies and other site data</li>
            <li><strong>Firefox:</strong> Options &gt; Privacy &amp; Security &gt; Cookies and Site Data</li>
            <li><strong>Safari:</strong> Preferences &gt; Privacy &gt; Manage Website Data</li>
            <li><strong>Edge:</strong> Settings &gt; Privacy, search, and services &gt; Cookies and site permissions</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>7. Impact of Disabling Cookies</h2>
          <p>
            While you can disable cookies, please note that doing so may affect the functionality of our website:
          </p>
          <ul>
            <li>You may not be able to log in to your account</li>
            <li>Your preferences may not be saved</li>
            <li>Some features may not work properly</li>
            <li>We may not be able to provide personalized content</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>8. Updates to This Policy</h2>
          <p>
            We may update this Cookie Policy from time to time to reflect changes in our practices or 
            for other operational, legal, or regulatory reasons. Please revisit this page regularly 
            to stay informed about our use of cookies.
          </p>
        </section>

        <section className="mb-8">
          <h2>9. Contact Us</h2>
          <p>
            If you have any questions about our use of cookies or this Cookie Policy, please contact us:
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