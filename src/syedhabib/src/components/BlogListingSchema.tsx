'use client';

import JsonLd from './seo/JsonLd';

interface BlogPost {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  author: string;
  image?: string;
}

interface BlogListingSchemaProps {
  blogPosts: BlogPost[];
  listingPage?: {
    name?: string;
    description?: string;
    url?: string;
  };
}

export default function BlogListingSchema({
  blogPosts,
  listingPage = {
    name: 'Digital Marketing & Web Development Blog',
    description: 'Expert insights, tips, and strategies for digital marketing and web development to help grow your business online.',
    url: 'https://syedhabib.com/blog'
  }
}: BlogListingSchemaProps) {
  const blogListingData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: listingPage.name,
    description: listingPage.description,
    url: listingPage.url,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: blogPosts.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.description,
          url: post.url,
          datePublished: post.datePublished,
          author: {
            '@type': 'Person',
            name: post.author
          },
          image: post.image || 'https://syedhabib.com/images/og-image.jpg',
          publisher: {
            '@type': 'Organization',
            name: 'Digital Marketing & Web Development Agency',
            logo: {
              '@type': 'ImageObject',
              url: 'https://syedhabib.com/images/logo.png'
            }
          }
        }
      }))
    }
  };

  return <JsonLd data={blogListingData} />;
}