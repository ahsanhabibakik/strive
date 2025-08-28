'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Code, Monitor, Rocket } from 'lucide-react';
import { ServicePricingTable } from '@/components/sections/ServicePricingTable';
import { ServiceProcess } from '@/components/sections/ServiceProcess';
import { ServiceTestimonials } from '@/components/sections/ServiceTestimonials';
import { ServiceFAQ } from '@/components/sections/ServiceFAQ';
import { ServiceNavigation } from '@/components/sections/ServiceNavigation';
import { pricingPlans, processSteps, serviceTestimonials, serviceFAQs } from '@/data/service-details';
import ServiceSchema from '@/components/seo/ServiceSchema';
import FAQSchema from '@/components/seo/FAQSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';

// Filter testimonials for website development
const websiteTestimonials = serviceTestimonials.filter(
  testimonial => testimonial.service === 'Website Development' || testimonial.service === 'E-commerce Solutions'
);

export default function WebsiteDevelopmentPage() {
  return (
    <div className="min-h-screen py-12">
      {/* Structured Data for SEO */}
      <ServiceSchema 
        service={{
          name: "Website Development Services",
          description: "Custom website development services focused on creating websites that convert visitors into customers. Our websites are designed for business growth with 43% average conversion increase.",
          url: "https://syedhabib.com/services/website-development",
          serviceType: "WebsiteDevelopment"
        }}
      />
      <FAQSchema faqs={serviceFAQs.website} mainEntity="https://syedhabib.com/services/website-development" />
      <BreadcrumbSchema 
        items={[
          { name: "Home", url: "https://syedhabib.com" },
          { name: "Services", url: "https://syedhabib.com/services" },
          { name: "Website Development", url: "https://syedhabib.com/services/website-development" }
        ]}
      />
      
      <ServiceNavigation />
      <div className="container px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Website Development That <span className="text-primary">Drives Results</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Custom websites designed to convert visitors into customers and grow your business online.
          </p>
          
          {/* Business-focused stats */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">43%</div>
              <div className="text-xs text-muted-foreground">Avg. Conversion Increase</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">2.5x</div>
              <div className="text-xs text-muted-foreground">Traffic Growth</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">100%</div>
              <div className="text-xs text-muted-foreground">Mobile Optimized</div>
            </div>
          </div>
        </div>

        {/* Service Features */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">What's Included</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Monitor className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Custom Design</h3>
              <p className="text-muted-foreground mb-4">
                Unique website design tailored to your brand and business goals, not a generic template.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Responsive for all devices</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>User-friendly navigation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Brand-aligned visuals</span>
                </li>
              </ul>
            </Card>
            
            <Card className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Development</h3>
              <p className="text-muted-foreground mb-4">
                Clean, efficient code that ensures your website loads quickly and functions perfectly.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Fast loading speeds</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>SEO best practices</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Content management</span>
                </li>
              </ul>
            </Card>
            
            <Card className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Rocket className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Growth Features</h3>
              <p className="text-muted-foreground mb-4">
                Built-in tools and features designed to convert visitors and grow your business.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Contact forms & CTAs</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Analytics integration</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Social media integration</span>
                </li>
              </ul>
            </Card>
          </div>
        </section>
        
        {/* Process Section */}
        <ServiceProcess 
          title="Our Website Development Process"
          description="How we create websites that deliver real business results"
          steps={processSteps.website}
        />
        
        {/* Pricing Section */}
        <ServicePricingTable 
          title="Website Development Pricing"
          description="Transparent pricing options for businesses of all sizes"
          plans={pricingPlans.website}
        />
        
        {/* Testimonials Section */}
        <ServiceTestimonials 
          testimonials={websiteTestimonials}
          title="What Our Website Clients Say"
          description="Real feedback from businesses we've helped with website development"
        />
        
        {/* FAQ Section */}
        <ServiceFAQ 
          title="Website Development FAQs"
          description="Common questions about our website development services"
          faqs={serviceFAQs.website}
        />
        
        {/* CTA Section */}
        <Card className="p-8 text-center bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 mt-16">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Book a free 30-minute consultation to discuss your website needs and get a custom quote.
          </p>
          <Button asChild size="lg" className="px-8">
            <Link href="/contact" className="flex items-center">
              Book Your Free Consultation
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              No obligation
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Custom quote
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Results guaranteed
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}