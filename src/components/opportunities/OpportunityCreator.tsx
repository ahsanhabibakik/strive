"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  CalendarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  TagIcon,
  PhotoIcon,
  LinkIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const opportunitySchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  description: z.string().min(100, "Description must be at least 100 characters"),
  category: z.string().min(1, "Please select a category"),
  subCategory: z.string().optional(),
  organizerName: z.string().min(2, "Organizer name is required"),
  organizerEmail: z.string().email("Valid email is required"),
  organizerWebsite: z.string().url("Valid website URL is required").optional().or(z.literal("")),
  country: z.string().optional(),
  city: z.string().optional(),
  isOnline: z.boolean(),
  applicationDeadline: z.string().min(1, "Application deadline is required"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  announcementDate: z.string().optional(),
  eligibility: z.array(z.string()).min(1, "At least one eligibility requirement is needed"),
  requirements: z.array(z.string()).min(1, "At least one requirement is needed"),
  applicationProcess: z.string().min(50, "Please provide detailed application process"),
  isFree: z.boolean(),
  fee: z.number().optional(),
  currency: z.string().optional(),
  prizes: z.array(z.object({
    position: z.string(),
    amount: z.number().optional(),
    description: z.string()
  })).optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  isTeamBased: z.boolean(),
  teamSize: z.number().optional(),
  maxParticipants: z.number().optional(),
  website: z.string().url("Valid website URL is required").optional().or(z.literal("")),
  applicationUrl: z.string().url("Valid application URL is required").optional().or(z.literal("")),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  logoUrl: z.string().url().optional().or(z.literal("")),
  bannerUrl: z.string().url().optional().or(z.literal("")),
});

type OpportunityFormData = z.infer<typeof opportunitySchema>;

const categories = [
  "Scholarships",
  "Competitions",
  "Internships",
  "Jobs",
  "Fellowships",
  "Grants",
  "Conferences",
  "Workshops",
  "Hackathons",
  "Awards",
  "Volunteering",
  "Study Abroad"
];

const popularTags = [
  "Technology", "Business", "Design", "Marketing", "Engineering", "Science", 
  "Medicine", "Law", "Education", "Arts", "Music", "Writing", "Research",
  "Innovation", "Startup", "Leadership", "Environment", "Social Impact"
];

