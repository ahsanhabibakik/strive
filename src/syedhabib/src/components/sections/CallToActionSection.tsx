'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { 
  Calendar, 
  CheckCircle,
  ArrowRight,
  Star
} from 'lucide-react';

// Simplified testimonials for social proof
const testimonials = [
  {
    quote: "The website increased our leads by 40% in the first month.",
    author: "Sarah J., Small Business Owner"
  },
  {
    quote: "Finally someone who explains tech without the jargon.",
    author: "Michael T., Startup Founder"
  }
];

export default function CallToActionSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-background relative">
      {/* Simple background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="container px-4 mx-auto relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main CTA Card */}
          <Card className="p-8 md:p-10 shadow-lg border-primary/10">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Grow Your Business Online?
              </h2>
              
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
                Book a free 30-minute consultation to discuss your project needs and get a clear roadmap forward.
              </p>
            </div>

            {/* Testimonials - Social Proof */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index} 
                  className="bg-background/50 p-4 rounded-lg border border-border/50"
                >
                  <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm italic mb-2">"{testimonial.quote}"</p>
                  <p className="text-xs text-muted-foreground">{testimonial.author}</p>
                </div>
              ))}
            </div>

            {/* Primary CTA Button */}
            <div className="flex flex-col items-center">
              <Button 
                asChild 
                size="lg" 
                className="w-full md:w-auto px-8 py-6 text-lg font-semibold h-auto mb-4"
              >
                <Link href="/contact" className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Book Your Free Consultation
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground mt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  No obligation
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  30-minute free call
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Custom solution & pricing
                </div>
              </div>
            </div>
          </Card>
          
          {/* Simple Contact Info */}
          <div className="text-center mt-6 text-sm text-muted-foreground">
            <p>Prefer email? Contact me directly at <a href="mailto:syedmirhabib@gmail.com" className="text-primary hover:underline">syedmirhabib@gmail.com</a></p>
          </div>
        </div>
      </div>
    </section>
  );
}
