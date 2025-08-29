'use client';

import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const faqs = [
  {
    id: 1,
    question: 'What\'s included in the Strive starter template?',
    answer: 'Strive includes everything you need to launch a SaaS: authentication with NextAuth.js, Stripe billing integration, analytics dashboard, user management with RBAC, API key management, notification system, admin settings, and more. It\'s built with Next.js 15, TypeScript, and Tailwind CSS v4.',
  },
  {
    id: 2,
    question: 'Do I need to know how to code to use this template?',
    answer: 'Yes, this is a developer-focused starter template. You\'ll need knowledge of React, Next.js, and TypeScript to customize and extend the template. However, all the complex integrations (auth, billing, etc.) are already implemented for you.',
  },
  {
    id: 3,
    question: 'What databases and services are supported?',
    answer: 'The template uses MongoDB as the primary database with Mongoose ODM. For services, it integrates with Stripe for payments, Resend for emails, Sentry for error tracking, and is optimized for deployment on Vercel.',
  },
  {
    id: 4,
    question: 'Can I customize the design and branding?',
    answer: 'Absolutely! The entire UI is built with Tailwind CSS v4 and custom components. You can easily customize colors, fonts, layouts, and add your own branding. All components are well-structured and documented.',
  },
  {
    id: 5,
    question: 'Is there ongoing support and updates?',
    answer: 'The template includes comprehensive documentation and examples. While we don\'t provide individual support, the codebase is well-commented and follows industry best practices. Updates may be released periodically.',
  },
  {
    id: 6,
    question: 'What are the deployment requirements?',
    answer: 'The template is optimized for deployment on Vercel but can be deployed anywhere Next.js is supported. You\'ll need accounts with MongoDB, Stripe, Resend, and Sentry for full functionality. Environment variables and deployment guides are included.',
  },
  {
    id: 7,
    question: 'Can I use this for client projects?',
    answer: 'Yes! Once purchased, you can use the template for unlimited personal and client projects. You can modify, extend, and rebrand it as needed. However, you cannot resell or redistribute the template itself.',
  },
  {
    id: 8,
    question: 'What\'s the difference between the pricing tiers shown?',
    answer: 'The pricing tiers shown are examples for your SaaS application, not for the template itself. They demonstrate how to implement different subscription levels with varying features and limits. You\'ll customize these tiers for your specific use case.',
  },
];

export function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setOpenItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">
            Frequently asked questions
          </h2>
          <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
            {faqs.map((faq) => {
              const isOpen = openItems.includes(faq.id);
              
              return (
                <div key={faq.id} className="pt-6">
                  <dt>
                    <button
                      onClick={() => toggleItem(faq.id)}
                      className="flex w-full items-start justify-between text-left text-gray-900"
                    >
                      <span className="text-base font-semibold leading-7">{faq.question}</span>
                      <span className="ml-6 flex h-7 items-center">
                        <ChevronDownIcon
                          className={`h-6 w-6 transform transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                          aria-hidden="true"
                        />
                      </span>
                    </button>
                  </dt>
                  {isOpen && (
                    <dd className="mt-2 pr-12">
                      <p className="text-base leading-7 text-gray-600">{faq.answer}</p>
                    </dd>
                  )}
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </div>
  );
}