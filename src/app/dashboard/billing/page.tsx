import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import connectToDatabase from '@/lib/mongoose';
import { User } from '@/lib/models/User';
import { PricingPlans } from '@/components/billing/PricingPlans';
import { BillingHistory } from '@/components/billing/BillingHistory';
import { SubscriptionOverview } from '@/components/billing/SubscriptionOverview';
import { SUBSCRIPTION_PLANS } from '@/lib/stripe/config';

export const metadata = {
  title: 'Billing - Strive',
  description: 'Manage your subscription and billing settings',
};

export default async function BillingPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  await connectToDatabase();
  const user = await User.findOne({ email: session.user.email });
  
  if (!user) {
    redirect('/auth/signin');
  }

  const currentPlan = user.subscription?.plan || 'free';
  const planData = SUBSCRIPTION_PLANS[currentPlan as keyof typeof SUBSCRIPTION_PLANS];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Billing & Subscription</h1>
        <p className="text-gray-600 mt-2">
          Manage your subscription, view billing history, and update payment methods
        </p>
      </div>

      {/* Current Subscription Overview */}
      <SubscriptionOverview user={user} currentPlan={planData} />

      {/* Pricing Plans */}
      <PricingPlans currentPlan={currentPlan} userId={user._id} />

      {/* Billing History */}
      <BillingHistory customerId={user.subscription?.customerId} />
    </div>
  );
}