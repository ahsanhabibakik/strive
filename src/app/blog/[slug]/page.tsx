import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, User, ArrowLeft, Share2, BookmarkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getPostBySlug, getRecentPosts, blogPosts } from "@/lib/blog/data";
import { BlogTracker } from "@/components/analytics/BlogTracker";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Post Not Found - Strive",
    };
  }

  return {
    title: post.seo?.metaTitle || `${post.title} - Strive Blog`,
    description: post.seo?.metaDescription || post.excerpt,
    keywords: post.seo?.keywords || post.tags,
    authors: [{ name: post.author.name, url: post.author.social?.website }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      images: post.featuredImage
        ? [
            {
              url: post.featuredImage.url,
              width: post.featuredImage.width,
              height: post.featuredImage.height,
              alt: post.featuredImage.alt,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.featuredImage ? [post.featuredImage.url] : [],
    },
  };
}

export async function generateStaticParams() {
  return blogPosts.map(post => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const recentPosts = getRecentPosts(3).filter(p => p.slug !== post.slug);

  return (
    <>
      <BlogTracker title={post.title} />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
              <Button asChild variant="ghost" size="sm">
                <Link
                  href="/blog"
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Blog
                </Link>
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  style={{
                    backgroundColor: `${post.category.color}10`,
                    color: post.category.color,
                  }}
                >
                  {post.category.name}
                </Badge>
                {post.featured && <Badge variant="outline">Featured</Badge>}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                {post.title}
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">{post.excerpt}</p>

              <div className="flex items-center justify-between pt-6 border-t">
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    {post.author.avatar ? (
                      <Image
                        src={post.author.avatar}
                        alt={post.author.name}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-indigo-600" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{post.author.name}</p>
                      <p className="text-xs text-gray-500">{post.author.bio?.split(".")[0]}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(post.publishedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime} min read</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    <BookmarkIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <article className="lg:col-span-3">
              <div className="prose prose-lg prose-gray max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html: post.content
                      .replace(/\n/g, "<br/>")
                      .replace(
                        /#{1,6} (.*)/g,
                        '<h2 class="text-2xl font-semibold text-gray-900 mt-8 mb-4">$1</h2>'
                      ),
                  }}
                  className="text-gray-700 leading-relaxed"
                />
              </div>

              {/* Tags */}
              <div className="mt-12 pt-8 border-t">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="hover:bg-gray-100 cursor-pointer">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Author Bio */}
              <Card className="mt-8">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {post.author.avatar ? (
                      <Image
                        src={post.author.avatar}
                        alt={post.author.name}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-full"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-indigo-600" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        About {post.author.name}
                      </h3>
                      <p className="text-gray-600 mb-4">{post.author.bio}</p>
                      {post.author.social && (
                        <div className="flex gap-4 text-sm">
                          {post.author.social.twitter && (
                            <a
                              href={`https://twitter.com/${post.author.social.twitter.replace("@", "")}`}
                              className="text-indigo-600 hover:text-indigo-700"
                            >
                              Twitter
                            </a>
                          )}
                          {post.author.social.linkedin && (
                            <a
                              href={`https://linkedin.com/in/${post.author.social.linkedin}`}
                              className="text-indigo-600 hover:text-indigo-700"
                            >
                              LinkedIn
                            </a>
                          )}
                          {post.author.social.github && (
                            <a
                              href={`https://github.com/${post.author.social.github}`}
                              className="text-indigo-600 hover:text-indigo-700"
                            >
                              GitHub
                            </a>
                          )}
                          {post.author.social.website && (
                            <a
                              href={post.author.social.website}
                              className="text-indigo-600 hover:text-indigo-700"
                            >
                              Website
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Recent Posts */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Posts</h3>
                    <div className="space-y-4">
                      {recentPosts.map(recentPost => (
                        <div key={recentPost.id}>
                          <Link
                            href={`/blog/${recentPost.slug}`}
                            className="block hover:text-indigo-600 transition-colors"
                          >
                            <h4 className="font-medium text-sm leading-tight mb-2">
                              {recentPost.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(recentPost.publishedAt).toLocaleDateString()}</span>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Newsletter */}
                <Card className="bg-indigo-50 border-indigo-200">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-indigo-900 mb-2">Stay Updated</h3>
                    <p className="text-sm text-indigo-700 mb-4">
                      Get the latest posts delivered to your inbox.
                    </p>
                    <div className="space-y-3">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full px-3 py-2 text-sm border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <Button size="sm" className="w-full">
                        Subscribe
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
