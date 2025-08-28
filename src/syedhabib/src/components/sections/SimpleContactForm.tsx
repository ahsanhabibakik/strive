'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  User,
  MessageSquare,
  Zap,
  Clock
} from 'lucide-react';

const projectTypes = [
  { id: 'website', label: 'Website', icon: '🌐' },
  { id: 'ecommerce', label: 'E-commerce', icon: '🛒' },
  { id: 'marketing', label: 'Digital Marketing', icon: '📱' },
  { id: 'branding', label: 'Branding', icon: '🎨' },
  { id: 'academic', label: 'Academic Help', icon: '📚' },
  { id: 'other', label: 'Other', icon: '💡' }
];

const budgetRanges = [
  { id: 'budget-500', label: 'Under $500', recommended: false },
  { id: 'budget-1k', label: '$500 - $1,000', recommended: true },
  { id: 'budget-5k', label: '$1,000 - $5,000', recommended: false },
  { id: 'budget-more', label: '$5,000+', recommended: false },
  { id: 'budget-discuss', label: 'Let\'s discuss', recommended: false }
];

const timelines = [
  { id: 'asap', label: 'ASAP (Rush)', extra: '+50% fee' },
  { id: '2-weeks', label: '2-4 weeks', recommended: true },
  { id: '1-month', label: '1-2 months' },
  { id: '3-months', label: '3+ months' },
  { id: 'flexible', label: 'Flexible' }
];

interface FormData {
  name: string;
  email: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
}

