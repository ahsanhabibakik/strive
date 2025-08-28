'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Users, DollarSign, Clock } from 'lucide-react';

export function EnhancedBeforeAfter() {
  const projects = [
    {
      name: "Local Restaurant Chain",
      industry: "Food & Beverage",
      before: "/images/portfolio/restaurant-before.svg",
      after: "/images/portfolio/restaurant-after.svg",
      results: {
        primary: "156% increase in online orders",
        secondary: [
          { label: "Revenue Growth", value: "+$45K monthly", icon: DollarSign },
          { label: "Customer Acquisition", value: "+280% new customers", icon: Users },
          { label: "Page Load Speed", value: "3.2s faster", icon: Clock }
        ]
      },
      testimonial: "Syed transformed our entire online presence. Within just 30 days, we saw our online orders double, and our revenue increased by 45% month-over-month. The new website is exactly what we needed to compete in the digital space.",
      client: "Maria Rodriguez, Owner",
      timeframe: "3 months",
      slug: "restaurant-case-study"
    },
    {
      name: "E-Commerce Fashion Store",
      industry: "Retail & Fashion",
      before: "/images/portfolio/retail-before.svg",
      after: "/images/portfolio/retail-after.svg",
      results: {
        primary: "243% increase in conversion rate",
        secondary: [
          { label: "Sales Revenue", value: "+$120K quarterly", icon: DollarSign },
          { label: "Site Traffic", value: "+185% organic visits", icon: TrendingUp },
          { label: "Checkout Speed", value: "60% faster process", icon: Clock }
        ]
      },
      testimonial: "The new website completely transformed our business. Our customers can now easily browse and purchase products, and our conversion rate has more than tripled. The investment paid for itself within the first quarter.",
      client: "James Chen, Founder",
      timeframe: "4 months",
      slug: "retail-case-study"
    }
  ];

  return (
    <section className="py-10 sm:py-16 bg-muted/30">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            Proven Results That Drive 
            <span className="block text-primary mt-2">Real Business Growth</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-8">
            Don't just take our word for it. See how we've helped businesses achieve measurable growth through strategic web development and optimization.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary">200%+</div>
              <div className="text-sm sm:text-base text-muted-foreground">Average Growth</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary">50+</div>
              <div className="text-sm sm:text-base text-muted-foreground">Projects Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary">98%</div>
              <div className="text-sm sm:text-base text-muted-foreground">Client Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary">6 Months</div>
              <div className="text-sm sm:text-base text-muted-foreground">Average ROI Time</div>
            </div>
          </div>
        </div>
        
        <div className="space-y-16 sm:space-y-24">
          {projects.map((project, index) => (
            <div key={project.name} className="bg-background/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg">
              <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Text content - always first on mobile */}
                <div className={`space-y-6 sm:space-y-8 order-2 md:order-none ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                  <div>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                      {project.industry}
                    </div>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">{project.name}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Clock className="w-4 h-4" />
                      <span>Delivered in {project.timeframe}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4 sm:p-6">
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-4">
                      {project.results.primary}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {project.results.secondary.map((result, idx) => {
                        const IconComponent = result.icon;
                        return (
                          <div key={idx} className="flex items-center gap-2">
                            <IconComponent className="w-4 h-4 text-primary shrink-0" />
                            <div>
                              <div className="font-semibold text-sm">{result.value}</div>
                              <div className="text-xs text-muted-foreground">{result.label}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <blockquote className="border-l-4 border-primary pl-6 space-y-2">
                    <p className="italic text-muted-foreground text-base sm:text-lg leading-relaxed">
                      "{project.testimonial}"
                    </p>
                    <cite className="text-sm font-semibold text-foreground not-italic">
                      — {project.client}
                    </cite>
                  </blockquote>
                  
                  <Button asChild size="lg" className="w-full sm:w-auto">
                    <Link href={`/projects/${project.slug}`} className="flex items-center justify-center">
                      View Full Case Study
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              
                {/* Images - always second on mobile */}
                <div className={`space-y-6 order-1 md:order-none ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-center">Before & After Transformation</h4>
                    
                    <div className="relative group">
                      <div className="absolute top-3 left-3 bg-red-500/90 text-white text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full z-10 shadow-lg">
                        Before
                      </div>
                      <div className="rounded-xl overflow-hidden border-2 border-red-200 shadow-lg transition-all duration-300 group-hover:shadow-xl">
                        <Image 
                          src={project.before} 
                          alt={`${project.name} Before Redesign`} 
                          width={600} 
                          height={400} 
                          className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-center">
                      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-primary/20 rounded-full">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium text-primary">Transformed</span>
                      </div>
                    </div>
                    
                    <div className="relative group">
                      <div className="absolute top-3 left-3 bg-green-500/90 text-white text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full z-10 shadow-lg">
                        After
                      </div>
                      <div className="rounded-xl overflow-hidden border-2 border-green-200 shadow-lg transition-all duration-300 group-hover:shadow-xl">
                        <Image 
                          src={project.after} 
                          alt={`${project.name} After Redesign`} 
                          width={600} 
                          height={400} 
                          className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16 sm:mt-20">
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8 sm:p-12 border border-primary/20">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              Ready to See Similar Results?
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Let's discuss how we can transform your business with a custom web solution that drives real growth and measurable results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="px-8">
                <Link href="/contact" className="flex items-center justify-center">
                  Start Your Transformation
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8">
                <Link href="/projects" className="flex items-center justify-center">
                  View All Case Studies
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}