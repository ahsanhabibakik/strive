# SEO Components

This directory contains all SEO-related components for the website, including structured data (JSON-LD), meta tags, and other SEO enhancements.

## Component Categories

### Base Components

- **JsonLd**: Base component for rendering JSON-LD structured data
- **CanonicalUrl**: Component for adding canonical URLs
- **SocialMetaTags**: Component for adding OpenGraph and Twitter card meta tags
- **GoogleTagManager**: Component for Google Tag Manager integration

### Schema.org Components

- **OrganizationSchema**: Company information with contact details
- **LocalBusinessSchema**: Local business information with service area
- **WebsiteSchema**: Website information with search functionality
- **PersonSchema**: Personal information for the website owner
- **LogoSchema**: Logo information for brand recognition
- **HomePageSchema**: Home page with services overview
- **ServiceSchema**: Individual service details
- **ServicePageSchema**: Service page with offers
- **ServicePageWrapper**: Service page with breadcrumbs
- **ProjectSchema**: Individual project details
- **ProjectPageSchema**: Project page with client information
- **ProjectListingSchema**: Projects index with project listings
- **ProjectsIndexSchema**: Projects index wrapper
- **ArticleSchema**: Blog post structured data
- **BlogPostSchema**: Blog post with author information
- **BlogIndexSchema**: Blog index with post listings
- **BlogListingSchema**: Blog listing with multiple posts
- **FAQSchema**: FAQ sections for rich results
- **FAQWrapper**: FAQ wrapper with additional context
- **ReviewSchema**: Testimonials and reviews
- **TestimonialsSchema**: Testimonials wrapper
- **BreadcrumbSchema**: Navigation breadcrumbs
- **ContactPageSchema**: Contact page information
- **ContactPageWrapper**: Contact page with breadcrumbs

## Usage

Import components from the SEO directory:

```tsx
import { 
  OrganizationSchema,
  LocalBusinessSchema,
  WebsiteSchema,
  // other components...
} from '@/components/seo';
```

### Example: Adding Schema to a Page

```tsx
export default function ServicePage() {
  const serviceData = {
    name: 'Website Development',
    description: 'Custom websites that convert visitors into customers.',
    url: 'https://syedhabib.com/services/website-development',
    // other properties...
  };

  return (
    <>
      <ServicePageSchema service={serviceData} />
      {/* Page content */}
    </>
  );
}
```

### Example: Adding Meta Tags to a Page

```tsx
export default function BlogPost() {
  return (
    <>
      <SocialMetaTags
        title="Blog Post Title"
        description="Blog post description"
        image="https://syedhabib.com/images/blog-post.jpg"
        url="https://syedhabib.com/blog/post-slug"
        type="article"
      />
      {/* Page content */}
    </>
  );
}
