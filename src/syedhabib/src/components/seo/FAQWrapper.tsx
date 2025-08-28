'use client';

import React from 'react';


import FAQSchema from './FAQSchema';

interface FAQWrapperProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  mainEntity?: string;
}

export default function FAQWrapper({ 
  faqs,
  mainEntity
}: FAQWrapperProps) {
  return <FAQSchema faqs={faqs} mainEntity={mainEntity} />;
}