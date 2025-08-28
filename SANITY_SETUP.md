# 🎨 SANITY CMS SETUP GUIDE

> **Complete Sanity Studio integration for content management**

## 🚀 QUICK SETUP (5 minutes)

### Step 1: Create Sanity Project
```bash
# Install Sanity CLI globally
npm install -g @sanity/cli

# Create new Sanity project
sanity init

# Follow prompts:
# - Login to Sanity
# - Create new project or use existing
# - Choose "Blog" template (optional)
# - Use TypeScript: Yes
```

### Step 2: Configure Environment Variables
```bash
# Add to .env.local
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-token-here
```

### Step 3: Deploy Sanity Studio
```bash
# Build and deploy Sanity Studio
npm run build
sanity deploy

# Your studio will be available at:
# https://your-project-id.sanity.studio
```

## 📁 PROJECT STRUCTURE

```
sanity/
├── schemas/
│   ├── index.ts          # Schema exports
│   ├── blogPost.ts       # Blog post schema
│   ├── author.ts         # Author schema
│   └── category.ts       # Category schema
├── lib/
│   ├── client.ts         # Sanity client
│   └── queries.ts        # GROQ queries
sanity.config.ts          # Sanity configuration
sanity.cli.ts            # CLI configuration (optional)
```

## 🔧 CONFIGURATION FILES

### sanity.config.ts (Already included)
```typescript
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemas } from "./sanity/schemas";

export default defineConfig({
  name: "strive-cms",
  title: "Strive CMS",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  
  plugins: [
    structureTool(),
    visionTool(), // GROQ query testing tool
  ],
  
  schema: {
    types: schemas,
  },
  
  // Studio customization
  studio: {
    components: {
      logo: () => "Strive CMS",
    },
  },
});
```

### Sanity Client (src/lib/sanity.ts)
```typescript
import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  useCdn: process.env.NODE_ENV === "production",
  token: process.env.SANITY_API_TOKEN, // Only for write operations
});

// Image URL builder
const builder = imageUrlBuilder(client);
export const urlFor = (source: any) => builder.image(source);

// Revalidation webhook (for ISR)
export const revalidate = 60; // seconds
```

## 📝 CONTENT SCHEMAS

### Blog Post Schema (sanity/schemas/blogPost.ts)
```typescript
import { defineType, defineField } from "sanity";

export const blogPost = defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().max(100),
    }),
    
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    
    defineField({
      name: "excerpt", 
      title: "Excerpt",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(200),
    }),
    
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative text",
              validation: (Rule) => Rule.required(),
            },
          ],
        },
        // Custom blocks can be added here
        {
          type: "object",
          name: "codeBlock",
          title: "Code Block",
          fields: [
            {
              name: "language",
              type: "string",
              title: "Language",
              options: {
                list: ["javascript", "typescript", "css", "html", "bash"],
              },
            },
            {
              name: "code",
              type: "text",
              title: "Code",
            },
          ],
        },
      ],
    }),
    
    defineField({
      name: "featuredImage",
      title: "Featured Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string", 
          title: "Alternative text",
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
    
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    
    defineField({
      name: "author",
      title: "Author", 
      type: "reference",
      to: [{ type: "author" }],
      validation: (Rule) => Rule.required(),
    }),
    
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
    }),
    
    defineField({
      name: "tags",
      title: "Tags",
      type: "array", 
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    
    defineField({
      name: "readTime",
      title: "Reading Time (minutes)",
      type: "number",
      validation: (Rule) => Rule.min(1).max(60),
    }),
    
    defineField({
      name: "featured",
      title: "Featured Post",
      type: "boolean",
      initialValue: false,
    }),
    
    defineField({
      name: "seo",
      title: "SEO Settings",
      type: "object",
      fields: [
        {
          name: "metaTitle",
          title: "Meta Title", 
          type: "string",
          validation: (Rule) => Rule.max(60),
        },
        {
          name: "metaDescription",
          title: "Meta Description",
          type: "text",
          rows: 3,
          validation: (Rule) => Rule.max(160),
        },
        {
          name: "keywords",
          title: "Keywords",
          type: "array",
          of: [{ type: "string" }],
        },
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
  ],
  
  preview: {
    select: {
      title: "title",
      author: "author.name", 
      media: "featuredImage",
      published: "publishedAt",
    },
    prepare({ title, author, media, published }) {
      return {
        title,
        subtitle: `by ${author} • ${new Date(published).toLocaleDateString()}`,
        media,
      };
    },
  },
  
  orderings: [
    {
      title: "Published Date, New",
      name: "publishedDateDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    {
      title: "Published Date, Old", 
      name: "publishedDateAsc",
      by: [{ field: "publishedAt", direction: "asc" }],
    },
  ],
});
```

