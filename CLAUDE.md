# Strive - Personal Goal Achievement Platform

A comprehensive SaaS platform designed to help individuals set, track, and achieve their personal and professional goals through data-driven insights and productivity tools.

## Project Overview

Strive is a full-stack Next.js application built with TypeScript, featuring user authentication, goal tracking, analytics, and team collaboration capabilities. The platform focuses on helping users turn aspirations into actionable plans with measurable outcomes.

## Tech Stack

- **Framework:** Next.js 15.5.2 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS with shadcn/ui components
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** NextAuth.js with multiple providers
- **Email:** Integrated email service with templates
- **Analytics:** Google Analytics, Vercel Analytics
- **Testing:** Jest, Playwright
- **Deployment:** Vercel

## Architecture

### Frontend

- Server-side rendering with React Server Components
- Client components for interactive features
- Responsive design with mobile-first approach
- Component-based architecture with reusable UI elements

### Backend

- API routes with Next.js App Router
- Middleware for authentication, rate limiting, and security
- Database models with Mongoose schemas
- Email service with template system
- File upload and processing capabilities

### Security

- Role-based access control (RBAC)
- Rate limiting and security headers
- Input validation and sanitization
- Secure authentication with session management

## Key Features

1. **User Management**
   - Multi-provider authentication (credentials, OAuth)
   - User profiles and preferences
   - Role-based permissions

2. **Goal Tracking**
   - SMART goal creation and management
   - Progress tracking with visual indicators
   - Milestone and deadline management

3. **Analytics & Insights**
   - Progress visualization with charts
   - Performance metrics and trends
   - Weekly/monthly progress reports

4. **Team Collaboration**
   - Team invitations and management
   - Shared goals and accountability features
   - Progress sharing and updates

5. **Content Management**
   - Blog system with rich content
   - Newsletter subscription management
   - Email templates and automated communications

## Visual Development

### Design Principles

- Comprehensive design checklist in `/context/design-principles.md`
- Brand style guide in `/context/style-guide.md`
- When making visual (front-end, UI/UX) changes, always refer to these files for guidance

### Quick Visual Check

IMMEDIATELY after implementing any front-end change:

1. **Identify what changed** - Review the modified components/pages
2. **Navigate to affected pages** - Use `mcp__playwright__browser_navigate` to visit each changed view
3. **Verify design compliance** - Compare against `/context/design-principles.md` and `/context/style-guide.md`
4. **Validate feature implementation** - Ensure the change fulfills the user's specific request
5. **Check acceptance criteria** - Review any provided context files or requirements
6. **Capture evidence** - Take full page screenshot at desktop viewport (1440px) of each changed view
7. **Check for errors** - Run `mcp__playwright__browser_console_messages`

This verification ensures changes meet design standards and user requirements.

### Comprehensive Design Review

Invoke the `@agent-design-review` subagent for thorough design validation when:

- Completing significant UI/UX features
- Before finalizing PRs with visual changes
- Needing comprehensive accessibility and responsiveness testing

Use the `/design-review` slash command for automated design reviews of current branch changes.

## Development Workflow

### Getting Started

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Start development server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build
```

### Build Commands

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Production build (uses simplified build script)
- `pnpm build:vercel` - Vercel-optimized build
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - TypeScript type checking

### Environment Variables

Key environment variables needed:

- `MONGODB_URI` - MongoDB connection string
- `NEXTAUTH_SECRET` - NextAuth.js secret key
- `NEXTAUTH_URL` - Application URL
- Email service configuration (SMTP settings)
- OAuth provider credentials
- Analytics tracking IDs

## Code Organization

```
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/               # Backend API endpoints
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard pages
│   └── ...
├── components/            # Reusable React components
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── forms/            # Form components
│   ├── layout/           # Layout components
│   └── ...
├── lib/                  # Utility functions and configurations
│   ├── auth/             # Authentication configuration
│   ├── database/         # Database models and utilities
│   ├── email/            # Email service and templates
│   └── ...
└── styles/               # Global styles and Tailwind config
```

## Database Schema

### Core Models

- **User**: User accounts with authentication data
- **Goal**: Individual goals with progress tracking
- **Team**: Team management and collaboration
- **Progress**: Progress entries and analytics data
- **EmailLog**: Email delivery tracking
- **AuditLog**: System activity logging

### Key Relationships

- Users can have multiple Goals
- Users can belong to multiple Teams
- Goals can have multiple Progress entries
- Teams can have shared Goals

## API Design

### Authentication

- JWT-based session management
- Role-based access control
- Protected routes with middleware

### RESTful Endpoints

- `/api/auth/*` - Authentication endpoints
- `/api/goals/*` - Goal management
- `/api/users/*` - User management
- `/api/teams/*` - Team collaboration
- `/api/analytics/*` - Data insights
- `/api/email/*` - Email communications

## Testing Strategy

### Unit Testing

- Jest for component and utility testing
- Test coverage for critical business logic
- Snapshot testing for UI components

### Integration Testing

- API endpoint testing
- Database integration tests
- Authentication flow testing

### End-to-End Testing

- Playwright for user journey testing
- Critical path automation
- Cross-browser compatibility

## Deployment

### Vercel Configuration

- Automated deployments from main branch
- Preview deployments for pull requests
- Environment variable management
- Build optimizations for performance

### Performance Optimization

- Static page generation where possible
- Image optimization with Next.js Image
- Code splitting and lazy loading
- Bundle analysis and optimization

## Security Considerations

- Input validation on all API endpoints
- SQL injection prevention with parameterized queries
- XSS protection with content sanitization
- CSRF protection with NextAuth.js
- Rate limiting to prevent abuse
- Secure headers configuration

## Monitoring & Analytics

- Application performance monitoring
- User behavior analytics
- Error tracking and logging
- Email delivery monitoring
- Database performance metrics

## Contributing Guidelines

### Code Style

- TypeScript strict mode enabled
- ESLint and Prettier configuration
- Conventional commit messages
- Component documentation with JSDoc

### Pull Request Process

1. Create feature branch from main
2. Implement changes with tests
3. Run design review using `/design-review` command
4. Ensure all tests pass
5. Submit PR with description and screenshots
6. Code review and approval required
7. Automated deployment to staging/production

### Design Review Process

- Use `@agent-design-review` for comprehensive UI/UX reviews
- Automated accessibility and responsiveness testing
- Visual regression testing with screenshots
- Performance impact assessment

This project emphasizes quality, user experience, and maintainable code while leveraging modern web development best practices and automated design validation workflows.
