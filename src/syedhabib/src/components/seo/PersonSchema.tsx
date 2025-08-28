'use client';

import React from 'react';


import JsonLd from './JsonLd';

interface PersonSchemaProps {
  person?: {
    name?: string;
    jobTitle?: string;
    image?: string;
    url?: string;
    email?: string;
    telephone?: string;
    description?: string;
    sameAs?: string[];
  };
}

export default function PersonSchema({
  person = {
    name: 'Ahsan Habib Akik',
    jobTitle: 'Digital Marketing & Web Development Specialist',
    image: 'https://syedhabib.com/images/profile.jpg',
    url: 'https://syedhabib.com',
    email: 'ahabibakik@gmail.com',
    telephone: '+8801518926700',
    description: 'Digital marketing and web development specialist helping businesses grow online with results-driven solutions.',
    sameAs: [
      'https://facebook.com/syedmirhabib',
      'https://instagram.com/ahsanhabibakik',
      'https://linkedin.com/in/ahsanhabibakik',
      'https://github.com/ahsanhabibakik'
    ]
  }
}: PersonSchemaProps) {
  const personData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    jobTitle: person.jobTitle,
    image: person.image,
    url: person.url,
    email: person.email,
    telephone: person.telephone,
    description: person.description,
    sameAs: person.sameAs,
    worksFor: {
      '@type': 'Organization',
      name: 'Digital Marketing & Web Development Agency',
      url: 'https://syedhabib.com'
    }
  };

  return <JsonLd data={personData} />;
}