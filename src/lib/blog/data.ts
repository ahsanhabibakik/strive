import { Author, Category, BlogPost } from './types';

// Sample authors
export const authors: Author[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@strive.com',
    bio: 'Senior Software Engineer with 8+ years of experience in full-stack development. Passionate about modern web technologies and user experience.',
    avatar: '/images/authors/john-doe.jpg',
    social: {
      twitter: '@johndoe',
      linkedin: 'johndoe',
      github: 'johndoe',
      website: 'https://johndoe.dev'
    }
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@strive.com',
    bio: 'Product Manager and UX advocate focused on creating meaningful user experiences. Expert in authentication and security best practices.',
    avatar: '/images/authors/jane-smith.jpg',
    social: {
      twitter: '@janesmith',
      linkedin: 'janesmith',
    }
  },
  {
    id: '3',
    name: 'Alex Johnson',
    email: 'alex@strive.com',
    bio: 'DevOps Engineer specializing in cloud architecture and performance optimization. Loves sharing knowledge about scalable systems.',
    avatar: '/images/authors/alex-johnson.jpg',
    social: {
      github: 'alexjohnson',
      website: 'https://alexj.tech'
    }
  }
];

// Sample categories
export const categories: Category[] = [
  {
    id: '1',
    name: 'Development',
    slug: 'development',
    description: 'Web development tutorials, tips, and best practices',
    color: '#3b82f6'
  },
  {
    id: '2',
    name: 'Design',
    slug: 'design',
    description: 'UI/UX design principles and modern design trends',
    color: '#8b5cf6'
  },
  {
    id: '3',
    name: 'Productivity',
    slug: 'productivity',
    description: 'Tips and tools to boost your productivity and achieve your goals',
    color: '#10b981'
  },
  {
    id: '4',
    name: 'Business',
    slug: 'business',
    description: 'Business insights, entrepreneurship, and growth strategies',
    color: '#f59e0b'
  },
  {
    id: '5',
    name: 'Technology',
    slug: 'technology',
    description: 'Latest tech trends, reviews, and industry insights',
    color: '#ef4444'
  }
];