interface OpportunityCreatorProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export function OpportunityCreator({ user }: OpportunityCreatorProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [eligibilityList, setEligibilityList] = useState<string[]>([""]);
  const [requirementsList, setRequirementsList] = useState<string[]>([""]);
  const [prizesList, setPrizesList] = useState<Array<{position: string, amount?: number, description: string}>>([
    { position: "1st Place", description: "" }
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger
  } = useForm<OpportunityFormData>({
    resolver: zodResolver(opportunitySchema),
    defaultValues: {
      organizerEmail: user.email || "",
      organizerName: user.name || "",
      isOnline: false,
      isFree: true,
      isTeamBased: false,
      difficulty: "beginner",
      currency: "USD",
      eligibility: [""],
      requirements: [""],
      tags: []
    }
  });

  const watchedValues = watch();
  const totalSteps = 4;
  
  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    setSelectedTags(newTags);
    setValue("tags", newTags);
  };

  const updateEligibility = (index: number, value: string) => {
    const newList = [...eligibilityList];
    newList[index] = value;
    setEligibilityList(newList);
    setValue("eligibility", newList.filter(item => item.trim() !== ""));
  };

  const addEligibility = () => {
    setEligibilityList([...eligibilityList, ""]);
  };

  const removeEligibility = (index: number) => {
    const newList = eligibilityList.filter((_, i) => i !== index);
    setEligibilityList(newList);
    setValue("eligibility", newList.filter(item => item.trim() !== ""));
  };

  const updateRequirement = (index: number, value: string) => {
    const newList = [...requirementsList];
    newList[index] = value;
    setRequirementsList(newList);
    setValue("requirements", newList.filter(item => item.trim() !== ""));
  };

  const addRequirement = () => {
    setRequirementsList([...requirementsList, ""]);
  };

  const removeRequirement = (index: number) => {
    const newList = requirementsList.filter((_, i) => i !== index);
    setRequirementsList(newList);
    setValue("requirements", newList.filter(item => item.trim() !== ""));
  };

  const handleNextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await trigger(fieldsToValidate);
    
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 1:
        return ["title", "description", "category", "organizerName", "organizerEmail"] as const;
      case 2:
        return ["applicationDeadline", "startDate", "endDate", "isOnline", "country", "city"] as const;
      case 3:
        return ["eligibility", "requirements", "applicationProcess", "difficulty"] as const;
      case 4:
        return ["tags", "website", "logoUrl", "bannerUrl"] as const;
      default:
        return [] as const;
    }
  };

  const onSubmit = async (data: OpportunityFormData) => {
    setIsSubmitting(true);
    
    try {
      // Transform the data to match API expectations
      const transformedData = {
        ...data,
        eligibility: {
          // For now, store eligibility requirements as experience field
          experience: eligibilityList.filter(item => item.trim() !== "").join('; ')
        },
        requirements: requirementsList.filter(item => item.trim() !== ""),
        prizes: prizesList.filter(prize => prize.description.trim() !== ""),
        tags: selectedTags,
        status: "draft", // Start as draft
        // Ensure website is provided
        website: data.website || data.applicationUrl || "https://example.com"
      };
      
      const response = await fetch("/api/opportunities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transformedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create opportunity");
      }

      const result = await response.json();
      router.push(`/opportunities/${result.opportunity.slug}?created=true`);
    } catch (error) {
      console.error("Error creating opportunity:", error);
      // Handle error (show toast, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
              <p className="text-gray-600">Tell us about your opportunity</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Opportunity Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g. Google Summer of Code 2024"
                  {...register("title")}
                  className={cn(errors.title && "border-red-500")}
                />
                {errors.title && (
                  <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide a detailed description of the opportunity..."
                  rows={6}
                  {...register("description")}
                  className={cn(errors.description && "border-red-500")}
                />
                {errors.description && (
                  <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  {watchedValues.description?.length || 0}/500 characters (minimum 100)
                </p>
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select onValueChange={(value) => setValue("category", value)}>
                  <SelectTrigger className={cn(errors.category && "border-red-500")}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-500 mt-1">{errors.category.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="organizerName">Organization/Organizer *</Label>
                  <Input
                    id="organizerName"
                    placeholder="e.g. Google, Microsoft, Stanford University"
                    {...register("organizerName")}
                    className={cn(errors.organizerName && "border-red-500")}
                  />
                  {errors.organizerName && (
                    <p className="text-sm text-red-500 mt-1">{errors.organizerName.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="organizerEmail">Contact Email *</Label>
                  <Input
                    id="organizerEmail"
                    type="email"
                    placeholder="contact@organization.com"
                    {...register("organizerEmail")}
                    className={cn(errors.organizerEmail && "border-red-500")}
                  />
                  {errors.organizerEmail && (
                    <p className="text-sm text-red-500 mt-1">{errors.organizerEmail.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-lg font-semibold mb-2">Timeline & Location</h3>
              <p className="text-gray-600">When and where will this take place?</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="applicationDeadline">Application Deadline *</Label>
                  <Input
                    id="applicationDeadline"
                    type="date"
                    {...register("applicationDeadline")}
                    className={cn(errors.applicationDeadline && "border-red-500")}
                  />
                  {errors.applicationDeadline && (
                    <p className="text-sm text-red-500 mt-1">{errors.applicationDeadline.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    {...register("startDate")}
                  />
                </div>

                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    {...register("endDate")}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isOnline"
                  checked={watchedValues.isOnline}
                  onCheckedChange={(checked) => setValue("isOnline", checked)}
                />
                <Label htmlFor="isOnline">This is an online opportunity</Label>
              </div>

              {!watchedValues.isOnline && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      placeholder="e.g. United States"
                      {...register("country")}
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="e.g. San Francisco"
                      {...register("city")}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isFree"
                    checked={watchedValues.isFree}
                    onCheckedChange={(checked) => setValue("isFree", checked)}
                  />
                  <Label htmlFor="isFree">This opportunity is free to join</Label>
                </div>

                {!watchedValues.isFree && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fee">Application Fee</Label>
                      <Input
                        id="fee"
                        type="number"
                        placeholder="50"
                        {...register("fee", { valueAsNumber: true })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="currency">Currency</Label>
                      <Select onValueChange={(value) => setValue("currency", value)} defaultValue="USD">
                        <SelectTrigger>
                          <SelectValue placeholder="Currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="CAD">CAD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-lg font-semibold mb-2">Requirements & Details</h3>
              <p className="text-gray-600">Who can apply and what's needed?</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label>Eligibility Requirements *</Label>
                <div className="space-y-2 mt-2">
                  {eligibilityList.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="e.g. Must be 18+ years old"
                        value={item}
                        onChange={(e) => updateEligibility(index, e.target.value)}
                      />
                      {eligibilityList.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeEligibility(index)}
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addEligibility}
                  >
                    Add Eligibility Requirement
                  </Button>
                </div>
                {errors.eligibility && (
                  <p className="text-sm text-red-500 mt-1">{errors.eligibility.message}</p>
                )}
              </div>

              <div>
                <Label>Application Requirements *</Label>
                <div className="space-y-2 mt-2">
                  {requirementsList.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="e.g. Submit a portfolio or resume"
                        value={item}
                        onChange={(e) => updateRequirement(index, e.target.value)}
                      />
                      {requirementsList.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeRequirement(index)}
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addRequirement}
                  >
                    Add Requirement
                  </Button>
                </div>
                {errors.requirements && (
                  <p className="text-sm text-red-500 mt-1">{errors.requirements.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="applicationProcess">Application Process *</Label>
                <Textarea
                  id="applicationProcess"
                  placeholder="Describe the application process step by step..."
                  rows={4}
                  {...register("applicationProcess")}
                  className={cn(errors.applicationProcess && "border-red-500")}
                />
                {errors.applicationProcess && (
                  <p className="text-sm text-red-500 mt-1">{errors.applicationProcess.message}</p>
                )}
              </div>

              <div>
                <Label>Difficulty Level *</Label>
                <RadioGroup
                  defaultValue="beginner"
                  onValueChange={(value) => setValue("difficulty", value as any)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="beginner" id="beginner" />
                    <Label htmlFor="beginner">Beginner - No prior experience needed</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="intermediate" id="intermediate" />
                    <Label htmlFor="intermediate">Intermediate - Some experience preferred</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="advanced" id="advanced" />
                    <Label htmlFor="advanced">Advanced - Significant experience required</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isTeamBased"
                  checked={watchedValues.isTeamBased}
                  onCheckedChange={(checked) => setValue("isTeamBased", checked)}
                />
                <Label htmlFor="isTeamBased">Team-based opportunity</Label>
              </div>

              {watchedValues.isTeamBased && (
                <div>
                  <Label htmlFor="teamSize">Recommended Team Size</Label>
                  <Input
                    id="teamSize"
                    type="number"
                    placeholder="4"
                    {...register("teamSize", { valueAsNumber: true })}
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-lg font-semibold mb-2">Tags & Media</h3>
              <p className="text-gray-600">Help people discover your opportunity</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label>Tags *</Label>
                <p className="text-sm text-gray-600 mb-3">Select relevant tags to help people find this opportunity</p>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline-solid"}
                      className="cursor-pointer hover:bg-primary/80"
                      onClick={() => handleTagToggle(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                {errors.tags && (
                  <p className="text-sm text-red-500 mt-1">Please select at least one tag</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website">Official Website</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://opportunity-website.com"
                    {...register("website")}
                  />
                </div>

                <div>
                  <Label htmlFor="applicationUrl">Application URL</Label>
                  <Input
                    id="applicationUrl"
                    type="url"
                    placeholder="https://apply-here.com"
                    {...register("applicationUrl")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="logoUrl">Logo URL</Label>
                  <Input
                    id="logoUrl"
                    type="url"
                    placeholder="https://example.com/logo.png"
                    {...register("logoUrl")}
                  />
                </div>

                <div>
                  <Label htmlFor="bannerUrl">Banner Image URL</Label>
                  <Input
                    id="bannerUrl"
                    type="url"
                    placeholder="https://example.com/banner.jpg"
                    {...register("bannerUrl")}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Step {currentStep} of {totalSteps}</span>
          <span>{Math.round((currentStep / totalSteps) * 100)}% complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {renderStep()}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-8">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevStep}
            disabled={currentStep === 1}
          >
            Previous
          </Button>

          {currentStep === totalSteps ? (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <CheckCircleIcon className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Opportunity"
              )}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleNextStep}
            >
              Next
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}