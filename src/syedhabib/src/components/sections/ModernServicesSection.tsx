"use client";

import { Monitor, Bot, TrendingUp, ShoppingCart, Megaphone, Settings, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const services = [
  {
    icon: <Monitor className="w-8 h-8 text-primary" />,
    title: "Website Development",
    description: "Custom websites that convert visitors into customers. Mobile-first and SEO-ready.",
    benefits: ["Increase online sales", "Improve brand credibility", "24/7 customer access"],
    slug: "website-development",
    popular: true
  },
  {
    icon: <Bot className="w-8 h-8 text-primary" />,
    title: "AI-Powered Solutions",
    description: "Automate repetitive tasks and enhance customer interactions with AI tools.",
    benefits: ["Save 10+ hours weekly", "Improve response times", "Reduce operational costs"],
    slug: "ai-solutions"
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-primary" />,
    title: "Social Media Management",
    description: "Grow your audience and drive engagement with strategic social media management.",
    benefits: ["Consistent brand presence", "Targeted audience growth", "Measurable ROI"],
    slug: "social-media"
  },
  {
    icon: <ShoppingCart className="w-8 h-8 text-primary" />,
    title: "E-Commerce Solutions",
    description: "Sell products online with a streamlined shopping experience that converts.",
    benefits: ["Higher conversion rates", "Simplified checkout", "Mobile shopping optimization"],
    slug: "ecommerce",
    popular: true
  },
  {
    icon: <Megaphone className="w-8 h-8 text-primary" />,
    title: "Digital Marketing",
    description: "Get more leads and sales with targeted ads and marketing campaigns.",
    benefits: ["Increase qualified leads", "Improve ad performance", "Track marketing ROI"],
    slug: "marketing"
  },
  {
    icon: <Settings className="w-8 h-8 text-primary" />,
    title: "Tech Setup & Support",
    description: "Get your business tools configured properly without the technical headaches.",
    benefits: ["Streamlined workflows", "Reliable tech stack", "Ongoing expert support"],
    slug: "tech-support"
  },
];

export default function ModernServicesSection() {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-br from-background via-accent/5 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Services That Drive <span className="text-primary">Results</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Solutions designed to grow your business, not just look pretty.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {services.map((service) => (
            <div
              key={service.title}
              className={`flex flex-col bg-card rounded-xl p-6 shadow-md border border-border/30 hover:border-primary/30 ${
                service.popular ? 'ring-2 ring-primary/20' : ''
              }`}
            >
              {service.popular && (
                <div className="bg-primary/10 text-primary text-xs font-medium py-1 px-3 rounded-full self-start mb-4">
                  Popular Choice
                </div>
              )}
              
              <div className="mb-4">
                {service.icon}
              </div>
              
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                {service.title}
              </h3>
              
              <p className="text-sm text-muted-foreground mb-4 flex-1">
                {service.description}
              </p>
              
              <div className="mb-6">
                <p className="text-sm font-medium mb-2 text-foreground">Benefits:</p>
                <ul className="space-y-2">
                  {service.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Button asChild className="w-full mt-auto">
                <Link href={`/services/${service.slug}`} className="flex items-center justify-center">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline" className="px-8">
            <Link href="/services">View All Services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}