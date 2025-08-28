'use client';

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Calendar,
  Clock,
  Target,
  Users,
  Lightbulb,
  Rocket,
} from "lucide-react";
import { notFound } from "next/navigation";

// Sample project data - in a real app, this would come from a database or CMS
const projectsData = {
  ecommerce: {
    title: "E-commerce Platform",
    description:
      "Custom online store with seamless checkout and inventory management.",
    client: "Fashion Retailer",
    duration: "8 weeks",
    year: "2023",
    tags: ["Next.js", "Stripe", "MongoDB"],
    result: "43% increase in conversion rate",
    challenge:
      "The client needed a modern e-commerce platform that could handle their growing inventory and provide a seamless shopping experience for their customers. Their existing website was slow, difficult to update, and had a high cart abandonment rate.",
    solution:
      "We built a custom e-commerce platform using Next.js for the frontend and MongoDB for the backend. We integrated Stripe for secure payments and implemented a user-friendly admin dashboard for inventory management. The site was optimized for mobile and featured a streamlined checkout process.",
    results: [
      "43% increase in conversion rate",
      "65% reduction in cart abandonment",
      "28% increase in average order value",
      "52% improvement in page load speed",
    ],
    testimonial: {
      quote:
        "The new website has completely transformed our online business. It's faster, easier to use, and our customers love the new checkout process.",
      author: "Emma Davis",
      position: "Marketing Director",
      company: "Fashion Retailer",
    },
    images: [
      "/images/projects/ecommerce-1.jpg",
      "/images/projects/ecommerce-2.jpg",
    ],
    features: [
      "Responsive design for all devices",
      "Secure payment processing with Stripe",
      "Inventory management system",
      "Customer account portal",
      "Advanced product filtering",
      "Wishlist functionality",
      "Order tracking system",
    ],
  },
  "facebook-campaign": {
    title: "Facebook Ad Campaign",
    description:
      "Strategic ad campaign that delivered qualified leads and measurable ROI.",
    client: "Local Restaurant",
    duration: "3 months",
    year: "2023",
    tags: ["Facebook Ads", "Marketing", "Analytics"],
    result: "150% increase in conversions",
    challenge:
      "A local restaurant was struggling to attract new customers despite having excellent food and service. They had tried traditional advertising methods with limited success and needed a more targeted approach to reach potential customers in their area.",
    solution:
      "We developed a comprehensive Facebook ad campaign targeting local food enthusiasts within a 5-mile radius of the restaurant. " +
      "The campaign included carousel ads showcasing their signature dishes, special offer ads for first-time visitors, " +
      "and retargeting ads for people who had engaged with their content but hadn't visited yet.",
    results: [
      "150% increase in new customer acquisitions",
      "32% increase in overall revenue",
      "4.2x return on ad spend (ROAS)",
      "68% reduction in cost per acquisition",
    ],
    testimonial: {
      quote:
        "The Facebook campaign brought in so many new customers that we had to hire additional staff. The ROI has been incredible and we're now booked solid most weekends.",
      author: "Michael Chen",
      position: "Owner",
      company: "Local Restaurant",
    },
    images: [
      "/images/projects/facebook-1.jpg",
      "/images/projects/facebook-2.jpg",
    ],
    features: [
      "Targeted local audience segmentation",
      "Custom ad creative for different customer personas",
      "A/B testing of ad copy and images",
      "Conversion tracking implementation",
      "Weekly performance reporting",
      "Budget optimization based on performance data",
      "Retargeting campaigns for engaged users",
    ],
  },
  "restaurant-case-study": {
    title: "Restaurant Website Redesign",
    description:
      "Complete website redesign with online ordering system for a local restaurant.",
    client: "The Local Bistro",
    duration: "6 weeks",
    year: "2023",
    tags: ["Web Design", "Online Ordering", "SEO"],
    result: "156% increase in online orders",
    challenge:
      "The Local Bistro had an outdated website that wasn't mobile-friendly and lacked online ordering capabilities. " +
      "They were losing business to competitors with more modern digital presences, especially during the pandemic when online ordering became essential.",
    solution:
      "We redesigned their website with a modern, responsive design that showcased their food beautifully. " +
      "We integrated a seamless online ordering system that connected directly to their POS system, " +
      "and optimized the site for local SEO to improve their visibility in search results.",
    results: [
      "156% increase in online orders within the first month",
      "43% increase in website traffic from local searches",
      "28% increase in average order value compared to phone orders",
      "4.8/5 star rating for the online ordering experience",
    ],
    testimonial: {
      quote:
        "Our online orders doubled within the first month after the new website launched. The online ordering system is so easy to use that our customers love it, and it's reduced the load on our staff who previously had to take all orders by phone.",
      author: "Sarah Johnson",
      position: "Owner",
      company: "The Local Bistro",
    },
    images: [
      "/images/portfolio/restaurant-before.svg",
      "/images/portfolio/restaurant-after.svg",
    ],
    features: [
      "Mobile-responsive design",
      "Integrated online ordering system",
      "Menu management system",
      "Photo gallery of dishes",
      "Customer reviews integration",
      "Local SEO optimization",
      "Google Business Profile integration",
    ],
  },
  "retail-case-study": {
    title: "Retail Store E-commerce Solution",
    description:
      "Custom e-commerce website with intuitive product filtering for a retail store.",
    client: "Urban Boutique",
    duration: "10 weeks",
    year: "2023",
    tags: ["E-commerce", "UX Design", "Conversion Optimization"],
    result: "43% increase in conversion rate",
    challenge:
      "Urban Boutique had a basic online store with poor user experience, confusing navigation, and a complicated checkout process. Their conversion rate was low, and customers frequently abandoned their carts before completing purchases.",
    solution:
      "We redesigned their e-commerce site with a focus on user experience and conversion optimization. We implemented intuitive product filtering, streamlined the checkout process to just three steps, and added high-quality product photography with zoom functionality.",
    results: [
      "43% increase in conversion rate",
      "38% reduction in cart abandonment",
      "27% increase in time spent on site",
      "52% increase in mobile purchases",
    ],
    testimonial: {
      quote:
        "The new website design made it so much easier for customers to find and purchase products. Our online sales have doubled since the launch, and we've received numerous compliments from customers about how easy the site is to use.",
      author: "Emma Davis",
      position: "CEO",
      company: "Urban Boutique",
    },
    images: [
      "/images/portfolio/retail-before.svg",
      "/images/portfolio/retail-after.svg",
    ],
    features: [
      "Advanced product filtering system",
      "Streamlined 3-step checkout",
      "Product recommendation engine",
      "Mobile-optimized shopping experience",
      "Integrated inventory management",
      "Customer account portal",
      "Wishlist functionality",
    ],
  },
};

