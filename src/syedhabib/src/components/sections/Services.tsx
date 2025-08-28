"use client";

import services, { Service } from "@/services";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const ServiceCard = ({ service, index }: { service: Service; index: number }) => (
  <motion.div
    key={index}
    className="group bg-card rounded-xl p-8 border border-border hover:border-primary/20 transition-all duration-300 hover:shadow-lg"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: index * 0.1 }}
  >
    <div className="flex items-start gap-4">
      <div className="p-3 rounded-lg bg-primary/10 text-primary">
        {service.icon}
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
          {service.title}
        </h3>
        <p className="text-muted-foreground mb-4">{service.description}</p>
        <ul className="space-y-2 mt-4">
          {service.features?.map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <span className="text-primary">✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </motion.div>
);

export default function Services() {
  return (
    <section className="py-20 md:py-28 bg-background relative overflow-hidden" id="services">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
      <div className="container max-w-6xl mx-auto px-4 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span 
            className="inline-block bg-primary/10 text-primary text-sm font-medium px-4 py-1 rounded-full mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            My Services
          </motion.span>
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Complete Web Development Solutions
          </motion.h2>
          <motion.p 
            className="text-muted-foreground text-lg"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            From custom websites to complex web applications, I create digital solutions that convert visitors into customers.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>

        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-muted-foreground mb-6">
            Ready to build a website that grows your business? Let&apos;s discuss your project requirements.
          </p>
          <a 
            href="#contact" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

        <p>Don&apos;t see what you&apos;re looking for? Reach out for a custom web development solution!</p>
      </div>
    </section>
  );
}
