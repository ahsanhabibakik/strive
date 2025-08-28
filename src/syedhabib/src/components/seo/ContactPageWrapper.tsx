'use client';

import React from 'react';


import ContactPageSchema from './ContactPageSchema';
import BreadcrumbSchema from './BreadcrumbSchema';

interface ContactPageWrapperProps {
  baseUrl?: string;
}

export default function ContactPageWrapper({ 
  baseUrl = 'https://syedhabib.com' 
}: ContactPageWrapperProps) {
  const breadcrumbItems = [
    { name: 'Home', url: baseUrl },
    { name: 'Contact', url: `${baseUrl}/contact` }
  ];

  return (
    <>
      <ContactPageSchema />
      <BreadcrumbSchema items={breadcrumbItems} />
    </>
  );
}