# Strive - Prebuild Project Template

A comprehensive Next.js 15 project template with authentication, blog, newsletter, and essential components pre-configured.

## Features

✅ **Authentication System**
- NextAuth.js with Google OAuth
- Custom credentials authentication
- Protected routes and session management
- MongoDB user storage

✅ **Newsletter Integration**
- Subscribe/unsubscribe functionality
- MongoDB newsletter subscriber storage
- Beautiful UI components

✅ **Blog System**
- Blog post listing and individual pages
- Author information and reading time
- SEO-friendly structure

✅ **UI Components**
- shadcn/ui components (Button, Input, Card, etc.)
- Tailwind CSS styling
- Responsive design
- Dark mode support

✅ **Database Ready**
- MongoDB integration
- User authentication storage
- Newsletter subscribers collection

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui + Radix UI
- **Authentication:** NextAuth.js
- **Database:** MongoDB
- **Validation:** Zod
- **Icons:** Lucide React

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

## License

MIT License - feel free to use this template for your projects.

## Support

If you have questions or need help:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

---

**Happy coding! 🚀**