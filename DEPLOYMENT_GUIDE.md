# Strive SaaS Starter - Deployment Guide

This guide walks you through deploying your Strive SaaS application to production using Vercel and setting up all the necessary services.

## Prerequisites

Before deploying, ensure you have accounts and API keys for the following services:

- ✅ [Vercel](https://vercel.com) - For hosting and deployment
- ✅ [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - For database
- ✅ [Stripe](https://stripe.com) - For payments and billing
- ✅ [Resend](https://resend.com) - For email delivery
- ✅ [Sentry](https://sentry.io) - For error tracking
- ✅ [Google Cloud Console](https://console.cloud.google.com) - For OAuth (optional)

## Quick Deployment (5 minutes)

### 1. Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/strive)

Or manually:

```bash
# Clone and deploy
git clone <your-repo-url>
cd strive
npm install
npx vercel
```

### 2. Configure Environment Variables

In your Vercel dashboard, go to **Settings > Environment Variables** and add:

```bash
# Essential variables for basic functionality
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-random-secret-32-chars-min
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/strive

# For authentication
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# For payments (can be added later)
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key

# For emails
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=noreply@yourdomain.com

# For error tracking
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
```

### 3. Set Up Your Domain

1. Go to Vercel project settings → **Domains**
2. Add your custom domain
3. Update `NEXTAUTH_URL` to use your domain

## Detailed Setup Guide

### MongoDB Atlas Setup

1. **Create a cluster** at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Create a database user** with read/write permissions
3. **Get connection string**:
   - Go to **Connect** → **Connect your application**
   - Copy the connection string
   - Replace `<username>`, `<password>`, and `<dbname>`

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/strive?retryWrites=true&w=majority
```

### Stripe Setup

1. **Create a Stripe account** at [stripe.com](https://stripe.com)
2. **Get API keys**:
   - Dashboard → **Developers** → **API keys**
   - Copy Publishable key and Secret key

3. **Create products and prices**:
   ```bash
   # Use Stripe CLI or dashboard to create products
   stripe products create --name "Pro Plan" --description "Professional features"
   stripe prices create --product prod_xxx --unit-amount 2900 --currency usd --recurring interval=month
   ```

4. **Set up webhook endpoint**:
   - Dashboard → **Developers** → **Webhooks**
   - Endpoint URL: `https://yourdomain.com/api/billing/webhook`
   - Events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`

### Resend Email Setup

1. **Create account** at [resend.com](https://resend.com)
2. **Verify your domain**:
   - Go to **Domains** → **Add Domain**
   - Add DNS records to your domain provider
3. **Get API key**:
   - Go to **API Keys** → **Create API Key**

### Google OAuth Setup

1. **Go to [Google Cloud Console](https://console.cloud.google.com)**
2. **Create a project** or select existing
3. **Enable Google+ API**:
   - **APIs & Services** → **Library**
   - Search "Google+ API" and enable
4. **Create OAuth credentials**:
   - **APIs & Services** → **Credentials**
   - **Create Credentials** → **OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Authorized redirect URIs: `https://yourdomain.com/api/auth/callback/google`

### Sentry Error Tracking Setup

1. **Create account** at [sentry.io](https://sentry.io)
2. **Create a project**:
   - Choose **Next.js** platform
   - Copy the DSN from project settings

### Environment Variables Reference

Create these environment variables in Vercel:

```bash
# Core Application
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=super-secret-jwt-token-at-least-32-characters
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/strive

# Authentication
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret

# Payments
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-signing-secret
STRIPE_PRO_PRICE_ID=price_your-pro-plan-price-id
STRIPE_ENTERPRISE_PRICE_ID=price_your-enterprise-plan-price-id

# Email
RESEND_API_KEY=re_your-resend-api-key
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=https://key@sentry.io/project-id

# Analytics (Optional)
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
NEXT_PUBLIC_MIXPANEL_TOKEN=your-mixpanel-token

# Feature Flags
ENABLE_REGISTRATION=true
ENABLE_OAUTH=true
ENABLE_BILLING=true
ENABLE_ANALYTICS=true
```

## Post-Deployment Checklist

### Security & Performance

- [ ] **HTTPS enabled** (automatic with Vercel)
- [ ] **Environment variables set** and not exposed in client-side code
- [ ] **Database connections secured** with proper user permissions
- [ ] **CORS configured** for your domain only
- [ ] **Rate limiting enabled** for API endpoints
- [ ] **Webhook endpoints secured** with signature verification

### Functionality Testing

- [ ] **Authentication works** (Google OAuth, email/password)
- [ ] **Database operations** (user registration, data persistence)
- [ ] **Email delivery** (welcome emails, password resets)
- [ ] **Payment processing** (subscription creation, webhooks)
- [ ] **Error tracking** (Sentry catching and reporting errors)

### Performance Optimization

- [ ] **Images optimized** using Next.js Image component
- [ ] **Bundle analyzed** for size optimization
- [ ] **Database queries** optimized with proper indexing
- [ ] **Caching enabled** for API responses where appropriate
- [ ] **Performance monitoring** set up (Vercel Analytics)

### SEO & Analytics

- [ ] **Meta tags configured** for all pages
- [ ] **Sitemap.xml generated** and submitted to Google
- [ ] **Google Analytics installed** (if using)
- [ ] **Open Graph images** set for social sharing
- [ ] **Structured data** added for better SEO

## Custom Domain Setup

### Using Vercel Domains

1. Go to your Vercel project settings
2. Navigate to **Domains**
3. Add your domain and follow DNS instructions
4. Update `NEXTAUTH_URL` environment variable

### Using External Domain Provider

1. **Add CNAME record** pointing to your Vercel deployment
2. **Verify domain** in Vercel dashboard
3. **Update environment variables** with new domain
4. **Test all authentication flows** with new domain

## Database Management

### Backup Strategy

```bash
# Set up automated backups
mongodump --uri="$MONGODB_URI" --out=backup-$(date +%Y-%m-%d)

# Schedule with GitHub Actions or similar
```

### Database Indexing

Add these indexes for optimal performance:

```javascript
// In MongoDB Atlas or using MongoDB Compass
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "subscription.customerId": 1 })
db.sessions.createIndex({ "expires": 1 }, { expireAfterSeconds: 0 })
db.apikeys.createIndex({ "userId": 1, "isActive": 1 })
```

## Monitoring & Alerts

### Health Checks

Set up monitoring for:

```bash
# Application health
GET https://yourdomain.com/api/health

# Database connectivity
GET https://yourdomain.com/api/health/database

# External services
GET https://yourdomain.com/api/health/stripe
GET https://yourdomain.com/api/health/email
```

### Uptime Monitoring

Use services like:
- **UptimeRobot** - Free uptime monitoring
- **Pingdom** - Advanced monitoring and alerts
- **StatusCake** - Comprehensive website monitoring

## Scaling Considerations

### Database Scaling

```javascript
// Connection pooling for high traffic
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
}
```

### Caching Strategy

```javascript
// Implement Redis caching for frequent queries
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})
```

### CDN Setup

Configure Vercel Edge Network or external CDN:
- **Static assets** cached globally
- **API responses** cached where appropriate
- **Database queries** cached with proper invalidation

## Troubleshooting

### Common Issues

1. **Authentication not working**:
   - Check `NEXTAUTH_URL` matches your domain exactly
   - Verify OAuth redirect URLs in Google Console
   - Ensure `NEXTAUTH_SECRET` is set and secure

2. **Database connection failing**:
   - Verify MongoDB URI format and credentials
   - Check network access whitelist in MongoDB Atlas
   - Ensure database user has proper permissions

3. **Payments not processing**:
   - Confirm webhook endpoint is accessible
   - Check Stripe webhook secret matches environment variable
   - Verify price IDs exist and are active

4. **Emails not sending**:
   - Test Resend API key in their dashboard
   - Check sender domain is verified
   - Verify email templates render correctly

### Debug Mode

Enable debug logging by setting:

```bash
DEBUG=true
LOG_LEVEL=debug
```

### Support

- **Documentation**: Check the README.md for detailed setup instructions
- **Issues**: Create GitHub issues for bugs or feature requests
- **Community**: Join our Discord for community support

## Security Best Practices

### Environment Variables

```bash
# Never commit these to git
.env.local
.env.production

# Use strong secrets
NEXTAUTH_SECRET=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)
```

### Database Security

```javascript
// Use least-privilege database users
// Enable MongoDB Atlas IP whitelisting
// Regular security updates for dependencies
npm audit fix
```

### API Security

```javascript
// Rate limiting implemented
// Input validation on all endpoints
// CORS properly configured
// Webhook signature verification
```

---

**Deployment Complete!** 🎉

Your Strive SaaS application is now live and ready for users. Monitor the health checks and performance metrics to ensure everything runs smoothly.

For ongoing maintenance, set up automated dependency updates and regular security audits.