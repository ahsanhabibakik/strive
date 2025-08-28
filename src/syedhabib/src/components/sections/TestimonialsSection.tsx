"use client";

import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah M.",
    role: "Small Business Owner",
    content: "Syed helped me set up my online store and social media presence. Everything was done quickly and professionally. Highly recommended!",
    rating: 5,
    project: "E-commerce Website + Social Media Setup",
    avatar: "/images/testimonials/sarah.jpg"
  },
  {
    name: "Ahmed K.",
    role: "Startup Founder",
    content: "The AI-powered automation he set up saved us hours every week. His tech knowledge and business understanding are exceptional.",
    rating: 5,
    project: "Business Automation & AI Tools",
    avatar: "/images/testimonials/mohammed.jpg"
  },
  {
    name: "Fatima R.",
    role: "Digital Creator",
    content: "From website design to marketing support, Syed delivered exactly what I needed. Great communication and fast turnaround.",
    rating: 5,
    project: "Portfolio Website + Marketing",
    avatar: "/images/testimonials/fatima.jpg"
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-background via-accent/5 to-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            What Clients Say
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Real feedback from real clients who've grown their businesses with our help.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="group flex flex-col bg-card/50 rounded-xl p-6 w-full border border-border/20 min-h-[280px] shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <div className="flex-1">
                <Quote className="w-6 h-6 text-primary mb-4 group-hover:scale-110 transition-transform duration-500" />
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6">
                  {testimonial.content}
                </p>
                <div className="mt-auto">
                  <p className="text-sm text-primary font-medium mb-3">
                    {testimonial.project}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-base font-semibold text-primary">
                        {testimonial.name.split(' ')[0][0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-base font-semibold text-foreground">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 