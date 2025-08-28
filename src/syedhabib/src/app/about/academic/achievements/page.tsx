'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  GraduationCap, 
  Award, 
  ArrowLeft,
  Star,
  TrendingUp,
  Target,
  BookOpen,
  Users,
  Medal,
  Trophy,
  Zap
} from 'lucide-react';

const achievements = [
  {
    icon: GraduationCap,
    title: 'Current BBA Student',
    description: 'Bangladesh University of Professionals',
    details: 'Faculty of Business Studies - 4th Year Student',
    category: 'Education',
    date: '2022 - Present',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    icon: Award,
    title: 'Academic Excellence',
    description: 'Consistent high performance in business courses',
    details: 'Maintaining strong CGPA with focus on practical application',
    category: 'Academic',
    date: '2022 - 2024',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    icon: Target,
    title: 'Project Leadership',
    description: 'Led multiple group projects and presentations',
    details: 'Successfully managed team projects in Marketing, Finance, and Operations',
    category: 'Leadership',
    date: '2023 - 2024',
    color: 'from-orange-500 to-red-600'
  },
  {
    icon: BookOpen,
    title: 'Research Contributions',
    description: 'Conducted business research and case studies',
    details: 'Published analysis on consumer behavior and digital transformation',
    category: 'Research',
    date: '2023 - 2024',
    color: 'from-purple-500 to-pink-600'
  }
];

const skills = [
  { name: 'Business Analysis', level: 90, icon: TrendingUp },
  { name: 'Presentation Skills', level: 95, icon: Star },
  { name: 'Research & Writing', level: 85, icon: BookOpen },
  { name: 'Team Leadership', level: 80, icon: Users },
  { name: 'Strategic Thinking', level: 85, icon: Target },
  { name: 'Digital Marketing', level: 90, icon: Zap }
];

const milestones = [
  {
    year: '2022',
    title: 'Started BBA Program',
    description: 'Enrolled in Bachelor of Business Administration at Bangladesh University of Professionals',
    icon: GraduationCap
  },
  {
    year: '2023',
    title: 'First Major Project',
    description: 'Led marketing strategy analysis for a major technology company case study',
    icon: Trophy
  },
  {
    year: '2023',
    title: 'Research Publication',
    description: 'Published research on consumer behavior in digital age for academic portfolio',
    icon: BookOpen
  },
  {
    year: '2024',
    title: 'Leadership Recognition',
    description: 'Recognized for outstanding leadership in group projects and presentations',
    icon: Medal
  },
  {
    year: '2024',
    title: 'Digital Portfolio',
    description: 'Created comprehensive digital portfolio showcasing academic and professional work',
    icon: Star
  }
];

const stats = [
  { label: 'Projects Completed', value: '15+', icon: Target },
  { label: 'Presentations Given', value: '25+', icon: Star },
  { label: 'Research Papers', value: '8', icon: BookOpen },
  { label: 'Team Collaborations', value: '20+', icon: Users }
];

export default function AchievementsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-orange-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <Link href="/about/academic" className="inline-flex items-center text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-200 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Academic Hub
          </Link>
          
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <Trophy className="w-16 h-16 mx-auto text-orange-600 dark:text-orange-400 mb-4" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Academic Achievements
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Academic milestones, skills development, and learning journey highlights
            </p>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              >
                <Card className="text-center bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-700">
                  <CardContent className="p-6">
                    <stat.icon className="w-8 h-8 mx-auto mb-3 text-orange-600 dark:text-orange-400" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Main Achievements */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Key Achievements
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.0 + index * 0.2 }}
              >
                <Card className="h-full border-0 shadow-lg overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${achievement.color}`} />
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <achievement.icon className="w-12 h-12 text-gray-700 dark:text-gray-300" />
                      <div className="text-right">
                        <Badge variant="outline" className="mb-2">
                          {achievement.category}
                        </Badge>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {achievement.date}
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-xl text-gray-900 dark:text-white">
                      {achievement.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      {achievement.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300">
                      {achievement.details}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Skills Progress */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Skills Development
          </h2>
          
          <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-700">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {skills.map((skill, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 1.6 + index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <skill.icon className="w-6 h-6 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">{skill.name}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, delay: 1.8 + index * 0.1 }}
                          className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Timeline */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.0 }}
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Academic Journey Timeline
          </h2>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500 to-red-500" />
            
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 2.2 + index * 0.2 }}
                  className="relative flex items-start gap-6"
                >
                  {/* Timeline dot */}
                  <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-white dark:bg-gray-800 border-4 border-orange-500 rounded-full shadow-lg">
                    <milestone.icon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  
                  {/* Content */}
                  <Card className="flex-1 border-orange-200 dark:border-orange-700">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-2">
                        <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900 dark:text-orange-300 dark:border-orange-700">
                          {milestone.year}
                        </Badge>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {milestone.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">
                        {milestone.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
