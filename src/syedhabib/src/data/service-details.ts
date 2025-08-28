import { Search, Lightbulb, Code, Rocket, BarChart, Zap } from 'lucide-react';

// Pricing plans for different services
export const pricingPlans = {
  website: [
    {
      name: "Basic Website",
      price: "$799",
      description: "Perfect for small businesses just getting started online",
      features: [
        { text: "5-page responsive website", included: true },
        { text: "Mobile optimization", included: true },
        { text: "Contact form", included: true },
        { text: "Basic SEO setup", included: true },
        { text: "Social media integration", included: true },
        { text: "1 month of support", included: true },
        { text: "Content management system", included: false },
        { text: "E-commerce functionality", included: false }
      ],
      popular: false,
      cta: "Get Started",
      ctaLink: "/contact"
    },
    {
      name: "Business Website",
      price: "$1,499",
      description: "Complete solution for established businesses looking to grow",
      features: [
        { text: "10-page responsive website", included: true },
        { text: "Content management system", included: true },
        { text: "Blog setup", included: true },
        { text: "Advanced SEO package", included: true },
        { text: "Google Analytics integration", included: true },
        { text: "Email newsletter setup", included: true },
        { text: "3 months of support", included: true },
        { text: "E-commerce functionality", included: false }
      ],
      popular: true,
      cta: "Most Popular",
      ctaLink: "/contact"
    },
    {
      name: "E-Commerce",
      price: "$2,499",
      description: "Full online store setup with payment processing",
      features: [
        { text: "Custom online store", included: true },
        { text: "Product management system", included: true },
        { text: "Payment gateway integration", included: true },
        { text: "Inventory management", included: true },
        { text: "Order tracking", included: true },
        { text: "Customer accounts", included: true },
        { text: "6 months of support", included: true },
        { text: "Marketing automation", included: true }
      ],
      popular: false,
      cta: "Start Selling",
      ctaLink: "/contact"
    }
  ],
  marketing: [
    {
      name: "Starter",
      price: "$499/mo",
      description: "Essential digital marketing for small businesses",
      features: [
        { text: "Social media management (2 platforms)", included: true },
        { text: "4 social posts per week", included: true },
        { text: "Basic SEO optimization", included: true },
        { text: "Monthly performance report", included: true },
        { text: "Google Business Profile optimization", included: true },
        { text: "Google Ads management", included: false },
        { text: "Content creation", included: false },
        { text: "Email marketing", included: false }
      ],
      popular: false,
      cta: "Get Started",
      ctaLink: "/contact"
    },
    {
      name: "Growth",
      price: "$999/mo",
      description: "Comprehensive marketing for business growth",
      features: [
        { text: "Social media management (4 platforms)", included: true },
        { text: "Daily social posts", included: true },
        { text: "Advanced SEO optimization", included: true },
        { text: "Weekly performance reports", included: true },
        { text: "Google Business Profile optimization", included: true },
        { text: "Google Ads management ($1000 budget)", included: true },
        { text: "Content creation (4 blog posts/mo)", included: true },
        { text: "Email marketing", included: true }
      ],
      popular: true,
      cta: "Most Popular",
      ctaLink: "/contact"
    },
    {
      name: "Enterprise",
      price: "$1,999/mo",
      description: "Full-service marketing for maximum results",
      features: [
        { text: "Social media management (all platforms)", included: true },
        { text: "Multiple daily social posts", included: true },
        { text: "Premium SEO optimization", included: true },
        { text: "Real-time performance dashboard", included: true },
        { text: "Google Business Profile optimization", included: true },
        { text: "Google & Facebook Ads management", included: true },
        { text: "Content creation (8 blog posts/mo)", included: true },
        { text: "Email marketing automation", included: true }
      ],
      popular: false,
      cta: "Contact Us",
      ctaLink: "/contact"
    }
  ]
};

// Service process steps
export const processSteps = {
  website: [
    {
      title: "Discovery",
      description: "We learn about your business goals, target audience, and requirements",
      icon: Search
    },
    {
      title: "Design",
      description: "We create wireframes and visual designs for your approval",
      icon: Lightbulb
    },
    {
      title: "Development",
      description: "We build your website with clean, efficient code",
      icon: Code
    },
    {
      title: "Launch",
      description: "We deploy your site and provide training on how to use it",
      icon: Rocket
    }
  ],
  marketing: [
    {
      title: "Audit",
      description: "We analyze your current marketing and identify opportunities",
      icon: Search
    },
    {
      title: "Strategy",
      description: "We create a custom marketing plan aligned with your goals",
      icon: Lightbulb
    },
    {
      title: "Execution",
      description: "We implement campaigns across selected channels",
      icon: Zap
    },
    {
      title: "Optimization",
      description: "We continuously monitor and improve performance",
      icon: BarChart
    }
  ]
};