// Sample blog posts
export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Getting Started with Next.js 15: A Complete Guide',
    slug: 'getting-started-nextjs-15',
    excerpt: 'Learn the fundamentals of Next.js 15 and how to build modern, performant web applications with the latest features including App Router, Server Components, and more.',
    content: `
# Getting Started with Next.js 15: A Complete Guide

Next.js 15 is here, and it brings a host of exciting new features that make building modern web applications easier and more performant than ever before. In this comprehensive guide, we'll walk through everything you need to know to get started.

## What's New in Next.js 15

### App Router Stability
The App Router, introduced in Next.js 13, is now stable and production-ready. It offers:
- Better performance through Server Components
- Improved developer experience
- More flexible routing patterns

### Server Components by Default
All components in the app directory are now Server Components by default, which means:
- Better SEO and initial page load times
- Reduced JavaScript bundle size
- Automatic code splitting

## Getting Started

### Installation

First, create a new Next.js project:

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

### Project Structure

With the new App Router, your project structure will look like this:

\`\`\`
app/
├── layout.tsx
├── page.tsx
├── loading.tsx
├── error.tsx
└── not-found.tsx
\`\`\`

## Building Your First Component

Here's a simple example of a Server Component:

\`\`\`tsx
// app/components/UserList.tsx
async function UserList() {
  const users = await fetch('https://api.example.com/users');
  const userData = await users.json();

  return (
    <div>
      <h2>Users</h2>
      {userData.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}

export default UserList;
\`\`\`

## Client Components

When you need interactivity, you can opt into Client Components:

\`\`\`tsx
'use client'

import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
\`\`\`

## Best Practices

1. **Use Server Components by default** - Only use Client Components when you need interactivity
2. **Leverage streaming** - Use loading.tsx files for better UX
3. **Optimize images** - Use the built-in Image component for automatic optimization
4. **Follow the data fetching patterns** - Use the new fetch patterns in Server Components

## Conclusion

Next.js 15 represents a major step forward in React-based web development. With its focus on performance, developer experience, and modern web standards, it's the perfect choice for your next project.

Ready to dive deeper? Check out the [official Next.js documentation](https://nextjs.org/docs) for more advanced topics and examples.
    `,
    author: authors[0],
    category: categories[0],
    tags: ['nextjs', 'react', 'web-development', 'javascript'],
    publishedAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-16T09:30:00Z',
    readTime: 8,
    featured: true,
    published: true,
    seo: {
      metaTitle: 'Getting Started with Next.js 15: Complete Beginner Guide',
      metaDescription: 'Learn Next.js 15 from scratch with this comprehensive guide covering App Router, Server Components, and modern web development best practices.',
      keywords: ['nextjs', 'react', 'web development', 'javascript', 'tutorial', 'guide']
    },
    featuredImage: {
      url: '/images/blog/nextjs-guide.jpg',
      alt: 'Next.js 15 Tutorial Guide',
      width: 1200,
      height: 630
    }
  },
  {
    id: '2',
    title: 'Authentication Best Practices in 2024',
    slug: 'authentication-best-practices-2024',
    excerpt: 'Secure authentication patterns using NextAuth.js, JWT, and modern security standards. Learn how to protect your users and applications.',
    content: `
# Authentication Best Practices in 2024

Authentication is the cornerstone of application security. In this comprehensive guide, we'll explore modern authentication patterns, security best practices, and how to implement them using NextAuth.js.

## Why Authentication Matters

In today's digital landscape, protecting user data is not just important—it's essential. Poor authentication can lead to:
- Data breaches
- Identity theft  
- Regulatory compliance issues
- Loss of user trust

## Modern Authentication Standards

### OAuth 2.0 and OpenID Connect
OAuth 2.0 remains the gold standard for authorization, while OpenID Connect adds the authentication layer on top.

### Multi-Factor Authentication (MFA)
MFA should be standard practice, not optional:
- Something you know (password)
- Something you have (phone, token)
- Something you are (biometrics)

## Implementing with NextAuth.js

NextAuth.js makes modern authentication patterns accessible:

\`\`\`tsx
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Your authentication logic here
        const user = await validateUser(credentials)
        return user ? { id: user.id, email: user.email } : null
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id
      return session
    }
  }
})
\`\`\`

## Security Best Practices

### 1. Password Security
- Enforce strong password policies
- Use bcrypt for password hashing
- Implement password breach checking

### 2. Session Management
- Use secure, httpOnly cookies
- Implement proper session timeout
- Validate sessions on every request

### 3. Rate Limiting
Implement rate limiting to prevent brute force attacks:

\`\`\`tsx
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later.'
})
\`\`\`

### 4. HTTPS Everywhere
- Always use HTTPS in production
- Set secure cookie flags
- Implement HSTS headers

## Common Vulnerabilities to Avoid

1. **SQL Injection** - Use parameterized queries
2. **XSS Attacks** - Sanitize user input
3. **CSRF Attacks** - Use CSRF tokens
4. **Session Fixation** - Regenerate session IDs

## Monitoring and Alerting

Set up monitoring for:
- Failed login attempts
- Suspicious user behavior
- Account lockouts
- Password reset requests

## Conclusion

Authentication security is an ongoing process, not a one-time implementation. Stay updated with the latest security practices, regularly audit your authentication flow, and always prioritize user privacy and security.

Remember: The best authentication system is one that's both secure and user-friendly.
    `,
    author: authors[1],
    category: categories[0],
    tags: ['authentication', 'security', 'nextauth', 'web-security', 'best-practices'],
    publishedAt: '2024-01-10T14:30:00Z',
    readTime: 12,
    featured: true,
    published: true,
    seo: {
      metaTitle: 'Authentication Best Practices 2024: Complete Security Guide',
      metaDescription: 'Learn modern authentication best practices including OAuth, MFA, NextAuth.js implementation, and security patterns to protect your applications.',
      keywords: ['authentication', 'security', 'oauth', 'nextauth', 'web security', 'best practices']
    },
    featuredImage: {
      url: '/images/blog/auth-security.jpg',
      alt: 'Authentication Security Best Practices',
      width: 1200,
      height: 630
    }
  },
  {
    id: '3',
    title: 'Building Scalable SaaS Applications',
    slug: 'building-scalable-saas-applications',
    excerpt: 'Learn the architectural patterns and best practices for building SaaS applications that can scale to millions of users.',
    content: `
# Building Scalable SaaS Applications

Building a SaaS application that can scale from zero to millions of users requires careful planning, the right architecture, and smart technology choices. In this guide, we'll explore the key patterns and practices.

## Understanding Scale

Scalability isn't just about handling more users—it's about:
- Performance under load
- Cost efficiency
- Maintainability
- Reliability and availability

## Architecture Patterns

### Microservices vs Monolith

Start with a modular monolith, then extract services as needed:

\`\`\`
Monolith -> Modular Monolith -> Domain Services -> Microservices
\`\`\`

### Database Strategy

- **Read Replicas**: Distribute read load
- **Sharding**: Partition data across databases
- **Caching**: Redis/Memcached for frequently accessed data

## Technology Choices

### Frontend
- **Next.js** for React-based applications
- **TypeScript** for type safety
- **Tailwind CSS** for styling

### Backend
- **Node.js** with Express or Fastify
- **PostgreSQL** for relational data
- **Redis** for caching and sessions

### Infrastructure
- **Vercel/Netlify** for frontend hosting
- **AWS/GCP** for backend services
- **CDN** for global content delivery

## Performance Optimization

### 1. Caching Strategy
\`\`\`tsx
// Example: Multi-level caching
const getCachedData = async (key: string) => {
  // L1: Memory cache
  let data = memoryCache.get(key)
  if (data) return data

  // L2: Redis cache
  data = await redis.get(key)
  if (data) {
    memoryCache.set(key, data)
    return JSON.parse(data)
  }

  // L3: Database
  data = await database.query(key)
  await redis.setex(key, 3600, JSON.stringify(data))
  memoryCache.set(key, data)
  return data
}
\`\`\`

### 2. Database Optimization
- Use indexes strategically
- Implement query optimization
- Consider database connection pooling

### 3. API Optimization
- Implement rate limiting
- Use pagination for large datasets
- Optimize N+1 queries

## Monitoring and Observability

Essential monitoring includes:
- **Application Performance Monitoring (APM)**
- **Error tracking** with Sentry
- **Uptime monitoring**
- **User analytics**

## Security at Scale

- **Zero-trust architecture**
- **API rate limiting**
- **DDoS protection**
- **Regular security audits**

## Cost Optimization

- **Auto-scaling** based on demand
- **Resource right-sizing**
- **Reserved instances** for predictable workloads
- **Spot instances** for batch processing

## Deployment Strategy

### CI/CD Pipeline
\`\`\`yaml
# Example GitHub Actions workflow
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Build
        run: npm run build
      - name: Deploy
        run: npm run deploy
\`\`\`

### Blue-Green Deployment
- Zero downtime deployments
- Easy rollback capability
- Reduced deployment risk

## Conclusion

Building scalable SaaS applications is a journey, not a destination. Start simple, measure everything, and scale incrementally based on real user needs and data.

Key takeaways:
1. Choose the right technology stack
2. Design for failure
3. Monitor everything
4. Scale incrementally
5. Prioritize user experience

Remember: Premature optimization is the root of all evil, but planning for scale is wisdom.
    `,
    author: authors[2],
    category: categories[4],
    tags: ['saas', 'scalability', 'architecture', 'performance', 'devops'],
    publishedAt: '2024-01-08T09:15:00Z',
    readTime: 15,
    featured: false,
    published: true,
    seo: {
      metaTitle: 'Building Scalable SaaS Applications: Complete Architecture Guide',
      metaDescription: 'Learn how to build SaaS applications that scale to millions of users with proper architecture, technology choices, and best practices.',
      keywords: ['saas', 'scalability', 'architecture', 'performance', 'microservices', 'devops']
    },
    featuredImage: {
      url: '/images/blog/saas-architecture.jpg',
      alt: 'Scalable SaaS Architecture Diagram',
      width: 1200,
      height: 630
    }
  },
  {
    id: '4',
    title: 'The Complete Guide to Goal Setting and Achievement',
    slug: 'complete-guide-goal-setting-achievement',
    excerpt: 'Master the art of setting and achieving meaningful goals with proven frameworks, practical strategies, and actionable insights.',
    content: `
# The Complete Guide to Goal Setting and Achievement

Goal setting is more than just writing down what you want to accomplish. It's a systematic approach to turning your dreams into reality through structured planning and consistent action.

## Why Most Goals Fail

Research shows that 92% of people fail to achieve their goals. Common reasons include:
- Vague or unrealistic goals
- Lack of a clear plan
- No accountability system
- Insufficient motivation
- Poor progress tracking

## The SMART Goals Framework

### Specific
Your goal should be clear and specific:
- ❌ "Get fit"
- ✅ "Lose 15 pounds and run a 5K"

### Measurable
Include metrics to track progress:
- ❌ "Improve website traffic"
- ✅ "Increase website traffic by 50% in 6 months"

### Achievable
Set challenging but realistic goals:
- Consider your resources
- Assess your constraints
- Build on past successes

### Relevant
Ensure goals align with your values and long-term vision:
- Does this goal matter to you?
- Will it move you closer to your bigger picture?
- Is now the right time?

### Time-bound
Set clear deadlines:
- Create urgency
- Enable progress tracking
- Provide clear milestones

## Advanced Goal-Setting Techniques

### OKRs (Objectives and Key Results)
Used by Google, Intel, and many successful companies:

\`\`\`
Objective: Become a thought leader in web development
Key Results:
- Publish 12 technical blog posts
- Speak at 3 industry conferences  
- Gain 5,000 Twitter followers
- Contribute to 2 open-source projects
\`\`\`

### The 90-Day Sprint Method
Break large goals into 90-day chunks:
1. **Days 1-30**: Planning and foundation
2. **Days 31-60**: Execution and momentum
3. **Days 61-90**: Optimization and completion

### Backwards Goal Planning
Start with your end goal and work backwards:
1. Define the end result
2. Identify key milestones
3. Break down into monthly targets
4. Create weekly action plans
5. Define daily habits

## The Psychology of Achievement

### Growth Mindset vs Fixed Mindset
- **Fixed**: "I'm not good at this"
- **Growth**: "I'm not good at this yet"

### Intrinsic vs Extrinsic Motivation
Focus on internal drivers:
- Personal satisfaction
- Skill development
- Purpose alignment
- Creative expression

## Building Systems for Success

### Habit Stacking
Link new behaviors to existing habits:
\`\`\`
After I [existing habit], I will [new habit]
After I pour my morning coffee, I will write for 10 minutes
\`\`\`

### Environment Design
Optimize your environment for success:
- Remove friction for good habits
- Add friction for bad habits
- Create visual cues and reminders

### Progress Tracking
Use multiple tracking methods:
- Daily journaling
- Weekly reviews
- Monthly assessments
- Quarterly planning sessions

## Overcoming Common Obstacles

### Procrastination
- Break tasks into smaller pieces
- Use the 2-minute rule
- Create implementation intentions
- Focus on starting, not finishing

### Lack of Motivation
- Connect to your deeper why
- Visualize success regularly
- Celebrate small wins
- Find an accountability partner

### Perfectionism
- Embrace "good enough" for version 1
- Focus on progress over perfection
- Set minimum viable goals
- Learn from failures quickly

## Tools and Resources

### Digital Tools
- **Notion**: Comprehensive planning and tracking
- **Todoist**: Task management and organization
- **Strava**: Fitness and health goals
- **RescueTime**: Time tracking and productivity

### Analog Methods
- Bullet journaling
- Vision boards
- Goal-setting worksheets
- Accountability journals

## Measuring Success

### Leading vs Lagging Indicators
- **Lagging**: Revenue, weight loss, followers
- **Leading**: Activities, habits, inputs

Focus on leading indicators you control.

### Regular Reviews
Schedule regular goal reviews:
- **Daily**: Check daily targets
- **Weekly**: Assess progress and adjust
- **Monthly**: Review bigger picture
- **Quarterly**: Set new goals and retire old ones

## Case Study: Building a Successful Blog

Let's apply these principles to building a successful blog:

**SMART Goal**: "Grow my blog to 10,000 monthly readers in 12 months"

**90-Day Sprints**:
- Q1: Foundation (blog setup, first 12 posts, SEO basics)
- Q2: Content (24 more posts, social media presence)  
- Q3: Growth (guest posting, partnerships, email list)
- Q4: Optimization (analytics, monetization, scaling)

**Daily Habits**:
- Write for 30 minutes every morning
- Share one piece of content on social media
- Read one industry article
- Respond to comments and emails

**Weekly Reviews**:
- Analyze traffic and engagement metrics
- Plan next week's content
- Assess what's working and what isn't
- Adjust strategy based on data

## Conclusion

Goal achievement isn't about willpower—it's about systems, strategies, and smart planning. By applying these frameworks and maintaining consistent action, you can dramatically increase your success rate.

Remember:
1. Start with clarity (SMART goals)
2. Build systems, not just goals
3. Focus on progress, not perfection
4. Review and adjust regularly
5. Celebrate wins along the way

Your goals are waiting for you. Now you have the tools to achieve them.
    `,
    author: authors[1],
    category: categories[2],
    tags: ['goals', 'productivity', 'success', 'planning', 'achievement'],
    publishedAt: '2024-01-05T11:00:00Z',
    readTime: 10,
    featured: true,
    published: true,
    seo: {
      metaTitle: 'Complete Guide to Goal Setting and Achievement | Strive',
      metaDescription: 'Master goal setting with SMART goals, OKRs, and proven strategies. Learn how to set, track, and achieve meaningful goals with this comprehensive guide.',
      keywords: ['goal setting', 'achievement', 'productivity', 'success', 'planning', 'smart goals']
    },
    featuredImage: {
      url: '/images/blog/goal-achievement.jpg',
      alt: 'Goal Setting and Achievement Guide',
      width: 1200,
      height: 630
    }
  }
];

