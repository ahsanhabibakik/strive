"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EnhancedBeforeAfter } from "@/components/sections/EnhancedBeforeAfter";
import { BasicProcessTimeline } from "@/components/sections/BasicProcessTimeline";
import { BasicPricing } from "@/components/sections/BasicPricing";
import { EnhancedHero } from "@/components/sections/EnhancedHero";
import { BrandsShowcase } from "@/components/sections/BrandsShowcase";
import HomePageSchema from "@/components/seo/HomePageSchema";

export default function HomePage() {
  const services = [
    {
      name: 'Web Development',
      description: 'Custom websites that convert visitors into customers.',
      url: 'https://syedhabib.com/services/website-development'
    },
    {
      name: 'Web Applications',
      description: 'Custom web apps built with modern technologies.',
      url: 'https://syedhabib.com/services/website-development'
    },
    {
      name: 'E-Commerce',
      description: 'Online stores that drive sales and simplify management.',
      url: 'https://syedhabib.com/services/ecommerce-solutions'
    }
  ];

  return (
    <main className="min-h-screen">
      {/* SEO Schema */}
      <HomePageSchema services={services} />
      
      {/* Enhanced Hero Section with SVG Dashboard */}
      <EnhancedHero />

      {/* Brands Showcase - Rupomoti, Qalbbox, Ebrikkho */}
      <BrandsShowcase />

      {/* Services Section */}
      <section className="py-10 sm:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Our Services</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="border p-4 sm:p-6 rounded-lg hover:border-primary/30 transition-colors">
              <h3 className="text-lg sm:text-xl font-bold mb-2">Web Development</h3>
              <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                Custom websites that convert visitors into customers.
              </p>
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href="/services">Learn More</Link>
              </Button>
            </div>

            <div className="border p-4 sm:p-6 rounded-lg hover:border-primary/30 transition-colors">
              <h3 className="text-lg sm:text-xl font-bold mb-2">Web Applications</h3>
              <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                Custom web apps built with modern technologies.
              </p>
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href="/services">Learn More</Link>
              </Button>
            </div>

            <div className="border p-4 sm:p-6 rounded-lg hover:border-primary/30 transition-colors sm:col-span-2 lg:col-span-1">
              <h3 className="text-lg sm:text-xl font-bold mb-2">E-Commerce</h3>
              <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                Online stores that drive sales and simplify management.
              </p>
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href="/services">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <BasicProcessTimeline />

      {/* Before/After Showcase with SVG Examples */}
      <EnhancedBeforeAfter />

      {/* Pricing Section */}
      <BasicPricing />

      {/* Call to Action */}
      <section className="py-10 sm:py-16 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
            Ready to Grow Your Business?
          </h2>
          <p className="text-sm sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
            Book your free 30-minute consultation today and let's discuss your
            website or web application project.
          </p>
          <Button asChild size="lg" className="w-full sm:w-auto px-4 sm:px-8">
            <Link href="/contact">Get a Free Consultation</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
