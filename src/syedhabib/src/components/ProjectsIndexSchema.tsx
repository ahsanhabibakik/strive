'use client';

import ProjectListingSchema from './seo/ProjectListingSchema';

interface Project {
  title: string;
  description: string;
  slug: string;
  image?: string;
  category?: string;
}

interface ProjectsIndexSchemaProps {
  projects: Project[];
  baseUrl?: string;
}

export default function ProjectsIndexSchema({ 
  projects, 
  baseUrl = 'https://syedhabib.com' 
}: ProjectsIndexSchemaProps) {
  const projectsData = projects.map(project => ({
    name: project.title,
    description: project.description,
    url: `${baseUrl}/projects/${project.slug}`,
    image: project.image,
    category: project.category
  }));

  return <ProjectListingSchema projects={projectsData} />;
}