export default function ProjectClient() {
  const { slug } = useParams();
  const projectSlug = Array.isArray(slug) ? slug[0] : slug;

  // Get project data based on slug
  const project = projectsData[projectSlug as keyof typeof projectsData];

  // If project doesn't exist, return 404
  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container px-4">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/projects"
            className="text-sm text-muted-foreground hover:text-primary flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Projects
          </Link>
        </div>

        {/* Project Header */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant="secondary" className="text-xs">
              Case Study
            </Badge>
            <Badge variant="outline" className="text-xs">
              {project.client}
            </Badge>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {project.title}
          </h1>

          <p className="text-lg text-muted-foreground max-w-3xl mb-6">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="font-medium">Year:</span> {project.year}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="font-medium">Duration:</span> {project.duration}
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-green-500" />
              <span className="font-medium">Result:</span> {project.result}
            </div>
          </div>
        </div>

        {/* Project Images */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {project.images.map((image, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="relative">
                <div className="absolute top-2 left-2 bg-background/80 text-sm font-medium px-2 py-1 rounded z-10">
                  {index === 0 ? "Before" : "After"}
                </div>
                <Image
                  src={image}
                  alt={`${project.title} ${index === 0 ? "Before" : "After"}`}
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
            </Card>
          ))}
        </div>

        {/* Project Details */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Project Overview</h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    The Challenge
                  </h3>
                  <p className="text-muted-foreground">{project.challenge}</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-primary" />
                    The Solution
                  </h3>
                  <p className="text-muted-foreground">{project.solution}</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-primary" />
                    The Results
                  </h3>
                  <ul className="space-y-2">
                    {project.results.map((result, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Technologies & Features</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="bg-primary/5">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="space-y-2">
                  {project.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 bg-primary/5 border-primary/20">
                <h3 className="font-semibold mb-4">Client Testimonial</h3>
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="text-primary"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="italic text-sm mb-4">
                  "{project.testimonial.quote}"
                </p>
                <div>
                  <p className="font-medium text-sm">
                    {project.testimonial.author}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {project.testimonial.position},{" "}
                    {project.testimonial.company}
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="p-8 text-center bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <h2 className="text-2xl font-bold mb-4">
            Want Similar Results for Your Business?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Book a free 30-minute consultation to discuss your project needs and
            goals.
          </p>
          <Button asChild size="lg" className="px-8">
            <Link href="/contact" className="flex items-center">
              Book Your Free Consultation
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              No obligation
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Custom solution
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Results guaranteed
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}