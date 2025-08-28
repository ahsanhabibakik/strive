'use client';

import React from 'react';


import JsonLd from './JsonLd';

interface ReviewItem {
  author: string;
  authorImage?: string;
  reviewBody: string;
  ratingValue: number;
  datePublished?: string;
}

interface ReviewSchemaProps {
  reviews: ReviewItem[];
  itemReviewed?: {
    name: string;
    description: string;
    url: string;
    image?: string;
  };
}

export default function ReviewSchema({
  reviews,
  itemReviewed = {
    name: 'Digital Marketing & Web Development Agency',
    description: 'Results-driven digital marketing and web development agency helping businesses grow online with custom websites, e-commerce solutions, and strategic marketing campaigns.',
    url: 'https://syedhabib.com',
    image: 'https://syedhabib.com/images/logo.png'
  }
}: ReviewSchemaProps) {
  const reviewsData = reviews.map((review) => ({
    '@context': 'https://schema.org',
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: review.author,
      ...(review.authorImage && { image: review.authorImage })
    },
    reviewBody: review.reviewBody,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.ratingValue,
      bestRating: 5,
      worstRating: 1
    },
    datePublished: review.datePublished || new Date().toISOString().split('T')[0],
    itemReviewed: {
      '@type': 'Organization',
      name: itemReviewed.name,
      description: itemReviewed.description,
      url: itemReviewed.url,
      ...(itemReviewed.image && { image: itemReviewed.image })
    }
  }));

  return (
    <>
      {reviewsData.map((reviewData) => (
        <JsonLd key={reviewData['@type']} data={reviewData} />
      ))}
    </>
  );
}