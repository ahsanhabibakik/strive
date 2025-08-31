"use client";

import { useState, useCallback } from "react";
import { X, ArrowLeft, ArrowRight, Upload, CheckCircle, Sparkles, Confetti, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ApplicationQuestion {
  id: string;
  type: "text" | "textarea" | "file" | "checkbox" | "radio" | "select";
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  maxLength?: number;
  accept?: string;
  description?: string;
}

interface OpportunityData {
  _id: string;
  title: string;
  organizerName: string;
  applicationQuestions?: ApplicationQuestion[];
  requirements?: string[];
  applicationDeadline: string;
  logoUrl?: string;
}

interface ApplicationWizardProps {
  opportunity: OpportunityData;
  onClose: () => void;
  onSubmit?: (formData: Record<string, any>) => Promise<void>;
}

const defaultQuestions: ApplicationQuestion[] = [
  {
    id: "personal_info",
    type: "text",
    label: "Full Name",
    placeholder: "Enter your full name",
    required: true,
  },
  {
    id: "email",
    type: "text",
    label: "Email Address",
    placeholder: "your.email@example.com",
    required: true,
  },
  {
    id: "phone",
    type: "text",
    label: "Phone Number",
    placeholder: "+1 (555) 123-4567",
  },
  {
    id: "motivation",
    type: "textarea",
    label: "Why are you interested in this opportunity?",
    placeholder: "Tell us about your motivation and what you hope to achieve...",
    required: true,
    maxLength: 500,
    description: "Share your passion and goals (max 500 characters)",
  },
  {
    id: "experience",
    type: "textarea",
    label: "Relevant Experience",
    placeholder: "Describe any relevant experience, skills, or achievements...",
    maxLength: 750,
    description: "Highlight experiences that make you a strong candidate",
  },
  {
    id: "resume",
    type: "file",
    label: "Resume/CV",
    accept: ".pdf,.doc,.docx",
    description: "Upload your resume in PDF or Word format",
  },
  {
    id: "availability",
    type: "radio",
    label: "Availability",
    required: true,
    options: [
      "Full-time commitment",
      "Part-time (20+ hours/week)",
      "Flexible schedule",
      "Weekends only",
    ],
  },
];

export function ApplicationWizard({
  opportunity,
  onClose,
  onSubmit,
}: ApplicationWizardProps) {
  const questions = opportunity.applicationQuestions || defaultQuestions;
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showStepCelebration, setShowStepCelebration] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const totalSteps = questions.length + 2; // +1 for review, +1 for confirmation
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const validateStep = useCallback((stepIndex: number): boolean => {
    if (stepIndex >= questions.length) return true;

    const question = questions[stepIndex];
    if (!question.required) return true;

    const value = formData[question.id];
    if (!value || (typeof value === "string" && value.trim() === "")) {
      setErrors(prev => ({
        ...prev,
        [question.id]: "This field is required",
      }));
      return false;
    }

    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[question.id];
      return newErrors;
    });
    return true;
  }, [formData, questions]);

  const handleInputChange = (questionId: string, value: any) => {
    setFormData(prev => ({ ...prev, [questionId]: value }));
    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const handleNext = () => {
    if (currentStep < questions.length && !validateStep(currentStep)) {
      return;
    }
    
    // Mark step as completed and show celebration
    if (currentStep < questions.length) {
      const newCompleted = new Set(completedSteps);
      newCompleted.add(currentStep);
      setCompletedSteps(newCompleted);
      
      setShowStepCelebration(true);
      setTimeout(() => setShowStepCelebration(false), 800);
    }
    
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const submissionData = {
        opportunityId: opportunity._id,
        responses: formData,
        submittedAt: new Date().toISOString(),
      };

      if (onSubmit) {
        await onSubmit(submissionData);
      } else {
        // Default submission logic
        const response = await fetch("/api/applications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submissionData),
        });

        if (!response.ok) {
          throw new Error("Failed to submit application");
        }
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting application:", error);
      setErrors({ submit: "Failed to submit application. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = (question: ApplicationQuestion) => {
    const value = formData[question.id] || "";
    const hasError = !!errors[question.id];

    switch (question.type) {
      case "text":
        return (
          <div className="space-y-2">
            <Label htmlFor={question.id} className="text-sm font-medium">
              {question.label}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {question.description && (
              <p className="text-sm text-gray-600">{question.description}</p>
            )}
            <Input
              id={question.id}
              placeholder={question.placeholder}
              value={value}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              className={cn(
                "transition-all duration-200 focus:scale-[1.02]",
                hasError && "border-red-500 animate-pulse",
                value && !hasError && "border-green-300 bg-green-50/30"
              )}
            />
            {hasError && (
              <p className="text-sm text-red-500 animate-pulse flex items-center gap-1">
                <span>⚠️</span> {errors[question.id]}
              </p>
            )}
            {value && !hasError && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <span>✓</span> Looking good!
              </p>
            )}
          </div>
        );

      case "textarea":
        const charCount = value.length;
        const maxLength = question.maxLength || 1000;
        const progressPercent = (charCount / maxLength) * 100;
        
        return (
          <div className="space-y-2">
            <Label htmlFor={question.id} className="text-sm font-medium">
              {question.label}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {question.description && (
              <p className="text-sm text-gray-600">{question.description}</p>
            )}
            <div className="relative">
              <Textarea
                id={question.id}
                placeholder={question.placeholder}
                value={value}
                onChange={(e) => {
                  const newValue = e.target.value.slice(0, maxLength);
                  handleInputChange(question.id, newValue);
                }}
                className={cn(
                  "min-h-[100px] transition-all duration-200",
                  hasError && "border-red-500",
                  charCount > 0 && "border-blue-300 focus:border-blue-500"
                )}
                rows={4}
              />
              {charCount > 0 && (
                <div className="absolute top-2 right-2">
                  <Sparkles className="h-4 w-4 text-blue-400 animate-pulse" />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                {hasError ? (
                  <p className="text-red-500 animate-pulse">{errors[question.id]}</p>
                ) : (
                  <p className="text-gray-500">
                    {charCount === 0 && "Start typing to see your progress! ✏️"}
                    {charCount > 0 && charCount < maxLength * 0.5 && "Looking good! Keep going 🚀"}
                    {charCount >= maxLength * 0.5 && charCount < maxLength * 0.8 && "Great progress! 💪"}
                    {charCount >= maxLength * 0.8 && charCount < maxLength && "Almost there! 🎯"}
                    {charCount >= maxLength && "Perfect! 🎆"}
                  </p>
                )}
                <p className={cn(
                  "text-gray-500 font-medium",
                  charCount > maxLength * 0.9 && "text-orange-500 animate-pulse",
                  charCount >= maxLength && "text-green-600"
                )}>
                  {charCount}/{maxLength}
                </p>
              </div>
              {charCount > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      progressPercent < 50 && "bg-blue-500",
                      progressPercent >= 50 && progressPercent < 80 && "bg-yellow-500",
                      progressPercent >= 80 && progressPercent < 100 && "bg-orange-500",
                      progressPercent >= 100 && "bg-green-500"
                    )}
                    style={{ width: `${Math.min(progressPercent, 100)}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        );

      case "file":
        return (
          <div className="space-y-2">
            <Label htmlFor={question.id} className="text-sm font-medium">
              {question.label}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {question.description && (
              <p className="text-sm text-gray-600">{question.description}</p>
            )}
            <div className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 group/upload cursor-pointer hover:border-blue-400 hover:bg-blue-50",
              value ? "border-green-400 bg-green-50" : "border-gray-300",
              hasError && "border-red-400 bg-red-50"
            )}>
              <Upload className={cn(
                "h-8 w-8 mx-auto mb-2 transition-all duration-200",
                value ? "text-green-500 animate-bounce" : "text-gray-400 group-hover/upload:text-blue-500 group-hover/upload:scale-110"
              )} />
              <p className={cn(
                "text-sm mb-2 transition-colors",
                value ? "text-green-700" : "text-gray-600 group-hover/upload:text-blue-600"
              )}>
                {value ? "File uploaded! Click to change" : "Click to upload or drag and drop"}
              </p>
              <Input
                id={question.id}
                type="file"
                accept={question.accept}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  handleInputChange(question.id, file);
                }}
                className="hidden"
              />
              <Label
                htmlFor={question.id}
                className="cursor-pointer text-blue-600 hover:text-blue-700"
              >
                Choose File
              </Label>
              {value && (
                <p className="mt-2 text-sm text-green-600">
                  ✓ {value.name}
                </p>
              )}
            </div>
            {hasError && (
              <p className="text-sm text-red-500">{errors[question.id]}</p>
            )}
          </div>
        );

      case "radio":
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {question.label}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {question.description && (
              <p className="text-sm text-gray-600">{question.description}</p>
            )}
            <RadioGroup
              value={value}
              onValueChange={(val) => handleInputChange(question.id, val)}
            >
              {question.options?.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                  <Label htmlFor={`${question.id}-${option}`} className="text-sm">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {hasError && (
              <p className="text-sm text-red-500">{errors[question.id]}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Review Your Application</h3>
        <p className="text-gray-600">
          Please review your responses before submitting
        </p>
      </div>

      <div className="space-y-4">
        {questions.map((question) => {
          const value = formData[question.id];
          if (!value) return null;

          return (
            <Card key={question.id}>
              <CardContent className="pt-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-gray-700 mb-1">
                      {question.label}
                    </h4>
                    <div className="text-sm">
                      {question.type === "file" ? (
                        <Badge variant="outline" className="text-green-600">
                          ✓ {value.name}
                        </Badge>
                      ) : (
                        <p className="whitespace-pre-wrap">{value}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentStep(questions.findIndex(q => q.id === question.id))}
                  >
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderConfirmationStep = () => (
    <div className="text-center space-y-6 relative">
      {/* Confetti animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 animate-bounce delay-100">
          <Confetti className="h-6 w-6 text-yellow-400" />
        </div>
        <div className="absolute top-10 right-1/4 animate-bounce delay-300">
          <PartyPopper className="h-5 w-5 text-pink-400" />
        </div>
        <div className="absolute top-5 left-3/4 animate-bounce delay-500">
          <Sparkles className="h-4 w-4 text-blue-400" />
        </div>
        <div className="absolute top-16 left-1/2 animate-bounce delay-700">
          <div className="w-3 h-3 bg-green-400 rounded-full" />
        </div>
      </div>
      
      <div className="flex justify-center">
        <div className="rounded-full bg-gradient-to-r from-green-100 to-blue-100 p-6 animate-pulse">
          <CheckCircle className="h-16 w-16 text-green-600 animate-bounce" />
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-bold text-gray-900 mb-2 animate-bounce">
          🎉 Application Submitted! 🎉
        </h3>
        <p className="text-gray-600 max-w-md mx-auto text-lg">
          Awesome! Your application for <span className="font-semibold text-orange-600">{opportunity.title}</span> has been sent to {opportunity.organizerName}. 🚀
        </p>
      </div>
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-3 flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5" />
          What happens next?
        </h4>
        <ul className="text-sm text-blue-800 text-left max-w-md mx-auto space-y-2">
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            You'll receive a confirmation email shortly 📧
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            The organizer will review your application 🔍
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            We'll notify you of any updates via email 🔔
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            Track your application in your dashboard 📊
          </li>
        </ul>
      </div>
      <div className="mt-6">
        <p className="text-sm text-gray-500">
          Keep being awesome! 🎆 More opportunities are waiting for you.
        </p>
      </div>
    </div>
  );

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-between">
              Application Complete
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>{renderConfirmationStep()}</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      {/* Step celebration overlay */}
      {showStepCelebration && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="animate-bounce">
            <div className="bg-green-500 text-white px-6 py-3 rounded-full font-semibold text-lg shadow-lg">
              🎆 Step Complete! 🎆
            </div>
          </div>
          <div className="absolute animate-ping">
            <Sparkles className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
      )}
      
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden relative">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {opportunity.logoUrl && (
                <img
                  src={opportunity.logoUrl}
                  alt={opportunity.organizerName}
                  className="h-8 w-8 rounded object-cover"
                />
              )}
              <div>
                <CardTitle className="text-lg">Apply to {opportunity.title}</CardTitle>
                <p className="text-sm text-gray-600">{opportunity.organizerName}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 font-medium">
                Step {currentStep + 1} of {totalSteps}
                {currentStep < questions.length && completedSteps.has(currentStep - 1) && (
                  <span className="ml-2 text-green-500">✓</span>
                )}
              </span>
              <span className={cn(
                "font-semibold",
                progress < 30 && "text-blue-600",
                progress >= 30 && progress < 70 && "text-yellow-600",
                progress >= 70 && progress < 100 && "text-orange-600",
                progress >= 100 && "text-green-600"
              )}>
                {Math.round(progress)}% complete 
                {progress >= 100 && "🎆"}
                {progress >= 70 && progress < 100 && "💪"}
                {progress >= 30 && progress < 70 && "🚀"}
                {progress < 30 && "🌟"}
              </span>
            </div>
            <div className="relative">
              <Progress value={progress} className="h-3 bg-gray-200" />
              <div className="absolute inset-0 flex items-center">
                {[...Array(totalSteps)].map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-4 h-4 rounded-full border-2 border-white transition-all duration-300",
                      index < currentStep && "bg-green-500",
                      index === currentStep && "bg-blue-500 animate-pulse",
                      index > currentStep && "bg-gray-300"
                    )}
                    style={{ left: `${(index / (totalSteps - 1)) * 100}%`, transform: 'translateX(-50%)' }}
                  />
                ))}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto max-h-[60vh]">
          {currentStep < questions.length ? (
            <div className="space-y-6">
              <div className="text-center">
                <Badge variant="outline" className="mb-4">
                  Question {currentStep + 1} of {questions.length}
                </Badge>
              </div>
              {renderQuestion(questions[currentStep])}
            </div>
          ) : currentStep === questions.length ? (
            renderReviewStep()
          ) : null}

          {errors.submit && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}
        </CardContent>

        <div className="border-t p-6">
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={cn(
                "transition-all duration-200 hover:scale-105",
                currentStep === 0 && "opacity-50 cursor-not-allowed"
              )}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep === questions.length ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={cn(
                  "min-w-[140px] bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white hover:scale-105 hover:shadow-lg transition-all duration-300 group/submit",
                  isSubmitting && "animate-pulse cursor-not-allowed"
                )}
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin border-2 border-current border-t-transparent rounded-full" />
                    Sending magic...
                  </>
                ) : (
                  <>
                    <span className="group-hover/submit:animate-pulse">🚀 Submit Application</span>
                    <Sparkles className="h-4 w-4 ml-2 opacity-0 group-hover/submit:opacity-100 transition-opacity" />
                  </>
                )}
              </Button>
            ) : (
              <Button 
                onClick={handleNext}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:scale-105 hover:shadow-lg transition-all duration-200 group/next"
              >
                <span className="group-hover/next:animate-pulse">Next</span>
                <ArrowRight className="h-4 w-4 ml-2 group-hover/next:translate-x-1 transition-transform" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}