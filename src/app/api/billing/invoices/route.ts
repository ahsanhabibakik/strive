import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { stripe } from '@/lib/stripe/config';
import connectToDatabase from '@/lib/mongoose';
import { User } from '@/lib/models/User';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get('customerId');

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    // Verify the customer belongs to the authenticated user
    await connectToDatabase();
    const user = await User.findOne({ 
      email: session.user.email,
      'subscription.customerId': customerId 
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized access to billing data' },
        { status: 403 }
      );
    }

    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      );
    }

    // Fetch invoices from Stripe
    const invoices = await stripe.invoices.list({
      customer: customerId,
      limit: 50, // Adjust as needed
      expand: ['data.charge', 'data.payment_intent']
    });

    // Transform Stripe invoice data to our format
    const formattedInvoices = invoices.data.map(invoice => ({
      id: invoice.id,
      date: new Date(invoice.created * 1000).toISOString(),
      amount: invoice.total,
      status: invoice.status === 'paid' ? 'paid' : 
              invoice.status === 'open' ? 'pending' :
              invoice.status === 'void' ? 'cancelled' : 'failed',
      description: invoice.lines.data[0]?.description || `Invoice for ${invoice.currency?.toUpperCase()} ${invoice.total / 100}`,
      currency: invoice.currency || 'usd',
      invoiceUrl: invoice.hosted_invoice_url,
      receiptUrl: invoice.receipt_number ? invoice.invoice_pdf : null,
    }));

    return NextResponse.json({
      invoices: formattedInvoices,
      hasMore: invoices.has_more
    });

  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}