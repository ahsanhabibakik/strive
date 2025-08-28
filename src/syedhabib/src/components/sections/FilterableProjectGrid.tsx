'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search,
  Filter,
  Grid3x3,
  List,
  SortAsc,
  SortDesc,
  Star,
  AlignLeft
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  category: string;
  status: string;
  description: string;
  capabilities: string[];
  technologies: string[];
  metrics?: {
    value: string;
    label: string;
  };
  screenshots: {
    thumbnail?: string;
    desktop?: string;
  };
  links: {
    demo?: string;
    live?: string;
    github?: string;
  };
  featured: boolean;
  createdAt: Date;
  emoji: string;
}

interface FilterableProjectGridProps {
  projects: Project[];
}

type SortOption = 'featured' | 'newest' | 'oldest' | 'alphabetical';
type ViewMode = 'grid' | 'list';

const categories = [
  { label: 'All Projects', value: 'all', count: 0 },
  { label: 'Featured', value: 'featured', count: 0 },
  { label: 'E-commerce', value: 'E-commerce', count: 0 },
  { label: 'AI Technology', value: 'AI Technology', count: 0 },
  { label: 'Health & Wellness', value: 'Health & Wellness', count: 0 },
  { label: 'Education', value: 'Education', count: 0 }
];

const sortOptions = [
  { value: 'featured', label: 'Featured First', icon: <Star className="w-4 h-4" /> },
  { value: 'newest', label: 'Newest First', icon: <SortDesc className="w-4 h-4" /> },
  { value: 'oldest', label: 'Oldest First', icon: <SortAsc className="w-4 h-4" /> },
  { value: 'alphabetical', label: 'A-Z', icon: <AlignLeft className="w-4 h-4" /> }
];

export default function FilterableProjectGrid({ projects }: FilterableProjectGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Calculate category counts
  const categoriesWithCounts = useMemo(() => {
    return categories.map(cat => ({
      ...cat,
      count: cat.value === 'all' 
        ? projects.length 
        : cat.value === 'featured'
        ? projects.filter(p => p.featured).length
        : projects.filter(p => p.category === cat.value).length
    }));
  }, [projects]);

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects;

    // Apply category filter
    if (activeCategory === 'featured') {
      filtered = filtered.filter(project => project.featured);
    } else if (activeCategory !== 'all') {
      filtered = filtered.filter(project => project.category === activeCategory);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.category.toLowerCase().includes(query) ||
        project.capabilities.some(cap => cap.toLowerCase().includes(query)) ||
        project.technologies.some(tech => tech.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'featured':
          if (a.featured !== b.featured) {
            return b.featured ? 1 : -1;
          }
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'newest':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'oldest':
          return a.createdAt.getTime() - b.createdAt.getTime();
        case 'alphabetical':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return sorted;
  }, [projects, activeCategory, searchQuery, sortBy]);

  return (
    <section id="projects" className="py-10 sm:py-16 bg-gradient-to-b from-background to-background/50">
      <div className="container mx-auto px-4 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-small-black/[0.02] dark:bg-grid-small-white/[0.05] pointer-events-none" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[400px] h-[400px] bg-gradient-radial from-primary/5 to-transparent rounded-full blur-3xl" />
        </div>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12 relative z-10"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Portfolio Showcase
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            All Projects
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Browse through my portfolio of web applications, e-commerce solutions, and digital platforms
          </p>
        </motion.div>

        {/* Search and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6 sm:mb-8 relative z-10"
        >
          {/* Search Bar and View Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4 sm:mb-6">
            <div className="relative flex-1 w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex rounded-lg border p-1">
                <Button
                  size="sm"
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('grid')}
                  className="h-8 w-8 p-0"
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('list')}
                  className="h-8 w-8 p-0"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Sort
                </Button>
                
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-popover border rounded-lg p-2 z-50 shadow-lg"
                    >
                      {sortOptions.map((option) => (
                        <Button
                          key={option.value}
                          variant={sortBy === option.value ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => {
                            setSortBy(option.value as SortOption);
                            setShowFilters(false);
                          }}
                          className="w-full justify-start gap-2"
                        >
                          {option.icon}
                          {option.label}
                        </Button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {categoriesWithCounts.map((category) => (
              <motion.div
                key={category.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant={activeCategory === category.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveCategory(category.value)}
                  className="gap-2"
                >
                  {category.label}
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {category.count}
                  </Badge>
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Results Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-6 flex items-center justify-between relative z-10"
        >
          <div className="text-sm text-muted-foreground">
            {filteredAndSortedProjects.length === 0 ? (
              <span>No projects found</span>
            ) : (
              <span>
                Showing {filteredAndSortedProjects.length} of {projects.length} projects
              </span>
            )}
          </div>
          
          {(searchQuery || activeCategory !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear filters
            </Button>
          )}
        </motion.div>

        {/* Projects Grid */}
        <div className={`
          relative z-10
          ${viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8' 
            : 'flex flex-col gap-6'
          }
        `}>
          <AnimatePresence mode="popLayout">
            {filteredAndSortedProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ 
                  duration: 0.4,
                  delay: index * 0.05,
                  layout: { duration: 0.3 }
                }}
                className={viewMode === 'list' ? 'w-full max-w-2xl mx-auto' : ''}
              >
                <ProjectCard 
                  project={project} 
                  index={index}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredAndSortedProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12 sm:py-16"
          >
            <div className="text-4xl sm:text-6xl mb-4">🔍</div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">No projects found</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-md mx-auto">
              Try adjusting your search terms or category filters to discover more projects.
            </p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
            >
              View All Projects
            </Button>
          </motion.div>
        )}

        {/* CTA Section */}
        {filteredAndSortedProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 sm:mt-16 text-center"
          >
            <div className="bg-primary/5 border border-primary/10 rounded-lg p-6 sm:p-8 max-w-2xl mx-auto">
              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                Ready to Start Your Project?
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-6">
                Let&apos;s discuss your requirements and build something amazing together.
              </p>
              <Button asChild size="lg">
                <Link href="/contact">Get a Free Consultation</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}