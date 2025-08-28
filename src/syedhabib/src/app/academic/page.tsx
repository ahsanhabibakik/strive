'use client';

import { academicWorks } from '@/data/academic-works';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AcademicWorkCard } from '@/components/ui/AcademicWorkCard';
import { 
  Search, 
  Filter, 
  GraduationCap, 
  BookOpen, 
  Users,
  Award,
  Calendar,
  FileText
} from 'lucide-react';

export default function AcademicPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [selectedWorkType, setSelectedWorkType] = useState<string | null>(null);

  // Get unique values for filters
  const allTypes = [...new Set(academicWorks.map(work => work.type))];
  const allSemesters = [...new Set(academicWorks.map(work => work.semester))];
  const allWorkTypes = [...new Set(academicWorks.map(work => work.workType))];

  // Filter works based on search and filters
  const filteredWorks = academicWorks.filter((work) => {
    const matchesSearch = work.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      work.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      work.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      work.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = !selectedType || work.type === selectedType;
    const matchesSemester = !selectedSemester || work.semester === selectedSemester;
    const matchesWorkType = !selectedWorkType || work.workType === selectedWorkType;
    
    return matchesSearch && matchesType && matchesSemester && matchesWorkType;
  });

  // Sort works by date (newest first)
  const sortedWorks = filteredWorks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const featuredWorks = sortedWorks.filter(work => work.featured);
  const regularWorks = sortedWorks.filter(work => !work.featured);

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
        duration: 0.4,
      },
    },
  };

  // Calculate stats
  const totalWorks = academicWorks.length;
  const subjects = [...new Set(academicWorks.map(work => work.subject))].length;
  const groupProjects = academicWorks.filter(work => work.workType === 'group').length;
  const gradesWithA = academicWorks.filter(work => work.grade?.startsWith('A')).length;

  const stats = [
    { label: 'Total Projects', value: totalWorks, icon: BookOpen },
    { label: 'Subjects Covered', value: subjects, icon: FileText },
    { label: 'Group Projects', value: groupProjects, icon: Users },
    { label: 'A Grades', value: `${gradesWithA}/${academicWorks.filter(w => w.grade).length}`, icon: Award },
  ];

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedType(null);
    setSelectedSemester(null);
    setSelectedWorkType(null);
  };

  return (
    <main className="min-h-screen py-8 md:py-12">
      <div className="container px-4 md:px-6 max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <GraduationCap className="w-4 h-4" />
              Academic Portfolio
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Academic Projects & Research
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              A comprehensive showcase of my academic journey, featuring research papers, 
              presentations, case studies, and design projects across various subjects.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
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
        </header>

        {/* Search and Filters */}
        <section className="mb-12">
          <div className="bg-card/50 rounded-xl p-6 border">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-lg mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="search"
                  placeholder="Search projects, subjects, or keywords..."
                  className="pl-10 h-12 text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Filter Badges */}
            <div className="space-y-4">
              {/* Project Type Filter */}
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Project Type
                </h4>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={!selectedType ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSelectedType(null)}
                  >
                    All Types ({academicWorks.length})
                  </Badge>
                  {allTypes.map((type) => {
                    const count = academicWorks.filter(work => work.type === type).length;
                    return (
                      <Badge
                        key={type}
                        variant={selectedType === type ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => setSelectedType(type)}
                      >
                        {type.replace('-', ' ')} ({count})
                      </Badge>
                    );
                  })}
                </div>
              </div>

              {/* Semester Filter */}
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Semester
                </h4>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={!selectedSemester ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSelectedSemester(null)}
                  >
                    All Semesters
                  </Badge>
                  {allSemesters.map((semester) => {
                    const count = academicWorks.filter(work => work.semester === semester).length;
                    return (
                      <Badge
                        key={semester}
                        variant={selectedSemester === semester ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => setSelectedSemester(semester)}
                      >
                        {semester} ({count})
                      </Badge>
                    );
                  })}
                </div>
              </div>

              {/* Work Type Filter */}
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Work Type
                </h4>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={!selectedWorkType ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSelectedWorkType(null)}
                  >
                    All
                  </Badge>
                  {allWorkTypes.map((workType) => {
                    const count = academicWorks.filter(work => work.workType === workType).length;
                    return (
                      <Badge
                        key={workType}
                        variant={selectedWorkType === workType ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => setSelectedWorkType(workType)}
                      >
                        {workType} ({count})
                      </Badge>
                    );
                  })}
                </div>
              </div>

              {/* Clear Filters */}
              {(searchQuery || selectedType || selectedSemester || selectedWorkType) && (
                <div className="pt-2">
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    Showing {sortedWorks.length} of {academicWorks.length} projects
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Featured Works */}
        {featuredWorks.length > 0 && !searchQuery && !selectedType && !selectedSemester && !selectedWorkType && (
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Featured Academic Work</h2>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {featuredWorks.map((work) => (
                <motion.div key={work.id} variants={itemVariants}>
                  <AcademicWorkCard work={work} variant="featured" />
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}

        {/* All Works Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">
              {(searchQuery || selectedType || selectedSemester || selectedWorkType) ? 'Search Results' : 'All Academic Work'}
            </h2>
            <div className="text-sm text-muted-foreground">
              {sortedWorks.length} project{sortedWorks.length !== 1 ? 's' : ''}
            </div>
          </div>

          {sortedWorks.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            >
              {(featuredWorks.length > 0 && !searchQuery && !selectedType && !selectedSemester && !selectedWorkType 
                ? regularWorks 
                : sortedWorks
              ).map((work) => (
                <motion.div key={work.id} variants={itemVariants}>
                  <AcademicWorkCard work={work} variant="default" />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No academic work found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search terms or filters
              </p>
              <Button onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