// Helper functions
export const getAuthorById = (id: string): Author | undefined => {
  return authors.find(author => author.id === id);
};

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(category => category.id === id);
};

export const getCategoryBySlug = (slug: string): Category | undefined => {
  return categories.find(category => category.slug === slug);
};

export const getPostById = (id: string): BlogPost | undefined => {
  return blogPosts.find(post => post.id === id);
};

export const getPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPosts.find(post => post.slug === slug);
};

export const getFeaturedPosts = (): BlogPost[] => {
  return blogPosts.filter(post => post.featured && post.published);
};

export const getRecentPosts = (limit: number = 5): BlogPost[] => {
  return blogPosts
    .filter(post => post.published)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
};

export const getPostsByCategory = (categorySlug: string): BlogPost[] => {
  return blogPosts.filter(post => 
    post.published && post.category.slug === categorySlug
  );
};

export const getPostsByAuthor = (authorId: string): BlogPost[] => {
  return blogPosts.filter(post => 
    post.published && post.author.id === authorId
  );
};

export const getPostsByTag = (tag: string): BlogPost[] => {
  return blogPosts.filter(post => 
    post.published && post.tags.includes(tag.toLowerCase())
  );
};

export const getAllTags = (): string[] => {
  const tags = new Set<string>();
  blogPosts.forEach(post => {
    post.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
};

export const searchPosts = (query: string): BlogPost[] => {
  const lowercaseQuery = query.toLowerCase();
  return blogPosts.filter(post => 
    post.published && (
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.excerpt.toLowerCase().includes(lowercaseQuery) ||
      post.content.toLowerCase().includes(lowercaseQuery) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    )
  );
};