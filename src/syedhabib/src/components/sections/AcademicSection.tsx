'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AcademicWorkCard } from '@/components/ui/AcademicWorkCard';
import { academicWorks } from '@/data/academic-works';
import { 
  GraduationCap, 
  TrendingUp, 
  BookOpen, 
  Users, 
  Award,
  Target,
  Lightbulb
} from 'lucide-react';

export function AcademicSection() {
  // Get featured works and stats
  const featuredWorks = academicWorks.filter(work => work.featured).slice(0, 2);
  const totalWorks = academicWorks.length;
  const subjects = [...new Set(academicWorks.map(work => work.subject))].length;
  const groupProjects = academicWorks.filter(work => work.workType === 'group').length;
  const averageGrade = 'A'; // You can calculate this dynamically

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const stats = [
    { label: 'Academic Projects', value: totalWorks, icon: BookOpen },
    { label: 'Subjects Covered', value: subjects, icon: Target },
    { label: 'Group Projects', value: groupProjects, icon: Users },
    { label: 'Average Grade', value: averageGrade, icon: Award },
  ];

  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-background via-accent/5 to-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse hidden md:block" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-accent/20 rounded-full blur-2xl animate-pulse hidden md:block" />
        <div className="absolute bottom-20 left-1/3 w-16 h-16 bg-primary/5 rounded-full blur-lg animate-pulse hidden md:block" />
      </div>

      <div className="container px-4 md:px-6 max-w-6xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <GraduationCap className="w-4 h-4" />
            Academic Excellence
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            Academic Portfolio
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            Showcasing my academic journey through research papers, presentations, and projects. 
            Each work demonstrates analytical thinking, research skills, and practical application of theoretical knowledge.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-12">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-3 mx-auto">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Featured Academic Works */}
        {featuredWorks.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-2">Featured Academic Work</h3>
                <p className="text-muted-foreground">
                  Highlighting exceptional projects and research contributions
                </p>
              </div>
              <Button variant="outline" asChild className="hidden sm:flex">
                <Link href="/academic">
                  <BookOpen className="w-4 h-4 mr-2" />
                  View All Work
                </Link>
              </Button>
            </div>

            <div className="grid gap-8 md:gap-12">
              {featuredWorks.map((work) => (
                <motion.div key={work.id} variants={itemVariants}>
                  <AcademicWorkCard work={work} variant="featured" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Academic Focus Areas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center">Academic Focus Areas</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Research & Analysis */}
            <div className="text-center p-6 rounded-xl bg-card/50 border border-border/20">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Research & Analysis</h4>
              <p className="text-sm text-muted-foreground mb-4">
                In-depth market research, case studies, and analytical papers
              </p>
              <div className="flex flex-wrap gap-1 justify-center">
                <Badge variant="outline" className="text-xs">Market Research</Badge>
                <Badge variant="outline" className="text-xs">Case Studies</Badge>
                <Badge variant="outline" className="text-xs">Data Analysis</Badge>
              </div>
            </div>

            {/* Design & Innovation */}
            <div className="text-center p-6 rounded-xl bg-card/50 border border-border/20">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Design & Innovation</h4>
              <p className="text-sm text-muted-foreground mb-4">
                UI/UX design projects and innovative solution development
              </p>
              <div className="flex flex-wrap gap-1 justify-center">
                <Badge variant="outline" className="text-xs">UI/UX Design</Badge>
                <Badge variant="outline" className="text-xs">Prototyping</Badge>
                <Badge variant="outline" className="text-xs">Innovation</Badge>
              </div>
            </div>

            {/* Business Strategy */}
            <div className="text-center p-6 rounded-xl bg-card/50 border border-border/20">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Business Strategy</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Business planning, financial modeling, and strategic analysis
              </p>
              <div className="flex flex-wrap gap-1 justify-center">
                <Badge variant="outline" className="text-xs">Business Planning</Badge>
                <Badge variant="outline" className="text-xs">Financial Modeling</Badge>
                <Badge variant="outline" className="text-xs">Strategy</Badge>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Explore My Academic Journey
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Dive deeper into my academic projects, research papers, and presentations. 
              See how theoretical knowledge translates into practical solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/academic">
                  <BookOpen className="w-5 h-5 mr-2" />
                  View All Academic Work
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about/academic">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Academic Background
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
