'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Database, 
  Palette, 
  Globe, 
  Settings,
  Zap,
  Heart,
  Star,
  Sparkles
} from 'lucide-react';

const skillCategories = [
  {
    title: 'Frontend',
    icon: Globe,
    color: 'from-blue-500 to-cyan-500',
    skills: [
      { name: 'React', level: 95, icon: '⚛️' },
      { name: 'Next.js', level: 90, icon: '▲' },
      { name: 'TypeScript', level: 85, icon: '🔷' },
      { name: 'Tailwind CSS', level: 95, icon: '💨' },
      { name: 'JavaScript', level: 95, icon: '🟨' },
      { name: 'HTML/CSS', level: 98, icon: '🌐' },
    ]
  },
  {
    title: 'Backend',
    icon: Database,
    color: 'from-green-500 to-emerald-500',
    skills: [
      { name: 'Node.js', level: 90, icon: '🟢' },
      { name: 'Express.js', level: 88, icon: '🚀' },
      { name: 'MongoDB', level: 85, icon: '🍃' },
      { name: 'Firebase', level: 80, icon: '🔥' },
      { name: 'RESTful APIs', level: 92, icon: '🔗' },
      { name: 'Authentication', level: 85, icon: '🔐' },
    ]
  },
  {
    title: 'Design & UI/UX',
    icon: Palette,
    color: 'from-purple-500 to-pink-500',
    skills: [
      { name: 'Figma', level: 85, icon: '🎨' },
      { name: 'Responsive Design', level: 95, icon: '📱' },
      { name: 'User Experience', level: 88, icon: '👤' },
      { name: 'Prototyping', level: 80, icon: '🎯' },
      { name: 'Brand Design', level: 75, icon: '✨' },
      { name: 'Animation', level: 85, icon: '🎬' },
    ]
  },
  {
    title: 'Tools & Others',
    icon: Settings,
    color: 'from-orange-500 to-red-500',
    skills: [
      { name: 'Git & GitHub', level: 92, icon: '🐙' },
      { name: 'VS Code', level: 98, icon: '💻' },
      { name: 'Vercel/Netlify', level: 90, icon: '🌍' },
      { name: 'Digital Marketing', level: 85, icon: '📊' },
      { name: 'SEO', level: 80, icon: '🔍' },
      { name: 'Project Management', level: 88, icon: '📈' },
    ]
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 20
    }
  },
};

export default function SkillsSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-background via-accent/5 to-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-small-black dark:bg-grid-small-white opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-transparent to-background/90" />
      
      <div className="container px-4 mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
          >
            <Zap className="w-4 h-4" />
            Skills & Technologies
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            What I Work With
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8 px-4 text-base md:text-lg leading-relaxed">
            I&apos;ve honed my skills across the full spectrum of web development, from crafting pixel-perfect frontends to building robust backend systems.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
        >
          {skillCategories.map((category, index) => (
            <motion.div key={category.title} variants={itemVariants}>
              <Card className="p-6 md:p-8 h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${category.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <category.icon className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-foreground">
                    {category.title}
                  </h3>
                </div>

                <div className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + skillIndex * 0.05 }}
                      className="group/skill"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{skill.icon}</span>
                          <span className="text-sm md:text-base font-medium text-foreground group-hover/skill:text-primary transition-colors">
                            {skill.name}
                          </span>
                        </div>
                        <span className="text-xs md:text-sm text-muted-foreground font-medium">
                          {skill.level}%
                        </span>
                      </div>
                      
                      <div className="w-full bg-muted/50 rounded-full h-2 md:h-2.5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ 
                            delay: index * 0.1 + skillIndex * 0.05 + 0.2,
                            duration: 0.8,
                            ease: "easeOut"
                          }}
                          className={`h-full bg-gradient-to-r ${category.color} rounded-full relative overflow-hidden`}
                        >
                          <motion.div
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ 
                              duration: 2, 
                              repeat: Infinity, 
                              ease: "linear",
                              delay: index * 0.2 + skillIndex * 0.1
                            }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          />
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Category badge */}
                <div className="mt-6 flex items-center justify-between">
                  <Badge variant="outline" className="text-xs bg-primary/5 border-primary/20 text-primary">
                    {category.skills.length} Skills
                  </Badge>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-muted-foreground'}`} 
                      />
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Fun fact section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-12 md:mt-16 text-center"
        >
          <Card className="p-6 md:p-8 bg-gradient-to-r from-primary/5 via-background to-primary/5 border-primary/20 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Heart className="w-5 h-5 text-red-500 animate-pulse" />
              <Sparkles className="w-5 h-5 text-yellow-500 animate-bounce" />
              <Heart className="w-5 h-5 text-red-500 animate-pulse" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">
              Always Learning & Growing
            </h3>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
              Technology evolves rapidly, and so do I. I&apos;m constantly exploring new frameworks, 
              tools, and methodologies to deliver the best solutions for my clients.
            </p>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
