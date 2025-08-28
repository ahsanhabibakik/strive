'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function BeforeAfterShowcase() {
  const projects = [
    {
      name: "Local Restaurant",
      before: "/images/portfolio/restaurant-before.svg",
      after: "/images/portfolio/restaurant-after.svg",
      results: "156% increase in online orders",
      testimonial: "Our online orders doubled within the first month after the new website launched.",
      slug: "restaurant-case-study"
    },
    {
      name: "Retail Store",
      before: "/images/portfolio/retail-before.svg",
      after: "/images/portfolio/retail-after.svg",
      results: "43% increase in conversion rate",
      testimonial: "The new website design made it so much easier for customers to find and purchase products.",
      slug: "retail-case-study"
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container px-4 mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">Real Results for Real Businesses</h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
          See how we've helped businesses like yours transform their online presence and achieve measurable growth.
        </p>
        
        <div className="space-y-16">
          {projects.map((project, index) => (
            <div key={project.name} className="grid md:grid-cols-2 gap-8 items-center">
              <div className={`space-y-6 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                <h3 className="text-2xl font-bold">{project.name}</h3>
                <div className="flex items-center gap-2">
                  <div className="text-xl font-bold text-primary">{project.results}</div>
                </div>
                <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                  "{project.testimonial}"
                </blockquote>
                <Button asChild variant="outline">
                  <Link href={`/projects/${project.slug}`} className="flex items-center">
                    View Case Study
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
              
              <div className={`space-y-4 ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                <div className="relative">
                  <div className="absolute top-2 left-2 bg-background/80 text-sm font-medium px-2 py-1 rounded z-10">
                    Before
                  </div>
                  <div className="rounded-lg overflow-hidden border">
                    <Image 
                      src={project.before} 
                      alt={`${project.name} Before`} 
                      width={600} 
                      height={400} 
                      className="w-full h-auto"
                    />
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute top-2 left-2 bg-background/80 text-sm font-medium px-2 py-1 rounded z-10">
                    After
                  </div>
                  <div className="rounded-lg overflow-hidden border">
                    <Image 
                      src={project.after} 
                      alt={`${project.name} After`} 
                      width={600} 
                      height={400} 
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button asChild size="lg">
            <Link href="/contact">
              Get Similar Results for Your Business
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}