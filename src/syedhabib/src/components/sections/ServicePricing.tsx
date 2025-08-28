'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function ServicePricing() {
  return (
    <section className="py-16">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Transparent Pricing</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Simple, straightforward pricing with no hidden fees.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-bold mb-2">Starter Website</h3>
            <div className="text-3xl font-bold mb-2">$799</div>
            <p className="text-sm text-muted-foreground mb-4">
              Perfect for small businesses just getting started online
            </p>
            <Button asChild className="w-full">
              <Link href="/contact">Get Started</Link>
            </Button>
          </div>
          
          <div className="border border-primary rounded-lg p-6 shadow-lg relative">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl">
              MOST POPULAR
            </div>
            <h3 className="text-xl font-bold mb-2">Business Growth</h3>
            <div className="text-3xl font-bold mb-2">$1,499</div>
            <p className="text-sm text-muted-foreground mb-4">
              Complete solution for established businesses looking to grow
            </p>
            <Button asChild className="w-full">
              <Link href="/contact">Most Popular</Link>
            </Button>
          </div>
          
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-bold mb-2">E-Commerce</h3>
            <div className="text-3xl font-bold mb-2">$2,499</div>
            <p className="text-sm text-muted-foreground mb-4">
              Full online store setup with payment processing
            </p>
            <Button asChild className="w-full">
              <Link href="/contact">Start Selling</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}