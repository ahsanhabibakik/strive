# Reusable Components Guide

This project provides a comprehensive set of reusable components that can be used in any website or application.

## Installation & Usage

### Method 1: Copy Components
Simply copy the components you need from `src/components/` to your project.

### Method 2: Import as Package
Import individual components or the entire component library:

```typescript
import { Newsletter, Button, Card } from "@/components";
```

## Core Components

### UI Components

#### Button
Basic button component with multiple variants.

```tsx
import { Button } from "@/components/ui/button";

<Button variant="default" size="lg">Click me</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="ghost" size="sm">Small Ghost</Button>
```

**Props:**
- `variant`: "default" | "outline" | "ghost" | "destructive"
- `size`: "sm" | "default" | "lg"
- `asChild`: boolean
- Standard button HTML attributes

#### Input
Styled input field with focus states.

```tsx
import { Input } from "@/components/ui/input";

<Input 
  type="email" 
  placeholder="Enter email" 
  className="w-full"
/>
```

**Props:**
- Standard input HTML attributes
- `className`: string for additional styling

#### Card Components
Flexible card layout components.

```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <p>Footer content</p>
  </CardFooter>
</Card>
```

### Form Components

#### Newsletter
Complete newsletter subscription component with customizable styling and API integration.

```tsx
import { Newsletter } from "@/components/forms/Newsletter";

// Basic usage
<Newsletter />

// Customized usage
<Newsletter 
  title="Join Our Community"
  description="Get weekly updates and exclusive content"
  buttonText="Join Now"
  className="max-w-md mx-auto"
  apiEndpoint="/api/custom-newsletter"
  onSubscribe={async (email) => {
    // Custom subscription logic
    console.log('Subscribing:', email);
  }}
/>
```

**Props:**
- `title`: string - Newsletter title (default: "Subscribe to Newsletter")
- `description`: string - Newsletter description
- `buttonText`: string - Subscribe button text (default: "Subscribe")
- `className`: string - Additional CSS classes
- `apiEndpoint`: string - API endpoint for subscription (default: "/api/newsletter/subscribe")
- `onSubscribe`: (email: string) => Promise<void> - Custom subscription handler

**Features:**
- Email validation
- Loading states
- Success/error feedback
- Responsive design
- Benefits display
- Custom API integration

### Layout Components

#### Navbar
Responsive navigation bar with authentication support.

```tsx
import { Navbar } from "@/components/layout/Navbar";

<Navbar />
```

**Features:**
- Responsive design
- Authentication integration (NextAuth.js)
- User session display
- Sign in/out functionality

#### Providers
Context providers for authentication and other global state.

```tsx
import { Providers } from "@/components/providers/Providers";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

## API Endpoints

### Health Check
`GET /api/health`

Returns system status and checks for database and external service connectivity.

### Newsletter Subscription
`POST /api/newsletter/subscribe`

**Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "Successfully subscribed!"
}
```

### Blog API
`GET /api/blog`

Returns blog posts from Sanity CMS or mock data if not configured.

## Customization

### Styling
All components use Tailwind CSS and can be customized via:

1. **CSS Classes**: Pass `className` props
2. **Tailwind Config**: Modify `tailwind.config.ts`
3. **CSS Variables**: Update `globals.css`

### Theming
Components support light/dark themes through CSS variables:

```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --secondary: 210 40% 96%;
  /* ... */
}

.dark {
  --primary: 210 40% 98%;
  --secondary: 217.2 32.6% 17.5%;
  /* ... */
}
```

### API Integration
All API-dependent components can be configured with custom endpoints:

```tsx
// Use different API endpoints
<Newsletter apiEndpoint="/api/v2/newsletter" />
```

## Best Practices

### 1. Prop Types
Always use TypeScript interfaces for component props:

```typescript
interface MyComponentProps {
  title: string;
  optional?: boolean;
  onClick: () => void;
}
```

### 2. Default Props
Provide sensible defaults:

```typescript
const MyComponent = ({ 
  title = "Default Title",
  className = ""
}: MyComponentProps) => {
  // component logic
}
```

### 3. Accessibility
Components include ARIA attributes and semantic HTML:

```tsx
<Button 
  aria-label="Subscribe to newsletter"
  role="button"
>
  Subscribe
</Button>
```

### 4. Responsive Design
Use Tailwind's responsive utilities:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Responsive grid */}
</div>
```

## Integration Examples

### E-commerce Site
```tsx
<Newsletter 
  title="Get Exclusive Deals"
  description="Subscribe for early access to sales and new products"
  buttonText="Get Deals"
/>
```

### Blog/Content Site
```tsx
<Newsletter 
  title="Weekly Insights"
  description="Join 10,000+ readers getting our weekly newsletter"
  buttonText="Subscribe"
/>
```

### SaaS Application
```tsx
<Newsletter 
  title="Product Updates"
  description="Stay updated with new features and improvements"
  buttonText="Stay Updated"
/>
```

## Testing

Use the test page at `/test` to verify all components and API endpoints are working correctly.

## Contributing

1. Follow existing component patterns
2. Include TypeScript types
3. Add responsive design
4. Test across different use cases
5. Update this documentation

## Support

For issues or questions:
1. Check the `/test` page for debugging
2. Review component source code
3. Check environment variables
4. Verify API endpoints

---

These components are designed to be highly reusable and customizable for any type of website or application.