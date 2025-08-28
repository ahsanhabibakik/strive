'use client';

import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface ProcessStep {
  title: string;
  description: string;
  icon: LucideIcon;
}

interface ServiceProcessProps {
  title?: string;
  description?: string;
  steps: ProcessStep[];
}

export function ServiceProcess({
  title = "Our Service Process",
  description = "How we deliver exceptional results for your business",
  steps
}: ServiceProcessProps) {
  return (
    <section className="py-12">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </div>
        
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-24 left-0 right-0 h-1 bg-muted hidden md:block" />
          
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="p-6 h-full flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 relative z-10 border-4 border-background">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  
                  <div className="text-xl font-bold mb-2">Step {index + 1}</div>
                  <div className="font-medium mb-2">{step.title}</div>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}