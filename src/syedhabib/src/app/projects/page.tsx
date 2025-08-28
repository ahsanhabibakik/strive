'use client';

import { MouseGradientOverlayOptimized } from '@/components/ui/MouseGradientOverlay';
import ProjectsHero from '@/components/sections/ProjectsHero';
import FilterableProjectGrid from '@/components/sections/FilterableProjectGrid';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import ProjectsIndexSchema from '@/components/seo/ProjectsIndexSchema';

// Enhanced portfolio projects with comprehensive data
const portfolioProjects = [
  {
    id: 'ease',
    name: 'Ease - Mental Wellness',
    category: 'Health & Wellness',
    status: 'Live',
    description: 'Comprehensive anxiety management platform with mood tracking, guided exercises, and multilingual support for mental health improvement.',
    capabilities: ['Mood Tracking', 'Guided Exercises', 'Progress Analytics', 'Multilingual Support', 'AI Insights'],
    technologies: ['Next.js 15', 'MongoDB', 'NextAuth', 'Tailwind CSS', 'Chart.js', 'OpenAI API'],
    metrics: {
      value: '85% improvement',
      label: 'in user well-being scores'
    },
    screenshots: {
      thumbnail: '/images/projects/ease-thumb.jpg',
      desktop: '/images/projects/ease-desktop.jpg'
    },
    links: {
      demo: '/projects/ease',
      live: 'https://easeyourmind.vercel.app'
    },
    featured: true,
    createdAt: new Date('2024-01-15'),
    emoji: '🌱'
  },
  {
    id: 'purebite',
    name: 'PureBite E-commerce',
    category: 'E-commerce',
    status: 'Live',
    description: 'Complete e-commerce platform for healthy Bangladeshi snacks with advanced cart, payment processing, and comprehensive admin dashboard.',
    capabilities: ['Shopping Cart', 'Payment Gateway', 'Order Management', 'Admin Dashboard', 'Inventory Control'],
    technologies: ['Next.js 15', 'Prisma', 'PostgreSQL', 'Stripe', 'NextAuth', 'Cloudinary'],
    metrics: {
      value: '₹8.2L+',
      label: 'revenue generated'
    },
    screenshots: {
      thumbnail: '/images/projects/purebite-thumb.jpg',
      desktop: '/images/projects/purebite-desktop.jpg'
    },
    links: {
      demo: '/projects/purebite',
      live: 'https://purebite.vercel.app'
    },
    featured: true,
    createdAt: new Date('2024-02-20'),
    emoji: '🛒'
  },
  {
    id: 'aibud',
    name: 'AI Buddy Platform',
    category: 'AI Technology',
    status: 'Live',
    description: 'AI productivity copilot landing page featuring stunning 3D animations, Ghost CMS integration, and cutting-edge modern design.',
    capabilities: ['3D Animations', 'Ghost CMS', 'Interactive UI', 'Performance Optimized', 'SEO Enhanced'],
    technologies: ['Next.js 15', 'Ghost CMS', 'Three.js', 'Framer Motion', 'TypeScript', 'Tailwind'],
    metrics: {
      value: '40% faster',
      label: 'decision making for users'
    },
    screenshots: {
      thumbnail: '/images/projects/aibud-thumb.jpg',
      desktop: '/images/projects/aibud-desktop.jpg'
    },
    links: {
      demo: '/projects/aibud',
      live: 'https://aibud.ca',
      github: 'https://github.com/aibud-platform'
    },
    featured: true,
    createdAt: new Date('2024-03-10'),
    emoji: '🤖'
  },
  {
    id: 'rupomoti',
    name: 'Rupomoti Jewelry',
    category: 'E-commerce',
    status: 'Live',
    description: 'Elegant jewelry e-commerce platform featuring sophisticated inventory management, order tracking, and premium user experience.',
    capabilities: ['Product Catalog', 'Inventory System', 'Order Tracking', 'Premium UI', 'Customer Portal'],
    technologies: ['Next.js 14', 'Prisma', 'MongoDB', 'NextAuth', 'Cloudinary', 'Stripe'],
    metrics: {
      value: '95%',
      label: 'customer satisfaction'
    },
    screenshots: {
      thumbnail: '/images/projects/rupomoti-thumb.jpg'
    },
    links: {
      live: 'https://rupomoti.com',
      demo: '/projects/rupomoti'
    },
    featured: false,
    createdAt: new Date('2024-04-05'),
    emoji: '💎'
  },
  {
    id: 'edibleworld',
    name: 'EdibleWorld AI',
    category: 'AI Technology',
    status: 'Development',
    description: 'AI-powered food recommendation engine with nutritional analysis, extensive recipe database integration, and personalized meal planning.',
    capabilities: ['AI Recommendations', 'Nutrition Analysis', 'Recipe Database', 'Dietary Planning', 'Health Tracking'],
    technologies: ['Next.js 14', 'OpenAI API', 'Spoonacular API', 'MongoDB', 'Python', 'FastAPI'],
    metrics: {
      value: '10,000+',
      label: 'recipes analyzed'
    },
    screenshots: {
      thumbnail: '/images/projects/edibleworld-thumb.jpg'
    },
    links: {
      demo: '/projects/edibleworld'
    },
    featured: false,
    createdAt: new Date('2024-05-12'),
    emoji: '🍽️'
  },
  {
    id: 'tastejourney',
    name: 'TasteJourney',
    category: 'AI Technology',
    status: 'Completed',
    description: 'Personalized food recommendation system featuring advanced taste profiling, AI-powered suggestions, and social dining features.',
    capabilities: ['Taste Profiling', 'AI Suggestions', 'User Preferences', 'Social Features', 'Restaurant Integration'],
    technologies: ['Next.js 14', 'Qloo API', 'Gemini AI', 'MongoDB', 'Redis', 'Socket.io'],
    metrics: {
      value: '92%',
      label: 'recommendation accuracy'
    },
    screenshots: {
      thumbnail: '/images/projects/tastejourney-thumb.jpg'
    },
    links: {
      demo: '/projects/tastejourney'
    },
    featured: false,
    createdAt: new Date('2024-06-20'),
    emoji: '🎯'
  },
  {
    id: 'smartifier',
    name: 'Smartifier Academy',
    category: 'Education',
    status: 'Live',
    description: 'Comprehensive learning management system with course delivery, student progress tracking, video streaming, and certification management.',
    capabilities: ['Course Management', 'Video Streaming', 'Progress Tracking', 'Certificates', 'Assessment Tools'],
    technologies: ['Next.js 14', 'MongoDB', 'Video Processing', 'NextAuth', 'AWS S3', 'Stripe'],
    metrics: {
      value: '500+',
      label: 'students enrolled'
    },
    screenshots: {
      thumbnail: '/images/projects/smartifier-thumb.jpg'
    },
    links: {
      demo: '/projects/smartifier'
    },
    featured: false,
    createdAt: new Date('2024-07-15'),
    emoji: '🎓'
  },
  {
    id: 'logosolve',
    name: 'LogoSolve Agency',
    category: 'Design',
    status: 'Live',
    description: 'Creative design agency website featuring dynamic portfolio showcase, client collaboration tools, and project management system.',
    capabilities: ['Portfolio Showcase', 'Client Portal', 'Design Tools', 'Collaboration', 'Project Management'],
    technologies: ['Next.js 14', 'Cloudinary', 'Framer Motion', 'Stripe', 'MongoDB', 'Socket.io'],
    metrics: {
      value: '150+',
      label: 'designs delivered'
    },
    screenshots: {
      thumbnail: '/images/projects/logosolve-thumb.jpg'
    },
    links: {
      demo: '/projects/logosolve'
    },
    featured: false,
    createdAt: new Date('2024-08-10'),
    emoji: '🎨'
  }
];

