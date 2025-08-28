'use client';

import { Search, Lightbulb, Code, Rocket } from 'lucide-react';

export function ProcessTimeline() {
  const steps = [
    {
      number: 1,
      title: "Discovery",
      description: "We start by understanding your business goals, target audience, and current challenges.",
      icon: Search
    },
    {
      number: 2,
      title: "Strategy",
      description: "Based on our findings, we create a custom digital strategy tailored to your specific needs.",
      icon: Lightbulb
    },
    {
      number: 3,
      title: "Design & Development",
      description: "Our team creates a beautiful, functional solution that aligns with your brand and goals.",
      icon: Code
    },
    {
      number: 4,
      title: "Launch & Optimize",
      description: "We launch your project and continuously optimize for the best results.",
      icon: Rocket
    }
  ];

  return (
    <section className="py-16 bg-muted/20">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Proven Process</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A simple, effective approach that delivers results every time.
          </p>
        </div>
        
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-12 left-0 right-0 h-1 bg-muted hidden md:block" />
          
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4 relative z-10 border-4 border-background">
                    <step.icon className="w-10 h-10 text-primary" />
                  </div>
                  
                  <div className="text-2xl font-bold mb-2">{step.number}. {step.title}</div>
                  <p className="text-center text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}