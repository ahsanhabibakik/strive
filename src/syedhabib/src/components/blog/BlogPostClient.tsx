'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { StructuredData, createArticleSchema } from '@/components/seo/StructuredData';
import { 
  Calendar, 
  Clock, 
  Share2, 
  ArrowRight, 
  BookOpen, 
  ThumbsUp, 
  Mail,
  CheckCircle,
  Bookmark
} from 'lucide-react';
import { BlogPost, blogPosts } from '@/data/blog-posts';

interface BlogPostClientProps {
  post: BlogPost;
}

export default function BlogPostClient({ post }: BlogPostClientProps) {
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [popularPosts, setPopularPosts] = useState<BlogPost[]>([]);
  const [estimatedReadTime, setEstimatedReadTime] = useState(post.readingTime);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Track scroll progress
    const updateScrollProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min((window.scrollY / scrollHeight) * 100, 100);
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${progress / 100})`;
      }
    };

    window.addEventListener('scroll', updateScrollProgress);
    
    // Find related posts based on tags
    const related = blogPosts
      .filter(p => p.slug !== post.slug) // Exclude current post
      .filter(p => p.tags.some(tag => post.tags.includes(tag))) // Must share at least one tag
      .slice(0, 3); // Limit to 3 posts
    
    setRelatedPosts(related);
    
    // Get popular posts (could be based on views in a real app)
    // Here we're just using the most recent posts as a stand-in
    const popular = [...blogPosts]
      .filter(p => p.slug !== post.slug) // Exclude current post
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 2); // Limit to 2 posts
    
    setPopularPosts(popular);
    
    // Calculate estimated read time based on content length
    const wordCount = post.content.split(/\s+/).length;
    const readingTimeMinutes = Math.ceil(wordCount / 200); // Assuming 200 words per minute
    setEstimatedReadTime(`${readingTimeMinutes} min read`);
    
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, [post]);

  const sharePost = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Extract primary tag for highlighting
  const primaryTag = post.tags[0];
  
  // Create structured data for SEO
  const articleSchema = createArticleSchema(
    post.title,
    post.coverImage,
    post.date,
    post.date, // Using same date for modified since we don't track modifications
    'Syed Habib',
    'Syed Habib',
    '/logos/logo.png', // Replace with your actual logo path
    post.excerpt
  );

  return (
    <article className="py-12">
      {/* Structured Data for SEO */}
      <StructuredData data={articleSchema} />
      
      {/* Reading Progress Bar */}
      <div
        ref={progressBarRef}
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
      />

      <div className="container px-4">
        <div className="max-w-5xl mx-auto">
          {/* Article Header */}
          <div className="mb-8">
            {/* Primary Tag */}
            <div className="mb-4">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none">
                {primaryTag}
              </Badge>
            </div>
            
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.date} className="text-sm">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </time>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{estimatedReadTime}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto"
                onClick={sharePost}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
            
            {/* Featured Image */}
            <div className="relative aspect-[2/1] mb-8 rounded-lg overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              />
            </div>
          </div>

          {/* Three Column Layout for Content and Sidebar */}
          <div className="grid md:grid-cols-12 gap-8">
            {/* Table of Contents - Desktop Only */}
            <aside className="hidden lg:block lg:col-span-2">
              <div className="sticky top-24">
                <TableOfContents className="pr-4" />
              </div>
            </aside>
            
            {/* Main Content */}
            <div className="md:col-span-8 lg:col-span-7">
              {/* Article Content */}
              <div className="prose dark:prose-invert max-w-none mb-10">
                {post.content}
              </div>
              
              {/* Tags */}
              <div className="mb-8">
                <h3 className="text-sm font-medium mb-2">Topics:</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Social Sharing */}
              <Card className="p-4 mb-8 bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" className="rounded-full">
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Helpful
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full">
                      <Bookmark className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                  <Button variant="outline" size="sm" onClick={sharePost}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </Card>
              
              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-xl font-bold mb-4">Related Articles</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {relatedPosts.map((relatedPost) => (
                      <Link 
                        key={relatedPost.slug} 
                        href={`/blog/${relatedPost.slug}`}
                        className="group"
                      >
                        <Card className="overflow-hidden h-full hover:border-primary/30 transition-colors">
                          <div className="relative aspect-[16/9]">
                            <Image
                              src={relatedPost.coverImage}
                              alt={relatedPost.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 300px"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="font-medium mb-2 group-hover:text-primary transition-colors line-clamp-2">
                              {relatedPost.title}
                            </h3>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              {relatedPost.readingTime}
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Bottom CTA */}
              <Card className="p-6 mt-12 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                <div className="text-center">
                  <h2 className="text-xl font-bold mb-2">Want to Implement These Strategies?</h2>
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    I can help you apply these insights to your business. Book a free consultation today.
                  </p>
                  <Button asChild size="lg" className="px-8">
                    <Link href="/contact" className="flex items-center">
                      Book Your Free Consultation
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                </div>
              </Card>
            </div>
            
            {/* Sidebar */}
            <aside className="md:col-span-4 lg:col-span-3">
              {/* Author Card */}
              <Card className="p-4 mb-6">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto flex items-center justify-center mb-2">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-medium">Syed Habib</h3>
                  <p className="text-xs text-muted-foreground">Digital Solutions Expert</p>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  I help businesses grow online with practical digital solutions and actionable advice.
                </p>
                <Button asChild className="w-full" variant="outline" size="sm">
                  <Link href="/contact">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Me
                  </Link>
                </Button>
              </Card>
              
              {/* Table of Contents - Mobile Only */}
              <div className="lg:hidden mb-6">
                <Card className="p-4">
                  <h3 className="font-medium mb-3">Table of Contents</h3>
                  <TableOfContents />
                </Card>
              </div>
              
              {/* Popular Posts */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Popular Articles</h3>
                <div className="space-y-4">
                  {popularPosts.map((popularPost) => (
                    <Link 
                      key={popularPost.slug} 
                      href={`/blog/${popularPost.slug}`}
                      className="group flex gap-3 items-start"
                    >
                      <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={popularPost.coverImage}
                          alt={popularPost.title}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                          {popularPost.title}
                        </h4>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {popularPost.readingTime}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* CTA Card */}
              <Card className="p-4 bg-primary/5 border-primary/20">
                <h3 className="font-medium mb-2">Need Help With Your Business?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Book a free 30-minute consultation to discuss your specific needs.
                </p>
                <Button asChild className="w-full mb-3">
                  <Link href="/contact">
                    Book Free Consultation
                  </Link>
                </Button>
                <div className="flex items-center text-xs text-muted-foreground">
                  <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                  No obligation, custom solutions
                </div>
              </Card>
              
              {/* Topics */}
              <div className="mt-6">
                <h3 className="font-medium mb-3">Explore Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {['Web Development', 'Marketing', 'E-commerce', 'UI/UX', 'SEO'].map((topic) => (
                    <Link key={topic} href={`/blog?topic=${topic}`}>
                      <Badge variant="outline" className="hover:bg-primary/5">
                        {topic}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </article>
  );
}