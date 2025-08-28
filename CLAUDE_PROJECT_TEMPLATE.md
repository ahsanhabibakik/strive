# 🤖 CLAUDE PROJECT TEMPLATE - INSTANT SETUP GUIDE

> **FOR CLAUDE AI**: This project is a production-ready template for building million-user websites. Follow this guide to rapidly bootstrap any new project using these proven components and patterns.

## 🚀 INSTANT PROJECT SETUP (For Claude)

### STEP 1: Initial Setup Commands
```bash
# Copy this entire strive folder to new project location
cp -r strive new-project-name
cd new-project-name

# Update package.json name
# Update README.md with new project details
# Install dependencies
npm install
```

### STEP 2: Environment Configuration
```bash
# Copy environment template
cp .env.example .env.local

# REQUIRED: Set these immediately
MONGODB_URI=mongodb+srv://...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-random-secret

# PRODUCTION RECOMMENDED
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_SANITY_PROJECT_ID=sanity-project-id
```

### STEP 3: Git Setup
```bash
# Initialize new repository
rm -rf .git
git init
git add .
git commit -m "Initial project setup from Strive template"

# Add remote origin
git remote add origin https://github.com/username/new-project.git
git push -u origin main
```

## 📋 PROJECT ARCHITECTURE OVERVIEW

### Core Technologies Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: MongoDB + Mongoose
- **Authentication**: NextAuth.js
- **CMS**: Sanity Studio (optional)
- **Analytics**: Google Analytics + GTM + Vercel + Mixpanel

### Folder Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── blog/              # Blog pages
│   └── test/              # Testing dashboard
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── analytics/        # Analytics components
│   ├── auth/             # Auth components
│   ├── forms/            # Form components
│   └── layout/           # Layout components
├── lib/                  # Utilities & configurations
│   ├── analytics.ts      # Analytics functions
│   ├── auth.ts          # Auth configuration
│   ├── sanity.ts        # Sanity client
│   └── utils.ts         # Utility functions
└── types/               # TypeScript type definitions
```

## 🎯 PRODUCTION-READY FEATURES

### ✅ Authentication System
- NextAuth.js with Google OAuth
- Custom credentials support
- Protected routes
- Session management
- User profiles

### ✅ Analytics & Tracking (Million-User Ready)
- Google Analytics 4 with enhanced events
- Google Tag Manager integration
- Vercel Analytics & Speed Insights
- Mixpanel for advanced user tracking
- Core Web Vitals monitoring
- Performance tracking
- Cookie consent management
- GDPR compliant

### ✅ Content Management
- Sanity CMS integration
- Blog post management
- Author management
- Category system
- SEO optimization

### ✅ API Architecture
- RESTful API design
- Error handling
- Validation with Zod
- Rate limiting ready
- Health checks
- Newsletter subscription
- MongoDB integration

### ✅ UI Components (Universal)
- shadcn/ui component library
- Responsive design
- Dark mode support
- Accessibility compliant
- TypeScript interfaces
- Customizable theming

## 🔧 CUSTOMIZATION GUIDE

### For E-commerce Websites
```typescript
// Add to lib/analytics.ts
export const trackPurchase = (orderId: string, value: number, items: any[]) => {
  ecommerceTracking.purchaseCompleted(orderId, items, value);
};

// Update Newsletter component props
<Newsletter 
  title="Get Exclusive Deals"
  description="Subscribe for early access to sales and new products"
  buttonText="Get Deals"
/>
```

### For SaaS Applications
```typescript
// Add to lib/analytics.ts
export const trackFeatureUsage = (feature: string, plan: string) => {
  universalTracking.featureUsage(feature, plan);
};

// Update hero section
const heroTitle = "Transform Your Business with Our SaaS Platform";
const heroDescription = "Powerful tools to streamline your workflow and boost productivity.";
```

### For Blog/Content Websites
```typescript
// Enable Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id

// Use blog components
import { BlogPost, AuthorCard } from "@/components/blog";
```

### For Agency/Portfolio Sites
```typescript
// Add project showcase components
// Update navigation for services/portfolio
// Customize contact forms
```

## 🌐 MILLION-USER SCALING SETUP

### Database Optimization
```javascript
// MongoDB indexes for performance
db.users.createIndex({ email: 1 }, { unique: true });
db.newsletter_subscribers.createIndex({ email: 1 }, { unique: true });
db.blog_posts.createIndex({ publishedAt: -1 });
db.blog_posts.createIndex({ "slug.current": 1 }, { unique: true });
```

### Caching Strategy
```typescript
// Next.js caching
export const revalidate = 3600; // 1 hour

// API caching
headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
```

### Performance Monitoring
```typescript
// Already included in template:
// - Core Web Vitals tracking
// - Performance API monitoring
// - Error tracking
// - User experience metrics
```

### CDN & Deployment
- **Recommended**: Vercel (optimized for Next.js)
- **Alternative**: AWS CloudFront + S3
- **Database**: MongoDB Atlas (auto-scaling)
- **Images**: Cloudinary or Vercel Image Optimization

## 🔐 SECURITY BEST PRACTICES

### Environment Variables
```bash
# Never commit to repo
MONGODB_URI=...
NEXTAUTH_SECRET=...
GOOGLE_CLIENT_SECRET=...