### Author Schema (sanity/schemas/author.ts)
```typescript
import { defineType, defineField } from "sanity";

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string", 
      validation: (Rule) => Rule.required(),
    }),
    
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (Rule) => Rule.required(),
    }),
    
    defineField({
      name: "image",
      title: "Profile Image",
      type: "image",
      options: { hotspot: true },
    }),
    
    defineField({
      name: "bio",
      title: "Bio",
      type: "text",
      rows: 4,
    }),
    
    defineField({
      name: "email",
      title: "Email",
      type: "email",
    }),
    
    defineField({
      name: "social",
      title: "Social Links",
      type: "object",
      fields: [
        { name: "twitter", title: "Twitter", type: "url" },
        { name: "linkedin", title: "LinkedIn", type: "url" },
        { name: "github", title: "GitHub", type: "url" },
        { name: "website", title: "Website", type: "url" },
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
  ],
  
  preview: {
    select: {
      title: "name",
      media: "image",
      email: "email",
    },
    prepare({ title, media, email }) {
      return {
        title,
        subtitle: email,
        media,
      };
    },
  },
});
```

## 🔍 GROQ QUERIES

### Common Queries (src/lib/sanity-queries.ts)
```typescript
// Blog post queries
export const blogPostsQuery = `
  *[_type == "blogPost" && publishedAt < now()] 
  | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    readTime,
    featured,
    author->{
      name,
      slug,
      image
    },
    categories[]->{
      title,
      slug,
      color
    },
    featuredImage{
      asset,
      alt
    },
    tags
  }
`;

export const blogPostBySlugQuery = `
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    slug, 
    content,
    excerpt,
    publishedAt,
    readTime,
    author->{
      name,
      slug,
      image,
      bio,
      social
    },
    categories[]->{
      title,
      slug,
      color
    },
    featuredImage{
      asset,
      alt
    },
    tags,
    seo
  }
`;

export const featuredPostsQuery = `
  *[_type == "blogPost" && featured == true && publishedAt < now()] 
  | order(publishedAt desc) [0...3] {
    _id,
    title,
    slug,
    excerpt,
    featuredImage{
      asset,
      alt
    },
    author->{
      name,
      image
    }
  }
`;

export const authorBySlugQuery = `
  *[_type == "author" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    image,
    bio,
    email,
    social,
    "posts": *[_type == "blogPost" && references(^._id)] 
    | order(publishedAt desc) {
      title,
      slug,
      excerpt,
      publishedAt,
      featuredImage
    }
  }
`;

export const categoriesQuery = `
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    color,
    "postCount": count(*[_type == "blogPost" && references(^._id)])
  }
`;

export const postsByCategoryQuery = `
  *[_type == "blogPost" && references(*[_type == "category" && slug.current == $categorySlug]._id)]
  | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    featuredImage,
    author->{
      name,
      image
    }
  }
`;

// Sitemap query
export const sitemapQuery = `
  {
    "posts": *[_type == "blogPost" && publishedAt < now()] {
      slug,
      publishedAt
    },
    "authors": *[_type == "author"] {
      slug
    },
    "categories": *[_type == "category"] {
      slug
    }
  }
`;
```

## 🎨 STUDIO CUSTOMIZATION