// Service-specific testimonials
export const serviceTestimonials = [
  {
    name: "Sarah Johnson",
    position: "Owner",
    company: "The Local Bistro",
    image: "/testimonials/sarah.jpg",
    quote: "Our online orders increased by 75% within the first month after launching our new website. The online ordering system is so easy to use that our customers love it.",
    service: "Website Development",
    stars: 5
  },
  {
    name: "Michael Chen",
    position: "Founder",
    company: "Spice House",
    quote: "The Facebook ad campaign brought in so many new customers that we had to hire more staff. The ROI has been incredible.",
    image: "/testimonials/michael.jpg",
    service: "Digital Marketing",
    stars: 5
  },
  {
    name: "Emma Davis",
    position: "CEO",
    company: "Urban Boutique",
    quote: "Our e-commerce sales have doubled since the new website launched. The product filtering and checkout process is so smooth now.",
    image: "/testimonials/emma.jpg",
    service: "E-commerce Solutions",
    stars: 5
  },
  {
    name: "James Wilson",
    position: "Marketing Director",
    company: "Outdoor Gear Shop",
    quote: "The SEO work has put us on the first page of Google for our main keywords. We're getting consistent traffic and sales now.",
    image: "/testimonials/james.jpg",
    service: "Digital Marketing",
    stars: 4
  },
  {
    name: "Robert Thompson",
    position: "Partner",
    company: "Thompson Law Firm",
    quote: "The website redesign has completely transformed our online presence. We're getting more qualified leads than ever before.",
    image: "/testimonials/robert.jpg",
    service: "Website Development",
    stars: 5
  },
  {
    name: "Dr. Lisa Wang",
    position: "Director",
    company: "Wellness Clinic",
    quote: "The online booking system has reduced our administrative workload by 40%. Patients love being able to book appointments online.",
    image: "/testimonials/lisa.jpg",
    service: "Website Development",
    stars: 5
  }
];

// Service FAQs
export const serviceFAQs = {
  website: [
    {
      question: "How long does it take to build a website?",
      answer: "A basic website typically takes 2-4 weeks to complete, while more complex websites or e-commerce stores can take 6-8 weeks. The timeline depends on the scope of the project, the number of pages, and any custom functionality required."
    },
    {
      question: "Do I need to provide content for my website?",
      answer: "Ideally, yes. While we can help with basic content creation and optimization, you know your business best. We provide guidance on what content works well, but the most effective websites have content that reflects the owner's expertise and voice."
    },
    {
      question: "Will my website be mobile-friendly?",
      answer: "Absolutely! All our websites are built with responsive design, ensuring they look great and function perfectly on all devices - from desktop computers to tablets and smartphones."
    },
    {
      question: "Can I update the website myself after it's built?",
      answer: "Yes! We build most of our websites on user-friendly content management systems that allow you to easily update content, add pages, blog posts, and more. We also provide training so you feel comfortable making updates."
    },
    {
      question: "Do you provide website hosting?",
      answer: "We can set up hosting for you on reliable, high-performance servers. We handle all the technical aspects of hosting setup, and you'll own the hosting account. We can also work with your existing hosting if you prefer."
    }
  ],
  marketing: [
    {
      question: "How long before I see results from digital marketing?",
      answer: "This varies by channel. Social media advertising can show results within days, while SEO typically takes 3-6 months to see significant improvements. We provide realistic timelines based on your specific goals and industry."
    },
    {
      question: "What's included in your social media management?",
      answer: "Our social media management includes content creation, posting schedule, community engagement, analytics reporting, and strategy adjustments. We create a mix of promotional, educational, and engaging content tailored to your audience."
    },
    {
      question: "How do you measure marketing success?",
      answer: "We establish clear KPIs at the beginning of our engagement based on your business goals. These might include website traffic, lead generation, conversion rates, engagement metrics, or sales. We provide regular reports showing progress against these metrics."
    },
    {
      question: "Do I need to be on all social media platforms?",
      answer: "No, and we don't recommend it. We help you identify which platforms your target audience uses most and focus efforts there. Quality engagement on 2-3 platforms is more effective than spreading yourself thin across all of them."
    },
    {
      question: "Can I cancel my marketing services if needed?",
      answer: "Yes, our marketing services operate on monthly contracts with a 30-day notice period for cancellation. There are no long-term commitments, though we find that digital marketing is most effective when given time to build momentum."
    }
  ]
};