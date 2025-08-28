'use client';

import ServiceListingSchema from './seo/ServiceListingSchema';

interface Service {
  title: string;
  description: string;
  slug?: string;
  image?: string;
  category?: string;
}

interface ServicesIndexSchemaProps {
  services: Service[];
  baseUrl?: string;
}

export default function ServicesIndexSchema({ 
  services, 
  baseUrl = 'https://syedhabib.com' 
}: ServicesIndexSchemaProps) {
  const servicesData = services.map(service => ({
    name: service.title,
    description: service.description,
    url: service.slug ? `${baseUrl}/services/${service.slug}` : `${baseUrl}/services`,
    image: service.image,
    category: service.category
  }));

  return <ServiceListingSchema services={servicesData} />;
}