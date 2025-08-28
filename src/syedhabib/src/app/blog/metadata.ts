import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Digital Marketing & Web Development Blog | Expert Insights & Tips',
  description: 'Expert insights, tips, and strategies for digital marketing and web development to help grow your business online.',
  keywords: [
    'Digital Marketing Blog', 
    'Web Development Tips', 
    'SEO Strategies', 
    'Facebook Ads Guide', 
    'E-commerce Development', 
    'Business Growth Tips', 
    'Marketing ROI', 
    'Web Design Trends'
  ],
  alternates: {
    canonical: 'https://syedhabib.com/blog',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://syedhabib.com/blog',
    title: 'Digital Marketing & Web Development Blog | Expert Insights & Tips',
    description: 'Expert insights, tips, and strategies for digital marketing and web development to help grow your business online.',
    siteName: 'Digital Marketing & Web Development Agency',
    images: [
      {
        url: 'https://syedhabib.com/images/blog-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Digital Marketing & Web Development Blog',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Marketing & Web Development Blog | Expert Insights & Tips',
    description: 'Expert insights, tips, and strategies for digital marketing and web development to help grow your business online.',
    creator: '@ahsanhabibakik',
    images: ['https://syedhabib.com/images/blog-og-image.jpg'],
  }
};