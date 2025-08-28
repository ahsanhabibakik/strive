// src/app/blog/[slug]/page.tsx

'use client';  // Mark this file as client-side

import { useState, useEffect, useCallback } from 'react';
import './blog-post.css'; // Make sure to include your CSS for styling

interface Heading {
  title: string;
  level: number;
  id: string;
}

interface BlogPostProps {
  post: {
    content: string;
    data: {
      title: string;
      date: string;
      [key: string]: string;
    };
    readingTime: number;
    headings: Heading[];
  };
}

// Client-side component that renders the blog post and its TOC
export default function BlogPostClient({ post }: BlogPostProps) {
  const { content, data, readingTime, headings } = post;
  const [activeHeading, setActiveHeading] = useState<string | null>(null);

  // Function to handle scroll and update active heading
  const handleScroll = useCallback(() => {
    // Don't process if there are no headings
    if (!headings || headings.length === 0) return;

    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      const headingElements = headings.map(h => document.getElementById(h.id));
      const headingPositions = headingElements.map(el => 
        el ? el.getBoundingClientRect().top : Infinity
      );
      
      const activeIndex = headingPositions.findIndex(pos => pos > 100); // Add offset for better UX
      if (activeIndex === -1) {
        setActiveHeading(headings[headings.length - 1].id);
      } else if (activeIndex > 0) {
        setActiveHeading(headings[activeIndex - 1].id);
      } else {
        setActiveHeading(headings[0].id);
      }
    });
  }, [headings]);

  // Add scroll event listener with cleanup
  useEffect(() => {
    if (typeof window !== 'undefined' && headings && headings.length > 0) {
      window.addEventListener('scroll', handleScroll);
      // Initial check for active heading
      handleScroll();
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [headings, handleScroll]); // Add handleScroll as a dependency

  return (
    <main className="bg-gray-50 text-gray-800 pb-24 flex gap-12 flex-wrap">
      {/* Sticky Table of Contents (TOC) - Only show if there are headings */}
      {headings && headings.length > 0 && (
        <aside className="lg:block sticky top-20 max-w-xs self-start px-6 py-4 bg-white shadow-lg rounded-lg mb-4 lg:mb-0">
          <h3 className="text-xl font-semibold mb-4">Table of Contents</h3>
          <ul className="space-y-2 mt-4">
            {headings.map((heading) => (
              <li key={heading.id} className={`pl-${heading.level * 2}`}>
                <a 
                  href={`#${heading.id}`} 
                  className={`text-gray-900 hover:text-blue-500 transition-all duration-200 ${
                    activeHeading === heading.id ? 'text-blue-500 font-medium' : ''
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {heading.title}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      )}

      {/* Blog Content */}
      <section className={`flex-1 max-w-4xl mx-auto px-6 ${!headings || headings.length === 0 ? 'w-full' : ''}`}>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-50 via-white to-slate-100 py-24 mb-16 border-b shadow-sm">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
              {data.title}
            </h1>
            <p className="text-gray-600 text-sm mt-2">{data.date} · 📖 {readingTime} min read</p>
          </div>
        </section>

        {/* Blog Content */}
        <article 
          className="prose prose-lg dark:prose-invert max-w-full mx-auto text-gray-900 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </section>
    </main>
  );
}
