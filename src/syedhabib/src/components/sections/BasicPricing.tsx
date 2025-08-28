'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Check } from 'lucide-react';

export function BasicPricing() {
  return (
    <section className="py-10 sm:py-16">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Transparent Pricing</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Simple, straightforward pricing with no hidden fees.
          </p>
        </div>
        
        {/* Pricing cards with horizontal scrolling on mobile */}
        <div className="flex flex-nowrap overflow-x-auto pb-6 sm:pb-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 sm:overflow-visible">
          {/* Starter Website */}
          <div className="border rounded-lg p-5 sm:p-6 h-full flex flex-col min-w-[280px] sm:min-w-0 mr-4 sm:mr-0">
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">Starter Website</h3>
              <div className="text-2xl sm:text-3xl font-bold mb-2">$799</div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                Perfect for small businesses just getting started online
              </p>
              <ul className="space-y-2 mb-6">
                {['5-page responsive website', 'Mobile optimization', 'Contact form', 'Basic SEO setup'].map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-auto">
              <Button asChild className="w-full">
                <Link href="/contact">Get Started</Link>
              </Button>
            </div>
          </div>
          
          {/* Business Growth - Popular */}
          <div className="border border-primary rounded-lg p-5 sm:p-6 shadow-lg relative h-full flex flex-col min-w-[280px] sm:min-w-0 mr-4 sm:mr-0">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl">
              MOST POPULAR
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">Business Growth</h3>
              <div className="text-2xl sm:text-3xl font-bold mb-2">$1,499</div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                Complete solution for established businesses looking to grow
              </p>
              <ul className="space-y-2 mb-6">
                {['10-page responsive website', 'Content management system', 'Advanced SEO package', 'Google Analytics integration'].map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-auto">
              <Button asChild className="w-full">
                <Link href="/contact">Most Popular</Link>
              </Button>
            </div>
          </div>
          
          {/* E-Commerce */}
          <div className="border rounded-lg p-5 sm:p-6 h-full flex flex-col min-w-[280px] sm:min-w-0">
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">E-Commerce</h3>
              <div className="text-2xl sm:text-3xl font-bold mb-2">$2,499</div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                Full online store setup with payment processing
              </p>
              <ul className="space-y-2 mb-6">
                {['Custom online store', 'Product management system', 'Payment gateway integration', 'Inventory management'].map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-auto">
              <Button asChild className="w-full">
                <Link href="/contact">Start Selling</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}