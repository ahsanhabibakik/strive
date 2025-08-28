'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRight, CheckCircle, BarChart, Megaphone, Target } from 'lucide-react';
import { ServicePricingTable } from '@/components/sections/ServicePricingTable';
import { ServiceProcess } from '@/components/sections/ServiceProcess';
import { ServiceTestimonials } from '@/components/sections/ServiceTestimonials';
import { ServiceFAQ } from '@/components/sections/ServiceFAQ';
import { ServiceNavigation } from '@/components/sections/ServiceNavigation';
import { pricingPlans, processSteps, serviceTestimonials, serviceFAQs } from '@/data/service-details';
import ServiceSchema from '@/components/seo/ServiceSchema';
import FAQSchema from '@/components/seo/FAQSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';

// Filter testimonials for digital marketing
const marketingTestimonials = serviceTestimonials.filter(
  testimonial => testimonial.service === 'Digital Marketing'
);

export default function DigitalMarketingPage() {
  return (
    <div className="min-h-screen py-12">
      {/* Structured Data for SEO */}
      <ServiceSchema 
        service={{
          name: "Digital Marketing Services",
          description: "Data-driven digital marketing services that deliver measurable ROI. Our strategic marketing campaigns help businesses attract customers and grow online with an average 2.8x return on ad spend.",
          url: "https://syedhabib.com/services/digital-marketing",
          serviceType: "DigitalMarketing"
        }}
      />
      <FAQSchema faqs={serviceFAQs.marketing} mainEntity="https://syedhabib.com/services/digital-marketing" />
      <BreadcrumbSchema 
        items={[
          { name: "Home", url: "https://syedhabib.com" },
          { name: "Services", url: "https://syedhabib.com/services" },
          { name: "Digital Marketing", url: "https://syedhabib.com/services/digital-marketing" }
        ]}
      />
      
      <ServiceNavigation />
      <div className="container px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Digital Marketing That <span className="text-primary">Delivers ROI</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Data-driven marketing strategies that attract customers and grow your business.
          </p>
          
          {/* Business-focused stats */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">2.8x</div>
              <div className="text-xs text-muted-foreground">Avg. ROI</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">67%</div>
              <div className="text-xs text-muted-foreground">Lead Increase</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">40%</div>
              <div className="text-xs text-muted-foreground">Cost Per Lead Reduction</div>
            </div>
          </div>
        </div>

        {/* Service Features */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Our Marketing Services</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Megaphone className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Social Media Marketing</h3>
              <p className="text-muted-foreground mb-4">
                Strategic social media management that builds your brand and engages your audience.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Content creation & scheduling</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Community management</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Paid social campaigns</span>
                </li>
              </ul>
            </Card>
            
            <Card className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Search Engine Marketing</h3>
              <p className="text-muted-foreground mb-4">
                SEO and paid search campaigns that drive qualified traffic to your website.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Keyword research & optimization</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Google Ads management</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Local SEO optimization</span>
                </li>
              </ul>
            </Card>
            
            <Card className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Analytics & Reporting</h3>
              <p className="text-muted-foreground mb-4">
                Data-driven insights and transparent reporting on your marketing performance.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Performance dashboards</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>ROI tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Conversion optimization</span>
                </li>
              </ul>
            </Card>
          </div>
        </section>
        
        {/* Process Section */}
        <ServiceProcess 
          title="Our Digital Marketing Process"
          description="How we create marketing campaigns that deliver measurable results"
          steps={processSteps.marketing}
        />
        
        {/* Pricing Section */}
        <ServicePricingTable 
          title="Digital Marketing Pricing"
          description="Flexible marketing packages to fit your business goals and budget"
          plans={pricingPlans.marketing}
        />
        
        {/* Testimonials Section */}
        <ServiceTestimonials 
          testimonials={marketingTestimonials}
          title="What Our Marketing Clients Say"
          description="Real feedback from businesses we've helped with digital marketing"
        />
        
        {/* FAQ Section */}
        <ServiceFAQ 
          title="Digital Marketing FAQs"
          description="Common questions about our digital marketing services"
          faqs={serviceFAQs.marketing}
        />
        
        {/* CTA Section */}
        <Card className="p-8 text-center bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 mt-16">
          <h2 className="text-2xl font-bold mb-4">Ready to Grow Your Business?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Book a free 30-minute consultation to discuss your marketing goals and get a custom strategy.
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
              Custom strategy
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