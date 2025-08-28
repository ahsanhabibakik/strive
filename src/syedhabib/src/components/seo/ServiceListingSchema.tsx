'use client';

import React from 'react';
import JsonLd from './JsonLd';

interface Service {
  name: string;
  description: string;
  url: string;
  image?: string;
  category?: string;
}

interface ServiceListingSchemaProps {
  services: Service[];
  listingPage?: {
    name?: string;
    description?: string;
    url?: string;
  };
}

export default function ServiceListingSchema({
  services,
  listingPage = {
    name: 'Digital Marketing & Web Development Services',
    description: 'Professional digital marketing and web development services that drive business growth and deliver measurable results.',
    url: 'https://syedhabib.com/services'
  }
}: ServiceListingSchemaProps) {
  const serviceListingData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listingPage.name,
    description: listingPage.description,
    url: listingPage.url,
    itemListElement: services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        name: service.name,
        description: service.description,
        url: service.url,
        provider: {
          '@type': 'Organization',
          name: 'Digital Marketing & Web Development Agency',
          url: 'https://syedhabib.com'
        },
        ...(service.image && { image: service.image }),
        ...(service.category && { serviceType: service.category })
      }
    }))
  };

  return <JsonLd data={serviceListingData} />;
}