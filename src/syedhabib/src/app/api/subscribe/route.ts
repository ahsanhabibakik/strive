import { NextResponse } from 'next/server';
import { z } from 'zod';

// Email validation schema
const subscribeSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
});

export async function POST(request: Request) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const { email } = subscribeSchema.parse(body);
    
    // In a real application, you would:
    // 1. Check if the email already exists in your database
    // 2. Add the email to your newsletter service (Mailchimp, ConvertKit, etc.)
    // 3. Store the subscription in your database
    
    // For now, we'll just simulate a successful subscription
    console.log(`Newsletter subscription: ${email}`);
    
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