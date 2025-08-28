'use client';

import React from 'react';
import BlogListingSchema from './BlogListingSchema';
import { BlogPost } from '@/data/blog-posts';

interface BlogIndexSchemaProps {
  posts: BlogPost[];
  baseUrl?: string;
}

export default function BlogIndexSchema({ 
  posts, 
  baseUrl = 'https://syedhabib.com' 
}: BlogIndexSchemaProps) {
  const blogPosts = posts.map(post => ({
    title: post.title,
    description: post.excerpt,
    url: `${baseUrl}/blog/${post.slug}`,
    datePublished: post.date,
    author: 'Ahsan Habib Akik',
    image: post.coverImage
  }));

  return <BlogListingSchema blogPosts={blogPosts} />;
}