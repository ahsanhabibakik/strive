'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

interface ServiceFAQProps {
  title?: string;
  description?: string;
  faqs: FAQ[];
}

export function ServiceFAQ({
  title = "Frequently Asked Questions",
  description = "Answers to common questions about our services",
  faqs
}: ServiceFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  return (
    <section className="py-12">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <Card 
              key={index} 
              className={`overflow-hidden transition-all ${
                openIndex === index ? 'shadow-md' : ''
              }`}
            >
              <button
                className="w-full p-6 flex justify-between items-center text-left"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="font-medium">{faq.question}</h3>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                )}
              </button>
              
              <div 
                className={`px-6 overflow-hidden transition-all ${
                  openIndex === index ? 'pb-6 max-h-96' : 'max-h-0'
                }`}
              >
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}