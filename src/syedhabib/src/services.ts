import { Code, Monitor, Users, TrendingUp, Palette } from 'lucide-react';
import React from 'react';

export interface Service {
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  category: 'business' | 'creative';
}

const iconSize = 24; // Size for all icons

const services: Service[] = [
  {
    title: "Website Development",
    description: "Modern, responsive websites that help your business grow online. From simple business sites to complex web applications.",
    icon: React.createElement(Code, { size: iconSize }),
    category: 'business',
    features: [
      "Custom website design",
      "Mobile-friendly responsive design", 
      "Fast loading & SEO optimized",
      "Contact forms & integrations",
      "Admin dashboard included",
      "Free hosting setup guidance"
    ]
  },
  {
    title: "E-commerce Solutions",
    description: "Complete online stores with payment processing, inventory management, and everything you need to sell online successfully.",
    icon: React.createElement(Monitor, { size: iconSize }),
    category: 'business',
    features: [
      "Online store setup",
      "Payment gateway integration",
      "Product catalog management",
      "Order tracking system",
      "Customer accounts",
      "Sales analytics dashboard"
    ]
  },
  {
    title: "Custom Web Applications",
    description: "Tailored web applications built to solve specific business needs with modern technologies and best practices.",
    icon: React.createElement(TrendingUp, { size: iconSize }),
    category: 'business',
    features: [
      "Custom functionality development",
      "API integration",
      "Database design & optimization",
      "User authentication systems",
      "Real-time features",
      "Performance monitoring"
    ]
  },
  {
    title: "Website Maintenance & Support",
    description: "Ongoing website maintenance, updates, security monitoring, and technical support to keep your site running smoothly.",
    icon: React.createElement(Users, { size: iconSize }),
    category: 'business',
    features: [
      "Regular security updates",
      "Performance optimization",
      "Content updates",
      "Bug fixes & troubleshooting",
      "Backup management",
      "Technical support"
    ]
  },
  {
    title: "Web Design & UI/UX",
    description: "Modern, user-focused web design that creates engaging experiences and drives conversions for your business.",
    icon: React.createElement(Palette, { size: iconSize }),
    category: 'creative',
    features: [
      "User experience (UX) design",
      "User interface (UI) design",
      "Wireframing & prototyping",
      "Brand-consistent design systems",
      "Mobile-first design approach",
      "Accessibility compliance"
    ]
  }
];

export default services;