"use client";

import JsonLd from "./seo/JsonLd";

interface ArticleSchemaProps {
  article: {
    title: string;
    description: string;
    url: string;
    image?: string;
    datePublished: string;
    dateModified?: string;
    authorName: string;
    authorUrl?: string;
    publisherName?: string;
    publisherLogo?: string;
    category?: string;
    tags?: string[];
  };
}

export default function ArticleSchema({ article }: ArticleSchemaProps) {
  const articleData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: article.image || "https://syedhabib.com/images/og-image.jpg",
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      "@type": "Person",
      name: article.authorName,
      url: article.authorUrl || "https://syedhabib.com",
    },
    publisher: {
      "@type": "Organization",
      name:
        article.publisherName || "Digital Marketing & Web Development Agency",
      logo: {
        "@type": "ImageObject",
        url: article.publisherLogo || "https://syedhabib.com/images/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": article.url,
    },
    ...(article.category && { articleSection: article.category }),
    ...(article.tags && { keywords: article.tags.join(", ") }),
  };

  return <JsonLd data={articleData} />;
}
