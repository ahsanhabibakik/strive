"use client";

import { usePathname } from "next/navigation";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  children?: React.ReactNode;
}

/**
 * SEO component for consistent metadata across pages
 * Improves search engine visibility and social sharing
 *
 * Note: This component is for client-side SEO enhancements.
 * For primary metadata, use the metadata export in your page files.
 */
export function SEO({
  title = "Syed Habib - Web Development Specialist",
  description = "Web Development Specialist helping local businesses grow with modern, high-performance websites and custom web solutions.",
  canonical,
  children,
}: SEOProps) {
  const pathname = usePathname();
  const url = canonical || `https://syedhabib.com${pathname}`;
  // Using title and description for potential future use
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _title = title;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _description = description;

  return (
    <>
      {/* In App Router, we should use the Metadata API for most SEO needs */}
      {/* This component is kept for client-side SEO enhancements only */}
      <link rel="canonical" href={url} />
      {children}
    </>
  );
}