export default function SimpleContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    projectType: '',
    budget: '',
    timeline: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const validateStep = (currentStep: number) => {
    const newErrors: Partial<FormData> = {};
    
    if (currentStep === 1) {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
    } else if (currentStep === 2) {
      if (!formData.projectType) newErrors.projectType = 'Please select a project type';
    } else if (currentStep === 3) {
      if (!formData.message.trim() || formData.message.length < 20) {
        newErrors.message = 'Please provide more details (minimum 20 characters)';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(step)) return;
    
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to send message');

      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        projectType: '',
        budget: '',
        timeline: '',
        message: ''
      });
    } catch {
      setSubmitError('Something went wrong. Please try again or contact me directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (submitSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-4 sm:p-8"
      >
        <Card className="max-w-md mx-auto p-6 sm:p-8 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">
            Message Sent Successfully!
          </h3>
          <p className="text-green-600 dark:text-green-300 mb-4">
            Thank you for reaching out! I&apos;ll review your project details and get back to you within 2 hours.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-400">
            <Clock className="w-4 h-4" />
            <span>Expected response time: 2 hours</span>
          </div>
        </Card>
      </motion.div>
    );
  }

  // Progress indicator
  const renderProgressBar = () => (
    <div className="flex items-center justify-between mb-6">
      {[1, 2, 3].map((stepNumber) => (
        <div key={stepNumber} className="flex flex-col items-center">
          <div 
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              stepNumber === step 
                ? 'bg-primary text-primary-foreground' 
                : stepNumber < step 
                  ? 'bg-primary/20 text-primary' 
                  : 'bg-muted text-muted-foreground'
            }`}
          >
            {stepNumber < step ? <CheckCircle className="w-4 h-4" /> : stepNumber}
          </div>
          <span className="text-xs mt-1 hidden sm:block">
            {stepNumber === 1 ? 'Info' : stepNumber === 2 ? 'Project' : 'Details'}
          </span>
        </div>
      ))}
      <div className="absolute left-0 right-0 h-1 bg-muted -z-10">
        <div 
          className="h-full bg-primary transition-all" 
          style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={step === totalSteps ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }} className="space-y-6">
        {/* Progress Bar */}
        <div className="relative">
          {renderProgressBar()}
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-4 sm:p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Basic Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Your Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="John Doe"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="john@example.com"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Project Type & Budget/Timeline */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-4 sm:p-6 mb-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                What type of project do you have? *
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {projectTypes.map((type) => (
                  <label key={type.id} className="cursor-pointer">
                    <input
                      type="radio"
                      value={type.id}
                      checked={formData.projectType === type.id}
                      onChange={(e) => handleInputChange('projectType', e.target.value)}
                      className="sr-only peer"
                    />
                    <div className="p-2 sm:p-3 border rounded-lg text-center transition-all peer-checked:border-primary peer-checked:bg-primary/5 hover:border-primary/50">
                      <div className="text-xl sm:text-2xl mb-1">{type.icon}</div>
                      <div className="text-xs sm:text-sm font-medium">{type.label}</div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.projectType && (
                <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.projectType}
                </p>
              )}
            </Card>

            <div className="grid sm:grid-cols-2 gap-4">
              <Card className="p-4 sm:p-6">
                <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Budget Range (Optional)</h3>
                <div className="space-y-1 sm:space-y-2">
                  {budgetRanges.map((budget) => (
                    <label key={budget.id} className="flex items-center space-x-2 sm:space-x-3 cursor-pointer p-1 sm:p-2 rounded hover:bg-muted/50">
                      <input
                        type="radio"
                        value={budget.id}
                        checked={formData.budget === budget.id}
                        onChange={(e) => handleInputChange('budget', e.target.value)}
                        className="text-primary"
                      />
                      <span className="text-xs sm:text-sm flex-1">{budget.label}</span>
                      {budget.recommended && (
                        <Badge variant="secondary" className="text-[10px] sm:text-xs">Recommended</Badge>
                      )}
                    </label>
                  ))}
                </div>
              </Card>

              <Card className="p-4 sm:p-6">
                <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Timeline (Optional)</h3>
                <div className="space-y-1 sm:space-y-2">
                  {timelines.map((timeline) => (
                    <label key={timeline.id} className="flex items-center space-x-2 sm:space-x-3 cursor-pointer p-1 sm:p-2 rounded hover:bg-muted/50">
                      <input
                        type="radio"
                        value={timeline.id}
                        checked={formData.timeline === timeline.id}
                        onChange={(e) => handleInputChange('timeline', e.target.value)}
                        className="text-primary"
                      />
                      <span className="text-xs sm:text-sm flex-1">{timeline.label}</span>
                      {timeline.extra && (
                        <Badge variant="outline" className="text-[10px] sm:text-xs text-orange-600">
                          {timeline.extra}
                        </Badge>
                      )}
                      {timeline.recommended && (
                        <Badge variant="secondary" className="text-[10px] sm:text-xs">Popular</Badge>
                      )}
                    </label>
                  ))}
                </div>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Step 3: Project Details */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-4 sm:p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Project Details *
              </h3>
              
              <Textarea
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder="Tell me about your project:
• What do you want to achieve?
• Who is your target audience?
• Any specific features or requirements?
• Any examples or references?
• Any questions or concerns?"
                rows={6}
                className={`resize-none ${errors.message ? 'border-red-500' : ''}`}
              />
              <div className="flex justify-between items-center mt-2">
                {errors.message && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground ml-auto">
                  {formData.message.length} characters
                </p>
              </div>
            </Card>

            {/* Submit Error */}
            {submitError && (
              <Card className="p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 mt-4">
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {submitError}
                </p>
              </Card>
            )}
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3">
          {step > 1 && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={prevStep}
              className="flex-1"
            >
              Back
            </Button>
          )}
          
          <Button
            type={step === totalSteps ? "submit" : "button"}
            disabled={isSubmitting}
            className={`${step === 1 ? 'w-full' : 'flex-1'} h-12`}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending...
              </span>
            ) : step === totalSteps ? (
              <span className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                Send Message
              </span>
            ) : (
              <span>Continue</span>
            )}
          </Button>
        </div>

        {/* Step Indicator */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Step {step} of {totalSteps}
          </p>
        </div>
      </form>
    </div>
  );
}