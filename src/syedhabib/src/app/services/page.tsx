'use client';

import Link from 'next/link';
import services from '@/services';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Code, Monitor, Palette, Wrench } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ServiceNavigation } from '@/components/sections/ServiceNavigation';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import ServicesIndexSchema from '@/components/seo/ServicesIndexSchema';

// Web development focused categories
const serviceCategories = [
  {
    id: 'development',
    title: 'Web Development',
    description: 'Custom websites and web applications built with modern technologies',
    icon: Code,
    color: 'from-blue-500 to-indigo-600',
    outcome: 'Fast, secure, and scalable web solutions'
  },
  {
    id: 'design',
    title: 'Web Design & UX',
    description: 'User-centered design that creates engaging web experiences',
    icon: Palette,
    color: 'from-purple-500 to-pink-600',
    outcome: 'Intuitive interfaces that users love'
  }
];

// Development-focused stats
const stats = [
  { value: '3+', label: 'Years Experience' },
  { value: '50+', label: 'Projects Completed' },
  { value: '100%', label: 'Client Satisfaction' }
];

// Client testimonials focused on web development
const testimonials = [
  {
    quote: "The website is fast, responsive, and exactly what we needed for our business.",
    author: "Sarah J., E-commerce Owner"
  },
  {
    quote: "Finally someone who explains tech without the jargon.",
    author: "Michael T., Startup Founder"
  }
];

export default function ServicesPage() {
  const businessServices = services.filter(service => service.category === 'business');
  const creativeServices = services.filter(service => service.category === 'creative');

  // We've moved the structured data to the ServicesIndexSchema component

  // Format services for the schema component
  const allServices = [...businessServices, ...creativeServices];
  const schemaServices = allServices.map(service => ({
    title: service.title,
    description: service.description,
    slug: service.title === "Website Development" || service.title === "E-commerce Solutions" 
      ? "website-development"
      : service.title === "Digital Marketing & Growth" 
      ? "digital-marketing"
      : undefined,
    category: service.category
  }));

  return (
    <div className="min-h-screen py-12">
      {/* Structured Data for SEO */}
      <ServicesIndexSchema services={schemaServices} />
      <BreadcrumbSchema 
        items={[
          { name: "Home", url: "https://syedhabib.com" },
          { name: "Services", url: "https://syedhabib.com/services" }
        ]}
      />
      
      <ServiceNavigation />
      <div className="container px-4">
        {/* Hero Section - Web development focused */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Web Development <span className="text-primary">Services</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Professional web development services using modern technologies and best practices.
            Creating fast, secure, and scalable solutions for your digital needs.
          </p>
          
          {/* Development-focused stats */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Service Categories - Clearer value proposition */}
        <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
          {serviceCategories.map((category) => (
            <Card key={category.id} className="p-6 border hover:border-primary/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center`}>
                  <category.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">{category.title}</h2>
                  <p className="text-muted-foreground mb-3">{category.description}</p>
                  <div className="flex items-center text-primary text-sm font-medium">
                    <Star className="w-4 h-4 mr-1" />
                    {category.outcome}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Web Development Services */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Development Services</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {businessServices.map((service) => (
              <Card
                key={service.title}
                className="p-6 hover:shadow-md transition-shadow border hover:border-primary/30"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    {service.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{service.title}</h3>
                </div>
                <p className="text-muted-foreground mb-4 text-sm">{service.description}</p>
                
                {/* Key benefits - limited to 4 for clarity */}
                <div className="mb-6">
                  <p className="font-medium mb-2 text-sm">Key Benefits:</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-2">
                    {service.features.slice(0, 4).map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Clear CTA */}
                <Button asChild className="w-full">
                  <Link 
                    href={
                      service.title === "Website Development" || service.title === "E-commerce Solutions" 
                        ? "/services/website-development" 
                        : service.title === "Digital Marketing & Growth" 
                        ? "/services/digital-marketing"
                        : "/contact"
                    } 
                    className="flex items-center justify-center"
                  >
                    {service.title === "Website Development" || service.title === "E-commerce Solutions" || service.title === "Digital Marketing & Growth"
                      ? "Learn More"
                      : "Get Started"
                    }
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </Card>
            ))}
          </div>
        </section>

        {/* Design Services */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Design & UX Services</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {creativeServices.map((service) => (
              <Card
                key={service.title}
                className="p-6 hover:shadow-md transition-shadow border hover:border-primary/30"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    {service.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{service.title}</h3>
                </div>
                <p className="text-muted-foreground mb-4 text-sm">{service.description}</p>
                
                {/* Key benefits - limited to 4 for clarity */}
                <div className="mb-6">
                  <p className="font-medium mb-2 text-sm">Key Benefits:</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-2">
                    {service.features.slice(0, 4).map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Clear CTA */}
                <Button asChild className="w-full">
                  <Link 
                    href={service.title === "Creative Design Services" 
                      ? "/services/website-development" 
                      : "/contact"
                    } 
                    className="flex items-center justify-center"
                  >
                    {service.title === "Creative Design Services" ? "Learn More" : "Get Started"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </Card>
            ))}
          </div>
        </section>

        {/* Testimonials - Social proof */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">What Clients Say</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 bg-background/50">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-base italic mb-3">"{testimonial.quote}"</p>
                <p className="text-sm text-muted-foreground">{testimonial.author}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section - Development focused */}
        <Card className="p-8 text-center bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 mb-8">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Your Project?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Let's discuss your web development needs and create a solution that fits your requirements.
          </p>
          <Button asChild size="lg" className="px-8">
            <Link href="/contact" className="flex items-center">
              Book Your Free Consultation
              <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          
          {/* Development focused indicators */}
          <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              No obligation
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Custom Solutions
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Responsive Design
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}