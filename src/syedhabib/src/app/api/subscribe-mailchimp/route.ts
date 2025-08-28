import { NextResponse } from 'next/server';
import { z } from 'zod';

// Email validation schema
const subscribeSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

// Replace with your Mailchimp API key and list ID when ready
const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY || '';
const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID || '';
const MAILCHIMP_SERVER = process.env.MAILCHIMP_SERVER || 'us1'; // e.g., 'us1'

export async function POST(request: Request) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const { email, firstName, lastName } = subscribeSchema.parse(body);
    
    // Check if Mailchimp credentials are configured
    if (!MAILCHIMP_API_KEY || !MAILCHIMP_LIST_ID || !MAILCHIMP_SERVER) {
      console.error('Mailchimp credentials not configured');
      return NextResponse.json(
        { success: false, message: 'Newsletter service not configured' },
        { status: 500 }
      );
    }
    
    // Prepare the data for Mailchimp
    const data = {
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        FNAME: firstName || '',
        LNAME: lastName || '',
      },
    };
    
    // Make API request to Mailchimp
    const response = await fetch(
      `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString('base64')}`,
        },
        body: JSON.stringify(data),
      }
    );
    
    const responseData = await response.json();
    
    // Handle existing subscribers
    if (response.status === 400 && responseData.title === 'Member Exists') {
      return NextResponse.json(
        { success: true, message: 'You are already subscribed!' },
        { status: 200 }
      );
    }
    
    if (!response.ok) {
      throw new Error(responseData.detail || 'Failed to subscribe');
    }
    
    // Return success response
    return NextResponse.json(
      { success: true, message: 'Thank you for subscribing!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    // Check if it's a validation error
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: error.errors[0].message },
        { status: 400 }
      );
    }
    
    // Generic error
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}