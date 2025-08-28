"use client";

import React from 'react';
import { motion } from "framer-motion";
import { Briefcase, Code, BarChart, Leaf, Award, Globe, type LucideIcon } from 'lucide-react';

type IconType = LucideIcon;

interface StatItem {
  label: string;
  value: string;
  icon: IconType;
  description?: string;
}

interface TimelineItemProps {
  year: string;
  title: string;
  description: string;
  isLast?: boolean;
  icon?: IconType;
}

const stats: StatItem[] = [
  { 
    label: 'Years Experience', 
    value: '2+', 
    icon: Briefcase,
    description: 'In web development & software engineering'
  },
  { 
    label: 'Projects Completed', 
    value: '50+', 
    icon: Code,
    description: 'Across various industries and business sizes'
  },
  { 
    label: 'Web Applications', 
    value: '25+', 
    icon: BarChart,
    description: 'Custom web applications built'
  },
  { 
    label: 'eBrikkho Impact', 
    value: '500+', 
    icon: Leaf,
    description: 'Eco-friendly products delivered'
  },
];

const TimelineItem = ({ year, title, description, isLast = false, icon: Icon }: TimelineItemProps) => {
  return (
    <div className="flex group">
      <div className="flex flex-col items-center mr-6">
        {Icon && (
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
            {React.createElement(Icon, { className: 'h-5 w-5' })}
          </div>
        )}
        {!isLast && <div className="w-px h-full bg-border" />}
      </div>
      <div className="pb-12">
        <p className="text-sm font-medium text-muted-foreground">{year}</p>
        <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default function About() {
  return (
    <section className="py-12 md:py-20 lg:py-24 relative overflow-hidden" id="about">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background/30 pointer-events-none"></div>
      
      <div className="container max-w-7xl mx-auto px-4 relative">
        <div className="text-center max-w-4xl mx-auto mb-12 md:mb-16 lg:mb-20">
          <motion.span 
            className="inline-block bg-primary/10 text-primary text-xs md:text-sm font-medium px-3 md:px-4 py-1.5 rounded-full mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            MY JOURNEY
          </motion.span>
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Crafting Web Solutions That Work
          </motion.h2>
          <motion.p 
            className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            I build custom websites and web applications that solve real business problems and drive measurable results.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start mb-16 md:mb-20 lg:mb-28">
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="space-y-6 md:space-y-8">
              <div>
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6">Who I Am</h3>
                <div className="space-y-4 md:space-y-6 text-muted-foreground text-sm md:text-base lg:text-lg leading-relaxed">
                  <p>
                    I&apos;m <span className="font-medium text-foreground">Syed Mir Ahsan Habib</span>, a full-stack web developer with a passion for creating custom websites and web applications that solve real business problems.
                  </p>
                  <p>
                    My expertise spans modern web technologies including React, Next.js, Node.js, and database systems. I specialize in building responsive, performant websites that convert visitors into customers.
                  </p>
                  <p>
                    As the co-founder of <span className="font-medium text-foreground">eBrikkho</span>, I built the entire web platform from scratch, handling everything from e-commerce functionality to inventory management systems.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 pt-4">
                {stats.map((stat, index) => (
                  <motion.div 
                    key={index}
                    className="bg-muted/30 p-4 md:p-6 rounded-xl border border-border/50 hover:border-primary/20 transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    viewport={{ once: true }}
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3 md:mb-4">
                      {React.createElement(stat.icon, { className: 'h-4 w-4 md:h-5 md:w-5' })}
                    </div>
                    <h4 className="text-xl md:text-2xl font-bold mb-1">{stat.value}</h4>
                    <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
                    {stat.description && (
                      <p className="text-xs mt-2 text-muted-foreground/70 hidden sm:block">{stat.description}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="sticky top-24 bg-background/80 backdrop-blur-sm p-6 rounded-xl border border-border/50">
              <h3 className="text-3xl font-bold mb-8">My Journey</h3>
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-border via-border/50 to-transparent"></div>
                
                <div className="space-y-2">
                  <TimelineItem 
                    year="2021 - Present" 
                    title="Full-Stack Web Developer"
                    description="Building custom websites and web applications using modern technologies like React, Next.js, and Node.js"
                    icon={Briefcase}
                  />
                  <TimelineItem 
                    year="2020 - 2021" 
                    title="Co-founded eBrikkho"
                    description="Developed complete e-commerce platform with custom inventory management and payment systems"
                    icon={Leaf}
                  />
                  <TimelineItem 
                    year="2019 - 2020" 
                    title="Freelance Developer"
                    description="Worked with clients worldwide to build custom web applications and digital solutions"
                    icon={Code}
                  />
                  <TimelineItem 
                    year="2018 - 2019" 
                    title="Started My Journey"
                    description="Began exploring web development and digital marketing"
                    icon={Award}
                    isLast={true}
                  />
                </div>
              </div>
              
              <div className="mt-12 p-6 bg-muted/30 rounded-xl border border-border/50">
                <Globe className="h-8 w-8 text-primary mb-4" />
                <h4 className="text-lg font-semibold mb-2">Global Experience</h4>
                <p className="text-muted-foreground text-sm">
                  Worked with clients and teams from over 10 countries, delivering digital solutions that drive real business impact.
                </p>
              </div>
            </div>
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index}
                  className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
                    {React.createElement(Icon, { className: 'w-6 h-6 text-primary' })}
                  </div>
                  <p className="text-2xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              );
            })}
          </motion.div>
        </div>

        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-semibold mb-8 text-center">My Journey</h3>
          <div className="space-y-1">
            <TimelineItem 
              year="2020 - Present" 
              title="Full-Stack Web Developer"
              description="Building custom websites, web applications, and e-commerce solutions using modern technologies."
              icon={Briefcase}
            />
            <TimelineItem 
              year="2019 - Present" 
              title="Co-founder at eBrikkho"
              description="Building a sustainable plant-based brand focused on environmental impact and innovation."
              icon={Leaf}
            />
            <TimelineItem 
              year="2018 - 2019" 
              title="Freelance Web Developer"
              description="Started building websites for local businesses, focusing on responsive design and user experience."
              icon={Code}
            />
            <TimelineItem 
              year="2017 - 2018" 
              title="Web Development Intern"
              description="Learned web development fundamentals and gained experience with modern frameworks and tools."
              isLast
              icon={Award}
            />
          </div>
        </div>

        <div className="text-center max-w-4xl mx-auto mt-20">
          <p>Don&apos;t hesitate to connect with me on social media or send me an email if you&apos;d like to collaborate or just say hi!</p>
        </div>
      </div>
    </section>
  );
}
