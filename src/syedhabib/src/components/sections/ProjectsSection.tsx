'use client';

import { useState } from 'react';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Enhanced projects data for homepage showcase
const projects = [
  {
    id: 'ecommerce-platform',
    name: 'E-commerce Platform',
    category: 'E-commerce',
    status: 'Live',
    description: 'Custom online store with seamless checkout and inventory management.',
    capabilities: ['Shopping Cart', 'Payment Gateway', 'Inventory Management'],
    technologies: ['React', 'Node.js', 'MongoDB'],
    metrics: {
      value: '43% increase',
      label: 'in conversion rate'
    },
    screenshots: {
      thumbnail: '/images/projects/ecommerce-thumb.jpg'
    },
    links: {
      demo: '/projects/ecommerce'
    },
    featured: true,
    createdAt: new Date('2024-01-15'),
    emoji: '🛒'
  },
  {
    id: 'social-dashboard',
    name: 'Social Media Dashboard',
    category: 'Analytics',
    status: 'Live',
    description: 'Analytics dashboard that simplifies social media management and reporting.',
    capabilities: ['Analytics', 'Reporting', 'Social Integration'],
    technologies: ['Next.js', 'Chart.js', 'API Integration'],
    metrics: {
      value: '15+ hours',
      label: 'saved weekly'
    },
    screenshots: {
      thumbnail: '/images/projects/dashboard-thumb.jpg'
    },
    links: {
      demo: '/projects/dashboard'
    },
    featured: false,
    createdAt: new Date('2024-02-20'),
    emoji: '📊'
  },
  {
    id: 'mobile-app',
    name: 'Mobile App UI/UX',
    category: 'Design',
    status: 'Completed',
    description: 'User-centered mobile app design focused on simplicity and engagement.',
    capabilities: ['UI/UX Design', 'User Research', 'Prototyping'],
    technologies: ['Figma', 'Mobile Design', 'UI/UX'],
    metrics: {
      value: '28% higher',
      label: 'user retention'
    },
    screenshots: {
      thumbnail: '/images/projects/mobile-app-thumb.jpg'
    },
    links: {
      demo: '/projects/mobile-app'
    },
    featured: false,
    createdAt: new Date('2024-03-10'),
    emoji: '📱'
  },
  {
    id: 'marketing-campaign',
    name: 'Digital Marketing Campaign',
    category: 'Marketing',
    status: 'Completed',
    description: 'Strategic campaign that delivered qualified leads and measurable ROI.',
    capabilities: ['Ad Management', 'Content Strategy', 'SEO'],
    technologies: ['Facebook Ads', 'Content Strategy', 'SEO'],
    metrics: {
      value: '3.2x ROAS',
      label: 'return on ad spend'
    },
    screenshots: {
      thumbnail: '/images/projects/marketing-thumb.jpg'
    },
    links: {
      demo: '/projects/marketing'
    },
    featured: true,
    createdAt: new Date('2024-04-05'),
    emoji: '📈'
  }
];

const categories = [
  { label: 'All Projects', value: 'all' },
  { label: 'Web', value: 'web' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'Design', value: 'design' },
];

export default function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredProjects = projects.filter(
    (project) => activeCategory === 'all' || project.category === activeCategory
  );

  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-background via-accent/5 to-background">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">Results-Driven Projects</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            Real solutions that delivered measurable business outcomes.
          </p>

          {/* Simplified category filter - mobile optimized */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={activeCategory === category.value ? 'default' : 'outline'}
                onClick={() => setActiveCategory(category.value)}
                className="text-sm"
                size="sm"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Project grid - no animations for better performance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
          {filteredProjects.map((project) => (
            <div key={project.id} className="w-full">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
        
        {/* Clear CTA */}
        <div className="text-center mt-10">
          <Button asChild size="lg" className="px-8">
            <Link href="/projects" className="flex items-center gap-2">
              View All Case Studies
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}