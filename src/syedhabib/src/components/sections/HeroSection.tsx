'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useSoundManager } from '@/lib/soundManager';
import { TypingAnimation } from '@/components/ui/TypingAnimation';

export function HeroSection() {
  const { playButtonHover, playButtonClick, playMagic } = useSoundManager();

  // Simplified animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const stats = [
    { number: '8+', label: 'Live Applications' },
    { number: '3+', label: 'Years Experience' },
    { number: '5+', label: 'Tech Stacks Mastered' }
  ];

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center bg-gradient-hero py-12 md:py-20">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-grid-small-black/[0.02] dark:bg-grid-small-white/[0.02] -z-10" />
      
      {/* Simple gradient background - works on mobile too */}
      <div className="absolute top-0 right-0 w-full md:w-1/2 h-1/3 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl -z-10" />
      
      <div className="container px-4 mx-auto text-center relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="max-w-4xl mx-auto"
        >
          {/* Main Heading - Development Focus */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="block text-foreground mb-2">Full Stack Developer</span>
            <span className="block text-gradient-primary">
              <TypingAnimation 
                text="Building Modern Web Applications"
                delay={100}
              />
            </span>
          </h1>

          {/* Developer value proposition */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Specialized in Next.js, React, TypeScript, and modern web technologies. 
            From e-commerce platforms to AI-powered applications - I build scalable, performant solutions.
          </p>

          {/* Primary and Secondary CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              asChild 
              size="lg" 
              className="px-8 py-6 text-lg font-semibold h-auto w-full sm:w-auto"
              onMouseEnter={() => playButtonHover()}
            >
              <Link 
                href="/contact" 
                className="flex items-center gap-2"
                onClick={() => playButtonClick()}
              >
                Get In Touch
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline"
              size="lg" 
              className="px-8 py-6 text-lg font-semibold h-auto w-full sm:w-auto"
              onMouseEnter={() => playButtonHover()}
            >
              <Link 
                href="/projects" 
                className="flex items-center gap-2"
                onClick={() => playMagic()}
              >
                View My Projects
                <Sparkles className="w-5 h-5" />
              </Link>
            </Button>
          </div>

          {/* Social proof stats - simplified */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-lg mx-auto mb-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center"
              >
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
          
          {/* Developer badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Modern tech stack. Production ready.
          </div>
        </motion.div>
      </div>
    </section>
  );
}