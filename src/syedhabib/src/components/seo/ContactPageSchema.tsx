'use client';

import React from 'react';


import JsonLd from './JsonLd';

interface ContactPageSchemaProps {
  name?: string;
  description?: string;
  url?: string;
  email?: string;
  telephone?: string;
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
}

export default function ContactPageSchema({
  name = 'Contact Digital Marketing & Web Development Agency',
  description = 'Get in touch with our digital marketing and web development agency for custom solutions that drive results.',
  url = 'https://syedhabib.com/contact',
  email = 'ahabibakik@gmail.com',
  telephone = '+8801518926700',
  address = {
    addressLocality: 'Dhaka',
    addressRegion: 'Dhaka',
    addressCountry: 'Bangladesh'
  }
}: ContactPageSchemaProps) {
  const contactPageData = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name,
    description,
    url,
    mainEntity: {
      '@type': 'Organization',
      name: 'Digital Marketing & Web Development Agency',
      email,
      telephone,
      address: {
        '@type': 'PostalAddress',
        ...address
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone,
        contactType: 'customer service',
        email,
        availableLanguage: ['English', 'Bengali']
      }
    }
  };

  return <JsonLd data={contactPageData} />;
}