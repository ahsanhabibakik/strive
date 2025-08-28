import { client } from '../sanity/lib/client'
import { blogPostsQuery, blogPostBySlugQuery } from '../sanity/lib/queries'

export interface SanityBlogPost {
  _id: string
  title: string
  slug: {
    current: string
  }
  excerpt: string
  coverImage: string
  coverImageAlt?: string
  content: unknown[]
  tags: string[]
  readingTime: string
  publishedAt: string
  featured: boolean
}

export async function getAllBlogPosts(): Promise<SanityBlogPost[]> {
  return await client.fetch(blogPostsQuery)
}

export async function getBlogPostBySlug(slug: string): Promise<SanityBlogPost | null> {
  return await client.fetch(blogPostBySlugQuery, { slug })
}