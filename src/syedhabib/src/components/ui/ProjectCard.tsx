'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSoundManager } from '@/lib/soundManager';
import { 
  ExternalLink, 
  Github, 
  TrendingUp,
  Globe
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

interface ProjectCardProps {
  project: Project;
}

// Status color mappings
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'live':
      return 'bg-green-500/10 text-green-400 border-green-500/20';
    case 'development':
      return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    case 'beta':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'completed':
      return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    default:
      return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  }
};

export function ProjectCard({ project }: ProjectCardProps) {
  const { playButtonClick, playMagic } = useSoundManager();

  return (
    <Card className="relative group overflow-hidden h-full transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 border-border/50 hover:border-primary/30 bg-card/50 backdrop-blur-sm">
      {/* Featured Badge */}
      {project.featured && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-primary/20 text-primary border-primary/30">
            <TrendingUp className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        </div>
      )}

      {/* Project Image/Icon */}
      <div className="relative h-48 overflow-hidden">
        {project.screenshots.thumbnail ? (
          <Image
            src={project.screenshots.thumbnail}
            alt={project.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
            <span className="text-6xl">{project.emoji}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">
              {project.name}
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                {project.category}
              </Badge>
              <Badge className={`text-xs ${getStatusColor(project.status)}`}>
                {project.status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-1">
          {project.description}
        </p>

        {/* Metrics */}
        {project.metrics && (
          <div className="bg-primary/5 rounded-lg p-3 mb-4 border border-primary/10">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{project.metrics.value}</div>
              <div className="text-xs text-muted-foreground">{project.metrics.label}</div>
            </div>
          </div>
        )}

        {/* Capabilities */}
        <div className="mb-4">
          <div className="text-xs font-medium text-muted-foreground mb-2">Key Features</div>
          <div className="flex flex-wrap gap-1">
            {project.capabilities.slice(0, 3).map((capability) => (
              <Badge key={capability} variant="secondary" className="text-xs py-1">
                {capability}
              </Badge>
            ))}
            {project.capabilities.length > 3 && (
              <Badge variant="secondary" className="text-xs py-1">
                +{project.capabilities.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Technologies */}
        <div className="mb-4">
          <div className="text-xs font-medium text-muted-foreground mb-2">Technologies</div>
          <div className="flex flex-wrap gap-1">
            {project.technologies.slice(0, 4).map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs py-1">
                {tech}
              </Badge>
            ))}
            {project.technologies.length > 4 && (
              <Badge variant="outline" className="text-xs py-1">
                +{project.technologies.length - 4}
              </Badge>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto pt-4">
          {project.links.demo && (
            <Button 
              asChild 
              className="flex-1" 
              size="sm"
              onClick={() => playButtonClick()}
            >
              <Link href={project.links.demo} className="flex items-center justify-center">
                <Globe className="w-4 h-4 mr-2" />
                Demo
              </Link>
            </Button>
          )}
          {project.links.live && (
            <Button 
              asChild 
              variant="outline" 
              className="flex-1" 
              size="sm"
              onClick={() => playMagic()}
            >
              <Link 
                href={project.links.live} 
                target="_blank"
                className="flex items-center justify-center"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Live
              </Link>
            </Button>
          )}
          {project.links.github && (
            <Button 
              asChild 
              variant="ghost" 
              size="sm"
              className="px-3"
              onClick={() => playButtonClick()}
            >
              <Link 
                href={project.links.github} 
                target="_blank"
                className="flex items-center"
              >
                <Github className="w-4 h-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}