'use client';

import React from 'react';
import JsonLd from './JsonLd';

interface LogoSchemaProps {
  url?: string;
  logo?: string;
  name?: string;
}

export default function LogoSchema({
  url = 'https://syedhabib.com',
  logo = 'https://syedhabib.com/images/logo.png',
  name = 'Digital Marketing & Web Development Agency'
}: LogoSchemaProps) {
  const logoData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    url,
    logo,
    name
  };

  return <JsonLd data={logoData} />;
}