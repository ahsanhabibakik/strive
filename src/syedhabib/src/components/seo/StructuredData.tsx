import React from 'react';

interface StructuredDataProps {
  data: Record<string, unknown>;
}

/**
 * Component for adding structured data (JSON-LD) to pages
 * Improves SEO by providing search engines with explicit information about page content
 */
export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Helper function to create organization structured data
 */
export function createOrganizationSchema(
  name: string,
  url: string,
  logo: string,
  description: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo,
    description,
  };
}

/**
 * Helper function to create person structured data
 */
export function createPersonSchema(
  name: string,
  url: string,
  image: string,
  jobTitle: string,
  description: string,
  sameAs: string[] = []
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    url,
    image,
    jobTitle,
    description,
    sameAs,
  };
}

/**
 * Helper function to create article structured data
 */
export function createArticleSchema(
  headline: string,
  image: string,
  datePublished: string,
  dateModified: string,
  authorName: string,
  publisherName: string,
  publisherLogo: string,
  description: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    image,
    datePublished,
    dateModified,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: publisherName,
      logo: {
        '@type': 'ImageObject',
        url: publisherLogo,
      },
    },
    description,
  };
}

/**
 * Helper function to create FAQ structured data
 */
export function createFAQSchema(questions: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };
}

/**
 * Helper function to create service structured data
 */
export function createServiceSchema(
  name: string,
  description: string,
  provider: string,
  url: string,
  image: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: {
      '@type': 'Organization',
      name: provider,
    },
    url,
    image,
  };
}