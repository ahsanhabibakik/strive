import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - Strive',
  description: 'Terms of Service for Strive - Goal Achievement Platform',
}

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="prose prose-gray max-w-none dark:prose-invert">
        <h1>Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">
          Last updated: {new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>

        <section className="mb-8">
          <h2>1. Agreement to Terms</h2>
          <p>
            By accessing and using Strive (&quot;Service&quot;), you accept and agree to be bound by the terms 
            and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>
        </section>

        <section className="mb-8">
          <h2>2. Description of Service</h2>
          <p>
            Strive is a goal achievement platform that helps users set, track, and accomplish their personal and 
            professional objectives. Our Service includes features such as goal setting, progress tracking, 
            milestone management, and community support.
          </p>
        </section>

        <section className="mb-8">
          <h2>3. User Accounts</h2>
          <p>
            To access certain features of the Service, you may be required to create an account. You agree to:
          </p>
          <ul>
            <li>Provide accurate, current, and complete information during registration</li>
            <li>Maintain the security of your password and identification</li>
            <li>Notify us immediately of any unauthorized use of your account</li>
            <li>Accept responsibility for all activities under your account</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>4. Acceptable Use</h2>
          <p>You agree not to use the Service to:</p>
          <ul>
            <li>Upload, post, or transmit any content that is unlawful, harmful, or objectionable</li>
            <li>Impersonate any person or entity or falsely state your affiliation</li>
            <li>Interfere with or disrupt the Service or servers connected to the Service</li>
            <li>Violate any applicable local, state, national, or international law</li>
            <li>Collect or store personal data about other users without permission</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>5. Privacy Policy</h2>
          <p>
            Your privacy is important to us. Please review our Privacy Policy, which also governs your use 
            of the Service, to understand our practices.
          </p>
        </section>

        <section className="mb-8">
          <h2>6. Content Ownership</h2>
          <p>
            You retain ownership of any content you submit, post, or display on the Service. By submitting 
            content, you grant us a worldwide, non-exclusive, royalty-free license to use, copy, reproduce, 
            process, adapt, modify, publish, transmit, display, and distribute such content.
          </p>
        </section>

        <section className="mb-8">
          <h2>7. Termination</h2>
          <p>
            We may terminate or suspend your account and access to the Service immediately, without prior 
            notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2>8. Disclaimer of Warranties</h2>
          <p>
            The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. We expressly disclaim all 
            warranties of any kind, whether express or implied, including but not limited to the implied 
            warranties of merchantability, fitness for a particular purpose, and non-infringement.
          </p>
        </section>

        <section className="mb-8">
          <h2>9. Limitation of Liability</h2>
          <p>
            In no event shall Strive, its directors, employees, partners, agents, suppliers, or affiliates 
            be liable for any indirect, incidental, special, consequential, or punitive damages, including 
            without limitation, loss of profits, data, use, goodwill, or other intangible losses.
          </p>
        </section>

        <section className="mb-8">
          <h2>10. Changes to Terms</h2>
          <p>
            We reserve the right to modify or replace these Terms at any time. If a revision is material, 
            we will try to provide at least 30 days notice prior to any new terms taking effect.
          </p>
        </section>

        <section className="mb-8">
          <h2>11. Contact Information</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at:
          </p>
          <ul>
            <li>Email: support@strive-app.com</li>
            <li>Address: [Your Business Address]</li>
          </ul>
        </section>
      </div>
    </div>
  )
}