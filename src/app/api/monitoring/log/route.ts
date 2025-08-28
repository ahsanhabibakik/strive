import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const logEntry = await request.json();
    
    // In production, you might want to:
    // - Store logs in a dedicated logging service (e.g., Logtail, DataDog, Sentry)
    // - Filter sensitive information
    // - Rate limit requests
    
    // For now, we'll just acknowledge receipt
    console.log('[MONITORING]', logEntry);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to process monitoring log:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process log' },
      { status: 500 }
    );
  }
}