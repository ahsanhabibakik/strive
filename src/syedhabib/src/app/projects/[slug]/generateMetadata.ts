import { Metadata } from 'next';
import { createMetadata } from '../../metadata';

// Sample project data - in a real app, this would come from a database or CMS
const projectsData = {
  'ecommerce': {
    title: 'E-commerce Platform',
    description: 'Custom online store with seamless checkout and inventory management.',
    client: 'Fashion Retailer',
    result: '43% increase in conversion rate',
  },
  'facebook-campaign': {
    title: 'Facebook Ad Campaign',
    description: 'Strategic ad campaign that delivered qualified leads and measurable ROI.',
    client: 'Local Restaurant',
    result: '150% increase in conversions',
  },
  'restaurant-case-study': {
    title: 'Restaurant Website Redesign',
    description: 'Complete website redesign with online ordering system for a local restaurant.',
    client: 'The Local Bistro',
    result: '156% increase in online orders',
  },
  'retail-case-study': {
    title: 'Retail Store E-commerce Solution',
    description: 'Custom e-commerce website with intuitive product filtering for a retail store.',
    client: 'Urban Boutique',
    result: '43% increase in conversion rate',
  }
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const slug = params.slug;
  const project = projectsData[slug as keyof typeof projectsData];
  
  if (!project) {
    return createMetadata({
      title: 'Project Not Found',
      description: 'Sorry, the project you are looking for doesn\'t exist or has been moved.',
      path: `/projects/${slug}`,
    });
  }
  
  return createMetadata({
    title: `${project.title} Case Study | ${project.result}`,
    description: `See how we helped ${project.client} achieve ${project.result} through our ${project.title.toLowerCase()} solution. ${project.description}`,
    keywords: [
      'Case Study',
      'Client Results',
      'Business Growth',
      'Success Story',
      project.title,
      project.client,
      ...project.description.split(' ').filter(word => word.length > 5)
    ],
    path: `/projects/${slug}`,
    type: 'article',
  });
}