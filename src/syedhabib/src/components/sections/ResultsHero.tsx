'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function ResultsHero() {
  return (
    <section className="relative py-12 md:py-20 overflow-hidden">
      <div className="container px-4 mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Proven Results for Local Businesses
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Grow Your Business <span className="text-primary">Online</span> Without the Tech Headaches
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Websites that convert visitors into customers. Digital marketing that delivers real ROI. No jargon, just results.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="px-8">
                <Link href="/contact">
                  Get a Free Consultation
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/projects">See Client Results</Link>
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -top-6 -left-6 bg-primary/10 rounded-lg p-4 shadow-lg z-10">
              <div className="font-bold text-2xl text-primary">43%</div>
              <div className="text-sm">Avg. Conversion Increase</div>
            </div>
            
            <div className="absolute -bottom-6 -right-6 bg-primary/10 rounded-lg p-4 shadow-lg z-10">
              <div className="font-bold text-2xl text-primary">2.8x</div>
              <div className="text-sm">ROI on Ad Spend</div>
            </div>
            
            <div className="rounded-lg overflow-hidden border shadow-2xl">
              <Image 
                src="/images/dashboard-results.svg" 
                alt="Client Results Dashboard" 
                width={600} 
                height={400} 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}