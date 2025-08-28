'use client';

import { motion, Variants } from 'framer-motion';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  Code, 
  BarChart, 
  TagIcon, 
  Briefcase, 
  Share2, 
  Rocket, 
  ArrowRight,
  CheckCircle,
  Star,
  Zap
} from 'lucide-react';

const services = [
	{
		icon: Code,
		title: 'MERN Stack Development',
		description: 'Building full-stack web applications with MongoDB, Express.js, React, and Node.js.',
		shortDesc: 'Full-stack web applications',
		features: ['RESTful APIs', 'Database Design', 'Authentication', 'Real-time Features'],
		color: 'from-blue-500 to-purple-600',
		price: 'From $500',
		popular: false,
	},
	{
		icon: Rocket,
		title: 'React & Next.js',
		description: 'Creating dynamic user interfaces and server-side rendered applications for optimal performance.',
		shortDesc: 'Modern React applications',
		features: ['Server-Side Rendering', 'Performance Optimization', 'TypeScript', 'Modern UI/UX'],
		color: 'from-purple-500 to-pink-600',
		price: 'From $400',
		popular: true,
	},
	{
		icon: TagIcon,
		title: 'E-commerce Development',
		description: 'Complete e-commerce platforms with payment integration and inventory management.',
		shortDesc: 'Online store solutions',
		features: ['Payment Integration', 'Inventory Management', 'Admin Dashboard', 'Order Processing'],
		color: 'from-green-500 to-blue-600',
		price: 'From $800',
		popular: false,
	},
	{
		icon: BarChart,
		title: 'API Development',
		description: 'Building robust RESTful APIs and integrating third-party services.',
		shortDesc: 'API & Backend services',
		features: ['RESTful Design', 'Third-party Integration', 'Documentation', 'Testing'],
		color: 'from-orange-500 to-red-600',
		price: 'From $300',
		popular: false,
	},
	{
		icon: Share2,
		title: 'Digital Marketing Tech',
		description: 'Implementing tracking pixels, analytics, and marketing automation tools.',
		shortDesc: 'Marketing technology',
		features: ['Analytics Setup', 'Pixel Tracking', 'Automation Tools', 'Performance Monitoring'],
		color: 'from-cyan-500 to-blue-600',
		price: 'From $250',
		popular: false,
	},
	{
		icon: Briefcase,
		title: 'Business Solutions',
		description: 'Custom tech solutions that address real-world business challenges.',
		shortDesc: 'Custom business apps',
		features: ['Process Automation', 'Workflow Optimization', 'Business Analysis', 'Custom Solutions'],
		color: 'from-indigo-500 to-purple-600',
		price: 'Custom Quote',
		popular: false,
	},
];

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.15,
		},
	},
};

const cardVariants: Variants = {
	hidden: { opacity: 0, y: 30, scale: 0.9 },
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: {
			type: 'spring',
			stiffness: 200,
			damping: 20,
		},
	},
};

