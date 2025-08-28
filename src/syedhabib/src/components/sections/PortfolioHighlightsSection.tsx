"use client";

import Image from 'next/image';

const projects = [
  {
    image: "/projects/ecommerce.jpg",
    title: "E-commerce Store & Social Media",
    description: "A fast, mobile-first online store with integrated Facebook/Instagram presence for a local business.",
    link: "/projects/ecommerce",
    category: "E-commerce"
  },
  {
    image: "/projects/portfolio.jpg",
    title: "Personal Portfolio & Blog",
    description: "A modern, SEO-ready portfolio and blog for a digital creator, with easy content management.",
    link: "/projects/portfolio",
    category: "Portfolio"
  },
  {
    image: "/projects/facebook-ads.jpg",
    title: "Marketing Funnel & Automation",
    description: "Landing page, ad funnel, and AI-powered automation for a startup’s lead generation.",
    link: "/projects/facebook-ads",
    category: "Marketing"
  },
];

export default function PortfolioHighlightsSection() {
  return (
    <section className="py-8 sm:py-12 md:py-20 bg-gradient-to-br from-background via-accent/5 to-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            Portfolio Highlights
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base sm:text-lg md:text-xl">
            A few examples of how we help clients grow online.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 max-w-7xl mx-auto">
          {projects.map((project) => (
            <a
              key={project.title}
              href={project.link}
              className="group flex flex-col bg-card/70 rounded-2xl p-0 border border-border/20 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-2"
            >
              <div className="aspect-w-16 aspect-h-9 w-full bg-muted/30 relative overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-block px-3 py-1 text-sm bg-primary/90 text-primary-foreground rounded-lg font-medium">
                    {project.category}
                  </span>
                </div>
              </div>
              <div className="p-6 sm:p-8 flex-1">
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4 text-foreground group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-4 flex-1 leading-relaxed">
                  {project.description}
                </p>
                <span className="text-primary text-sm sm:text-base font-medium mt-auto group-hover:translate-x-1 transition-transform duration-300">View Project →</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
} 