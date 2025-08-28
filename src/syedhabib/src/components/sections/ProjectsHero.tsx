'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { 
  ArrowRight,
  Star,
  Code2,
  Sparkles
} from 'lucide-react';

export default function ProjectsHero() {
  return (
    <section className="relative py-16 lg:py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-muted/20" />
      <div className="absolute inset-0 bg-grid-small-black/[0.02] dark:bg-grid-small-white/[0.05]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-6 text-sm px-4 py-2">
              <Code2 className="w-4 h-4 mr-2" />
              Featured Work
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                My Projects
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-10">
              A collection of web applications, e-commerce platforms, and digital experiences 
              built with modern technologies and focused on user experience.
            </p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Button asChild size="lg" className="text-base px-8 py-6 h-auto">
                <Link href="/contact" className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Let's Work Together
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="text-base px-8 py-6 h-auto">
                <Link href="#projects">
                  View All Projects
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Simple intro text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-gradient-to-r from-card/50 to-card/30 backdrop-blur-sm border rounded-2xl p-6 sm:p-8">
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center gap-2 text-primary">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-medium">Browse Projects Below</span>
                  <Star className="w-5 h-5 fill-current" />
                </div>
              </div>
              <p className="text-muted-foreground">
                Each project showcases different technologies, design approaches, and problem-solving methods. 
                Click on any project to learn more about the development process and see it in action.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}