'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { blogPosts } from '@/data/blog-posts';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  ArrowRight, 
  BookOpen, 
  Sparkles,
  TrendingUp,
  Users,
  Eye
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 20
    }
  },
};

const stats = [
  { icon: BookOpen, value: '15+', label: 'Articles' },
  { icon: Users, value: '500+', label: 'Readers' },
  { icon: TrendingUp, value: '95%', label: 'Helpful' },
];

export default function BlogSection() {
  // Get the 3 most recent blog posts
  const featuredPosts = blogPosts.slice(0, 3);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-background via-accent/5 to-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-small-black dark:bg-grid-small-white opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-transparent to-background/90" />
      
      <div className="container px-4 mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
          >
            <BookOpen className="w-4 h-4" />
            Blog & Insights
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            Learn & Get Inspired
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8 px-4 text-base md:text-lg leading-relaxed">
            Practical insights about web development, business growth, and digital marketing. 
            Real experiences and tips to help you succeed.
          </p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 md:gap-8 mb-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-2 bg-background/60 backdrop-blur-sm rounded-lg px-3 py-2 border border-border/50"
              >
                <stat.icon className="w-4 h-4 text-primary" />
                <div className="text-left">
                  <div className="text-sm font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12"
        >
          {featuredPosts.map((post, index) => (
            <motion.div key={post.slug} variants={itemVariants}>
              <Card className="group h-full overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
                <Link href={`/blog/${post.slug}`} className="block h-full">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary/90 text-white border-0 text-xs">
                        {index === 0 ? 'Latest' : 'Popular'}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/90 rounded-full p-2">
                        <ArrowRight className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 md:p-6 flex flex-col flex-1">
                    {/* Meta Info */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <time dateTime={post.date}>
                          {new Date(post.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </time>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{post.readingTime}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>124 views</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg md:text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs bg-primary/5 border-primary/20 text-primary">
                          {tag}
                        </Badge>
                      ))}
                      {post.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{post.tags.length - 2} more
                        </Badge>
                      )}
                    </div>

                    {/* Read More */}
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
                      <span className="text-sm font-medium text-primary group-hover:text-primary/80 transition-colors">
                        Read More
                      </span>
                      <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Why Read My Blog Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {[
            {
              icon: Sparkles,
              title: 'Real Experience',
              description: 'No fluff, just practical insights from real projects and client work.'
            },
            {
              icon: TrendingUp,
              title: 'Stay Updated',
              description: 'Latest trends and best practices in web development and digital marketing.'
            },
            {
              icon: Users,
              title: 'Community Focused',
              description: 'Written with fellow developers and business owners in mind.'
            }
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Card className="p-6 text-center bg-card/30 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300">
                <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-4">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Card className="p-6 md:p-8 bg-gradient-to-r from-primary/5 via-background to-primary/5 border-primary/20 max-w-2xl mx-auto">
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">
              Want More Insights?
            </h3>
            <p className="text-sm md:text-base text-muted-foreground mb-6 max-w-lg mx-auto">
              Browse all articles for in-depth tutorials, case studies, and industry insights 
              that can help grow your business and skills.
            </p>
            <Button size="default" className="bg-gradient-to-r from-primary to-blue-600" asChild>
              <Link href="/blog">
                View All Articles
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
