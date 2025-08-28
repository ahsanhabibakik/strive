# 🚀 Strive - Production-Ready Project Template

> **Million-User Ready** • A comprehensive Next.js 15 project template with authentication, analytics, CMS, newsletter, and essential components pre-configured for scale.

## ⚡ Features

### 🔐 **Authentication System**
- NextAuth.js with Google OAuth + Custom credentials
- Protected routes and session management  
- MongoDB user storage with proper indexing

### 📊 **Analytics & Tracking (Million-User Ready)**
- Google Analytics 4 with enhanced events
- Google Tag Manager integration
- Vercel Analytics & Speed Insights
- Mixpanel for advanced user tracking
- Core Web Vitals monitoring
- Performance tracking with real-time metrics
- Cookie consent management (GDPR compliant)

### 📝 **Content Management (Sanity CMS)**
- Complete Sanity Studio integration
- Blog post management with rich content
- Author and category management
- SEO optimization built-in
- Image optimization and CDN integration

### 📧 **Newsletter & Communications**
- Advanced newsletter subscription system
- Email validation and error handling
- MongoDB subscriber storage
- Analytics tracking for conversions

### 🎨 **UI Components (Universal)**
- Complete shadcn/ui component library
- Responsive design with mobile-first approach
- Dark mode support with system detection
- Accessibility compliant (WCAG 2.1)
- TypeScript interfaces for all components
- Customizable theming system

### ⚙️ **API Architecture**
- RESTful API design with proper error handling
- Input validation with Zod schemas
- Rate limiting ready (Redis integration)
- Health checks and monitoring
- MongoDB integration with connection pooling

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router) with TypeScript
- **Styling:** Tailwind CSS + shadcn/ui + Radix UI  
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** NextAuth.js (Google OAuth + Credentials)
- **CMS:** Sanity Studio with GROQ queries
- **Analytics:** Google Analytics 4 + GTM + Vercel + Mixpanel
- **Validation:** Zod schemas for type-safe APIs
- **Performance:** Core Web Vitals monitoring + optimization
- **Icons:** Lucide React (lightweight and modern)

## Quick Start

1. **Clone and Install**
   ```bash
   git clone <your-repo>
   cd strive
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   - `MONGODB_URI` - Your MongoDB connection string
   - `NEXTAUTH_SECRET` - Random secret for NextAuth.js
   - `GOOGLE_CLIENT_ID` - Google OAuth Client ID
   - `GOOGLE_CLIENT_SECRET` - Google OAuth Client Secret

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   └── newsletter/   # Newsletter endpoints
│   ├── auth/             # Authentication pages
│   ├── blog/             # Blog pages
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Homepage
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── auth/             # Authentication components
│   ├── forms/            # Form components
│   └── sections/         # Page sections
└── lib/                  # Utilities and configurations
    ├── auth.ts           # NextAuth configuration
    └── utils.ts          # Utility functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

## Key Components

### Authentication
- Google OAuth integration
- Custom email/password authentication
- Protected routes with middleware
- Session management

### Newsletter
- Email subscription form
- MongoDB storage
- Success/error states
- Validation with Zod

### Blog System
- Static blog posts (can be extended with CMS)
- Author information
- Reading time calculation
- SEO optimization

### UI Components
All components are built with Tailwind CSS and follow modern design patterns:
- Responsive design
- Accessibility compliant
- Dark mode ready
- Animation support

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `NEXTAUTH_SECRET` | NextAuth.js secret | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | Optional |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | Optional |

## Database Collections

### Users
Automatically created by NextAuth.js MongoDB adapter.

### Newsletter Subscribers
```javascript
{
  _id: ObjectId,
  email: String,
  subscribedAt: Date,
  status: String // 'active' | 'unsubscribed'
}
```

## Customization

1. **Styling**: Modify `tailwind.config.ts` and `globals.css`
2. **Components**: Add new components in `src/components/`
3. **Pages**: Add new pages in `src/app/`
4. **API**: Add new API routes in `src/app/api/`

## Deployment

This project is optimized for deployment on:
- **Vercel** (recommended)
- **Netlify**
- **Railway**
- **DigitalOcean App Platform**

Make sure to set environment variables in your deployment platform.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📚 Documentation

- **[🤖 CLAUDE_PROJECT_TEMPLATE.md](./CLAUDE_PROJECT_TEMPLATE.md)** - Complete guide for Claude AI to rapidly bootstrap new projects
- **[🌐 MILLION_USER_SCALING.md](./MILLION_USER_SCALING.md)** - Production architecture for handling 1M+ users
- **[🎨 SANITY_SETUP.md](./SANITY_SETUP.md)** - Complete Sanity CMS integration guide
- **[🧩 COMPONENTS.md](./COMPONENTS.md)** - Reusable components documentation

## 🎯 Use Cases

This template is perfect for:
- **E-commerce sites** (add cart, checkout, product analytics)
- **SaaS applications** (add pricing, features, trial tracking)  
- **Blog/Content sites** (enable Sanity, add author system)
- **Agency/Portfolio sites** (add portfolio, testimonials)
- **Restaurant websites** (add menu, reservations, location)
- **Real estate platforms** (add property search, listings)

## 🚀 Production Deployment

### Recommended Stack for 1M+ users:
- **Hosting:** Vercel (optimized for Next.js)
- **Database:** MongoDB Atlas (M40+ cluster)
- **CDN:** Vercel Edge Network or AWS CloudFront
- **Caching:** Upstash Redis for rate limiting
- **Monitoring:** Vercel Analytics + Sentry
- **Email:** Resend or SendGrid

### Performance Targets:
- **Core Web Vitals:** >90 score
- **Page Load Time:** <2 seconds globally
- **API Response Time:** <200ms average
- **Uptime:** >99.9% SLA

## 🔧 Git Commit Manager

Includes automated git workflow with:
- Intelligent commit message generation
- Logical file grouping and chunking
- Automated testing and building
- Smart push strategies

```bash
# Use the built-in commit manager
node .git-commit-manager/scripts/auto-commit.js
```

## 💡 Quick Tips

### For Claude AI:
When copying this template for new projects, always:
1. Read `CLAUDE_PROJECT_TEMPLATE.md` first
2. Customize components for the specific industry
3. Update analytics tracking events
4. Configure environment variables
5. Test all functionality with `/test` route

### For Developers:
- Visit `/test` to verify all integrations work
- Check `COMPONENTS.md` for reusable component examples
- Follow `MILLION_USER_SCALING.md` for production optimization
- Use `SANITY_SETUP.md` for CMS configuration

## License

MIT License - feel free to use this template for your projects.

## Support

If you have questions or need help:
1. Check the comprehensive documentation above
2. Test functionality with the `/test` dashboard
3. Review environment variables with `.env.example`
4. Search existing issues or create new ones

---

**🎉 Ready to build your million-user website! 🚀**