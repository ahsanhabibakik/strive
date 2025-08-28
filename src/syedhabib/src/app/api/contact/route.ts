// Ensure this route runs in the Node.js runtime (not edge)
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with API key
const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(request: Request) {
  try {
    const formData = await request.json();
    
    // Handle both simple form (name, email, message) and detailed project form
    const {
      name,
      email,
      message,
      projectType,
      budget,
      timeline
    } = formData;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Create email content based on form type
    const isDetailedForm = projectType || budget || timeline;
    const emailSubject = isDetailedForm 
      ? `🚀 New Project Inquiry from ${name}` 
      : `💬 Contact Form Message from ${name}`;

    let emailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
          ${isDetailedForm ? '🚀 New Project Inquiry' : '💬 Contact Form Message'}
        </h2>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #007bff; margin-top: 0;">Contact Information</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        </div>`;

    if (isDetailedForm) {
      emailHTML += `
        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1976d2; margin-top: 0;">Project Details</h3>
          ${projectType ? `<p><strong>Project Type:</strong> ${projectType}</p>` : ''}
          ${budget ? `<p><strong>Budget Range:</strong> ${budget}</p>` : ''}
          ${timeline ? `<p><strong>Timeline:</strong> ${timeline}</p>` : ''}
        </div>`;
    }

    emailHTML += `
        <div style="background: #fff; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Message</h3>
          <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
        </div>
        
        <div style="background: #d4edda; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="color: #155724; margin: 0 0 10px 0;">Next Steps</h4>
          <ul style="color: #155724; margin: 0; padding-left: 20px;">
            <li>Respond within 2 hours with initial thoughts</li>
            ${isDetailedForm ? '<li>Prepare detailed proposal with timeline and pricing</li>' : '<li>Address their questions promptly</li>'}
            <li>Schedule follow-up call if needed</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
          <p style="color: #6c757d; font-size: 14px;">
            Sent from Portfolio Contact Form • ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' })} BD Time
          </p>
        </div>
      </div>`;

    // Always log to console for development and debugging
    console.log('📧 NEW CONTACT FORM SUBMISSION:');
    console.log('='.repeat(60));
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    if (projectType) console.log(`Project Type: ${projectType}`);
    if (budget) console.log(`Budget: ${budget}`);
    if (timeline) console.log(`Timeline: ${timeline}`);
    console.log(`Message:\n${message}`);
    console.log('='.repeat(60));

    if (resend) {
      try {
        // Use Resend if available
        const data = await resend.emails.send({
          from: 'Portfolio Contact <onboarding@resend.dev>',
          to: ['ahabibakik@gmail.com'],
          subject: emailSubject,
          html: emailHTML,
          // Add reply-to for easy response
          reply_to: email,
        });

        console.log('✅ Email sent successfully via Resend:', data);
        return NextResponse.json({ 
          success: true, 
          service: 'resend',
          message: 'Your message has been sent successfully!' 
        });
      } catch (emailError) {
        console.error('❌ Resend email error:', emailError);
        // Still return success since we logged the message
        return NextResponse.json({ 
          success: true, 
          service: 'console-log-fallback',
          message: 'Your message has been received and logged successfully!' 
        });
      }
    } else {
      // No email service configured - log to console for development
      console.warn('⚠️ No RESEND_API_KEY configured. Message logged to console only.');
      
      return NextResponse.json({ 
        success: true, 
        service: 'console-log',
        message: 'Your message has been received and logged successfully!' 
      });
    }

  } catch (error) {
    console.error('❌ Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to process contact form submission' },
      { status: 500 }
    );
  }
}