export function ImprovedServicesSection() {
	return (
		<section className="py-16 md:py-24 bg-gradient-to-br from-background via-accent/5 to-background relative overflow-hidden">
			{/* Background Elements */}
			<div className="absolute inset-0 bg-grid-small-black dark:bg-grid-small-white opacity-20" />
			<div className="absolute inset-0 bg-gradient-to-br from-background/90 via-transparent to-background/90" />

			<div className="container px-4 mx-auto relative">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="text-center mb-12 md:mb-16"
				>
					<motion.div
						initial={{ scale: 0 }}
						whileInView={{ scale: 1 }}
						viewport={{ once: true }}
						transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
						className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
					>
						<Zap className="w-4 h-4" />
						Services & Solutions
					</motion.div>

					<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
						What I Can Build For You
					</h2>

					<p className="text-muted-foreground max-w-2xl mx-auto mb-8 px-4 text-base md:text-lg leading-relaxed">
						From simple websites to complex web applications, I provide end-to-end development services 
						that help businesses grow and succeed in the digital world.
					</p>
				</motion.div>

				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto"
				>
					{services.map((service) => (
						<motion.div key={service.title} variants={cardVariants} className="h-full group">
							<Card className="relative h-full p-4 md:p-6 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 border border-border/50 hover:border-primary/30 bg-card/50 backdrop-blur-sm">
								{/* Popular badge */}
								{service.popular && (
									<div className="absolute top-4 right-4 z-10">
										<Badge className="bg-gradient-to-r from-primary to-blue-600 text-white border-0 text-xs">
											<Star className="w-3 h-3 mr-1" />
											Popular
										</Badge>
									</div>
								)}

								{/* Gradient overlay */}
								<div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

								{/* Service Icon */}
								<div className="relative mb-4 md:mb-6">
									<motion.div
										whileHover={{ scale: 1.1, rotate: 5 }}
										className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${service.color} text-white shadow-lg group-hover:shadow-xl transition-all duration-300`}
									>
										<service.icon className="w-5 h-5 md:w-6 md:h-6" />
									</motion.div>
								</div>

								{/* Content */}
								<div className="relative space-y-3 md:space-y-4 flex-1 flex flex-col">
									<div>
										<h3 className="text-lg md:text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
											{service.title}
										</h3>
										
										{/* Mobile: Short description, Desktop: Full description */}
										<p className="text-sm text-muted-foreground leading-relaxed md:hidden">
											{service.shortDesc}
										</p>
										<p className="text-sm md:text-base text-muted-foreground leading-relaxed hidden md:block">
											{service.description}
										</p>
									</div>

									{/* Features */}
									<div className="space-y-2 flex-1">
										<h4 className="text-sm font-semibold text-foreground mb-2">Includes:</h4>
										<div className="space-y-1">
											{service.features.slice(0, 3).map((feature) => (
												<div key={feature} className="flex items-center gap-2 text-xs md:text-sm">
													<CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 flex-shrink-0" />
													<span className="text-muted-foreground">{feature}</span>
												</div>
											))}
											{service.features.length > 3 && (
												<div className="text-xs text-muted-foreground">
													+{service.features.length - 3} more features
												</div>
											)}
										</div>
									</div>

									{/* Price and CTA */}
									<div className="space-y-3 mt-auto pt-4 border-t border-border/50">
										<div className="flex items-center justify-between">
											<div>
												<div className="text-lg md:text-xl font-bold text-primary">
													{service.price}
												</div>
												<div className="text-xs text-muted-foreground">
													Starting price
												</div>
											</div>
											<Badge variant="outline" className="text-xs">
												{service.features.length} Features
											</Badge>
										</div>

										<Button 
											size="sm" 
											className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
											asChild
										>
											<a href="/contact">
												Get Started
												<ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-2" />
											</a>
										</Button>
									</div>
								</div>
							</Card>
						</motion.div>
					))}
				</motion.div>

				{/* CTA Section */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ delay: 0.5 }}
					className="text-center mt-12 md:mt-16"
				>
					<Card className="p-6 md:p-8 bg-gradient-to-r from-primary/5 via-background to-primary/5 border-primary/20 max-w-3xl mx-auto">
						<h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">
							Need Something Custom?
						</h3>
						<p className="text-sm md:text-base text-muted-foreground mb-6 max-w-xl mx-auto">
							Don&apos;t see exactly what you need? I specialize in creating custom solutions 
							tailored to your specific requirements and budget.
						</p>
						<div className="flex flex-col sm:flex-row gap-3 justify-center">
							<Button size="default" className="bg-gradient-to-r from-primary to-blue-600" asChild>
								<a href="/contact">
									Discuss Your Project
									<ArrowRight className="w-4 h-4 ml-2" />
								</a>
							</Button>
							<Button variant="outline" size="default" asChild>
								<a href="/schedule">
									Schedule a Call
								</a>
							</Button>
						</div>
					</Card>
				</motion.div>
			</div>
		</section>
	);
}
