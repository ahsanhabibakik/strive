'use client';

import React from 'react';


import JsonLd from './JsonLd';

interface ProjectSchemaProps {
  project: {
    name: string;
    description: string;
    url: string;
    image?: string;
    dateCreated?: string;
    creator?: string;
    category?: string;
    technologies?: string[];
    clientName?: string;
    clientUrl?: string;
  };
}

export default function ProjectSchema({ project }: ProjectSchemaProps) {
  const projectData = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.name,
    description: project.description,
    url: project.url,
    image: project.image || 'https://syedhabib.com/images/og-image.jpg',
    dateCreated: project.dateCreated || new Date().toISOString().split('T')[0],
    creator: {
      '@type': 'Person',
      name: project.creator || 'Ahsan Habib Akik',
      url: 'https://syedhabib.com'
    },
    ...(project.category && { genre: project.category }),
    ...(project.technologies && { keywords: project.technologies.join(', ') }),
    ...(project.clientName && {
      accountablePerson: {
        '@type': 'Person',
        name: project.clientName,
        ...(project.clientUrl && { url: project.clientUrl })
      }
    })
  };

  return <JsonLd data={projectData} />;
}