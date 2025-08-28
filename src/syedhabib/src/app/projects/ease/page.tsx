'use client';

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { 
  ExternalLink, 
  ArrowLeft, 
  Heart, 
  Brain, 
  Globe, 
  Shield, 
  Users,
  ChevronRight,
  Clock,
  BarChart
} from 'lucide-react'
import Link from 'next/link'
import { useSoundManager } from '@/lib/soundManager'

// Project metrics and status
const projectStatus = {
  status: 'Live',
  category: 'Mental Health Platform',
  duration: '4 months',
  users: '1,200+',
  rating: '4.8/5.0'
}

const projectMetrics = [
  { value: '85%', label: 'User Engagement Rate' },
  { value: '1,200+', label: 'Active Users' },
  { value: '4.8/5.0', label: 'User Rating' },
  { value: '40%', label: 'Anxiety Reduction' }
]

const keyFeatures = [
  {
    title: 'Multilingual Support',
    description: 'Native Bengali and English support with cultural sensitivity in mental health approaches',
    icon: Globe,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'Real-time Mood Tracking',
    description: 'Interactive mood analytics with visual charts and progress tracking over time',
    icon: BarChart,
    color: 'from-purple-500 to-pink-500'
  },
  {
    title: 'Secure Authentication',
    description: 'NextAuth.js integration with encrypted data storage and privacy protection',
    icon: Shield,
    color: 'from-green-500 to-emerald-500'
  },
  {
    title: 'Guided Meditation',
    description: 'Audio-guided breathing exercises and meditation sessions for anxiety relief',
    icon: Heart,
    color: 'from-red-500 to-pink-500'
  },
  {
    title: 'Progress Analytics',
    description: 'Comprehensive dashboard showing mental health journey and improvement metrics',
    icon: Brain,
    color: 'from-indigo-500 to-purple-500'
  },
  {
    title: 'Community Support',
    description: 'Safe space for users to connect and share experiences with moderated discussions',
    icon: Users,
    color: 'from-orange-500 to-red-500'
  }
]

const techStack = [
  { name: 'Next.js 14', category: 'Frontend' },
  { name: 'TypeScript', category: 'Language' },
  { name: 'MongoDB', category: 'Database' },
  { name: 'NextAuth.js', category: 'Authentication' },
  { name: 'Chart.js', category: 'Analytics' },
  { name: 'Tailwind CSS', category: 'Styling' },
  { name: 'Framer Motion', category: 'Animation' },
  { name: 'React Hook Form', category: 'Forms' }
]

const developmentProcess = [
  {
    phase: 'Research & Planning',
    duration: '2 weeks',
    description: 'Mental health app research, user persona development, and technical architecture planning',
    deliverables: ['User Research', 'Technical Architecture', 'Design System']
  },
  {
    phase: 'Design & Prototyping',
    duration: '3 weeks', 
    description: 'UI/UX design with focus on calming colors, accessibility, and cultural sensitivity',
    deliverables: ['Wireframes', 'Design System', 'Interactive Prototype']
  },
  {
    phase: 'Development',
    duration: '8 weeks',
    description: 'Full-stack development with real-time features, secure authentication, and multilingual support',
    deliverables: ['Core App', 'Authentication', 'Analytics Dashboard']
  },
  {
    phase: 'Testing & Launch',
    duration: '3 weeks',
    description: 'User testing, performance optimization, and deployment with monitoring setup',
    deliverables: ['Quality Assurance', 'Performance Optimization', 'Production Deployment']
  }
]

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const cardHover = {
  hover: { 
    y: -5, 
    transition: { type: "spring" as const, stiffness: 300, damping: 20 } 
  }
}

export default function EasePage() {
  const { playCardHover, playButtonClick, playWhoosh } = useSoundManager()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-24 md:pb-20">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid-small-black/[0.02] dark:bg-grid-small-white/[0.02]" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-green-500/10 to-cyan-500/10 rounded-full blur-3xl" />

        <div className="container px-4 mx-auto relative">
          {/* Navigation */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Button 
              variant="ghost" 
              asChild
              onMouseEnter={() => playCardHover()}
            >
              <Link 
                href="/projects" 
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
                onClick={() => playButtonClick()}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Projects
              </Link>
            </Button>
          </motion.div>

          <div className="max-w-4xl mx-auto text-center">
            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <Badge 
                variant="secondary" 
                className="px-4 py-2 text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
              >
                ✨ {projectStatus.status} • {projectStatus.category}
              </Badge>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent"
            >
              Mental Wellness
              <span className="block">Redefined</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
              className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              A comprehensive mental health platform combining mood tracking, guided meditation, 
              and community support—built with cultural sensitivity and multilingual accessibility.
            </motion.p>

            {/* Metrics */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
            >
              {projectMetrics.map((metric) => (
                <motion.div
                  key={metric.label}
                  variants={fadeInUp}
                  className="text-center"
                  onMouseEnter={() => playCardHover()}
                >
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                    {metric.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {metric.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button 
                size="lg"
                className="px-8 py-6 text-lg font-semibold"
                onMouseEnter={() => playCardHover()}
                onClick={() => playWhoosh()}
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                View Live Application
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg font-semibold"
                onMouseEnter={() => playCardHover()}
                onClick={() => playButtonClick()}
              >
                <BarChart className="w-5 h-5 mr-2" />
                View Case Study
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 md:py-20">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comprehensive Mental Health Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every feature designed with user privacy, cultural sensitivity, and evidence-based mental health practices in mind.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {keyFeatures.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                whileHover="hover"
                onMouseEnter={() => playCardHover()}
              >
                <Card className="h-full p-6 hover:shadow-xl transition-all duration-300 border-border/20 hover:border-primary/30">
                  <motion.div variants={cardHover}>
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-4`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built with Modern Technologies
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Leveraging cutting-edge tools and frameworks for optimal performance, security, and user experience.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {techStack.map((tech) => (
              <motion.div
                key={tech.name}
                variants={fadeInUp}
                onMouseEnter={() => playCardHover()}
              >
                <Card className="p-4 text-center hover:shadow-lg transition-all duration-300">
                  <div className="font-semibold text-sm mb-1">{tech.name}</div>
                  <div className="text-xs text-muted-foreground">{tech.category}</div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Development Process */}
      <section className="py-16 md:py-20">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Development Journey
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A structured approach from research to deployment, focusing on user-centered design and technical excellence.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {developmentProcess.map((phase, index) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="mb-8 last:mb-0"
                onMouseEnter={() => playCardHover()}
              >
                <Card className="p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{phase.phase}</h3>
                        <Badge variant="outline" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {phase.duration}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-3 leading-relaxed">
                        {phase.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {phase.deliverables.map((deliverable) => (
                          <Badge key={deliverable} variant="secondary" className="text-xs">
                            {deliverable}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10">
        <div className="container px-4 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Build Your Next Project?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Let's create something amazing together. From concept to deployment, 
              I'll help bring your vision to life with modern technologies and best practices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                size="lg"
                className="px-8 py-6 text-lg font-semibold"
                onMouseEnter={() => playCardHover()}
              >
                <Link 
                  href="/contact"
                  onClick={() => playWhoosh()}
                >
                  Start Your Project
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg font-semibold"
                onMouseEnter={() => playCardHover()}
              >
                <Link 
                  href="/projects"
                  onClick={() => playButtonClick()}
                >
                  View More Projects
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}