'use client';

import React from 'react';
import ArticleSchema from './ArticleSchema';
import { BlogPost } from '@/data/blog-posts';

interface BlogPostSchemaProps {
  post: BlogPost;
  baseUrl?: string;
}

export default function BlogPostSchema({ 
  post, 
  baseUrl = 'https://syedhabib.com' 
}: BlogPostSchemaProps) {
  const articleData = {
    title: post.title,
    description: post.excerpt,
    url: `${baseUrl}/blog/${post.slug}`,
    image: post.coverImage,
    datePublished: post.date,
    authorName: 'Ahsan Habib Akik',
    authorUrl: baseUrl,
    publisherName: 'Digital Marketing & Web Development Agency',
    publisherLogo: `${baseUrl}/images/logo.png`,
    category: post.tags[0] || 'Digital Marketing',
    tags: post.tags
  };

  return <ArticleSchema article={articleData} />;
}