'use client';

import React from 'react';


import ServicePageSchema from './ServicePageSchema';
import BreadcrumbSchema from './BreadcrumbSchema';

interface ServicePageWrapperProps {
  service: {
    name: string;
    description: string;
    slug: string;
    image?: string;
    offers?: Array<{
      name: string;
      description: string;
      price?: string;
      priceCurrency?: string;
    }>;
    serviceArea?: string;
    serviceOutput?: string;
    serviceType?: string;
  };
  baseUrl?: string;
}

export default function ServicePageWrapper({ 
  service, 
  baseUrl = 'https://syedhabib.com' 
}: ServicePageWrapperProps) {
  const serviceData = {
    name: service.name,
    description: service.description,
    url: `${baseUrl}/services/${service.slug}`,
    image: service.image,
    offers: service.offers,
    serviceArea: service.serviceArea,
    serviceOutput: service.serviceOutput,
    serviceType: service.serviceType
  };

  const breadcrumbItems = [
    { name: 'Home', url: baseUrl },
    { name: 'Services', url: `${baseUrl}/services` },
    { name: service.name, url: `${baseUrl}/services/${service.slug}` }
  ];

  return (
    <>
      <ServicePageSchema service={serviceData} />
      <BreadcrumbSchema items={breadcrumbItems} />
    </>
  );
}