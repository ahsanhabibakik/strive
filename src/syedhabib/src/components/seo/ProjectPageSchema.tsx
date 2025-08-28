'use client';

import React from 'react';
import ProjectSchema from './ProjectSchema';

interface Project {
  title: string;
  description: string;
  slug: string;
  image?: string;
  category?: string;
  technologies?: string[];
  client?: string;
  clientUrl?: string;
  date?: string;
}

interface ProjectPageSchemaProps {
  project: Project;
  baseUrl?: string;
}

export default function ProjectPageSchema({ 
  project, 
  baseUrl = 'https://syedhabib.com' 
}: ProjectPageSchemaProps) {
  const projectData = {
    name: project.title,
    description: project.description,
    url: `${baseUrl}/projects/${project.slug}`,
    image: project.image,
    dateCreated: project.date,
    creator: 'Ahsan Habib Akik',
    category: project.category,
    technologies: project.technologies,
    clientName: project.client,
    clientUrl: project.clientUrl
  };

  return <ProjectSchema project={projectData} />;
}