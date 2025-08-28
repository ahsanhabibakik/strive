'use client';

import { Card } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface Testimonial {
  name: string;
  position: string;
  company: string;
  image: string;
  quote: string;
  service: string;
  stars: number;
}

interface ServiceTestimonialsProps {
  testimonials: Testimonial[];
  title?: string;
  description?: string;
}

export function ServiceTestimonials({ 
  testimonials,
  title = "What Our Clients Say",
  description = "Real feedback from businesses we've helped"
}: ServiceTestimonialsProps) {
  const [activeService, setActiveService] = useState<string | null>(null);
  
  // Get unique services
  const services = Array.from(new Set(testimonials.map(t => t.service)));
  
  // Filter testimonials by active service or show all if none selected
  const filteredTestimonials = activeService 
    ? testimonials.filter(t => t.service === activeService)
    : testimonials;

  return (
    <section className="py-12 bg-muted/20">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </div>
        
        {/* Service filter buttons */}
        {services.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setActiveService(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeService === null 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              All Services
            </button>
            {services.map(service => (
              <button
                key={service}
                onClick={() => setActiveService(service)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  activeService === service 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {service}
              </button>
            ))}
          </div>
        )}
        
        {/* Testimonials grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 h-full flex flex-col">
              <div className="mb-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${
                        i < testimonial.stars 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'fill-gray-200 text-gray-200'
                      }`} 
                    />
                  ))}
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Service: {testimonial.service}
                </div>
              </div>
              
              <div className="flex-1">
                <Quote className="w-8 h-8 text-primary/20 mb-2" />
                <p className="italic text-sm mb-4">"{testimonial.quote}"</p>
              </div>
              
              <div className="flex items-center gap-3 mt-4">
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.position}, {testimonial.company}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}