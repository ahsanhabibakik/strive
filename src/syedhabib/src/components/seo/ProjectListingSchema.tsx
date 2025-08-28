'use client';

import React from 'react';
import JsonLd from './JsonLd';

interface Project {
  name: string;
  description: string;
  url: string;
  image?: string;
  category?: string;
}

interface ProjectListingSchemaProps {
  projects: Project[];
  listingPage?: {
    name?: string;
    description?: string;
    url?: string;
  };
}

export default function ProjectListingSchema({
  projects,
  listingPage = {
    name: 'Digital Marketing & Web Development Portfolio',
    description: 'Explore our portfolio of successful digital marketing campaigns and web development projects that have helped businesses grow online.',
    url: 'https://syedhabib.com/projects'
  }
}: ProjectListingSchemaProps) {
  const projectListingData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: listingPage.name,
    description: listingPage.description,
    url: listingPage.url,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: projects.map((project, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'CreativeWork',
          name: project.name,
          description: project.description,
          url: project.url,
          image: project.image || 'https://syedhabib.com/images/og-image.jpg',
          ...(project.category && { genre: project.category }),
          creator: {
            '@type': 'Person',
            name: 'Ahsan Habib Akik',
            url: 'https://syedhabib.com'
          }
        }
      }))
    }
  };

  return <JsonLd data={projectListingData} />;
}