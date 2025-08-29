'use client';

import { useState } from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { SUBSCRIPTION_PLANS } from '@/lib/stripe/config';

interface PricingPlansProps {
  currentPlan: string;
  userId: string;
}

export function PricingPlans({ currentPlan, userId }: PricingPlansProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    if (planId === currentPlan) return;
    
    setLoading(planId);
    
    try {
      const response = await fetch('/api/billing/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          userId,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const response = await fetch('/api/billing/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating portal session:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xs">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Choose Your Plan</h3>
        <p className="mt-1 text-sm text-gray-500">
          Select the plan that best fits your needs
        </p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(SUBSCRIPTION_PLANS).map(([planId, plan]) => {
            const isCurrentPlan = planId === currentPlan;
            const isPopular = planId === 'pro';
            
            return (
              <div
                key={planId}
                className={`relative rounded-lg border-2 p-6 ${
                  isCurrentPlan
                    ? 'border-indigo-600 bg-indigo-50'
                    : isPopular
                    ? 'border-indigo-200'
                    : 'border-gray-200'
                } ${isPopular ? 'ring-1 ring-indigo-600' : ''}`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-indigo-600 px-3 py-1 text-sm font-medium text-white">
                      Most Popular
                    </span>
                  </div>
                )}
                
                {isCurrentPlan && (
                  <div className="absolute -top-4 right-4">
                    <span className="inline-flex items-center rounded-full bg-green-600 px-3 py-1 text-sm font-medium text-white">
                      Current Plan
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
                  <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">
                      ${plan.price}
                    </span>
                    <span className="text-base font-medium text-gray-500">
                      /{plan.interval}
                    </span>
                  </div>
                </div>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <CheckIcon className="h-5 w-5 flex-shrink-0 text-green-500 mt-0.5" />
                      <span className="ml-3 text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  {isCurrentPlan ? (
                    <Button
                      onClick={handleManageSubscription}
                      variant="outline"
                      className="w-full"
                    >
                      Manage Subscription
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleSubscribe(planId)}
                      disabled={loading === planId}
                      className={`w-full ${
                        isPopular
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                          : ''
                      }`}
                      variant={isPopular ? 'default' : 'outline'}
                    >
                      {loading === planId ? 'Loading...' : 
                       planId === 'free' ? 'Downgrade to Free' : 
                       `Upgrade to ${plan.name}`}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {currentPlan !== 'free' && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Need to cancel or modify your subscription?{' '}
              <button
                onClick={handleManageSubscription}
                className="text-indigo-600 hover:text-indigo-500"
              >
                Manage your subscription
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}