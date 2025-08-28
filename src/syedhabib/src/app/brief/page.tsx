'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { FileText, Clock, Target, DollarSign, CheckCircle } from 'lucide-react';

const formSchema = z.object({
  // Basic Info
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().optional(),
  phone: z.string().optional(),
  
  // Project Details
  projectType: z.string().min(1, 'Please select a project type'),
  projectTitle: z.string().min(5, 'Project title must be at least 5 characters'),
  projectDescription: z.string().min(50, 'Please provide a detailed description (minimum 50 characters)'),
  
  // Requirements
  budget: z.string().min(1, 'Please select a budget range'),
  timeline: z.string().min(1, 'Please select a timeline'),
  features: z.string().min(20, 'Please describe the key features needed'),
  
  // Additional Info
  inspiration: z.string().optional(),
  additionalNotes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const projectTypes = [
  'Website Development',
  'E-commerce Store',
  'Web Application',
  'Mobile App',
  'Digital Marketing',
  'Brand Design',
  'Other'
];

const budgetRanges = [
  'Under $500',
  '$500 - $1,000',
  '$1,000 - $2,500',
  '$2,500 - $5,000',
  '$5,000 - $10,000',
  'Above $10,000',
  'Let\'s discuss'
];

const timelines = [
  'ASAP (Rush job)',
  '1-2 weeks',
  '3-4 weeks',
  '1-2 months',
  '3-6 months',
  'No specific deadline',
  'Let\'s discuss'
];

const benefits = [
  'Detailed project assessment',
  'Accurate timeline estimation',
  'Transparent pricing',
  'Custom solution approach',
  'Free consultation included'
];

export default function BriefPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      const response = await fetch('/api/brief', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit project brief');
      }

      setSubmitSuccess(true);
      reset();
    } catch (err) {
      console.error('Error submitting brief:', err);
      setSubmitError('Something went wrong. Please try again or contact me directly at syedmirhabib@gmail.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20">
      <div className="container px-4 md:px-6 max-w-4xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <FileText className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Project Brief
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Tell me about your project in detail. The more information you provide, 
            the better I can understand your needs and provide an accurate proposal.
          </p>
          
          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 max-w-4xl mx-auto mb-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 text-sm"
              >
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>{benefit}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      {...register('name')}
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company">Company/Organization</Label>
                    <Input
                      id="company"
                      {...register('company')}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      {...register('phone')}
                    />
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Project Details
                </h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="projectType">Project Type *</Label>
                    <select
                      id="projectType"
                      {...register('projectType')}
                      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.projectType ? 'border-red-500' : ''}`}
                    >
                      <option value="">Select project type</option>
                      {projectTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {errors.projectType && (
                      <p className="text-sm text-red-500">{errors.projectType.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="projectTitle">Project Title *</Label>
                    <Input
                      id="projectTitle"
                      placeholder="Give your project a descriptive title"
                      {...register('projectTitle')}
                      className={errors.projectTitle ? 'border-red-500' : ''}
                    />
                    {errors.projectTitle && (
                      <p className="text-sm text-red-500">{errors.projectTitle.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="projectDescription">Project Description *</Label>
                    <Textarea
                      id="projectDescription"
                      placeholder="Describe your project in detail. What problem does it solve? Who is your target audience? What are your goals?"
                      rows={6}
                      {...register('projectDescription')}
                      className={errors.projectDescription ? 'border-red-500' : ''}
                    />
                    {errors.projectDescription && (
                      <p className="text-sm text-red-500">{errors.projectDescription.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Requirements & Budget */}
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  Requirements & Budget
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget Range *</Label>
                    <select
                      id="budget"
                      {...register('budget')}
                      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.budget ? 'border-red-500' : ''}`}
                    >
                      <option value="">Select budget range</option>
                      {budgetRanges.map((range) => (
                        <option key={range} value={range}>
                          {range}
                        </option>
                      ))}
                    </select>
                    {errors.budget && (
                      <p className="text-sm text-red-500">{errors.budget.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timeline">Timeline *</Label>
                    <select
                      id="timeline"
                      {...register('timeline')}
                      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.timeline ? 'border-red-500' : ''}`}
                    >
                      <option value="">Select timeline</option>
                      {timelines.map((timeline) => (
                        <option key={timeline} value={timeline}>
                          {timeline}
                        </option>
                      ))}
                    </select>
                    {errors.timeline && (
                      <p className="text-sm text-red-500">{errors.timeline.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2 mt-4">
                  <Label htmlFor="features">Key Features & Functionality *</Label>
                  <Textarea
                    id="features"
                    placeholder="List the key features and functionality you need. Be as specific as possible."
                    rows={4}
                    {...register('features')}
                    className={errors.features ? 'border-red-500' : ''}
                  />
                  {errors.features && (
                    <p className="text-sm text-red-500">{errors.features.message}</p>
                  )}
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Additional Information
                </h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="inspiration">Inspiration & References</Label>
                    <Textarea
                      id="inspiration"
                      placeholder="Share any websites, apps, or designs that inspire you. Include URLs if possible."
                      rows={3}
                      {...register('inspiration')}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="additionalNotes">Additional Notes</Label>
                    <Textarea
                      id="additionalNotes"
                      placeholder="Any other information you think would be helpful for understanding your project."
                      rows={3}
                      {...register('additionalNotes')}
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              {submitError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{submitError}</p>
                </div>
              )}

              {submitSuccess && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <h3 className="font-semibold text-green-800 mb-2">Project Brief Submitted Successfully!</h3>
                  <p className="text-sm text-green-700">
                    Thank you for the detailed information. I&apos;ll review your project brief and 
                    get back to you within 24 hours with a detailed proposal and next steps.
                  </p>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting Project Brief...' : 'Submit Project Brief'}
              </Button>
            </form>
          </Card>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <h2 className="text-2xl font-bold mb-6">What Happens Next?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border rounded-lg">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Review & Analysis</h3>
              <p className="text-sm text-muted-foreground">
                I&apos;ll carefully review your project brief and analyze your requirements.
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Detailed Proposal</h3>
              <p className="text-sm text-muted-foreground">
                You&apos;ll receive a comprehensive proposal with timeline, pricing, and approach.
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Discussion & Start</h3>
              <p className="text-sm text-muted-foreground">
                We&apos;ll discuss the proposal and, if everything looks good, start your project!
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}