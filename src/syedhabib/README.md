# Next.js Modern Web Application


A modern, feature-rich web application built with Next.js 14, TypeScript, and Tailwind CSS. This project implements best practices for performance, security, and user experience.

Last updated: 2024-03-19

## 🌟 Features

### 🔐 Authentication & Authorization
- Next-Auth integration for secure authentication
- Multiple authentication providers support
- Protected API routes and pages
- Role-based access control (Admin/User)

### 🎨 UI/UX
- Modern, responsive design using Tailwind CSS
- Dark/Light theme support with next-themes
- Custom UI components using Radix UI
- Smooth animations with Framer Motion
- Optimized fonts with next/font
- Icon support with Lucide React and React Icons

### 📝 Content Management
- MDX support for rich content
- Content Layer integration
- Markdown processing with remark
- Dynamic content rendering
- Gray-matter for frontmatter parsing

### 🔧 Technical Features
- TypeScript for type safety
- MongoDB integration with type support
- API routes with proper error handling
- Form handling with react-hook-form and zod validation
- Email functionality using Resend
- Date formatting with date-fns

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PNPM (recommended) or NPM
- MongoDB database
- Git

### Environment Variables
Create a `.env.local` file in the root directory with the following variables:

```env
# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# MongoDB
MONGODB_URI=your-mongodb-connection-string

# Email (Resend)
RESEND_API_KEY=your-resend-api-key

# Other configurations
NODE_ENV=development
```

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser.

## 🏗️ Project Structure

```
src/
├── app/                 # Next.js 14 App Router
│   ├── api/            # API routes
│   ├── (auth)/         # Authentication related pages
│   └── ...             # Other route groups
├── components/         # Reusable React components
├── lib/               # Utility functions and configurations
├── types/             # TypeScript type definitions
├── styles/            # Global styles and Tailwind config
└── content/           # MDX and markdown content
```

## 🛠️ Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build production bundle
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm add-admin` - Add admin user to database

## 🔒 Security Features

- CSRF protection
- Secure authentication with Next-Auth
- Password hashing with bcryptjs
- Protected API routes
- Secure headers
- Input validation with Zod

## 🎨 Styling and UI

### Theme Support
The application supports both light and dark themes using `next-themes`. Theme switching is persistent across sessions.

### UI Components
- Custom components built with Radix UI
- Tailwind CSS for styling
- Class variance authority for component variants
- Tailwind merge for class name conflicts

## 📦 Major Dependencies

### Core
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS

### Authentication & Database
- NextAuth.js
- MongoDB
- @auth/mongodb-adapter

### UI & Styling
- Tailwind CSS
- Radix UI
- Framer Motion
- Lucide React
- React Icons

### Forms & Validation
- React Hook Form
- Zod
- Hookform Resolvers

### Content
- MDX
- Contentlayer
- Remark
- Gray Matter

## 🔄 Development Workflow

1. Create feature branch from main
2. Make changes and test locally
3. Commit changes (follows conventional commits)
4. Push and create PR
5. Deploy to staging for testing
6. Merge to main for production

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [MongoDB Documentation](https://docs.mongodb.com)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- All open-source contributors

---

For more information or support, please open an issue in the repository.