### Custom Studio Components
```typescript
// sanity/components/CustomLogo.tsx
export const CustomLogo = () => (
  <div style={{ padding: '1rem' }}>
    <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Strive CMS</h2>
  </div>
);

// sanity/structure/index.ts - Custom studio structure
export const structure = (S: any) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Blog Posts')
        .child(
          S.documentTypeList('blogPost')
            .title('Blog Posts')
            .filter('_type == "blogPost"')
            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
        ),
      
      S.listItem()
        .title('Featured Posts')
        .child(
          S.documentList()
            .title('Featured Posts')
            .filter('_type == "blogPost" && featured == true')
        ),
      
      S.divider(),
      
      S.listItem()
        .title('Authors')
        .child(S.documentTypeList('author')),
        
      S.listItem()
        .title('Categories')
        .child(S.documentTypeList('category')),
    ]);
```

## 🔄 ISR & REVALIDATION

### Incremental Static Regeneration
```typescript
// app/blog/page.tsx - ISR for blog listing
export const revalidate = 3600; // Revalidate every hour

export default async function BlogPage() {
  const posts = await client.fetch(blogPostsQuery);
  
  return <BlogListing posts={posts} />;
}

// app/blog/[slug]/page.tsx - ISR for individual posts  
export const revalidate = 86400; // Revalidate daily

export async function generateStaticParams() {
  const slugs = await client.fetch(`
    *[_type == "blogPost" && publishedAt < now()]{ "slug": slug.current }
  `);
  
  return slugs;
}
```

### Webhook Revalidation
```typescript
// app/api/revalidate/route.ts - Webhook for live updates
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  
  if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return Response.json({ message: 'Invalid secret' }, { status: 401 });
  }
  
  const body = await request.json();
  const { _type, slug } = body;
  
  try {
    // Revalidate based on content type
    if (_type === 'blogPost') {
      revalidatePath('/blog');
      if (slug?.current) {
        revalidatePath(`/blog/${slug.current}`);
      }
    }
    
    if (_type === 'author') {
      revalidatePath('/blog');
      if (slug?.current) {
        revalidatePath(`/blog/author/${slug.current}`);
      }
    }
    
    return Response.json({ revalidated: true });
  } catch (err) {
    return Response.json({ message: 'Error revalidating' }, { status: 500 });
  }
}
```

## 🚀 DEPLOYMENT

### Sanity Studio Deployment
```bash
# Deploy to Sanity hosting (free)
sanity deploy

# Or deploy to Vercel/Netlify as a separate site
npm run build
# Deploy build folder to your hosting provider
```

### Production Environment Setup
```bash
# Production environment variables
NEXT_PUBLIC_SANITY_PROJECT_ID=abc123
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=sk_test_... # Write token for webhooks
SANITY_WEBHOOK_SECRET=your_webhook_secret
```

## 📊 ANALYTICS INTEGRATION

### Track Content Performance
```typescript
// Track blog post views
export const trackBlogPostView = (postSlug: string, postTitle: string) => {
  trackEvent('Blog Post Viewed', {
    category: 'content',
    action: 'view_post',
    label: postSlug,
    title: postTitle
  });
};

// Track author page views
export const trackAuthorView = (authorSlug: string, authorName: string) => {
  trackEvent('Author Page Viewed', {
    category: 'content', 
    action: 'view_author',
    label: authorSlug,
    name: authorName
  });
};
```

## 🔧 MAINTENANCE

### Content Backup
```bash
# Export all content
sanity dataset export production backup.tar.gz

# Import content
sanity dataset import backup.tar.gz production
```

### Schema Migration
```bash
# When updating schemas, use migrations
sanity exec migrations/addNewField.js --with-user-token
```

## 📋 TROUBLESHOOTING

### Common Issues
1. **CORS Errors**: Add domain to Sanity CORS settings
2. **Token Permissions**: Ensure API token has correct permissions
3. **ISR Not Working**: Check revalidation webhooks
4. **Images Not Loading**: Verify image domains in next.config.ts

### Debug Mode
```typescript
// Enable debug mode in development
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false, // Disable CDN for debugging
  perspective: 'published', // or 'previewDrafts'
});
```

This setup provides a complete, production-ready CMS integration for your million-user website!