'use client';

import { motion, Variants } from 'framer-motion';
import { Card } from '../ui/card';
import { 
  Code, 
  BarChart, 
  TagIcon, 
  Briefcase, 
  Share2, 
  Rocket, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useSoundManager } from '@/lib/soundManager';

const services = [
	{
		icon: Rocket,
		title: 'Next.js & React Development',
		description: 'Modern full-stack applications with server-side rendering, TypeScript, and cutting-edge performance optimizations.',
		shortDesc: 'Modern React applications',
		features: ['App Router', 'Server Components', 'TypeScript Integration', 'Performance Optimization'],
		color: 'from-purple-500 to-pink-600',
		popular: true,
	},
	{
		icon: TagIcon,
		title: 'E-commerce Platforms',
		description: 'Complete online stores with advanced features like cart management, payment processing, and admin dashboards.',
		shortDesc: 'Full e-commerce solutions',
		features: ['Stripe Integration', 'Inventory System', 'Order Management', 'Admin Dashboard'],
		color: 'from-green-500 to-blue-600',
		popular: false,
	},
	{
		icon: Code,
		title: 'Full Stack Development',
		description: 'End-to-end web applications using modern technologies like PostgreSQL, MongoDB, Prisma ORM, and cloud deployment.',
		shortDesc: 'Complete web solutions',
		features: ['Database Design', 'REST APIs', 'Authentication', 'Cloud Deployment'],
		color: 'from-blue-500 to-purple-600',
		popular: false,
	},
	{
		icon: BarChart,
		title: 'AI-Powered Applications',
		description: 'Intelligent web applications integrating OpenAI, custom AI APIs, and machine learning capabilities.',
		shortDesc: 'AI & ML integration',
		features: ['OpenAI Integration', 'Custom AI Logic', 'Data Processing', 'Intelligent Features'],
		color: 'from-orange-500 to-red-600',
		popular: false,
	},
	{
		icon: Share2,
		title: 'API Development & Integration',
		description: 'Robust backend services, third-party API integrations, and microservices architecture.',
		shortDesc: 'Backend & API services',
		features: ['RESTful APIs', 'Third-party Integration', 'Microservices', 'API Documentation'],
		color: 'from-cyan-500 to-blue-600',
		popular: false,
	},
	{
		icon: Briefcase,
		title: 'Custom Web Solutions',
		description: 'Tailored applications for specific business needs, from educational platforms to productivity tools.',
		shortDesc: 'Custom business apps',
		features: ['Business Analysis', 'Custom Features', 'Scalable Architecture', 'Maintenance Support'],
		color: 'from-indigo-500 to-purple-600',
		popular: false,
	},
];

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.2,
		},
	},
};

const cardVariants: Variants = {
	hidden: { opacity: 0, y: 50, scale: 0.9 },
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

export function ServicesSection() {
	const { playCardHover, playWhoosh } = useSoundManager();

	return (
		<section className="py-12 md:py-20 bg-gradient-to-br from-background via-accent/5 to-background relative overflow-hidden">
			{/* Background Elements */}
			<div className="absolute inset-0 bg-grid-small-black dark:bg-grid-small-white opacity-20" />
			<div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
			{/* eslint-disable-next-line */}
			<div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />

			<div className="container px-4 md:px-6 relative">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="text-center mb-12"
				>
					<motion.div
						initial={{ scale: 0 }}
						whileInView={{ scale: 1 }}
						viewport={{ once: true }}
						transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
						className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
					>
						<Sparkles className="w-4 h-4" />
						Skills & Technologies
					</motion.div>

					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.3, duration: 0.5 }}
						className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gradient-primary"
					>
						Technical Expertise
					</motion.h2>

					<motion.p
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.4, duration: 0.5 }}
						className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
					>
						Specialized in modern web technologies and frameworks to build scalable, performant applications 
						from concept to production deployment.
					</motion.p>
				</motion.div>

				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto"
				>
					{services.map((service, index) => (
						<motion.div 
							key={service.title} 
							variants={cardVariants} 
							className="h-full group"
							onMouseEnter={() => playCardHover()}
						>
							<Card className="relative h-full p-6 overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 border border-border/20 hover:border-primary/30 bg-card/50 backdrop-blur-sm">
								{/* Gradient Background */}
								<div
									className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
								/>

								{/* Icon with animated background */}
								<div className="relative mb-6">
									<motion.div
										whileHover={{ scale: 1.1, rotate: 5 }}
										className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${service.color} text-white shadow-lg group-hover:shadow-xl transition-all duration-300`}
									>
										<service.icon className="h-6 w-6 md:h-7 md:w-7" />
									</motion.div>
								</div>

								{/* Content */}
								<div className="relative">
									<h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-500">
										{service.title}
									</h3>

									<p className="text-base text-muted-foreground leading-relaxed mb-4">
										{service.description}
									</p>

									{/* Features List */}
									{/* eslint-disable-next-line */}
									<ul className="space-y-2 mb-4">
										{service.features.map((feature, featureIndex) => (
											<motion.li
												key={feature}
												initial={{ opacity: 0, x: -10 }}
												whileInView={{ opacity: 1, x: 0 }}
												viewport={{ once: true }}
												transition={{
													delay: 0.6 + index * 0.1 + featureIndex * 0.05,
												}}
												className="text-xs md:text-sm text-muted-foreground flex items-center gap-2"
											>
												<div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
												{feature}
											</motion.li>
										))}
									</ul>

									{/* Hover Action */}
									<motion.div
										initial={{ opacity: 0, y: 10 }}
										whileHover={{ opacity: 1, y: 0 }}
										className="flex items-center gap-2 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300"
									>
										Learn More
										<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
									</motion.div>
								</div>

								{/* Decorative Elements */}
								<div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
									<div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
								</div>

								<div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
							</Card>
						</motion.div>
					))}
				</motion.div>

				{/* Call to Action */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ delay: 0.8 }}
					className="text-center mt-16"
				>
					<motion.div
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
						onMouseEnter={() => playCardHover()}
						onClick={() => playWhoosh()}
					>
						<span>Explore My Services</span>
						<ArrowRight className="w-4 h-4" />
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}