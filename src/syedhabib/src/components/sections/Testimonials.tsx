"use client";

import { motion } from "framer-motion";
import { Star } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  platform: 'Upwork' | 'Fiverr' | 'LinkedIn' | 'Direct';
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Marketing Director",
    company: "TechStart Inc.",
    content: "Working with Syed was a game-changer for our digital presence. Their strategic approach to our marketing campaigns resulted in a 150% increase in qualified leads within just three months.",
    rating: 5,
    platform: "Upwork"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "CEO",
    company: "GreenLeaf Organics",
    content: "The website Syed built for us exceeded our expectations. They understood our brand perfectly and delivered a solution that's both beautiful and functional. Our online sales have increased by 80%.",
    rating: 5,
    platform: "Fiverr"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Founder",
    company: "Bloom & Grow",
    content: "Syed's expertise in both digital marketing and web development is impressive. They helped us streamline our online operations and implement strategies that have significantly improved our conversion rates.",
    rating: 5,
    platform: "LinkedIn"
  },
  {
    id: 4,
    name: "David Kim",
    role: "Product Manager",
    company: "Nexus Innovations",
    content: "We've worked with many developers, but Syed stands out for their attention to detail and commitment to delivering exceptional results. They consistently go above and beyond.",
    rating: 5,
    platform: "Direct"
  },
];

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <motion.div 
      className="bg-card border border-border rounded-xl p-6 h-full flex flex-col"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="flex items-center mb-4">
        <div className="flex-1">
          <div className="flex items-center mb-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`} 
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">via {testimonial.platform}</span>
        </div>
      </div>
      <p className="text-muted-foreground mb-6 flex-1">&quot;{testimonial.content}&quot;</p>
      <div className="mt-auto">
        <div className="font-medium">{testimonial.name}</div>
        <div className="text-sm text-muted-foreground">
          {testimonial.role}, {testimonial.company}
        </div>
      </div>
    </motion.div>
  );
};

export default function Testimonials() {
  return (
    <section className="py-20 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
      <div className="container max-w-6xl mx-auto px-4 relative">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-4 py-1 rounded-full mb-4">
            Client Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Trusted by Businesses Worldwide
          </h2>
          <p className="text-muted-foreground text-lg">
            Don&apos;t just take our word for it. Here&apos;s what our clients have to say about working with us.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: testimonial.id * 0.1 }}
              viewport={{ once: true }}
            >
              <TestimonialCard testimonial={testimonial} />
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="text-muted-foreground mb-6">
            Ready to experience the difference? Let&apos;s work together on your next project.
          </p>
          <a 
            href="#contact" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Get in Touch
          </a>
        </motion.div>
      </div>
    </section>
  );
}
