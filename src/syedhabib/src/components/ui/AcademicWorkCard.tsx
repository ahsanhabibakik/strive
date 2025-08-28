'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from './badge';
import { Button } from './button';
import { Card } from './card';
import { 
  Calendar, 
  Clock, 
  Users, 
  User, 
  FileText, 
  Presentation,
  Target,
  BookOpen,
  Download
} from 'lucide-react';
import { AcademicWork } from '@/data/academic-works';

interface AcademicWorkCardProps {
  work: AcademicWork;
  variant?: 'default' | 'featured' | 'compact';
}

export function AcademicWorkCard({ work, variant = 'default' }: AcademicWorkCardProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'term-paper':
        return FileText;
      case 'presentation':
        return Presentation;
      case 'research':
        return BookOpen;
      default:
        return Target;
    }
  };

  const TypeIcon = getTypeIcon(work.type);

  if (variant === 'featured') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="group"
      >
        <Link href={`/academic/${work.id}`}>
          <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50">
            <div className="md:flex">
              {/* Image Section */}
              <div className="relative md:w-2/5 aspect-[4/3] md:aspect-[3/4]">
                {work.coverImage ? (
                  <Image
                    src={work.coverImage}
                    alt={work.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <TypeIcon className="w-16 h-16 text-primary/60" />
                  </div>
                )}
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-primary text-primary-foreground">Featured</Badge>
                  {work.grade && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {work.grade}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 md:p-8 md:w-3/5 flex flex-col">
                {/* Meta Info */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {work.semester}, {work.year}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {work.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    {work.workType === 'group' ? <Users className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    {work.workType}
                  </div>
                </div>

                {/* Title and Subject */}
                <h3 className="text-2xl font-bold group-hover:text-primary transition-colors mb-2 leading-tight">
                  {work.title}
                </h3>
                <p className="text-lg text-primary font-medium mb-4">{work.subject}</p>

                {/* Description */}
                <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-3">
                  {work.description}
                </p>

                {/* Key Skills */}
                <div className="mb-6">
                  <p className="text-sm font-medium mb-2">Key Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {work.skills.slice(0, 4).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {work.skills.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{work.skills.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 mt-auto">
                  <Button size="sm" className="flex-1">
                    View Details
                  </Button>
                  {work.files.length > 0 && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={work.files[0].url} target="_blank" rel="noopener noreferrer">
                        <Download className="w-4 h-4 mr-2" />
                        Files
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </Link>
      </motion.div>
    );
  }

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="group"
      >
        <Link href={`/academic/${work.id}`}>
          <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 p-4">
            <div className="flex gap-4">
              {/* Small Image */}
              <div className="relative w-20 h-20 flex-shrink-0">
                {work.coverImage ? (
                  <Image
                    src={work.coverImage}
                    alt={work.title}
                    fill
                    className="object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 rounded-md flex items-center justify-center">
                    <TypeIcon className="w-8 h-8 text-primary/60" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <span>{work.semester}</span>
                  <span>•</span>
                  <span>{work.workType}</span>
                  {work.grade && (
                    <>
                      <span>•</span>
                      <Badge variant="outline" className="text-xs px-1 py-0">
                        {work.grade}
                      </Badge>
                    </>
                  )}
                </div>
                <h4 className="font-semibold group-hover:text-primary transition-colors line-clamp-1 mb-1">
                  {work.title}
                </h4>
                <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                  {work.subject}
                </p>
                <div className="flex flex-wrap gap-1">
                  {work.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs px-2 py-0">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </Link>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group h-full"
    >
      <Link href={`/academic/${work.id}`} className="block h-full">
        <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50">
          {/* Cover Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            {work.coverImage ? (
              <Image
                src={work.coverImage}
                alt={work.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <TypeIcon className="w-16 h-16 text-primary/60" />
              </div>
            )}
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge className="bg-black/70 text-white">
                {work.type.replace('-', ' ')}
              </Badge>
              {work.grade && (
                <Badge className="bg-green-500 text-white">
                  {work.grade}
                </Badge>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col h-full">
            {/* Meta Info */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {work.semester}, {work.year}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {work.duration}
              </div>
              <div className="flex items-center gap-1">
                {work.workType === 'group' ? <Users className="h-3 w-3" /> : <User className="h-3 w-3" />}
                {work.workType}
              </div>
            </div>

            {/* Title and Subject */}
            <h3 className="text-xl font-bold group-hover:text-primary transition-colors mb-2 line-clamp-2 leading-tight">
              {work.title}
            </h3>
            <p className="text-sm text-primary font-medium mb-3">{work.subject}</p>

            {/* Description */}
            <p className="text-muted-foreground line-clamp-3 mb-4 flex-grow text-sm leading-relaxed">
              {work.description}
            </p>

            {/* Skills Tags */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {work.skills.slice(0, 3).map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs px-2 py-1">
                    {skill}
                  </Badge>
                ))}
                {work.skills.length > 3 && (
                  <Badge variant="outline" className="text-xs px-2 py-1">
                    +{work.skills.length - 3}
                  </Badge>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <FileText className="h-3 w-3" />
                {work.files.length} file{work.files.length !== 1 ? 's' : ''}
              </div>
              <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/10">
                View Details
              </Button>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
