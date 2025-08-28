'use client';

import SimpleContactForm from '@/components/sections/SimpleContactForm';
import ContactOptions from '@/components/sections/ContactOptions';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Clock, 
  Award, 
  Lightbulb, 
  Users, 
  Target,
  Star,
  ArrowRight,
  Calendar
} from 'lucide-react';
import JsonLd from '@/components/seo/JsonLd';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import FAQSchema from '@/components/seo/FAQSchema';

// Business-focused benefits
const benefits = [
  {
    icon: Clock,
    title: '2-Hour Response',
    description: 'Quick turnaround on inquiries'
  },
  {
    icon: CheckCircle,
    title: 'Results Guaranteed',
    description: 'Measurable business outcomes'
  },
  {
    icon: Award,
    title: '50+ Projects',
    description: 'Proven track record'
  },
  {
    icon: Calendar,
    title: 'Free Consultation',
    description: '30-minute strategy session'
  }
];

// Simplified process steps
const processSteps = [
  {
    icon: Lightbulb,
    title: 'Share Your Goals',
    description: 'Tell me about your business challenges'
  },
  {
    icon: Users,
    title: 'Get Custom Solution',
    description: 'Receive a tailored plan with clear pricing'
  },
  {
    icon: Target,
    title: 'See Results',
    description: 'Watch your business grow with measurable outcomes'
  }
];

// Client testimonials for social proof
const testimonials = [
  {
    quote: "The website increased our leads by 40% in the first month.",
    author: "Sarah J.",
    business: "Small Business Owner"
  },
  {
    quote: "Finally someone who explains tech without the jargon.",
    author: "Michael T.",
    business: "Startup Founder"
  }
];

// Business-focused reasons to choose
const reasons = [
  'Focus on business results, not just pretty designs',
  'Clear, transparent pricing with no hidden costs',
  'Proven strategies that increase conversions',
  'Fast turnaround times for urgent business needs',
  'Ongoing support to ensure continued success',
  'Data-driven approach to maximize ROI'
];

