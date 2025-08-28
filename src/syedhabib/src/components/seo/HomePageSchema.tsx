'use client';

import React from 'react';
import JsonLd from './JsonLd';

interface HomePageSchemaProps {
  services?: Array<{
    name: string;
    description: string;
    url: string;
  }>;
  projects?: Array<{
    name: string;
    description: string;
    url: string;
  }>;
}

export default function HomePageSchema({
  services = [
    {
      name: 'Website Development',
      description: 'Custom websites that convert visitors into customers.',
      url: 'https://syedhabib.com/services/website-development'
    },
    {
      name: 'Digital Marketing',
      description: 'Results-driven campaigns that generate real ROI.',
      url: 'https://syedhabib.com/services/digital-marketing'
    },
    {
      name: 'E-commerce Solutions',
      description: 'Online stores that drive sales and simplify management.',
      url: 'https://syedhabib.com/services/ecommerce-solutions'
    }
  ],
  projects = []
}: HomePageSchemaProps) {
  const homePageData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Digital Marketing & Web Development Agency | Results-Driven Solutions',
    description: 'Results-driven digital marketing and web development agency helping businesses grow online with custom websites, e-commerce solutions, and strategic marketing campaigns.',
    url: 'https://syedhabib.com',
    mainEntity: {
      '@type': 'Organization',
      name: 'Digital Marketing & Web Development Agency',
      url: 'https://syedhabib.com',
      logo: 'https://syedhabib.com/images/logo.png',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Digital Services',
        itemListElement: services.map((service) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: service.name,
            description: service.description,
            url: service.url
          }
        }))
      }
    },
    ...(projects.length > 0 && {
      mentions: projects.map(project => ({
        '@type': 'CreativeWork',
        name: project.name,
        description: project.description,
        url: project.url
      }))
    })
  };

  return <JsonLd data={homePageData} />;
}