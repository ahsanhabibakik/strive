import { NextResponse } from "next/server";
import { client, blogPostsQuery } from "@/lib/sanity";

export async function GET() {
  try {
    // Try to fetch from Sanity first
    const posts = await client.fetch(blogPostsQuery);
    return NextResponse.json({ posts });
  } catch {
    // If Sanity is not configured, return mock data
    const mockPosts = [
      {
        _id: "1",
        title: "Getting Started with Next.js",
        slug: { current: "getting-started-nextjs" },
        excerpt: "Learn the fundamentals of Next.js and how to build modern web applications.",
        publishedAt: "2024-01-15T00:00:00Z",
        readTime: 5,
        author: {
          name: "John Doe",
          image: null,
        },
        categories: [
          {
            title: "Next.js",
            slug: { current: "nextjs" },
          },
        ],
        featuredImage: null,
      },
      {
        _id: "2",
        title: "Authentication Best Practices",
        slug: { current: "auth-best-practices" },
        excerpt: "Secure authentication patterns using NextAuth.js and modern standards.",
        publishedAt: "2024-01-10T00:00:00Z",
        readTime: 7,
        author: {
          name: "Jane Smith",
          image: null,
        },
        categories: [
          {
            title: "Authentication",
            slug: { current: "authentication" },
          },
        ],
        featuredImage: null,
      },
    ];

    return NextResponse.json({
      posts: mockPosts,
      message: "Using mock data - configure Sanity for dynamic content",
    });
  }
}
