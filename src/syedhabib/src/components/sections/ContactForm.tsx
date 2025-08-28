'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  User,
  Mail,
  MessageSquare,
  Clock,
  DollarSign,
  Calendar
} from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  projectType: z.string().min(1, 'Please select a project type'),
  budget: z.string().min(1, 'Please select your budget range'),
  timeline: z.string().min(1, 'Please select your timeline'),
  message: z.string().min(20, 'Please provide more details about your project (minimum 20 characters)'),
});

type FormData = z.infer<typeof formSchema>;

const projectTypes = [
  'Website Development',
  'E-commerce Store', 
  'Digital Marketing',
  'Brand Development',
  'Mobile App',
  'Other'
];

const budgetRanges = [
  'Under $1,000',
  '$1,000 - $5,000',
  '$5,000 - $10,000',
  '$10,000 - $25,000',
  '$25,000+',
  'Let\'s discuss'
];

const timelines = [
  'ASAP (Rush job)',
  '2-4 weeks',
  '1-2 months',
  '3-6 months',
  '6+ months',
  'Flexible'
];

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange'
  });

  const watchedFields = watch();

  const onSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setSubmitSuccess(true);
      reset();
      setCurrentStep(1);
    } catch (err) {
      console.error('Error submitting form:', err);
      setSubmitError('Something went wrong. Please try again or contact me directly at syedmirhabib@gmail.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (submitSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-6 md:p-8"
      >
        <Card className="max-w-md mx-auto p-6 md:p-8 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CheckCircle className="w-12 h-12 md:w-16 md:h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg md:text-xl font-bold text-green-700 dark:text-green-400 mb-2">
            Message Sent Successfully!
          </h3>
          <p className="text-sm md:text-base text-green-600 dark:text-green-300 mb-4">
            Thank you for reaching out! I&apos;ll review your project details and get back to you within 2 hours.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-green-600 dark:text-green-400">
            <Clock className="w-4 h-4" />
            <span>Expected response time: 2 hours</span>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center justify-center space-x-4 mb-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step <= currentStep
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`w-12 h-1 mx-2 transition-all ${
                    step < currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <span className="text-sm text-muted-foreground">
            Step {currentStep} of 3: {
              currentStep === 1 ? 'Basic Info' :
              currentStep === 2 ? 'Project Details' :
              'Message'
            }
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Your Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  {...register('name')}
                  className={`h-10 md:h-12 ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@company.com"
                  {...register('email')}
                  className={`h-10 md:h-12 ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="button"
              onClick={nextStep}
              disabled={!watchedFields.name || !watchedFields.email}
              className="w-full h-12"
            >
              Continue to Project Details
            </Button>
          </motion.div>
        )}

        {/* Step 2: Project Details */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label>Project Type</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {projectTypes.map((type) => (
                  <label key={type} className="cursor-pointer">
                    <input
                      type="radio"
                      value={type}
                      {...register('projectType')}
                      className="sr-only peer"
                    />
                    <Badge
                      variant="outline"
                      className="w-full justify-center py-2 peer-checked:bg-primary peer-checked:text-primary-foreground hover:bg-muted transition-colors"
                    >
                      {type}
                    </Badge>
                  </label>
                ))}
              </div>
              {errors.projectType && (
                <p className="text-xs text-red-500">{errors.projectType.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Budget Range
                </Label>
                <div className="space-y-2">
                  {budgetRanges.map((budget) => (
                    <label key={budget} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        value={budget}
                        {...register('budget')}
                        className="text-primary focus:ring-primary"
                      />
                      <span className="text-sm">{budget}</span>
                    </label>
                  ))}
                </div>
                {errors.budget && (
                  <p className="text-xs text-red-500">{errors.budget.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Timeline
                </Label>
                <div className="space-y-2">
                  {timelines.map((timeline) => (
                    <label key={timeline} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        value={timeline}
                        {...register('timeline')}
                        className="text-primary focus:ring-primary"
                      />
                      <span className="text-sm">{timeline}</span>
                    </label>
                  ))}
                </div>
                {errors.timeline && (
                  <p className="text-xs text-red-500">{errors.timeline.message}</p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
                Back
              </Button>
              <Button
                type="button"
                onClick={nextStep}
                disabled={!watchedFields.projectType || !watchedFields.budget || !watchedFields.timeline}
                className="flex-1"
              >
                Continue to Message
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Message */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="message" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Project Details
              </Label>
              <Textarea
                id="message"
                placeholder="Tell me more about your project:
• What specific features do you need?
• Who is your target audience?
• Do you have any design preferences?
• Any specific requirements or challenges?"
                rows={6}
                {...register('message')}
                className={`min-h-[120px] resize-none ${errors.message ? 'border-red-500' : ''}`}
              />
              <div className="flex justify-between items-center">
                {errors.message && (
                  <p className="text-xs text-red-500">{errors.message.message}</p>
                )}
                <p className="text-xs text-muted-foreground ml-auto">
                  {watchedFields.message?.length || 0} characters
                </p>
              </div>
            </div>

            {submitError && (
              <div className="p-3 md:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-xs md:text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {submitError}
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
                Back
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="flex-1 h-12 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Send Project Details
                  </span>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </form>
    </div>
  );
}