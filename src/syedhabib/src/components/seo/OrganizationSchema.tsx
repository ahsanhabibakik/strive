'use client';

import React from 'react';


import JsonLd from './JsonLd';

export default function OrganizationSchema() {
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Digital Marketing & Web Development Agency',
    url: 'https://syedhabib.com',
    logo: 'https://syedhabib.com/images/logo.png',
    description: 'Results-driven digital marketing and web development agency helping businesses grow online with custom websites, e-commerce solutions, and strategic marketing campaigns.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Dhaka',
      addressRegion: 'Dhaka',
      addressCountry: 'Bangladesh'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+8801518926700',
      contactType: 'customer service',
      email: 'ahabibakik@gmail.com',
      availableLanguage: ['English', 'Bengali']
    },
    sameAs: [
      'https://facebook.com/syedmirhabib',
      'https://instagram.com/ahsanhabibakik'
    ],
    founder: {
      '@type': 'Person',
      name: 'Ahsan Habib Akik',
      jobTitle: 'Founder & CEO',
      url: 'https://syedhabib.com'
    },
    areaServed: 'Worldwide',
    priceRange: '$$',
    openingHours: 'Mo-Sa 09:00-18:00',
    paymentAccepted: ['Credit Card', 'PayPal', 'Bank Transfer'],
    currenciesAccepted: 'USD, BDT'
  };

  return <JsonLd data={organizationData} />;
}