export default function ContactPage() {
  // Create FAQ data for structured data
  const faqData = [
    {
      question: "How quickly can you start my project?",
      answer: "Most projects can start within 2-3 days after our consultation and agreement on scope."
    },
    {
      question: "What's your pricing structure?",
      answer: "Pricing is based on project scope and business goals. I offer transparent, value-based pricing with no hidden costs."
    },
    {
      question: "Do you provide ongoing support?",
      answer: "Yes! I provide ongoing support and maintenance for all projects to ensure continued success."
    },
    {
      question: "How do you measure results?",
      answer: "I track key metrics like conversion rates, traffic, and engagement to ensure your business goals are being met."
    }
  ];

  // Create contact page structured data
  const contactPageData = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Us | Free Business Growth Consultation',
    description: 'Book a free 30-minute consultation to discuss your business challenges and get a custom solution that drives real results.',
    mainEntity: {
      '@type': 'Organization',
      name: 'Digital Marketing & Web Development Agency',
      telephone: '+8801518926700',
      email: 'ahabibakik@gmail.com',
      contactType: 'customer service',
      availableLanguage: ['English', 'Bengali']
    }
  };

  return (
    <section className="py-12">
      {/* Structured Data for SEO */}
      <JsonLd data={contactPageData} />
      <FAQSchema faqs={faqData} mainEntity="https://syedhabib.com/contact" />
      <BreadcrumbSchema 
        items={[
          { name: "Home", url: "https://syedhabib.com" },
          { name: "Contact", url: "https://syedhabib.com/contact" }
        ]}
      />
      
      <div className="container px-4">
        {/* Hero Section - Simplified and focused on outcomes */}
        <div className="text-center mb-10">
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-none">
            Free 30-Minute Consultation
          </Badge>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Let's Grow Your Business Together
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-6">
            Book a free consultation to discuss your specific business challenges and get a custom solution that drives real results.
          </p>
          
          {/* Quick Stats - Social Proof */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-8">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">43% avg. conversion increase</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">50+ successful projects</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">100% satisfaction rate</span>
            </div>
          </div>
        </div>

        {/* Benefits Section - Mobile Optimized */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {benefits.map((benefit) => (
            <Card key={benefit.title} className="p-4 text-center border hover:border-primary/30 transition-colors">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg mb-3">
                <benefit.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-sm mb-1">{benefit.title}</h3>
              <p className="text-xs text-muted-foreground">{benefit.description}</p>
            </Card>
          ))}
        </div>

        {/* Two Column Layout - Form First on Mobile */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact Form - Comes first for mobile priority */}
          <div className="order-1 lg:order-2">
            <Card className="border-primary/20 p-6" id="contact-form">
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">Book Your Free Consultation</h2>
                <p className="text-muted-foreground text-sm">
                  Fill out this form and I'll get back to you within 2 hours to schedule your free 30-minute consultation.
                </p>
              </div>
              <SimpleContactForm />
            </Card>
          </div>

          {/* Info Column */}
          <div className="space-y-6 order-2 lg:order-1">
            {/* Testimonials - Social Proof */}
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4">What Clients Say</h3>
              <div className="space-y-4">
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="p-4 bg-background/50">
                    <div className="flex gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-sm italic mb-2">"{testimonial.quote}"</p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.author} - {testimonial.business}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* Process Steps - Simplified */}
            <div>
              <h3 className="text-lg font-bold mb-4">How It Works</h3>
              <div className="space-y-4">
                {processSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-sm font-bold text-primary">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">
                        {step.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Why Choose Me - Business Focused */}
            <Card className="p-5 bg-primary/5 border-primary/20">
              <h3 className="font-bold mb-3">Why Businesses Choose Me</h3>
              <ul className="space-y-2">
                {reasons.map((reason, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </Card>
            
            {/* Quick Connect Options */}
            <div>
              <h3 className="text-lg font-bold mb-3">Need a Quick Response?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                For urgent inquiries, you can reach me directly through:
              </p>
              <ContactOptions />
            </div>
          </div>
        </div>

        {/* FAQ Section - Simplified */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-4 hover:border-primary/30 transition-colors">
              <h3 className="font-semibold mb-2">How quickly can you start my project?</h3>
              <p className="text-sm text-muted-foreground">
                Most projects can start within 2-3 days after our consultation and agreement on scope.
              </p>
            </Card>
            <Card className="p-4 hover:border-primary/30 transition-colors">
              <h3 className="font-semibold mb-2">What's your pricing structure?</h3>
              <p className="text-sm text-muted-foreground">
                Pricing is based on project scope and business goals. I offer transparent, value-based pricing with no hidden costs.
              </p>
            </Card>
            <Card className="p-4 hover:border-primary/30 transition-colors">
              <h3 className="font-semibold mb-2">Do you provide ongoing support?</h3>
              <p className="text-sm text-muted-foreground">
                Yes! I provide ongoing support and maintenance for all projects to ensure continued success.
              </p>
            </Card>
            <Card className="p-4 hover:border-primary/30 transition-colors">
              <h3 className="font-semibold mb-2">How do you measure results?</h3>
              <p className="text-sm text-muted-foreground">
                I track key metrics like conversion rates, traffic, and engagement to ensure your business goals are being met.
              </p>
            </Card>
          </div>
        </div>
        
        {/* Final CTA */}
        <Card className="p-6 mt-12 text-center bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <h2 className="text-xl font-bold mb-2">Ready to Grow Your Business?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Book your free 30-minute consultation today and let's discuss how I can help you achieve your business goals.
          </p>
          <Button asChild size="lg" className="px-8">
            <a href="#contact-form" className="flex items-center">
              Book Your Free Consultation
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </Button>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              No obligation
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Custom solution
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Results guaranteed
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}