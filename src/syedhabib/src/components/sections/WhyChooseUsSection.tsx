"use client";

import { Smile, DollarSign, Zap, Sparkles } from "lucide-react";

const reasons = [
  {
    icon: <Smile className="w-8 h-8 text-primary" />,
    title: "Personalized",
    description: "Every project is tailored to your unique needs and goals."
  },
  {
    icon: <DollarSign className="w-8 h-8 text-primary" />,
    title: "Affordable",
    description: "Transparent pricing and solutions for every budget."
  },
  {
    icon: <Zap className="w-8 h-8 text-primary" />,
    title: "Fast Turnaround",
    description: "Quick delivery without sacrificing quality or support."
  },
  {
    icon: <Sparkles className="w-8 h-8 text-primary" />,
    title: "AI-Powered",
    description: "Leverage the latest AI tools for smarter, more efficient results."
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="py-8 sm:py-12 md:py-20 bg-gradient-to-br from-background via-accent/5 to-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            Why Choose Us?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base sm:text-lg md:text-xl">
            We're committed to your growth, every step of the way.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6:gap-8 d:gap-10 max-w-6xl mx-auto">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="group flex flex-col items-center text-center bg-card/70 rounded-2xl p-6 sm:p-8 w-md border border-border/20 min-h-[180px] sm:min-h-[200px] hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">{reason.icon}</div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4 text-foreground group-hover:text-primary transition-colors">
                {reason.title}
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 