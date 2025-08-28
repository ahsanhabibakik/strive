export interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  technologies: string[];
  image: string;
  link: string;
  github?: string;
  featured: boolean;
  results?: string[];
  testimonial?: {
    client: string;
    feedback: string;
  };
}

const projects: Project[] = [
  {
    id: "rupomoti-website",
    name: "Rupomoti - Jewelry E-commerce Website",
    description: "Built a custom e-commerce website for a jewelry business with product catalog, shopping cart, and payment integration.",
    category: "Web Development",
    technologies: ["Next.js", "React", "Stripe Integration", "MongoDB", "Tailwind CSS"],
    image: "/projects/facebook-ads.jpg",
    link: "https://rupomoti.com",
    featured: true,
    results: [
      "Built full e-commerce platform with payment processing",
      "Implemented responsive design for mobile and desktop",
      "Created admin dashboard for inventory management"
    ]
  },
  {
    id: "qalbbox-platform",
    name: "Qalbbox - Custom Gifting Platform",
    description: "Developed a full-stack e-commerce platform for personalized gifting with custom product builder, user accounts, and order management.",
    category: "Web Development",
    technologies: ["Next.js", "React", "Node.js", "PostgreSQL", "Tailwind CSS", "Payment Gateway"],
    image: "/projects/ecommerce.jpg",
    link: "https://qalbbox.com",
    featured: true,
    results: [
      "Built full-stack e-commerce platform with custom features",
      "Implemented user authentication and order tracking",
      "Created responsive design with 98% mobile performance score"
    ]
  },
  {
    id: "ebrikkho-platform",
    name: "eBrikkho - E-commerce Platform & Inventory System",
    description: "Co-founded and built complete e-commerce platform for sustainable plant business with custom inventory management, order processing, and analytics.",
    category: "Web Development",
    technologies: ["Next.js", "TypeScript", "MongoDB", "Node.js", "Stripe", "Admin Dashboard"],
    image: "/projects/mobile-ui.jpg",
    link: "https://ebrikkho.com",
    featured: true,
    results: [
      "Built full e-commerce platform from scratch",
      "Implemented custom inventory management system",
      "Achieved 500+ orders and 2.5x conversion rate improvement"
    ]
  },
  {
    id: "university-web-app",
    name: "University Management Web Application",
    description: "Built a comprehensive web application for university course management with student portal, grade tracking, and admin functionality.",
    category: "Web Development",
    technologies: ["React", "Express.js", "MySQL", "JWT Authentication", "Material-UI"],
    image: "/projects/mobile-ui copy.jpg",
    link: "#",
    featured: false,
    results: [
      "Created multi-role user system (students, teachers, admin)",
      "Implemented real-time grade tracking and notifications",
      "Built responsive interface for mobile and desktop"
    ]
  },
  {
    id: "portfolio-website",
    name: "Personal Portfolio Website with CMS",
    description: "Modern portfolio website with custom CMS for blog management, project showcases, and contact form handling. Built with performance optimization in mind.",
    category: "Web Development",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "MongoDB", "NextAuth"],
    image: "/projects/portfolio.jpg",
    link: "#",
    github: "https://github.com/syedhabib",
    featured: true,
    results: [
      "Achieved 98+ Google PageSpeed score",
      "Built custom CMS with authentication system",
      "Implemented SEO optimization and analytics integration"
    ]
  },
  {
    id: "react-native-app",
    name: "Mobile Expense Tracker App",
    description: "Built a React Native mobile application for expense tracking with offline functionality, data sync, and budget planning features.",
    category: "Mobile Development",
    technologies: ["React Native", "TypeScript", "SQLite", "Firebase", "Chart.js"],
    image: "/projects/mobile-ui copy 2.jpg",
    link: "#",
    featured: false,
    results: [
      "Built cross-platform mobile app for iOS and Android",
      "Implemented offline-first architecture with data sync",
      "Created intuitive UI with data visualization charts"
    ]
  }
];

export default projects; 