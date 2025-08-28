'use client';

import React from 'react';

interface SocialMetaTagsProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  twitterUsername?: string;
}

export default function SocialMetaTags({
  title,
  description,
  image = 'https://syedhabib.com/images/og-image.jpg',
  url = 'https://syedhabib.com',
  type = 'website',
  twitterUsername = '@ahsanhabibakik'
}: SocialMetaTagsProps) {
  return (
    <>
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={twitterUsername} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </>
  );
}