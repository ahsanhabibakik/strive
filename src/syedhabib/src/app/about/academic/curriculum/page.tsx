'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  GraduationCap, 
  ArrowLeft,
  Calendar,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Clock,
  Award,
  Target
} from 'lucide-react';

// Course data structure
const semesterCourses = [
  {
    semester: "1st Year 1st Semester",
    year: "1st Year",
    courses: [
      { code: "GBD 1101", title: "Functional English & Presentation Skill Development", credits: 3 },
      { code: "GBD 1102", title: "Introduction to Business", credits: 3 },
      { code: "GBD 1103", title: "Bangladesh Studies", credits: 3 },
      { code: "ALD 1101", title: "Business Mathematics", credits: 3 },
      { code: "ACC 1101", title: "Principles of Accounting", credits: 3 }
    ]
  },
  {
    semester: "1st Year 2nd Semester",
    year: "1st Year",
    courses: [
      { code: "HRM 1201", title: "Principles of Management", credits: 3 },
      { code: "ALD 1201", title: "Business Statistics", credits: 3 },
      { code: "ALD 1202", title: "Business Communication", credits: 3 },
      { code: "GBD 1204", title: "Psychology", credits: 3 },
      { code: "GED 1209", title: "Business Leadership", credits: 3 },
      { code: "FIN 2101", title: "Principles of Finance", credits: 3 }
    ]
  },
  {
    semester: "2nd Year 1st Semester",
    year: "2nd Year",
    courses: [
      { code: "MKT 2102", title: "Principles of Marketing", credits: 3 },
      { code: "ALD 2101", title: "Microeconomics", credits: 3 },
      { code: "ALD 2102", title: "Legal Environment of Business", credits: 3 },
      { code: "GED 2101", title: "Foreign Language", credits: 3 },
      { code: "ALD 2201", title: "Organizational Behavior", credits: 3 }
    ]
  },
  {
    semester: "2nd Year 2nd Semester",
    year: "2nd Year",
    courses: [
      { code: "ACC 2202", title: "Intermediate Accounting", credits: 3 },
      { code: "FIN 2201", title: "Financial Management", credits: 3 },
      { code: "MKT 2201", title: "Marketing Management", credits: 3 },
      { code: "ALD 2202", title: "Macro Economics", credits: 3 }
    ]
  },
  {
    semester: "3rd Year 1st Semester",
    year: "3rd Year",
    courses: [
      { code: "HRM 3101", title: "Human Resources Management", credits: 3 },
      { code: "ALD 3104", title: "Business Analytics", credits: 3 },
      { code: "ACC 3103", title: "Management Accounting", credits: 3 },
      { code: "SCOM 3104", title: "Operations Management", credits: 3 },
      { code: "EPD 3105", title: "Entrepreneurship", credits: 3 }
    ]
  },
  {
    semester: "3rd Year 2nd Semester",
    year: "3rd Year",
    courses: [
      { code: "SCOM 3201", title: "Principles of Supply Chain Management", credits: 3 },
      { code: "ALD 3202", title: "Business Research Methodology", credits: 3 },
      { code: "ALD 3203", title: "International Business Environment", credits: 3 },
      { code: "MIS 3202", title: "Management Information System", credits: 3 },
      { code: "SCOM 3205", title: "Project Management", credits: 3 }
    ]
  },
  {
    semester: "4th Year 1st Semester",
    year: "4th Year",
    courses: [
      { code: "MAJOR", title: "4 × Major Courses", credits: 12 },
      { code: "MINOR", title: "1 × Minor Course", credits: 3 },
      { code: "MAJOR", title: "2 × Additional Major Courses", credits: 6 },
      { code: "MINOR", title: "2 × Additional Minor Courses", credits: 6 }
    ]
  },
  {
    semester: "4th Year 2nd Semester",
    year: "4th Year",
    courses: [
      { code: "MGT 4802", title: "Strategic Management", credits: 3 },
      { code: "ORL 4803", title: "Viva", credits: 3 },
      { code: "INT 4801", title: "Internship", credits: 3 }
    ]
  }
];

const programStats = [
  { label: 'Total Credits', value: '120+', icon: Target },
  { label: 'Core Courses', value: '45+', icon: BookOpen },
  { label: 'Duration', value: '4 Years', icon: Clock },
  { label: 'Semesters', value: '8', icon: Calendar }
];

export default function CurriculumPage() {
  const [expandedSemesters, setExpandedSemesters] = useState<Set<number>>(new Set([0]));

  const toggleSemester = (index: number) => {
    const newExpanded = new Set(expandedSemesters);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSemesters(newExpanded);
  };

  const totalCredits = semesterCourses.reduce((total, semester) => 
    total + semester.courses.reduce((semTotal, course) => semTotal + course.credits, 0), 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <Link href="/about/academic" className="inline-flex items-center text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-200 mb-6 transition-colors">
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
              <Calendar className="w-16 h-16 mx-auto text-emerald-600 dark:text-emerald-400 mb-4" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              BBA Curriculum
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Complete 8-semester course breakdown for Bachelor of Business Administration program
            </p>
          </div>
        </motion.div>

        {/* Program Overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-700">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <GraduationCap className="w-12 h-12 mx-auto text-emerald-600 dark:text-emerald-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Bachelor of Business Administration
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Bangladesh University of Professionals • Faculty of Business Studies
                </p>
              </div>
              
              {/* Program Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {programStats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                    className="text-center"
                  >
                    <stat.icon className="w-8 h-8 mx-auto mb-2 text-emerald-600 dark:text-emerald-400" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Semester Breakdown */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Course Breakdown by Semester
          </h2>
          
          <div className="space-y-6">
            {semesterCourses.map((semesterData, index) => {
              const isExpanded = expandedSemesters.has(index);
              const totalCredits = semesterData.courses.reduce((sum, course) => sum + course.credits, 0);
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 + index * 0.1 }}
                >
                  <Card className="overflow-hidden border-l-4 border-l-emerald-500 hover:shadow-lg transition-shadow">
                    <CardHeader 
                      className="cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                      onClick={() => toggleSemester(index)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-xl text-emerald-600 dark:text-emerald-400">
                            {semesterData.semester}
                          </CardTitle>
                          <CardDescription className="text-gray-600 dark:text-gray-400">
                            {semesterData.courses.length} courses • {totalCredits} credits total
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="outline" className="border-emerald-200 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300">
                            {semesterData.year}
                          </Badge>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    {isExpanded && (
                      <CardContent className="pt-0">
                        <div className="grid gap-3">
                          {semesterData.courses.map((course, courseIndex) => (
                            <motion.div 
                              key={courseIndex}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: courseIndex * 0.05 }}
                              className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                            >
                              <div className="flex-1">
                                <div className="font-medium text-gray-900 dark:text-white mb-1">
                                  {course.title}
                                </div>
                                <div className="text-sm text-emerald-600 dark:text-emerald-400 font-mono">
                                  {course.code}
                                </div>
                              </div>
                              <Badge variant="secondary" className="ml-4 bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                                {course.credits} credits
                              </Badge>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Summary */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          className="mt-16 text-center"
        >
          <Card className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
            <CardContent className="p-8">
              <Award className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Program Summary</h3>
              <p className="text-emerald-100 mb-4">
                Complete 4-year undergraduate business program with comprehensive curriculum
              </p>
              <div className="text-3xl font-bold mb-2">{totalCredits} Total Credits</div>
              <div className="text-emerald-100">
                Across 8 semesters with core business subjects and specializations
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  );
}
