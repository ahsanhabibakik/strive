import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY && process.env.NODE_ENV === 'production') {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-08-27.basil',
      typescript: true,
    })
  : null;

export const STRIPE_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  secretKey: process.env.STRIPE_SECRET_KEY || '',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
};

// Subscription plans configuration
export const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    description: 'Perfect for getting started',
    price: 0,
    currency: 'usd',
    interval: 'month',
    features: [
      'Up to 1,000 API calls/month',
      'Basic dashboard',
      'Email support',
      '1 user account'
    ],
    stripePriceId: null, // Free plan doesn't have a Stripe price ID
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    description: 'For growing businesses',
    price: 29,
    currency: 'usd',
    interval: 'month',
    features: [
      'Up to 50,000 API calls/month',
      'Advanced dashboard',
      'Priority support',
      'Up to 5 user accounts',
      'Custom integrations',
      'Advanced analytics'
    ],
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID,
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations',
    price: 99,
    currency: 'usd',
    interval: 'month',
    features: [
      'Unlimited API calls',
      'Custom dashboard',
      'Dedicated support',
      'Unlimited users',
      'White-label options',
      'Advanced security',
      'SLA guarantee',
      'Custom contracts'
    ],
    stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
  },
} as const;

export type SubscriptionPlan = keyof typeof SUBSCRIPTION_PLANS;
export type SubscriptionPlanData = typeof SUBSCRIPTION_PLANS[SubscriptionPlan];