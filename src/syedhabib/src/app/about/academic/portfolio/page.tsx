'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Presentation, 
  BookOpen, 
  Award, 
  ArrowLeft,
  Search,
  Filter,
  Grid,
  List,
  ExternalLink,
  Star,
  Folder
} from 'lucide-react';
import { academicWorks, type AcademicWork } from '@/data/academic-works';

// Icon mapping for academic work types
const typeIcons = {
  presentation: Presentation,
  report: FileText,
  assignment: BookOpen,
  research: BookOpen,
  project: Award,
  design: Award,
  'term-paper': FileText,
  'case-study': BookOpen
} as const;

export default function PortfolioPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedSemester, setSelectedSemester] = useState('All Semesters');
  const [selectedType, setSelectedType] = useState('All Types');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter options
  const subjects = ['All Subjects', ...Array.from(new Set(academicWorks.map(work => work.subject)))];
  const semesters = ['All Semesters', ...Array.from(new Set(academicWorks.map(work => work.semester)))];
  const workTypes = ['All Types', ...Array.from(new Set(academicWorks.map(work => work.type)))];

  // Filter works
  const filteredWorks = academicWorks.filter(work => {
    const matchesSearch = work.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         work.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         work.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = selectedSubject === 'All Subjects' || work.subject === selectedSubject;
    const matchesSemester = selectedSemester === 'All Semesters' || work.semester === selectedSemester;
    const matchesType = selectedType === 'All Types' || work.type === selectedType;
    
    return matchesSearch && matchesSubject && matchesSemester && matchesType;
  });

  const featuredWorks = academicWorks.filter(work => work.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <Link href="/about/academic" className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 mb-6 transition-colors">
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
              <Folder className="w-16 h-16 mx-auto text-purple-600 dark:text-purple-400 mb-4" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Academic Portfolio
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Explore my academic journey through presentations, research projects, assignments, and design work
            </p>
          </div>
        </motion.div>

        {/* Featured Works */}
        {featuredWorks.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-900 dark:text-white">
              <Star className="w-6 h-6 mr-2 text-yellow-500" />
              Featured Work
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredWorks.map((work, index) => (
                <AcademicWorkCard key={work.id} work={work} delay={index * 0.1} />
              ))}
            </div>
          </motion.section>
        )}

        {/* Search and Filters */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-8"
        >
          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-purple-200 dark:border-purple-700">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Search & Filter</h3>
              
              <div className="flex flex-wrap gap-4 items-end mb-4">
                <div className="flex-1 min-w-[250px]">
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search by title, description, or tags..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-purple-200 focus:border-purple-500 dark:border-purple-700"
                    />
                  </div>
                </div>

                <div className="min-w-[150px]">
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Subject</label>
                  <select 
                    value={selectedSubject} 
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    title="Filter by subject"
                    className="w-full px-3 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-purple-700 dark:text-white"
                  >
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                <div className="min-w-[150px]">
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Semester</label>
                  <select 
                    value={selectedSemester} 
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    title="Filter by semester"
                    className="w-full px-3 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-purple-700 dark:text-white"
                  >
                    {semesters.map(semester => (
                      <option key={semester} value={semester}>{semester}</option>
                    ))}
                  </select>
                </div>

                <div className="min-w-[150px]">
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Type</label>
                  <select 
                    value={selectedType} 
                    onChange={(e) => setSelectedType(e.target.value)}
                    title="Filter by type"
                    className="w-full px-3 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-purple-700 dark:text-white"
                  >
                    {workTypes.map(type => (
                      <option key={type} value={type}>
                        {type === 'All Types' ? type : type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="bg-purple-600 hover:bg-purple-700 border-purple-600"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="bg-purple-600 hover:bg-purple-700 border-purple-600"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredWorks.length} of {academicWorks.length} works
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Academic Works Grid/List */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {filteredWorks.length === 0 ? (
            <div className="text-center py-12">
              <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                No works found
              </h3>
              <p className="text-gray-500 dark:text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-4'
            }>
              {filteredWorks.map((work, index) => (
                viewMode === 'grid' ? (
                  <AcademicWorkCard key={work.id} work={work} delay={index * 0.1} />
                ) : (
                  <AcademicWorkListItem key={work.id} work={work} delay={index * 0.05} />
                )
              ))}
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}

function AcademicWorkCard({ work, delay = 0 }: { work: AcademicWork; delay?: number }) {
  const IconComponent = typeIcons[work.type];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-purple-200 dark:border-purple-700">
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <IconComponent className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <Badge variant="outline" className="border-purple-200 text-purple-700 dark:border-purple-700 dark:text-purple-300">
              {work.type}
            </Badge>
          </div>
          <CardTitle className="line-clamp-2 text-gray-900 dark:text-white">{work.title}</CardTitle>
          <CardDescription>
            <div className="space-y-1">
              <div className="font-medium text-purple-600 dark:text-purple-400">{work.subject}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{work.semester}</div>
            </div>
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-3">
            {work.description}
          </p>
          
          <div className="flex flex-wrap gap-1">
            {work.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                {tag}
              </Badge>
            ))}
            {work.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                +{work.tags.length - 3} more
              </Badge>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex gap-2">
          {work.files.length > 0 && (
            <Button variant="outline" size="sm" asChild className="flex-1 border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300">
              <a href={work.files[0].url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                View
              </a>
            </Button>
          )}
          <Button variant="outline" size="sm" asChild className="flex-1 border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300">
            <Link href={`/academic/${work.id}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Details
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

function AcademicWorkListItem({ work, delay = 0 }: { work: AcademicWork; delay?: number }) {
  const IconComponent = typeIcons[work.type];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      <Card className="border-purple-200 dark:border-purple-700 hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <IconComponent className="w-6 h-6 text-purple-600 dark:text-purple-400 mt-1 flex-shrink-0" />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{work.title}</h3>
                <Badge variant="outline" className="border-purple-200 text-purple-700 dark:border-purple-700 dark:text-purple-300">
                  {work.type}
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                <span className="font-medium text-purple-600 dark:text-purple-400">{work.subject}</span>
                <span>{work.semester}</span>
                <span>{new Date(work.createdAt).toLocaleDateString()}</span>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                {work.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {work.tags.slice(0, 4).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                      {tag}
                    </Badge>
                  ))}
                  {work.tags.length > 4 && (
                    <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                      +{work.tags.length - 4} more
                    </Badge>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {work.files.length > 0 && (
                    <Button variant="outline" size="sm" asChild className="border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300">
                      <a href={work.files[0].url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View
                      </a>
                    </Button>
                  )}
                  <Button variant="outline" size="sm" asChild className="border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300">
                    <Link href={`/academic/${work.id}`}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Details
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
