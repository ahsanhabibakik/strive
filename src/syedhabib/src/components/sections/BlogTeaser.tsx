'use client';

import Link from "next/link";
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime?: string;
  tags?: string[];
  author?: string;
  featured?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function BlogTeaser({ posts }: { posts: Post[] }) {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-accent/5 via-background to-secondary/10 relative overflow-hidden" id="blog">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-small-black dark:bg-grid-small-white opacity-20" />
      <div className="absolute top-10 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      
      <div className="container max-w-7xl mx-auto text-center px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 md:mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
          >
            <BookOpen className="w-4 h-4" />
            Latest Insights
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gradient-primary">
            From the Blog
          </h2>
          
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Thoughts on web development, digital marketing, and the latest tech trends. 
            Sharing knowledge and insights from my journey.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-12"
        >
          {posts.slice(0, 6).map((post) => (
            <motion.article
              key={post.slug}
              variants={cardVariants}
              className="group h-full"
            >
              <Link href={`/blog/${post.slug}`} className="block h-full">
                <div className="h-full bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 transition-all duration-500 group relative">
                  {/* Featured Badge */}
                  {post.featured && (
                                         <div className="absolute top-4 left-4 z-10">
                       <div className="bg-primary/90 text-primary-foreground px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                         <Sparkles className="w-3 h-3" />
                         Featured
                       </div>
                     </div>
                  )}
                  
                  {/* Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Blog Image Placeholder */}
                  <div className="relative aspect-video bg-gradient-to-br from-primary/20 via-purple-500/20 to-blue-500/20 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="text-primary/60"
                    >
                      <BookOpen className="w-12 h-12" />
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
                  </div>
                  
                  <div className="p-6 relative">
                    {/* Meta Information */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <time dateTime={post.date}>
                          {new Date(post.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </time>
                      </div>
                      {post.readingTime && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {post.readingTime}
                          </div>
                        </>
                      )}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-lg md:text-xl font-bold group-hover:text-primary transition-colors mb-3 line-clamp-2 leading-tight">
                      {post.title}
                    </h3>
                    
                    {/* Excerpt */}
                    <p className="text-muted-foreground line-clamp-3 mb-4 text-sm leading-relaxed">
                      {post.excerpt}
                    </p>
                    
                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {post.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs px-2 py-1">
                            {tag}
                          </Badge>
                        ))}
                        {post.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs px-2 py-1">
                            +{post.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    {/* Read More */}
                    <div className="flex items-center gap-2 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300">
                      Read More
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  </div>
                  
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>

        {/* View All Posts CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              asChild
              size="lg"
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href="/blog" className="flex items-center gap-2">
                View All Posts
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </Link>
            </Button>
          </motion.div>
          
          <p className="text-sm text-muted-foreground mt-4">
            {posts.length} {posts.length === 1 ? 'article' : 'articles'} published
          </p>
        </motion.div>
      </div>
    </section>
  );
}
