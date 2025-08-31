"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  FileText,
  CreditCard,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  DollarSign,
} from "lucide-react";
import Image from "next/image";

interface Event {
  _id: string;
  title: string;
  description: string;
  organizerName: string;
  logoUrl: string;
  country: string;
  city: string;
  isOnline: boolean;
  applicationDeadline: string;
  eventDate: string;
  endDate: string;
  category: string;
  difficulty: string;
  isFree: boolean;
  price: string;
  tags: string[];
  slug: string;
}

interface RegistrationData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company: string;
    jobTitle: string;
    experience: string;
    linkedin: string;
  };
  eventPreferences: {
    accommodationNeeded: boolean;
    dietaryRequirements: string;
    accessibilityNeeds: string;
    tshirtSize: string;
    interests: string[];
    networkingOptIn: boolean;
  };
  additionalInfo: {
    howDidYouHear: string;
    expectations: string;
    questions: string;
    marketingOptIn: boolean;
  };
  payment?: {
    method: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    billingAddress: string;
  };
}

interface EventRegistrationProps {
  event: Event;
  onComplete: (data: RegistrationData) => void;
  onCancel: () => void;
}

export function EventRegistration({ event, onComplete, onCancel }: EventRegistrationProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<RegistrationData>({
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      jobTitle: "",
      experience: "",
      linkedin: "",
    },
    eventPreferences: {
      accommodationNeeded: false,
      dietaryRequirements: "",
      accessibilityNeeds: "",
      tshirtSize: "",
      interests: [],
      networkingOptIn: true,
    },
    additionalInfo: {
      howDidYouHear: "",
      expectations: "",
      questions: "",
      marketingOptIn: false,
    },
  });

  const totalSteps = event.isFree ? 3 : 4;
  const progress = (currentStep / totalSteps) * 100;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleInputChange = (section: keyof RegistrationData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      eventPreferences: {
        ...prev.eventPreferences,
        interests: prev.eventPreferences.interests.includes(interest)
          ? prev.eventPreferences.interests.filter(i => i !== interest)
          : [...prev.eventPreferences.interests, interest],
      },
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        const { firstName, lastName, email } = formData.personalInfo;
        return firstName.trim() !== "" && lastName.trim() !== "" && email.trim() !== "";
      case 2:
        return true; // Preferences are optional
      case 3:
        return true; // Additional info is optional
      case 4:
        if (event.isFree) return true;
        // Payment validation would go here
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    } else {
      toast.error("Please complete required fields");
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success("Registration successful! You'll receive a confirmation email shortly.");

      onComplete(formData);
    } catch (error) {
      toast.error("Registration failed. Please try again or contact support.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepTitles = [
    "Personal Information",
    "Event Preferences",
    "Additional Information",
    ...(event.isFree ? [] : ["Payment"]),
  ];

  const interests = [
    "Networking",
    "Learning",
    "Speaking",
    "Workshops",
    "Panels",
    "Job Opportunities",
    "Partnership",
    "Investment",
    "Technology Trends",
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Event Header */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex gap-6">
            <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
              <Image src={event.logoUrl} alt={event.title} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h1>
              <p className="text-gray-600 mb-3">Hosted by {event.organizerName}</p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(event.eventDate)}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {event.isOnline ? "Virtual Event" : `${event.city}, ${event.country}`}
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span className={event.isFree ? "text-green-600 font-medium" : ""}>
                    {event.price}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Registration Progress</h2>
          <span className="text-sm text-gray-600">
            Step {currentStep} of {totalSteps}
          </span>
        </div>
        <Progress value={progress} className="h-2" />

        {/* Step indicators */}
        <div className="flex justify-between mt-4">
          {stepTitles.map((title, index) => (
            <div
              key={title}
              className={`flex flex-col items-center text-xs ${
                index + 1 <= currentStep ? "text-indigo-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                  index + 1 < currentStep
                    ? "bg-indigo-600 text-white"
                    : index + 1 === currentStep
                      ? "bg-indigo-100 text-indigo-600 border-2 border-indigo-600"
                      : "bg-gray-200 text-gray-400"
                }`}
              >
                {index + 1 < currentStep ? <CheckCircle className="h-4 w-4" /> : index + 1}
              </div>
              <span className="text-center max-w-20">{title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {currentStep === 1 && <User className="h-5 w-5" />}
            {currentStep === 2 && <Users className="h-5 w-5" />}
            {currentStep === 3 && <FileText className="h-5 w-5" />}
            {currentStep === 4 && <CreditCard className="h-5 w-5" />}
            {stepTitles[currentStep - 1]}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.personalInfo.firstName}
                    onChange={e => handleInputChange("personalInfo", "firstName", e.target.value)}
                    placeholder="John"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.personalInfo.lastName}
                    onChange={e => handleInputChange("personalInfo", "lastName", e.target.value)}
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.personalInfo.email}
                  onChange={e => handleInputChange("personalInfo", "email", e.target.value)}
                  placeholder="john.doe@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.personalInfo.phone}
                  onChange={e => handleInputChange("personalInfo", "phone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company/Organization</Label>
                  <Input
                    id="company"
                    value={formData.personalInfo.company}
                    onChange={e => handleInputChange("personalInfo", "company", e.target.value)}
                    placeholder="Acme Inc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    value={formData.personalInfo.jobTitle}
                    onChange={e => handleInputChange("personalInfo", "jobTitle", e.target.value)}
                    placeholder="Software Engineer"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Experience Level</Label>
                <Select
                  value={formData.personalInfo.experience}
                  onValueChange={value => handleInputChange("personalInfo", "experience", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                    <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                    <SelectItem value="senior">Senior Level (6-10 years)</SelectItem>
                    <SelectItem value="expert">Expert (10+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn Profile (Optional)</Label>
                <Input
                  id="linkedin"
                  value={formData.personalInfo.linkedin}
                  onChange={e => handleInputChange("personalInfo", "linkedin", e.target.value)}
                  placeholder="https://linkedin.com/in/johndoe"
                />
              </div>
            </div>
          )}

          {/* Step 2: Event Preferences */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {!event.isOnline && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="accommodation"
                      checked={formData.eventPreferences.accommodationNeeded}
                      onCheckedChange={checked =>
                        handleInputChange("eventPreferences", "accommodationNeeded", checked)
                      }
                    />
                    <Label htmlFor="accommodation">I need help with accommodation</Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tshirtSize">T-Shirt Size</Label>
                    <Select
                      value={formData.eventPreferences.tshirtSize}
                      onValueChange={value =>
                        handleInputChange("eventPreferences", "tshirtSize", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="xs">XS</SelectItem>
                        <SelectItem value="s">S</SelectItem>
                        <SelectItem value="m">M</SelectItem>
                        <SelectItem value="l">L</SelectItem>
                        <SelectItem value="xl">XL</SelectItem>
                        <SelectItem value="xxl">XXL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="dietary">Dietary Requirements</Label>
                <Textarea
                  id="dietary"
                  value={formData.eventPreferences.dietaryRequirements}
                  onChange={e =>
                    handleInputChange("eventPreferences", "dietaryRequirements", e.target.value)
                  }
                  placeholder="Please describe any dietary restrictions or allergies..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accessibility">Accessibility Needs</Label>
                <Textarea
                  id="accessibility"
                  value={formData.eventPreferences.accessibilityNeeds}
                  onChange={e =>
                    handleInputChange("eventPreferences", "accessibilityNeeds", e.target.value)
                  }
                  placeholder="Please describe any accessibility requirements..."
                  rows={3}
                />
              </div>

              <div className="space-y-3">
                <Label>What are you most interested in? (Select all that apply)</Label>
                <div className="grid grid-cols-3 gap-3">
                  {interests.map(interest => (
                    <div
                      key={interest}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        formData.eventPreferences.interests.includes(interest)
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleInterestToggle(interest)}
                    >
                      <span className="text-sm font-medium">{interest}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="networking"
                  checked={formData.eventPreferences.networkingOptIn}
                  onCheckedChange={checked =>
                    handleInputChange("eventPreferences", "networkingOptIn", checked)
                  }
                />
                <Label htmlFor="networking">
                  I'm interested in networking opportunities and connecting with other attendees
                </Label>
              </div>
            </div>
          )}

          {/* Step 3: Additional Information */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="howDidYouHear">How did you hear about this event?</Label>
                <Select
                  value={formData.additionalInfo.howDidYouHear}
                  onValueChange={value =>
                    handleInputChange("additionalInfo", "howDidYouHear", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="social-media">Social Media</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="email">Email Newsletter</SelectItem>
                    <SelectItem value="friend">Friend/Colleague</SelectItem>
                    <SelectItem value="search">Search Engine</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectations">What do you hope to gain from this event?</Label>
                <Textarea
                  id="expectations"
                  value={formData.additionalInfo.expectations}
                  onChange={e =>
                    handleInputChange("additionalInfo", "expectations", e.target.value)
                  }
                  placeholder="Share your goals and expectations..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="questions">Any questions for the organizers?</Label>
                <Textarea
                  id="questions"
                  value={formData.additionalInfo.questions}
                  onChange={e => handleInputChange("additionalInfo", "questions", e.target.value)}
                  placeholder="Ask anything you'd like to know..."
                  rows={3}
                />
              </div>

              <Separator />

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="marketing"
                  checked={formData.additionalInfo.marketingOptIn}
                  onCheckedChange={checked =>
                    handleInputChange("additionalInfo", "marketingOptIn", checked)
                  }
                />
                <Label htmlFor="marketing" className="text-sm">
                  I'd like to receive updates about future events and opportunities
                </Label>
              </div>
            </div>
          )}

          {/* Step 4: Payment (if not free) */}
          {currentStep === 4 && !event.isFree && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Order Summary</h3>
                <div className="flex justify-between">
                  <span>Event Registration</span>
                  <span className="font-medium">{event.price}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={formData.payment?.cardNumber || ""}
                  onChange={e => handleInputChange("payment", "cardNumber", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    placeholder="MM/YY"
                    value={formData.payment?.expiryDate || ""}
                    onChange={e => handleInputChange("payment", "expiryDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={formData.payment?.cvv || ""}
                    onChange={e => handleInputChange("payment", "cvv", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="billingAddress">Billing Address</Label>
                <Textarea
                  id="billingAddress"
                  placeholder="123 Main St, City, Country"
                  value={formData.payment?.billingAddress || ""}
                  onChange={e => handleInputChange("payment", "billingAddress", e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <div>
              {currentStep > 1 && (
                <Button variant="outline" onClick={prevStep} className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>
              )}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>

              {currentStep < totalSteps ? (
                <Button onClick={nextStep} className="flex items-center gap-2">
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Complete Registration
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
