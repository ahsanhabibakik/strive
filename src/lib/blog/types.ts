export interface Author {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: Author;
  category: Category;
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
  readTime: number;
  featured: boolean;
  published: boolean;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  featuredImage?: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
}

export interface BlogSearchParams {
  category?: string;
  author?: string;
  tag?: string;
  search?: string;
  page?: number;
  limit?: number;
}