"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Camera, Edit3, MapPin, Calendar, Mail, Phone, Globe, Building } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/i18n/utils";
import { useLocale } from "@/lib/i18n/context";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  website?: string;
  location?: string;
  company?: string;
  jobTitle?: string;
  timezone?: string;
  createdAt: Date;
  lastLoginAt?: Date;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  role: string;
  subscription?: {
    plan: string;
    status: string;
    startDate: Date;
    endDate?: Date;
  };
  stats: {
    projectsCreated: number;
    tasksCompleted: number;
    totalLogins: number;
    streakDays: number;
  };
}

interface ProfileOverviewProps {
  profile: UserProfile;
  isOwnProfile?: boolean;
  onEdit?: () => void;
}

export function ProfileOverview({ profile, isOwnProfile = false, onEdit }: ProfileOverviewProps) {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const { data: session } = useSession();
  const [isUploading, setIsUploading] = useState(false);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await fetch("/api/user/avatar", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Refresh the page or update the avatar URL
        window.location.reload();
      }
    } catch (error) {
      console.error("Avatar upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "destructive";
      case "moderator":
        return "secondary";
      case "premium":
        return "default";
      default:
        return "outline-solid";
    }
  };

  const getSubscriptionBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "default";
      case "trialing":
        return "secondary";
      case "past_due":
        return "destructive";
      case "cancelled":
        return "outline-solid";
      default:
        return "outline-solid";
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Avatar Section */}
            <div className="relative">
              <Avatar className="w-24 h-24 sm:w-32 sm:h-32">
                <AvatarImage
                  src={profile.avatar}
                  alt={`${profile.firstName} ${profile.lastName}`}
                />
                <AvatarFallback className="text-2xl">
                  {getInitials(profile.firstName, profile.lastName)}
                </AvatarFallback>
              </Avatar>

              {isOwnProfile && (
                <div className="absolute bottom-0 right-0">
                  <label htmlFor="avatar-upload" className="cursor-pointer">
                    <div className="bg-primary text-primary-foreground rounded-full p-2 hover:bg-primary/90 transition-colors">
                      <Camera className="w-4 h-4" />
                    </div>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold">
                  {profile.firstName} {profile.lastName}
                </h1>

                <div className="flex gap-2">
                  <Badge variant={getRoleBadgeColor(profile.role)}>
                    {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                  </Badge>

                  {profile.subscription && (
                    <Badge variant={getSubscriptionBadgeColor(profile.subscription.status)}>
                      {profile.subscription.plan}
                    </Badge>
                  )}

                  {profile.emailVerified && (
                    <Badge variant="outline">
                      <Mail className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}

                  {profile.twoFactorEnabled && <Badge variant="outline">🔐 2FA</Badge>}
                </div>
              </div>

              {profile.jobTitle && (
                <p className="text-muted-foreground">
                  {profile.jobTitle}
                  {profile.company && ` at ${profile.company}`}
                </p>
              )}

              {profile.bio && <p className="text-sm max-w-2xl">{profile.bio}</p>}

              {/* Contact Info */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {profile.email}
                </div>

                {profile.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {profile.phone}
                  </div>
                )}

                {profile.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {profile.location}
                  </div>
                )}

                {profile.website && (
                  <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary"
                    >
                      {profile.website.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}
              </div>

              {isOwnProfile && (
                <Button onClick={onEdit} variant="outline" size="sm" className="mt-4">
                  <Edit3 className="w-4 h-4 mr-2" />
                  {t("common.edit")} Profile
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Stats</CardTitle>
            <CardDescription>Your activity overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {profile.stats.projectsCreated}
                </div>
                <div className="text-xs text-muted-foreground">Projects Created</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {profile.stats.tasksCompleted}
                </div>
                <div className="text-xs text-muted-foreground">Tasks Completed</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {profile.stats.totalLogins}
                </div>
                <div className="text-xs text-muted-foreground">Total Logins</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{profile.stats.streakDays}</div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Account details and dates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Joined</div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(profile.createdAt, locale, { dateStyle: "medium" })}
                  </div>
                </div>
              </div>

              {profile.lastLoginAt && (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full shrink-0" />
                  <div>
                    <div className="text-sm font-medium">Last Login</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(profile.lastLoginAt, locale, {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </div>
                  </div>
                </div>
              )}

              {profile.timezone && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Timezone</div>
                    <div className="text-xs text-muted-foreground">{profile.timezone}</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Subscription Info */}
        {profile.subscription && (
          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>Your current plan details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium">Current Plan</div>
                  <div className="text-lg font-bold capitalize">{profile.subscription.plan}</div>
                </div>

                <div>
                  <div className="text-sm font-medium">Status</div>
                  <Badge variant={getSubscriptionBadgeColor(profile.subscription.status)}>
                    {profile.subscription.status}
                  </Badge>
                </div>

                <div>
                  <div className="text-sm font-medium">Started</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(profile.subscription.startDate, locale, { dateStyle: "medium" })}
                  </div>
                </div>

                {profile.subscription.endDate && (
                  <div>
                    <div className="text-sm font-medium">
                      {profile.subscription.status === "cancelled" ? "Expires" : "Next Billing"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(profile.subscription.endDate, locale, { dateStyle: "medium" })}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default ProfileOverview;
