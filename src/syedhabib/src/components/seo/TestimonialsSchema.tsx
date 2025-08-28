'use client';

import React from 'react';


import ReviewSchema from './ReviewSchema';
import { Testimonial } from '@/data/testimonials';

interface TestimonialsSchemaProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSchema({ testimonials }: TestimonialsSchemaProps) {
  const reviews = testimonials.map(testimonial => ({
    author: testimonial.name,
    authorImage: testimonial.image,
    reviewBody: testimonial.content,
    ratingValue: testimonial.rating,
    datePublished: new Date().toISOString().split('T')[0] // Using current date as fallback
  }));

  return <ReviewSchema reviews={reviews} />;
}