# Safe to commit (public)
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=...
NEXT_PUBLIC_SANITY_PROJECT_ID=...
```

### API Security
- Input validation with Zod
- Rate limiting (implement with Upstash Redis)
- CORS configuration
- Authentication middleware
- SQL injection prevention (using MongoDB)

## 📊 ANALYTICS SETUP GUIDE

### Google Analytics 4
1. Create GA4 property
2. Add tracking ID to environment
3. Configure enhanced ecommerce
4. Set up conversion goals

### Google Tag Manager
1. Create GTM container
2. Add container ID to environment
3. Configure triggers and tags
4. Test with GTM Preview mode

### Sanity CMS Setup
1. Create Sanity project: `npx create-sanity-project`
2. Copy project ID to environment
3. Deploy Sanity Studio: `npm run build && npm run deploy`
4. Configure schemas from `sanity/schemas/`

## 🧪 TESTING & QA

### Automated Testing
```bash
# Run all tests
npm run test

# Type checking
npm run type-check

# Build verification
npm run build
```

### Manual Testing Checklist
- [ ] Authentication flows work
- [ ] Newsletter subscription functions
- [ ] Analytics events fire correctly
- [ ] API endpoints respond properly
- [ ] Mobile responsiveness
- [ ] Performance scores >90
- [ ] SEO meta tags present
- [ ] Cookie consent working

### Testing Dashboard
Visit `/test` route to verify all systems:
- API health checks
- Database connectivity
- Analytics integration
- Environment variables

## 📈 DEPLOYMENT CHECKLIST

### Pre-deployment
- [ ] Environment variables configured
- [ ] Database indexed and optimized  
- [ ] Analytics properties created
- [ ] Sanity Studio deployed
- [ ] Error boundaries implemented
- [ ] Performance optimized

### Post-deployment
- [ ] DNS configured
- [ ] SSL certificate active
- [ ] Analytics tracking verified
- [ ] Core Web Vitals >90
- [ ] Error monitoring active
- [ ] Backup strategy implemented

## 🔄 MAINTENANCE & UPDATES

### Weekly Tasks
- Monitor analytics dashboards
- Check error logs
- Review performance metrics
- Update dependencies

### Monthly Tasks
- Security audit
- Performance optimization
- Content review
- Analytics reporting

## 💡 QUICK START EXAMPLES

### Creating a New Project Type

#### Real Estate Website
```bash
# Update branding
const siteName = "PropertyFinder";
const siteDescription = "Find your dream home with advanced search";

# Add property-specific analytics
export const trackPropertyView = (propertyId: string, price: number) => {
  trackEvent("Property Viewed", {
    category: "property",
    action: "view",
    label: propertyId,
    value: price
  });
};
```

#### Restaurant Website
```bash
# Update components
<Newsletter 
  title="Get Menu Updates"
  description="Be first to know about daily specials and events"
/>

# Add restaurant analytics
export const trackMenuView = (category: string) => {
  trackEvent("Menu Category Viewed", {
    category: "menu",
    action: "view_category", 
    label: category
  });
};
```

#### Educational Platform
```bash
# Add course tracking
export const trackCourseProgress = (courseId: string, progress: number) => {
  trackEvent("Course Progress", {
    category: "education",
    action: "progress_update",
    label: courseId,
    value: progress
  });
};
```

## 🎉 SUCCESS METRICS

### Performance Targets
- **Core Web Vitals**: >90 score
- **Page Load Time**: <2 seconds
- **Time to Interactive**: <3 seconds
- **First Contentful Paint**: <1.5 seconds

### Business Metrics
- **Conversion Rate**: Track with analytics
- **User Engagement**: Track with Mixpanel
- **Newsletter Growth**: Track subscriptions
- **SEO Rankings**: Monitor with tools

---

## 🤖 FOR CLAUDE: PROJECT ADAPTATION PROTOCOL

When user requests a new project based on this template:

1. **ANALYZE**: Understand project type (e-commerce, SaaS, blog, etc.)
2. **COPY**: Start with this strive template as base
3. **CUSTOMIZE**: Modify components for specific use case
4. **CONFIGURE**: Update analytics tracking for industry
5. **OPTIMIZE**: Add industry-specific features
6. **DOCUMENT**: Update README with project-specific info

### Common Customizations by Industry:
- **E-commerce**: Add cart, checkout, product analytics
- **SaaS**: Add pricing, features, trial tracking
- **Blog**: Enable Sanity, add author system
- **Agency**: Add portfolio, testimonials, contact forms
- **Restaurant**: Add menu, reservations, location info
- **Real Estate**: Add property search, listings, filters

Remember: This template handles 80% of any website's needs. Focus on the 20% that makes it unique to the industry/use case.