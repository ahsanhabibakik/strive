'use client';

export function BasicProcessTimeline() {
  const steps = [
    {
      number: 1,
      title: "Discovery",
      description: "We start by understanding your business goals, target audience, and current challenges."
    },
    {
      number: 2,
      title: "Strategy",
      description: "Based on our findings, we create a custom digital strategy tailored to your specific needs."
    },
    {
      number: 3,
      title: "Design & Development",
      description: "Our team creates a beautiful, functional solution that aligns with your brand and goals."
    },
    {
      number: 4,
      title: "Launch & Optimize",
      description: "We launch your project and continuously optimize for the best results."
    }
  ];

  return (
    <section className="py-10 sm:py-16 bg-muted/20">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Our Proven Process</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            A simple, effective approach that delivers results every time.
          </p>
        </div>
        
        <div className="relative">
          {/* Connecting line for desktop */}
          <div className="absolute top-12 left-0 right-0 h-1 bg-muted hidden md:block" />
          
          {/* Vertical connecting line for mobile */}
          <div className="absolute top-0 bottom-0 left-[21px] w-1 bg-muted md:hidden" />
          
          <div className="grid md:grid-cols-4 gap-6 md:gap-8">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                {/* Mobile layout with horizontal alignment */}
                <div className="flex md:hidden items-start mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 relative z-10 border-4 border-background flex-shrink-0">
                    <span className="text-sm font-bold text-primary">{step.number}</span>
                  </div>
                  <div>
                    <div className="text-lg font-bold mb-1">{step.title}</div>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                
                {/* Desktop layout with vertical alignment */}
                <div className="hidden md:flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4 relative z-10 border-4 border-background">
                    <span className="text-2xl font-bold text-primary">{step.number}</span>
                  </div>
                  
                  <div className="text-xl font-bold mb-2 text-center">{step.number}. {step.title}</div>
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