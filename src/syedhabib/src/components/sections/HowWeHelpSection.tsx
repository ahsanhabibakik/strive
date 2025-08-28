"use client";

import { Users, MessageCircle, Hammer, LifeBuoy } from "lucide-react";

const steps = [
  {
    icon: <Users className="w-8 h-8 text-primary" />,
    title: "Connect",
    description: "Reach out via chat, form, or call. We listen to your needs."
  },
  {
    icon: <MessageCircle className="w-8 h-8 text-primary" />,
    title: "Discuss",
    description: "Share your vision, goals, and requirements. Get expert advice."
  },
  {
    icon: <Hammer className="w-8 h-8 text-primary" />,
    title: "Build & Deliver",
    description: "We design, build, and launch your solution—fast and reliable."
  },
  {
    icon: <LifeBuoy className="w-8 h-8 text-primary" />,
    title: "Support",
    description: "Ongoing help, updates, and advice whenever you need it."
  },
];

export default function HowWeHelpSection() {
  return (
    <section className="py-8 sm:py-12 md:py-20 bg-gradient-to-br from-background via-accent/10 to-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            How We Help You Succeed
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base sm:text-lg md:text-xl">
            Simple, supportive, and effective—every step of the way.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
          {steps.map((step) => (
            <div
              key={step.title}
              className="group flex flex-col items-center text-center bg-card/70 rounded-2xl p-6 sm:p-8 w-md border border-border/20 min-h-[200px] sm:min-h-[220px] hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">{step.icon}</div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4 text-foreground group-hover:text-primary transition-colors">
                {step.title}
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 