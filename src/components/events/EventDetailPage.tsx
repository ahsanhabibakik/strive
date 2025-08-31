"use client";

import { useState } from "react";
import { Header } from "@/components/landing/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Users,
  ExternalLink,
  ChevronLeft,
  Share,
  Bookmark,
  CheckCircle,
  User,
  Phone,
  Mail,
  Building,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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

interface User {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface EventDetailPageProps {
  event: Event;
  user: User;
}

interface RegistrationForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  experience: string;
  motivation: string;
}

export function EventDetailPage({ event, user }: EventDetailPageProps) {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationForm, setRegistrationForm] = useState<RegistrationForm>({
    firstName: user.name?.split(" ")[0] || "",
    lastName: user.name?.split(" ")[1] || "",
    email: user.email || "",
    phone: "",
    company: "",
    jobTitle: "",
    experience: "",
    motivation: "",
  });
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isDeadlineApproaching = () => {
    const deadline = new Date(event.applicationDeadline);
    const today = new Date();
    const daysUntilDeadline = Math.ceil(
      (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilDeadline <= 7;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
      case "all levels":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "conference":
        return "bg-blue-100 text-blue-800";
      case "hackathon":
        return "bg-purple-100 text-purple-800";
      case "workshop":
        return "bg-orange-100 text-orange-800";
      case "networking":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleRegistration = async () => {
    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      setIsRegistered(true);
      toast({
        title: "Registration successful!",
        description: `You've been registered for ${event.title}. You'll receive a confirmation email shortly.`,
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      description: isBookmarked
        ? `${event.title} has been removed from your bookmarks.`
        : `${event.title} has been added to your bookmarks.`,
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Event link has been copied to your clipboard.",
        });
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Event link has been copied to your clipboard.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/events"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Events
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <Card>
              <CardHeader className="p-0">
                <div className="relative h-64 w-full">
                  <Image
                    src={event.logoUrl}
                    alt={event.title}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className={getCategoryColor(event.category)}>{event.category}</Badge>
                    <Badge className={getDifficultyColor(event.difficulty)}>
                      {event.difficulty}
                    </Badge>
                  </div>
                  {isDeadlineApproaching() && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-red-500 text-white animate-pulse">
                        <Clock className="w-3 h-3 mr-1" />
                        Deadline Soon
                      </Badge>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
                    <p className="text-lg text-gray-600">by {event.organizerName}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleShare}>
                      <Share className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBookmark}
                      className={isBookmarked ? "text-yellow-600" : ""}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
                    </Button>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed mb-6">{event.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {event.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="bg-gray-100 text-gray-700">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Event Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Event Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Start Date</Label>
                      <p className="text-lg font-medium">{formatDate(event.eventDate)}</p>
                      <p className="text-sm text-gray-600">{formatTime(event.eventDate)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">End Date</Label>
                      <p className="text-lg font-medium">{formatDate(event.endDate)}</p>
                      <p className="text-sm text-gray-600">{formatTime(event.endDate)}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Location</Label>
                      <p className="text-lg font-medium flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {event.isOnline ? "Virtual Event" : `${event.city}, ${event.country}`}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Registration Fee</Label>
                      <p
                        className={`text-lg font-medium flex items-center gap-2 ${
                          event.isFree ? "text-green-600" : ""
                        }`}
                      >
                        <DollarSign className="w-4 h-4" />
                        {event.price}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  {isRegistered ? "Registration Confirmed!" : "Register Now"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isRegistered ? (
                  <div className="text-center space-y-4">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                    <p className="text-gray-600">
                      You're all set! Check your email for confirmation details.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        Apply by {formatDate(event.applicationDeadline)}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2" />
                        {event.price}
                      </div>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full" size="lg">
                          <Users className="w-4 h-4 mr-2" />
                          Register for Event
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Register for {event.title}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="firstName">First Name *</Label>
                              <Input
                                id="firstName"
                                value={registrationForm.firstName}
                                onChange={e =>
                                  setRegistrationForm({
                                    ...registrationForm,
                                    firstName: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="lastName">Last Name *</Label>
                              <Input
                                id="lastName"
                                value={registrationForm.lastName}
                                onChange={e =>
                                  setRegistrationForm({
                                    ...registrationForm,
                                    lastName: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={registrationForm.email}
                              onChange={e =>
                                setRegistrationForm({
                                  ...registrationForm,
                                  email: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          <div>
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              type="tel"
                              value={registrationForm.phone}
                              onChange={e =>
                                setRegistrationForm({
                                  ...registrationForm,
                                  phone: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="company">Company/Organization</Label>
                              <Input
                                id="company"
                                value={registrationForm.company}
                                onChange={e =>
                                  setRegistrationForm({
                                    ...registrationForm,
                                    company: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="jobTitle">Job Title</Label>
                              <Input
                                id="jobTitle"
                                value={registrationForm.jobTitle}
                                onChange={e =>
                                  setRegistrationForm({
                                    ...registrationForm,
                                    jobTitle: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="experience">Years of Experience</Label>
                            <Input
                              id="experience"
                              value={registrationForm.experience}
                              onChange={e =>
                                setRegistrationForm({
                                  ...registrationForm,
                                  experience: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div>
                            <Label htmlFor="motivation">
                              Why are you interested in this event?
                            </Label>
                            <Textarea
                              id="motivation"
                              rows={3}
                              value={registrationForm.motivation}
                              onChange={e =>
                                setRegistrationForm({
                                  ...registrationForm,
                                  motivation: e.target.value,
                                })
                              }
                            />
                          </div>

                          <Button
                            onClick={handleRegistration}
                            disabled={
                              isSubmitting ||
                              !registrationForm.firstName ||
                              !registrationForm.lastName ||
                              !registrationForm.email
                            }
                            className="w-full"
                            size="lg"
                          >
                            {isSubmitting ? "Registering..." : "Complete Registration"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Organizer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Event Organizer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-gray-600" />
                    <span className="font-medium">{event.organizerName}</span>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Website
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
