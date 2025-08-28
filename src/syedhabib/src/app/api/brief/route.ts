import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with API key
const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(request: Request) {
  try {
    const formData = await request.json();
    const {
      name,
      email,
      company,
      phone,
      projectType,
      projectTitle,
      projectDescription,
      budget,
      timeline,
      features,
      inspiration,
      additionalNotes
    } = formData;

    if (!resend) {
      console.warn('Resend API key not configured');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 503 }
      );
    }

    const data = await resend.emails.send({
      from: 'Project Brief <onboarding@resend.dev>',
      to: ['ahabibakik@gmail.com'],
      subject: `New Project Brief: ${projectTitle} from ${name}`,
      html: `
        <h2>New Project Brief Submission</h2>
        
        <h3>Client Information</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        
        <h3>Project Details</h3>
        <p><strong>Project Type:</strong> ${projectType}</p>
        <p><strong>Project Title:</strong> ${projectTitle}</p>
        <p><strong>Description:</strong></p>
        <p style="background: #f5f5f5; padding: 15px; border-radius: 5px;">${projectDescription}</p>
        
        <h3>Requirements & Timeline</h3>
        <p><strong>Budget Range:</strong> ${budget}</p>
        <p><strong>Timeline:</strong> ${timeline}</p>
        <p><strong>Key Features:</strong></p>
        <p style="background: #f5f5f5; padding: 15px; border-radius: 5px;">${features}</p>
        
        ${inspiration ? `
        <h3>Inspiration & References</h3>
        <p style="background: #f5f5f5; padding: 15px; border-radius: 5px;">${inspiration}</p>
        ` : ''}
        
        ${additionalNotes ? `
        <h3>Additional Notes</h3>
        <p style="background: #f5f5f5; padding: 15px; border-radius: 5px;">${additionalNotes}</p>
        ` : ''}
        
        <hr style="margin: 20px 0;">
        <p><em>This project brief was submitted via the portfolio website.</em></p>
      `,
    });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'Failed to send project brief' },
      { status: 500 }
    );
  }
}