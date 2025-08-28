'use client';

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { 
  ExternalLink, 
  ArrowLeft, 
  ShoppingCart, 
  CreditCard, 
  Globe, 
  ChevronRight,
  Clock,
  BarChart,
  Package,
  Smartphone,
  Star,
  TrendingUp,
  FileText
} from 'lucide-react'
import Link from 'next/link'
import { useSoundManager } from '@/lib/soundManager'

// Project metrics and status
const projectStatus = {
  status: 'Live',
  category: 'E-commerce Platform',
  duration: '6 months',
  orders: '2,500+',
  rating: '4.9/5.0'
}

const projectMetrics = [
  { value: '2,500+', label: 'Orders Processed' },
  { value: '95%', label: 'Customer Satisfaction' },
  { value: '4.9/5.0', label: 'User Rating' },
  { value: '₹8.2L', label: 'Revenue Generated' }
]

const keyFeatures = [
  {
    title: 'Advanced E-commerce Engine',
    description: 'Full-featured shopping cart, inventory management, and order processing system',
    icon: ShoppingCart,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'Secure Payment Gateway',
    description: 'Multiple payment options with Stripe integration and secure transaction processing',
    icon: CreditCard,
    color: 'from-green-500 to-emerald-500'
  },
  {
    title: 'Bengali Localization',
    description: 'Complete Bengali language support with cultural adaptation for Bangladeshi market',
    icon: Globe,
    color: 'from-purple-500 to-pink-500'
  },
  {
    title: 'Admin Dashboard',
    description: 'Comprehensive admin panel for inventory, orders, users, and analytics management',
    icon: BarChart,
    color: 'from-orange-500 to-red-500'
  },
  {
    title: 'Mobile Responsive',
    description: 'Optimized mobile experience with Progressive Web App capabilities',
    icon: Smartphone,
    color: 'from-indigo-500 to-purple-500'
  },
  {
    title: 'Real-time Analytics',
    description: 'Sales analytics, user behavior tracking, and performance monitoring dashboard',
    icon: TrendingUp,
    color: 'from-cyan-500 to-blue-500'
  }
]

const techStack = [
  { name: 'Next.js 14', category: 'Frontend' },
  { name: 'TypeScript', category: 'Language' },
  { name: 'PostgreSQL', category: 'Database' },
  { name: 'Prisma ORM', category: 'Database' },
  { name: 'Stripe API', category: 'Payments' },
  { name: 'NextAuth.js', category: 'Authentication' },
  { name: 'Tailwind CSS', category: 'Styling' },
  { name: 'Vercel', category: 'Deployment' }
]

const developmentPhases = [
  {
    phase: 'Market Research & Planning',
    duration: '3 weeks',
    description: 'In-depth analysis of Bangladeshi e-commerce market, competitor research, and technical planning',
    deliverables: ['Market Analysis', 'User Personas', 'Technical Architecture', 'Database Schema']
  },
  {
    phase: 'Design & User Experience',
    duration: '4 weeks', 
    description: 'Cultural-sensitive UI design, Bengali typography, and mobile-first responsive layouts',
    deliverables: ['UI/UX Design', 'Design System', 'Responsive Layouts', 'User Journey Maps']
  },
  {
    phase: 'Core Development',
    duration: '10 weeks',
    description: 'Full-stack development with e-commerce functionality, payment integration, and admin systems',
    deliverables: ['Shopping Cart', 'Payment System', 'Admin Dashboard', 'User Management']
  },
  {
    phase: 'Testing & Optimization',
    duration: '4 weeks',
    description: 'Performance optimization, security testing, payment gateway testing, and user acceptance',
    deliverables: ['Performance Testing', 'Security Audit', 'Payment Testing', 'User Feedback']
  },
  {
    phase: 'Launch & Monitoring',
    duration: '3 weeks',
    description: 'Production deployment, monitoring setup, analytics integration, and post-launch support',
    deliverables: ['Production Deploy', 'Analytics Setup', 'Monitoring', 'Documentation']
  }
]

const businessResults = [
  {
    metric: '₹8.2L+ Revenue',
    description: 'Generated in first 6 months of operation',
    icon: TrendingUp,
    color: 'text-green-600'
  },
  {
    metric: '2,500+ Orders',
    description: 'Successfully processed with 99.8% success rate',
    icon: Package,
    color: 'text-blue-600'
  },
  {
    metric: '95% Satisfaction',
    description: 'Customer satisfaction rate based on reviews',
    icon: Star,
    color: 'text-yellow-600'
  },
  {
    metric: '65% Mobile Traffic',
    description: 'Mobile-first approach driving majority traffic',
    icon: Smartphone,
    color: 'text-purple-600'
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

export default function PureBitePage() {
  const { playCardHover, playButtonClick, playWhoosh } = useSoundManager()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-24 md:pb-20">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid-small-black/[0.02] dark:bg-grid-small-white/[0.02]" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />

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
                🛒 {projectStatus.status} • {projectStatus.category}
              </Badge>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              E-commerce Excellence
              <span className="block">Made in Bangladesh</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
              className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              A comprehensive e-commerce platform serving the Bangladeshi market with Bengali localization, 
              secure payments, and mobile-first design—generating ₹8.2L+ revenue in 6 months.
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
                Visit Live Store
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg font-semibold"
                onMouseEnter={() => playCardHover()}
                onClick={() => playButtonClick()}
              >
                <FileText className="w-5 h-5 mr-2" />
                View Case Study
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Business Results Section */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Measurable Business Impact
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real results that matter—driving revenue growth and customer satisfaction in the competitive e-commerce market.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {businessResults.map((result) => (
              <motion.div
                key={result.metric}
                variants={fadeInUp}
                onMouseEnter={() => playCardHover()}
              >
                <Card className="p-6 text-center hover:shadow-lg transition-all duration-300">
                  <result.icon className={`w-8 h-8 mx-auto mb-4 ${result.color}`} />
                  <div className="text-2xl font-bold mb-2">{result.metric}</div>
                  <p className="text-sm text-muted-foreground">{result.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
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
              Enterprise-Grade E-commerce Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built for scale with features that drive conversions, ensure security, and provide exceptional user experience.
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
              Modern Technology Stack
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built with industry-leading technologies for performance, scalability, and maintainability.
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
              Development Process
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A systematic approach from market research to successful launch, ensuring every detail meets user needs.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {developmentPhases.map((phase, index) => (
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
      <section className="py-16 md:py-20 bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10">
        <div className="container px-4 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Launch Your E-commerce Store?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              From concept to profitable online store—let's build your e-commerce platform 
              with the same attention to detail and results-driven approach.
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
                  Start Your E-commerce Project
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