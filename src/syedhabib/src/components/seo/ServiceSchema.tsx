'use client';

import React from 'react';


import JsonLd from './JsonLd';

interface ServiceSchemaProps {
  service: {
    name: string;
    description: string;
    url: string;
    image?: string;
    provider?: string;
    areaServed?: string;
    serviceType?: string;
  };
}

export default function ServiceSchema({ service }: ServiceSchemaProps) {
  const serviceData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    url: service.url,
    provider: {
      '@type': 'Organization',
      name: service.provider || 'Digital Marketing & Web Development Agency',
      url: 'https://syedhabib.com'
    },
    areaServed: service.areaServed || 'Worldwide',
    serviceType: service.serviceType || 'Digital Services',
    ...(service.image && { image: service.image })
  };

  return <JsonLd data={serviceData} />;
}