export default function ProjectsPage() {
  // Format projects for schema
  const schemaProjects = portfolioProjects.map(project => ({
    title: project.name,
    description: project.description,
    slug: project.id,
    image: project.screenshots.thumbnail || `/images/projects/${project.id}.jpg`,
    category: project.category
  }));

  return (
    <div className="relative bg-background min-h-screen overflow-hidden">
      {/* Structured Data for SEO */}
      <ProjectsIndexSchema projects={schemaProjects} />
      <BreadcrumbSchema 
        items={[
          { name: "Home", url: "https://syedhabib.com" },
          { name: "Projects", url: "https://syedhabib.com/projects" }
        ]}
      />

      {/* Dynamic mouse-responsive gradient overlay */}
      <MouseGradientOverlayOptimized />
      
      {/* Page content */}
      <div className="relative z-20">
        {/* Hero Section with Featured Project Mosaic */}
        <ProjectsHero />

        {/* Filterable Project Grid */}
        <FilterableProjectGrid projects={portfolioProjects} />

        {/* Footer CTA Section */}
        <section className="py-20 px-4">
          <div className="container max-w-4xl mx-auto text-center">
            <div className="backdrop-blur-xl bg-card/60 border rounded-2xl p-8 lg:p-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                <span className="text-gradient-primary">
                  Ready to Build Something Amazing?
                </span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Transform your ideas into powerful digital solutions. Let&apos;s create something extraordinary together 
                that drives real business results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25">
                  <a href="/contact" className="flex items-center justify-center gap-2">
                    Start Your Project
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
                    </svg>
                  </a>
                </button>
                <button className="border border-border text-foreground hover:bg-muted px-8 py-4 rounded-lg font-semibold transition-all duration-300">
                  <a href="/about" className="flex items-center justify-center gap-2">
                    Learn More
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
                    </svg>
                  </a>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}