'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  GraduationCap, 
  FileText, 
  BookOpen, 
  Award, 
  ArrowLeft,
  Calendar,
  TrendingUp,
  Users,
  ArrowRight,
  Target
} from 'lucide-react';

const academicSections = [
  {
    title: 'BBA Curriculum',
    description: 'Complete 8-semester course breakdown with detailed curriculum information',
    icon: Calendar,
    href: '/about/academic/curriculum',
    color: 'from-emerald-500 to-teal-600',
    features: ['8 Semesters', '120+ Credits', 'Core Subjects', 'Specializations']
  },
  {
    title: 'Academic Portfolio',
    description: 'Showcase of academic projects, presentations, and research work',
    icon: FileText,
    href: '/about/academic/portfolio',
    color: 'from-purple-500 to-indigo-600',
    features: ['Projects', 'Presentations', 'Research', 'Assignments']
  },
  {
    title: 'Achievements',
    description: 'Academic milestones, certificates, and learning journey highlights',
    icon: Award,
    href: '/about/academic/achievements',
    color: 'from-orange-500 to-red-600',
    features: ['Certifications', 'Awards', 'Skills', 'Progress']
  }
];

const stats = [
  { label: 'Current Year', value: '4th', icon: GraduationCap },
  { label: 'Completed Projects', value: '15+', icon: Target },
  { label: 'CGPA Progress', value: 'Rising', icon: TrendingUp },
  { label: 'Study Groups', value: '3', icon: Users }
];

export default function AcademicHubPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <Link href="/about" className="inline-flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to About
          </Link>
          
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <GraduationCap className="w-20 h-20 mx-auto text-gray-700 dark:text-gray-300 mb-4" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Academic Journey
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Exploring my Bachelor of Business Administration program at Bangladesh University of Professionals
            </p>
          </div>
        </motion.div>

        {/* University Info Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <Card className="bg-gradient-to-r from-slate-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Bachelor of Business Administration
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Bangladesh University of Professionals • Faculty of Business Studies
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                    className="text-center"
                  >
                    <stat.icon className="w-8 h-8 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Academic Sections */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Explore My Academic Journey
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {academicSections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 + index * 0.2 }}
                className="group"
              >
                <Link href={section.href}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 cursor-pointer border-0 overflow-hidden">
                    <div className={`h-2 bg-gradient-to-r ${section.color}`} />
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <section.icon className="w-12 h-12 text-gray-700 dark:text-gray-300" />
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors" />
                      </div>
                      <CardTitle className="text-xl text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-100 transition-colors">
                        {section.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        {section.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2">
                        {section.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <div className="w-2 h-2 bg-gray-400 rounded-full mr-2" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Quick Links */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="mt-16 text-center"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Quick Navigation
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/projects">
                <BookOpen className="w-4 h-4 mr-2" />
                Professional Projects
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/services">
                <Target className="w-4 h-4 mr-2" />
                Services
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">
                <Users className="w-4 h-4 mr-2" />
                Get in Touch
              </Link>
            </Button>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

