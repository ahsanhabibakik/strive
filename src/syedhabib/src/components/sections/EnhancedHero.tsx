'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function EnhancedHero() {
  return (
    <section className="relative py-8 md:py-20 overflow-hidden">
      <div className="container px-4 mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            {/* Mobile-optimized badge with smaller text on mobile */}
            <div className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Proven Results for Local Businesses
            </div>
            
            {/* Responsive heading with better line height on mobile */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-[1.2] md:leading-tight">
              Grow Your Business <span className="text-primary">Online</span> Without the Tech Headaches
            </h1>
            
            {/* Smaller text on mobile */}
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8">
              Websites that convert visitors into customers. Digital marketing that delivers real ROI. No jargon, just results.
            </p>
            
            {/* Stack buttons on mobile, side by side on larger screens */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto px-4 sm:px-8">
                <Link href="/contact" className="flex items-center justify-center">
                  Get a Free Consultation
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="/projects" className="flex items-center justify-center">
                  See Client Results
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="relative mt-8 md:mt-0">
            {/* Smaller stats boxes on mobile */}
            <div className="absolute -top-4 sm:-top-6 -left-4 sm:-left-6 bg-primary/10 rounded-lg p-3 sm:p-4 shadow-lg z-10 text-center sm:text-left">
              <div className="font-bold text-xl sm:text-2xl text-primary">43%</div>
              <div className="text-xs sm:text-sm">Avg. Conversion Increase</div>
            </div>
            
            <div className="absolute -bottom-4 sm:-bottom-6 -right-4 sm:-right-6 bg-primary/10 rounded-lg p-3 sm:p-4 shadow-lg z-10 text-center sm:text-left">
              <div className="font-bold text-xl sm:text-2xl text-primary">2.8x</div>
              <div className="text-xs sm:text-sm">ROI on Ad Spend</div>
            </div>
            
            {/* Responsive image with better shadow on mobile */}
            <div className="rounded-lg overflow-hidden border shadow-md sm:shadow-2xl">
              <Image 
                src="/images/dashboard-results.svg" 
                alt="Client Results Dashboard" 
                width={600} 
                height={400} 
                className="w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}