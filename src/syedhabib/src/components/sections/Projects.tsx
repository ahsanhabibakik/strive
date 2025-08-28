"use client";

import projects, { Project } from "@/projects";
import { motion } from "framer-motion";

export default function Projects() {
  return (
    <section className="py-16 md:py-24 bg-muted/50" id="projects">
      <div className="container max-w-4xl mx-auto text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-semibold mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Projects & Experiments
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 text-left">
          {projects.map((project: Project, index: number) => (
            <motion.a
              key={index}
              href={project.link}
              className="block bg-white dark:bg-black border border-border rounded-xl p-5 hover:shadow-md transition"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
              <p className="text-muted-foreground">{project.description}</p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
