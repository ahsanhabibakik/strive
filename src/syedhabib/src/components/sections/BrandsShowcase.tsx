'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const brands = [
  {
    name: 'Rupomoti',
    logo: '/logos/rupomoti.png',
    description: 'Jewelry Brand',
    achievement: 'Brand Development',
    growth: 'Social Media Presence',
    link: 'https://rupomoti.com',
    color: 'from-pink-500 to-rose-500'
  },
  {
    name: 'Qalbbox',
    logo: '/logos/qalbbox.png',
    description: 'Gifting Platform',
    achievement: 'E-commerce Website',
    growth: 'Product Showcase',
    link: 'https://qalbbox.com',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    name: 'Ebrikkho',
    logo: '/logos/ebrikkho.png',
    description: 'Plant Business',
    achievement: 'Website Development',
    growth: 'Digital Presence',
    link: 'https://ebrikkho.com',
    color: 'from-green-500 to-emerald-500'
  }
];


export function BrandsShowcase() {
  return (
    <section className="py-10 sm:py-16 bg-muted/30">
      <div className="container px-4 mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Projects I&apos;ve Worked On
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Here are some of the projects and brands I&apos;ve helped develop through web development, design, and digital presence creation.
          </p>
        </motion.div>

        {/* Brands Grid - Horizontal scrolling on mobile */}
        <div className="flex flex-nowrap overflow-x-auto pb-6 sm:pb-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-16 sm:overflow-visible">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group min-w-[280px] sm:min-w-0 mr-4 sm:mr-0"
            >
              <Link href={`/projects/${brand.name.toLowerCase()}`} className="block h-full">
                <div className="bg-background rounded-lg border p-5 sm:p-6 hover:shadow-lg hover:border-primary/50 transition-all h-full">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4">
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={brand.logo}
                        alt={`${brand.name} logo`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-base sm:text-lg group-hover:text-primary transition-colors">{brand.name}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">{brand.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-xs sm:text-sm text-muted-foreground flex-shrink-0">Achievement:</span>
                      <span className="text-xs sm:text-sm font-medium truncate">{brand.achievement}</span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-xs sm:text-sm text-muted-foreground flex-shrink-0">Growth:</span>
                      <span className="text-xs sm:text-sm font-medium text-green-600 truncate">{brand.growth}</span>
                    </div>
                  </div>

                  <div 
                    className="inline-flex items-center gap-1 text-xs sm:text-sm text-primary"
                  >
                    View Project Details
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}