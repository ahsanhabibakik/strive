'use client';

import React from 'react';


import JsonLd from './JsonLd';

interface WebsiteSchemaProps {
  name?: string;
  url?: string;
  description?: string;
  searchUrl?: string;
}

export default function WebsiteSchema({
  name = 'Digital Marketing & Web Development Agency',
  url = 'https://syedhabib.com',
  description = 'Results-driven digital marketing and web development agency helping businesses grow online with custom websites, e-commerce solutions, and strategic marketing campaigns.',
  searchUrl = 'https://syedhabib.com/search?q={search_term_string}'
}: WebsiteSchemaProps) {
  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: searchUrl
      },
      'query-input': 'required name=search_term_string'
    }
  };

  return <JsonLd data={websiteData} />;
}