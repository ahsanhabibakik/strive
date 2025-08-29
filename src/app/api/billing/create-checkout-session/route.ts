import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { stripe } from '@/lib/stripe/config';
import { SUBSCRIPTION_PLANS } from '@/lib/stripe/config';
import connectToDatabase from '@/lib/mongoose';
import { User } from '@/lib/models/User';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { planId, userId } = body;

    if (!planId || !userId) {
      return NextResponse.json(
        { error: 'Plan ID and User ID are required' },
        { status: 400 }
      );
    }

    // Validate plan exists
    if (!SUBSCRIPTION_PLANS[planId as keyof typeof SUBSCRIPTION_PLANS]) {
      return NextResponse.json(
        { error: 'Invalid plan ID' },
        { status: 400 }
      );
    }

    const plan = SUBSCRIPTION_PLANS[planId as keyof typeof SUBSCRIPTION_PLANS];

    // Free plan doesn't require Stripe checkout
    if (planId === 'free') {
      await connectToDatabase();
      const user = await User.findById(userId);
      
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      // Update user to free plan
      user.subscription = {
        plan: 'free',
        status: 'active',
        startDate: new Date(),
        customerId: user.subscription?.customerId || null,
        subscriptionId: null
      };
      
      await user.save();

      return NextResponse.json({ success: true });
    }

    // For paid plans, create Stripe checkout session
    if (!plan.stripePriceId) {
      return NextResponse.json(
        { error: 'Price ID not configured for this plan' },
        { status: 500 }
      );
    }

    await connectToDatabase();
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user already has this plan
    if (user.subscription?.plan === planId) {
      return NextResponse.json(
        { error: 'You are already subscribed to this plan' },
        { status: 400 }
      );
    }

    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      );
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: session.user.email,
      line_items: [
        {
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/dashboard/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/billing?cancelled=true`,
      metadata: {
        userId: userId,
        planId: planId,
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer_creation: user.subscription?.customerId ? 'if_required' : 'always',
      ...(user.subscription?.customerId && {
        customer: user.subscription.customerId
      }),
    });

    return NextResponse.json({ url: checkoutSession.url });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}