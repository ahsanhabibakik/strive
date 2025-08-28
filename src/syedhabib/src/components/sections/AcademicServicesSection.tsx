'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileText, Presentation, Clock, CheckCircle, GraduationCap } from 'lucide-react';

const academicServices = [
  {
    icon: Presentation,
    title: 'Presentation Portfolio',
    description: 'Examples of presentations and templates I&apos;ve created for my university coursework.',
    features: ['Professional slide designs', 'Academic presentations', 'Visual storytelling', 'Research presentations']
  },
  {
    icon: FileText,
    title: 'Academic Work Samples',
    description: 'Showcase of my academic assignments, research work, and creative projects from university.',
    features: ['Assignment examples', 'Research projects', 'Creative solutions', 'Study methodologies']
  },
  {
    icon: Clock,
    title: 'Learning Journey',
    description: 'Documentation of my ongoing learning process and skill development in various areas.',
    features: ['Skill development', 'Learning documentation', 'Progress tracking', 'Knowledge sharing']
  }
];

const achievements = [
  {
    number: 'BBA',
    label: 'Current Studies',
    description: 'Business Administration'
  },
  {
    number: '2022',
    label: 'Started Creating',
    description: 'Digital content and projects'
  },
  {
    number: '50+',
    label: 'Projects Built',
    description: 'Web development work'
  }
];

export function AcademicServicesSection() {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
      <div className="container px-4 mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium mb-4">
            <GraduationCap size={16} />
            Academic Journey
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            My Academic & Creative Work
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            As a BBA student, I&apos;ve worked on various academic projects and presentations. 
            Here&apos;s a showcase of my academic work and the skills I&apos;ve developed along the way.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {academicServices.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background rounded-lg border p-6 hover:shadow-lg transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-4">
                <service.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-muted-foreground mb-4">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-background rounded-lg border p-8 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {achievements.map((achievement) => (
              <div key={achievement.label}>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {achievement.number}
                </div>
                <div className="font-medium mb-1">{achievement.label}</div>
                <div className="text-sm text-muted-foreground">{achievement.description}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Academic Portfolio</h3>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            These are examples of the academic work I create as part of my BBA studies. 
            Each project represents learning in business concepts and practical application.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/about/academic">View Academic Journey</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
