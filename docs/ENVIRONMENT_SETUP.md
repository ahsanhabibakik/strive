# 🔐 Environment Configuration Guide

This guide explains how to properly set up environment variables for the Strive SaaS platform.

## 📁 File Structure

```
├── .env.example          # Template with all available variables
├── .env.local            # Your local development configuration (ignored by git)
├── .env.production       # Production environment template for Vercel
└── docs/
    └── ENVIRONMENT_SETUP.md   # This documentation
```

## 🚀 Quick Start

1. **Copy the template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in required variables:**
   - `MONGODB_URI` - Your database connection string
   - `NEXTAUTH_SECRET` - Random 32+ character string for auth
   - `EMAIL_SERVER_*` - Email configuration for password resets

3. **Start development:**
   ```bash
   npm run dev
   ```

## 📋 Variable Categories

### 🔴 **Required Variables**
These are essential for basic functionality:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | Database connection string | `mongodb+srv://user:pass@cluster.mongodb.net/strive` |
| `NEXTAUTH_SECRET` | Authentication secret (32+ chars) | `your-super-secret-32-character-string` |
| `EMAIL_SERVER_HOST` | SMTP server for emails | `smtp.resend.com` |
| `EMAIL_SERVER_USER` | SMTP username | `resend` or `your-email@gmail.com` |
| `EMAIL_SERVER_PASSWORD` | SMTP password/API key | `your-resend-api-key` |

### 🟡 **Recommended Variables**
Important for production-ready features:

| Variable | Description | Required For |
|----------|-------------|---------------|
| `GOOGLE_CLIENT_ID` | Google OAuth | Social login |
| `STRIPE_SECRET_KEY` | Stripe payments | Billing features |
| `SENTRY_DSN` | Error tracking | Production monitoring |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics | User analytics |

### 🟢 **Optional Variables**
Nice-to-have features and integrations:

| Variable | Description | Use Case |
|----------|-------------|----------|
| `OPENAI_API_KEY` | AI features | Goal suggestions, content generation |
| `CLOUDINARY_*` | File uploads | Profile pictures, attachments |
| `REDIS_URL` | Caching | Performance optimization |

## 🔧 Environment-Specific Setup

### Development (.env.local)
```bash
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
DEBUG=true
LOG_LEVEL=debug
```

### Production (Vercel)
Set these in your Vercel project settings:
```bash
NODE_ENV=production
NEXTAUTH_SECRET=your-production-secret
MONGODB_URI=your-production-database
```

## 🔒 Security Best Practices

### ✅ **DO:**
- Use different secrets for development/production
- Generate strong random secrets (32+ characters)
- Store production secrets in Vercel dashboard
- Use environment-specific database names

### ❌ **DON'T:**
- Commit `.env.local` to git
- Use the same secrets across environments
- Store real API keys in example files
- Use weak or predictable secrets

## 🔑 Generating Secure Secrets

### Using OpenSSL:
```bash
# Generate NextAuth secret
openssl rand -base64 32

# Generate JWT secret
openssl rand -base64 32
```

### Using Node.js:
```javascript
// Generate a random secret
crypto.randomBytes(32).toString('base64')
```

## 📧 Email Configuration Options

### Option 1: Resend (Recommended)
```bash
EMAIL_SERVER_HOST=smtp.resend.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=resend
EMAIL_SERVER_PASSWORD=your-resend-api-key
```

### Option 2: Gmail
```bash
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password  # Not your regular password!
```

## 💳 Payment Setup (Stripe)

1. **Create Stripe account** at https://stripe.com
2. **Get test keys** from Stripe Dashboard
3. **Add to environment:**
   ```bash
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```
4. **Set up webhooks** for `/api/billing/webhook`

## 🔍 OAuth Provider Setup

### Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create project and enable Google+ API
3. Create OAuth 2.0 credentials
4. Add authorized redirect: `http://localhost:3000/api/auth/callback/google`

### GitHub OAuth:
1. Go to GitHub Settings → Developer Settings
2. Create new OAuth App
3. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

## 🚨 Troubleshooting

### Common Issues:

**"Invalid environment variables" error:**
- Check that all required variables are set
- Verify MongoDB URI format
- Ensure secrets are 32+ characters

**Authentication not working:**
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Ensure OAuth redirect URLs are correct

**Email not sending:**
- Test SMTP credentials separately
- Check firewall/security settings
- Verify `EMAIL_FROM` domain

**Build failures on Vercel:**
- Set all required variables in Vercel dashboard
- Check for typos in variable names
- Ensure production database is accessible

## 📝 Environment Variable Validation

The app automatically validates environment variables on startup using Zod schema in `src/lib/config/env.ts`. This ensures:

- Required variables are present
- URLs are properly formatted
- Secrets meet minimum length requirements
- Type safety throughout the application

## 🔄 Updating Environment Variables

### Development:
1. Update `.env.local`
2. Restart development server

### Production (Vercel):
1. Update variables in Vercel dashboard
2. Trigger new deployment
3. Variables take effect immediately

## 📞 Support

If you encounter issues with environment configuration:

1. Check this documentation
2. Verify against `.env.example`
3. Review the validation errors in console
4. Check Vercel deployment logs for production issues

---

**💡 Tip:** Use the organized `.env.local.organized` file as a reference for a clean, well-structured environment setup based on your current configuration.