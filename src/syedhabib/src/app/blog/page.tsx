'use client';

import { blogPosts } from '@/data/blog-posts';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { NewsletterSubscribe } from '@/components/NewsletterSubscribe';
import BlogIndexSchema from '@/components/seo/BlogIndexSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';

import { Calendar, Clock, Search, ArrowRight, CheckCircle, X } from 'lucide-react';

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter posts based on search
  const filteredPosts = blogPosts.filter((post) => {
    if (!searchQuery) return true;
    
    return post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  // Sort posts by date (newest first)
  const sortedPosts = filteredPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Get featured post (latest) and regular posts
  const featuredPost = sortedPosts[0];
  const regularPosts = sortedPosts.slice(1);

  // Business categories for quick filtering
  const businessCategories = [
    { name: 'Marketing', tag: 'Marketing' },
    { name: 'Web Development', tag: 'Web Development' },
    { name: 'E-commerce', tag: 'E-commerce' }
  ];

  return (
    <main className="min-h-screen py-8 sm:py-12">
      {/* Structured Data for SEO */}
      <BlogIndexSchema posts={blogPosts} />
      <BreadcrumbSchema 
        items={[
          { name: "Home", url: "https://syedhabib.com" },
          { name: "Blog", url: "https://syedhabib.com/blog" }
        ]}
      />
      <div className="container px-4 mx-auto">
        {/* Simplified Header */}
        <div className="text-center mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Business Growth Insights
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-4 sm:mb-6">
            Practical tips and strategies to help your business succeed online.
            No fluff, just actionable advice you can implement today.
          </p>
        </div>

        {/* Business Categories Quick Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 sm:mb-8">
          <Button 
            variant={!searchQuery ? "default" : "outline"}
            onClick={() => setSearchQuery('')}
            size="sm"
            className="text-xs sm:text-sm"
          >
            All Topics
          </Button>
          
          {businessCategories.map((category) => (
            <Button
              key={category.name}
              variant={searchQuery === category.tag ? "default" : "outline"}
              onClick={() => setSearchQuery(category.tag)}
              size="sm"
              className="text-xs sm:text-sm"
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Simplified Search Bar */}
        <div className="mb-8 sm:mb-10">
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search articles..."
              className="pl-10 pr-8 h-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {sortedPosts.length > 0 ? (
          <>
            {/* Featured Article - Mobile Optimized */}
            {featuredPost && !searchQuery && (
              <article className="mb-8 sm:mb-10">
                <Link href={`/blog/${featuredPost.slug}`} className="group block">
                  <Card className="overflow-hidden border hover:border-primary/30 transition-colors">
                    <div className="sm:flex">
                      <div className="relative h-48 sm:h-auto sm:w-1/2">
                        <Image
                          src={featuredPost.coverImage}
                          alt={featuredPost.title}
                          fill
                          className="object-cover"
                          priority
                          sizes="(max-width: 640px) 100vw, 50vw"
                        />
                        <Badge className="absolute top-3 left-3 bg-primary text-xs">
                          Featured
                        </Badge>
                      </div>
                      <div className="p-4 sm:p-6 sm:w-1/2">
                        <div className="flex items-center gap-3 text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="text-xs">
                              {new Date(featuredPost.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="text-xs">{featuredPost.readingTime}</span>
                          </div>
                        </div>
                        
                        <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 group-hover:text-primary transition-colors line-clamp-2">
                          {featuredPost.title}
                        </h2>
                        
                        <p className="text-muted-foreground text-sm mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3">
                          {featuredPost.excerpt}
                        </p>
                        
                        <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                          {featuredPost.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="text-primary font-medium text-sm sm:text-base flex items-center">
                          Read Article
                          <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </article>
            )}

            {/* Articles Grid - Mobile Optimized */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
              {regularPosts.map((post) => (
                <article key={post.slug} className="h-full">
                  <Link href={`/blog/${post.slug}`} className="group block h-full">
                    <Card className="h-full flex flex-col border hover:border-primary/30 transition-colors">
                      <div className="relative aspect-[16/9]">
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover"
                          loading="lazy"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                      <div className="p-3 sm:p-4 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 sm:gap-3 text-xs text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {new Date(post.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{post.readingTime}</span>
                          </div>
                        </div>
                        
                        <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        
                        <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 flex-1">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
                          {post.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-[10px] sm:text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="text-primary text-xs sm:text-sm font-medium flex items-center mt-auto">
                          Read More
                          <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                </article>
              ))}
            </div>
          </>
        ) : (
          /* No Results State - Mobile Optimized */
          <div className="text-center py-8 sm:py-12">
            <div className="bg-background border-2 border-dashed border-muted p-6 sm:p-8 max-w-md mx-auto">
              <Search className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4 opacity-50" />
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">No articles found</h3>
              <p className="text-sm text-muted-foreground mb-4 sm:mb-6">
                We couldn't find any articles matching "{searchQuery}".
              </p>
              <Button
                onClick={() => setSearchQuery('')}
                className="inline-flex items-center gap-2"
              >
                Show all articles
              </Button>
            </div>
          </div>
        )}

        {/* Newsletter Section - Mobile Optimized */}
        <div className="mb-8 sm:mb-12">
          <div className="max-w-3xl mx-auto">
            <NewsletterSubscribe 
              title="Get Business Growth Tips Straight to Your Inbox" 
              description="Join over 500+ business owners receiving actionable strategies every week. Unsubscribe anytime."
              variant="compact"
            />
          </div>
        </div>

        {/* CTA Section - Mobile Optimized */}
        <Card className="p-5 sm:p-8 text-center bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 mt-8 sm:mt-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">Need Help Growing Your Business?</h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 max-w-2xl mx-auto">
            Book a free 30-minute consultation to discuss your specific business challenges.
          </p>
          <Button asChild size="lg" className="w-full sm:w-auto px-4 sm:px-8">
            <Link href="/contact" className="flex items-center justify-center">
              Book Your Free Consultation
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Link>
          </Button>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-4 sm:mt-6 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-1 sm:gap-2">
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
              No obligation
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
              Actionable advice
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
              Custom strategy
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}