export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  image: string;
  content: string;
  rating: number;
  project: string;
}

const testimonials: Testimonial[] = [
  {
    id: "fatima-rupomoti",
    name: "Fatima Akik",
    role: "Co-founder",
    company: "Rupomoti",
    image: "/images/testimonials/fatima.jpg",
    content: "Akik built our complete e-commerce website from scratch. The custom features he developed helped us manage our jewelry inventory efficiently and process payments seamlessly. Our online sales increased by 300% after launching the new platform!",
    rating: 5,
    project: "Rupomoti E-commerce Website Development"
  },
  {
    id: "delwer-qalbbox",
    name: "Delwer Hossain",
    role: "Co-founder",
    company: "Qalbbox",
    image: "/images/testimonials/mohammed.jpg",
    content: "Akik developed a sophisticated e-commerce platform for Qalbbox with custom gifting features. His technical expertise in React and Node.js helped us create a unique user experience. The website handles hundreds of orders seamlessly and our conversion rate improved by 250%.",
    rating: 5,
    project: "Qalbbox Custom E-commerce Platform Development"
  },
  {
    id: "customer-ebrikkho",
    name: "Ruma Khatun",
    role: "Plant Enthusiast",
    company: "Home Gardener",
    image: "/images/testimonials/sarah.jpg",
    content: "I love shopping on the eBrikkho website! The interface is so intuitive and the checkout process is smooth. Akik built a fantastic platform that makes ordering plants effortless. The website loads fast and works perfectly on my phone too!",
    rating: 5,
    project: "eBrikkho E-commerce Platform User Experience"
  },
  {
    id: "omar-business",
    name: "Omar Hassan",
    role: "Small Business Owner",
    company: "Local Restaurant",
    image: "/images/testimonials/fatima.jpg", // Reusing image for now
    content: "Akik built our restaurant's website with online ordering functionality and reservation system. The responsive design works perfectly on all devices and our online orders increased by 400%. His technical skills and attention to detail are outstanding!",
    rating: 5,
    project: "Restaurant Website & Online Ordering System"
  },
  {
    id: "ayesha-student",
    name: "Ayesha Begum",
    role: "MBA Student",
    company: "North South University",
    image: "/images/testimonials/sarah.jpg", // Reusing image for now
    content: "Akik developed a web application for our university project management system. His expertise in React and database design helped us create a comprehensive solution for tracking student projects and grades. The system is still being used by our department!",
    rating: 5,
    project: "University Web Application Development"
  },
  {
    id: "karim-startup",
    name: "Abdul Karim",
    role: "Startup Founder",
    company: "Tech Startup",
    image: "/images/testimonials/mohammed.jpg", // Reusing image for now
    content: "Akik built our startup's MVP web application using modern technologies. His full-stack development skills helped us go from concept to a working product in just 3 months. The application is scalable and performs excellently under high user load.",
    rating: 5,
    project: "Startup MVP Web Application Development"
  }
];

export default testimonials;
