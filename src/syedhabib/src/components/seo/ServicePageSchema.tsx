'use client';

import React from 'react';


import JsonLd from './JsonLd';

interface ServicePageSchemaProps {
  service: {
    name: string;
    description: string;
    url: string;
    image?: string;
    offers?: Array<{
      name: string;
      description: string;
      price?: string;
      priceCurrency?: string;
    }>;
    serviceArea?: string;
    provider?: string;
    availableLanguage?: string[];
    serviceOutput?: string;
    serviceType?: string;
  };
}

export default function ServicePageSchema({ service }: ServicePageSchemaProps) {
  const servicePageData = {
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
    serviceType: service.serviceType || 'Digital Services',
    areaServed: service.serviceArea || 'Worldwide',
    availableLanguage: service.availableLanguage || ['English', 'Bengali'],
    ...(service.serviceOutput && { serviceOutput: service.serviceOutput }),
    ...(service.image && { image: service.image }),
    ...(service.offers && {
      offers: service.offers.map(offer => ({
        '@type': 'Offer',
        name: offer.name,
        description: offer.description,
        ...(offer.price && {
          price: offer.price,
          priceCurrency: offer.priceCurrency || 'USD'
        })
      }))
    })
  };

  return <JsonLd data={servicePageData} />;
}