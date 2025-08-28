'use client';

import React from 'react';


import JsonLd from './JsonLd';

export default function LocalBusinessSchema() {
  const localBusinessData = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Digital Marketing & Web Development Agency',
    url: 'https://syedhabib.com',
    logo: 'https://syedhabib.com/images/logo.png',
    image: 'https://syedhabib.com/images/og-image.jpg',
    description: 'Results-driven digital marketing and web development agency helping businesses grow online with custom websites, e-commerce solutions, and strategic marketing campaigns.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Your Street Address',
      addressLocality: 'Dhaka',
      addressRegion: 'Dhaka',
      postalCode: '1000',
      addressCountry: 'Bangladesh'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '23.8103',
      longitude: '90.4125'
    },
    telephone: '+8801518926700',
    email: 'ahabibakik@gmail.com',
    openingHours: [
      'Mo-Fr 09:00-18:00',
      'Sa 10:00-16:00'
    ],
    priceRange: '$$',
    paymentAccepted: ['Credit Card', 'PayPal', 'Bank Transfer'],
    currenciesAccepted: 'USD, BDT',
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: '23.8103',
        longitude: '90.4125'
      },
      geoRadius: '50000'
    },
    sameAs: [
      'https://facebook.com/syedmirhabib',
      'https://instagram.com/ahsanhabibakik'
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Digital Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Website Development',
            description: 'Custom websites that convert visitors into customers.'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Digital Marketing',
            description: 'Results-driven campaigns that generate real ROI.'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'E-commerce Solutions',
            description: 'Online stores that drive sales and simplify management.'
          }
        }
      ]
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      ratingCount: '27',
      bestRating: '5',
      worstRating: '1'
    },
    review: {
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: 'Sarah Johnson'
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
        bestRating: '5',
        worstRating: '1'
      },
      datePublished: '2023-06-15',
      reviewBody: 'The website increased our leads by 40% in the first month. I couldn\'t be happier with the results.'
    }
  };

  return <JsonLd data={localBusinessData} />;
}