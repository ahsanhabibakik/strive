import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Clock, User } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "Getting Started with Next.js",
    excerpt: "Learn the fundamentals of Next.js and how to build modern web applications.",
    author: "John Doe",
    publishedAt: "2024-01-15",
    readTime: 5,
    slug: "getting-started-nextjs",
  },
  {
    id: 2,
    title: "Authentication Best Practices",
    excerpt: "Secure authentication patterns using NextAuth.js and modern standards.",
    author: "Jane Smith",
    publishedAt: "2024-01-10",
    readTime: 7,
    slug: "auth-best-practices",
  },
];

export default function BlogPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog</h1>
        <p className="text-gray-600">
          Insights and tutorials for modern web development.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">
                {post.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm">
                {post.excerpt}
              </p>
              
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{post.readTime} min</span>
                </div>
              </div>
              
              <Button asChild variant="outline" className="w-full">
                <Link href={`/blog/${post.slug}`}>
                  Read Article
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}