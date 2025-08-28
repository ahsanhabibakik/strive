'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function SimpleBeforeAfter() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container px-4 mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">Real Results for Real Businesses</h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
          See how we've helped businesses like yours transform their online presence.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Local Restaurant</h3>
            <div className="text-xl font-bold text-primary">156% increase in online orders</div>
            <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
              "Our online orders doubled within the first month after the new website launched."
            </blockquote>
            <Button asChild variant="outline">
              <Link href="/projects/restaurant-case-study">
                View Case Study
              </Link>
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute top-2 left-2 bg-background/80 text-sm font-medium px-2 py-1 rounded z-10">
                Before
              </div>
              <div className="rounded-lg overflow-hidden border">
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">Restaurant Website (Before)</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute top-2 left-2 bg-background/80 text-sm font-medium px-2 py-1 rounded z-10">
                After
              </div>
              <div className="rounded-lg overflow-hidden border">
                <div className="w-full h-64 bg-blue-100 flex items-center justify-center">
                  <p className="text-blue-500">Restaurant Website (After)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Button asChild size="lg">
            <Link href="/contact">
              Get Similar Results for Your Business
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}