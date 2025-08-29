import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Calendar, Clock, User, Search, Filter } from "lucide-react";
import { blogPosts, categories, getFeaturedPosts } from "@/lib/blog/data";

export const metadata: Metadata = {
  title: 'Blog - Strive',
  description: 'Insights, tutorials, and best practices for web development, productivity, and achieving your goals.',
};

export default function BlogPage() {
  const featuredPosts = getFeaturedPosts();
  const allPosts = blogPosts.filter(post => post.published);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Blog</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Insights, tutorials, and best practices for web development, productivity, and achieving your goals.
          </p>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Browse by Category</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/blog/category/${category.slug}`}
                className="group"
              >
                <Badge
                  variant="outline"
                  className="px-4 py-2 hover:bg-gray-100 transition-colors"
                  style={{ borderColor: category.color }}
                >
                  <span style={{ color: category.color }}>
                    {category.name}
                  </span>
                </Badge>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-white">
                  {post.featuredImage && (
                    <div className="aspect-video bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        {post.title.split(' ').slice(0, 2).map(word => word[0]).join('')}
                      </span>
                    </div>
                  )}
                  <CardHeader className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        style={{ backgroundColor: `${post.category.color}10`, color: post.category.color }}
                      >
                        {post.category.name}
                      </Badge>
                      <Badge variant="outline">Featured</Badge>
                    </div>
                    <CardTitle className="text-xl hover:text-indigo-600 transition-colors">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{post.author.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime} min</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button asChild className="w-full">
                      <Link href={`/blog/${post.slug}`}>
                        Read Full Article
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Posts */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">All Posts</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow bg-white">
                <CardHeader className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      style={{ backgroundColor: `${post.category.color}10`, color: post.category.color }}
                    >
                      {post.category.name}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg hover:text-indigo-600 transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{post.author.name}</span>
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
                  
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href={`/blog/${post.slug}`}>
                      Read Article
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Newsletter CTA */}
        <div className="mt-16 bg-indigo-600 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Stay updated with our latest posts
          </h3>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
            Get the latest insights on web development, productivity, and goal achievement delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg border-0 focus:ring-2 focus:ring-indigo-300"
            />
            <Button variant="secondary" className="bg-white text-indigo-600 hover:bg-gray-100">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}