'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GraduationCap, Briefcase, Award, Linkedin, ExternalLink } from 'lucide-react';
import siteConfig from '@/content/siteConfig';

const companies = [
  {
    name: 'Rupomoti',
    logo: '/logos/rupomoti.png',
    color: '#FF6B6B',
    description: 'Premium Jewelry & Fashion Business',
    link: 'https://rupomoti.com'
  },
  {
    name: 'Qalbbox',
    logo: '/logos/qalbbox.png',
    color: '#4ECDC4',
    description: 'Gifting Platform',
    link: 'https://qalbbox.com'
  },
  {
    name: 'Ebrikkho',
    logo: '/logos/ebrikkho.png',
    color: '#45B7AF',
    description: 'Plant Selling Platform',
    link: 'https://ebrikkho.com'
  }
];

const certifications = [
  {
    name: 'React Development Certification',
    issuer: 'Meta',
    date: '2024',
    link: '#'
  },
  {
    name: 'Full-Stack Web Development',
    issuer: 'FreeCodeCamp',
    date: '2023',
    link: '#'
  },
  {
    name: 'Next.js & TypeScript',
    issuer: 'Vercel',
    date: '2024',
    link: '#'
  },
  {
    name: 'MongoDB Database Design',
    issuer: 'MongoDB University',
    date: '2023',
    link: '#'
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container px-4 md:px-6">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1"
          >
            <h1 className="text-4xl font-bold tracking-tighter mb-4">
              Syed Mir Ahsan Habib (Akik)
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Full-Stack Web Developer & BBA Student
            </p>
            <p className="text-base text-muted-foreground mb-8 leading-relaxed">
              I specialize in building modern web applications using React, Next.js, and Node.js. 
              Currently pursuing my BBA at Bangladesh University of Professionals while developing 
              web solutions that combine technical expertise with business understanding.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-8">
              <Link href="/contact">
                <Button className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Work With Me
                </Button>
              </Link>
              <Link href={siteConfig.links.linkedin} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4" />
                  Connect on LinkedIn
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 relative"
          >
            <div className="relative aspect-square rounded-full overflow-hidden border-4 border-primary/20 max-w-sm mx-auto">
              <Image
                src="/boy.png"
                alt="Syed Mir Ahsan Habib Akik"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>

        {/* Focus Areas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">Frontend</div>
            <div className="text-sm text-muted-foreground">React & Next.js</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">Backend</div>
            <div className="text-sm text-muted-foreground">Node.js & APIs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">Database</div>
            <div className="text-sm text-muted-foreground">MongoDB & SQL</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">UI/UX</div>
            <div className="text-sm text-muted-foreground">Design Systems</div>
          </div>
        </motion.div>

        {/* What I Do */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">What I Build</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 rounded-lg">
              <Briefcase className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Web Applications</h3>
              <p className="text-muted-foreground mb-4">
                I build modern, responsive web applications using cutting-edge technologies 
                and best practices for optimal performance and user experience.
              </p>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• React & Next.js Applications</li>
                <li>• RESTful APIs & Backend Services</li>
                <li>• Database Design & Integration</li>
                <li>• E-commerce Platforms</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-6 rounded-lg">
              <GraduationCap className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Academic Work</h3>
              <p className="text-muted-foreground mb-4">
                Through my BBA studies, I create presentations, research projects, and academic 
                content that demonstrate business concepts.
              </p>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Business Presentations</li>
                <li>• Research & Analysis Projects</li>
                <li>• Academic Content Creation</li>
                <li>• Case Study Development</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* University Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-semibold mb-6">My Academic Journey</h2>
          <div className="bg-background border rounded-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-16 h-16">
                <Image
                  src="/logos/bup.png"
                  alt="Bangladesh University of Professionals"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Bangladesh University of Professionals</h3>
                <p className="text-muted-foreground">BBA in General | Faculty of Business Studies</p>
                <p className="text-sm text-muted-foreground">Currently pursuing degree</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-4">
              Learning business fundamentals through practical application and real-world projects. 
              My studies provide the theoretical foundation while my projects offer hands-on experience.
            </p>
            <Link href="/about/academic">
              <Button variant="outline">
                View My Academic Portfolio & Coursework
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Companies/Brands Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-semibold mb-8">Brands I&apos;ve Built & Grown</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {companies.map((company, index) => (
              <motion.a
                key={company.name}
                href={company.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="group relative overflow-hidden rounded-lg border bg-background p-6 hover:shadow-lg transition-all"
                style={{ 
                  '--company-color': company.color 
                } as React.CSSProperties}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--company-color)] to-transparent opacity-0 group-hover:opacity-10 transition-opacity" />
                <div className="relative h-12 w-12 mb-4">
                  <Image
                    src={company.logo}
                    alt={company.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="font-semibold mb-2">{company.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{company.description}</p>
                <p className="text-xs text-primary font-medium">View Brand →</p>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Certifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-semibold mb-8">Professional Development</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="flex items-start gap-4 p-4 rounded-lg border bg-background hover:shadow-md transition-all"
              >
                <Award className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">{cert.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {cert.issuer} • {cert.date}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-center bg-gradient-to-r from-primary/10 to-primary/5 p-8 rounded-lg"
        >
          <h2 className="text-2xl font-bold mb-4">Let&apos;s Work Together</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Looking for a web developer who understands both technology and business? 
            Let&apos;s discuss your project requirements and build something amazing together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg">Start a Project</Button>
            </Link>
            <Link href="/services">
              <Button variant="outline" size="lg">View All Services</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 