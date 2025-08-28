import { Metadata } from 'next';

// Base URL for canonical links and images
const baseUrl = 'https://syedhabib.com';

// Helper function to generate full image URL
export const getImageUrl = (path: string) => `${baseUrl}${path}`;

// Helper function to generate canonical URL
export const getCanonicalUrl = (path: string = '') => `${baseUrl}${path}`;

// Helper function to create consistent metadata structure
export function createMetadata({
  title,
  description,
  path = '',
  keywords = [],
  image = '/images/og-image.jpg',
  type = 'website',
}: {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  image?: string;
  type?: 'website' | 'article';
}): Metadata {
  const imageUrl = getImageUrl(image);
  const url = getCanonicalUrl(path);
  
  return {
    title,
    description,
    keywords: [
      'Web Development', 
      'Digital Marketing', 
      'E-commerce Solutions', 
      'SEO', 
      'Website Design', 
      'Business Growth',
      ...keywords
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: 'Digital Marketing & Web Development Agency',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}