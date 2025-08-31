import { Schema, model, models, Document } from "mongoose";

export interface IUserProfile extends Document {
  _id: string;
  userId: Schema.Types.ObjectId; // Reference to User model
  username: string; // Unique username for public profile

  // Basic Profile Info
  displayName?: string;
  bio?: string;
  tagline?: string; // Short one-liner

  // Academic Information
  university?: string;
  universityEmail?: string;
  major?: string;
  graduationYear?: number;
  currentYear?: "freshman" | "sophomore" | "junior" | "senior" | "graduate" | "postgrad" | "alumni";
  gpa?: number;

  // Personal Details
  dateOfBirth?: Date;
  location?: {
    city?: string;
    country?: string;
    timezone?: string;
  };
  languages?: string[];

  // Skills & Interests
  skills: {
    name: string;
    level: "beginner" | "intermediate" | "advanced" | "expert";
    category: "technical" | "creative" | "business" | "academic" | "soft" | "other";
    verified?: boolean;
    endorsements?: {
      userId: Schema.Types.ObjectId;
      endorsedAt: Date;
    }[];
  }[];
  interests: string[];
  categories: (
    | "competition"
    | "scholarship"
    | "internship"
    | "hackathon"
    | "workshop"
    | "fellowship"
    | "conference"
  )[];

  // Portfolio & Achievements
  portfolioItems: {
    id: string;
    title: string;
    description: string;
    type:
      | "project"
      | "competition"
      | "internship"
      | "research"
      | "certification"
      | "publication"
      | "other";
    url?: string;
    images?: string[];
    technologies?: string[];
    startDate?: Date;
    endDate?: Date;
    isOngoing?: boolean;
    achievements?: string[];
    collaborators?: {
      name: string;
      role: string;
      profileUrl?: string;
    }[];
    featured: boolean;
    order: number;
  }[];

  // Competition & Achievement History
  achievements: {
    opportunityId?: Schema.Types.ObjectId;
    title: string;
    description: string;
    type: "win" | "runner_up" | "finalist" | "participant" | "certification" | "recognition";
    position?: number;
    date: Date;
    organizer?: string;
    certificateUrl?: string;
    verificationUrl?: string;
    isVerified: boolean;
    skills?: string[];
  }[];

  // Statistics & Gamification
  stats: {
    totalSubmissions: number;
    totalWins: number;
    totalParticipations: number;
    streakCount: number; // Current daily streak
    longestStreak: number;
    lastActivity: Date;
    joinDate: Date;

    // Leaderboard stats
    universityRank?: number;
    cityRank?: number;
    globalRank?: number;

    // Engagement stats
    profileViews: number;
    followerCount: number;
    followingCount: number;
    postCount: number;
    commentCount: number;
    upvoteCount: number;

    // Experience points
    experiencePoints: number;
    level: number;
  };

  // Social & Networking
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    instagram?: string;
    portfolio?: string;
    resume?: string;
    behance?: string;
    dribbble?: string;
    medium?: string;
    youtube?: string;
  };

  followers: Schema.Types.ObjectId[];
  following: Schema.Types.ObjectId[];

  // Privacy & Settings
  privacy: {
    profileVisibility: "public" | "university_only" | "private";
    showEmail: boolean;
    showLocation: boolean;
    showUniversity: boolean;
    showStats: boolean;
    allowMessages: boolean;
    allowTeamInvites: boolean;
    showOnLeaderboard: boolean;
  };

  // Preferences
  preferences: {
    preferredOpportunityTypes: string[];
    preferredLocations: string[];
    remoteOnly: boolean;
    teamWorkPreference: "solo" | "team" | "both";
    availabilityStatus: "available" | "busy" | "unavailable";
    notificationSettings: {
      emailNotifications: boolean;
      pushNotifications: boolean;
      weeklyDigest: boolean;
      opportunityAlerts: boolean;
      teamInvitations: boolean;
      achievements: boolean;
      followers: boolean;
    };
  };

  // Verification & Trust
  verification: {
    universityVerified: boolean;
    universityVerifiedAt?: Date;
    emailVerified: boolean;
    phoneVerified: boolean;
    identityVerified: boolean;
    backgroundCheckPassed: boolean;
  };

  // Activity & Engagement
  recentActivity: {
    type: "submission" | "win" | "join_team" | "post" | "comment" | "follow" | "achievement";
    description: string;
    timestamp: Date;
    relatedId?: Schema.Types.ObjectId;
    visibility: "public" | "followers" | "private";
  }[];

  // Badges & Rewards
  badges: {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlockedAt: Date;
    rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
    category: string;
  }[];

  // Team & Collaboration History
  teamHistory: {
    teamId: Schema.Types.ObjectId;
    teamName: string;
    role: string;
    joinedAt: Date;
    leftAt?: Date;
    status: "current" | "completed" | "left";
    achievements?: string[];
  }[];

  // Recommendations & Endorsements
  recommendations: {
    fromUserId: Schema.Types.ObjectId;
    content: string;
    relationship: "teammate" | "mentor" | "peer" | "competitor" | "other";
    createdAt: Date;
    isVisible: boolean;
  }[];

  // Search & Discovery
  searchKeywords: string[];
  tags: string[];

  createdAt: Date;
  updatedAt: Date;

  // Methods
  generateUsername(): string;
  updateExperiencePoints(points: number): Promise<IUserProfile>;
  addAchievement(achievement: any): Promise<IUserProfile>;
  updateStreak(): Promise<IUserProfile>;
  addFollower(userId: Schema.Types.ObjectId): Promise<IUserProfile>;
  removeFollower(userId: Schema.Types.ObjectId): Promise<IUserProfile>;
  calculateLevel(): number;
  toJSON(): any;
}

const userProfileSchema = new Schema<IUserProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      unique: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      lowercase: true,
      match: [
        /^[a-z0-9_.-]+$/,
        "Username can only contain lowercase letters, numbers, dots, hyphens, and underscores",
      ],
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
    },

    // Basic Profile Info
    displayName: {
      type: String,
      trim: true,
      maxlength: [50, "Display name cannot exceed 50 characters"],
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },
    tagline: {
      type: String,
      trim: true,
      maxlength: [100, "Tagline cannot exceed 100 characters"],
    },

    // Academic Information
    university: {
      type: String,
      trim: true,
      maxlength: [200, "University name cannot exceed 200 characters"],
    },
    universityEmail: {
      type: String,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid university email"],
    },
    major: {
      type: String,
      trim: true,
      maxlength: [100, "Major cannot exceed 100 characters"],
    },
    graduationYear: {
      type: Number,
      min: [1900, "Graduation year must be after 1900"],
      max: [2050, "Graduation year must be before 2050"],
    },
    currentYear: {
      type: String,
      enum: ["freshman", "sophomore", "junior", "senior", "graduate", "postgrad", "alumni"],
    },
    gpa: {
      type: Number,
      min: [0, "GPA cannot be negative"],
      max: [4.5, "GPA cannot exceed 4.5"],
    },

    // Personal Details
    dateOfBirth: Date,
    location: {
      city: String,
      country: String,
      timezone: String,
    },
    languages: [String],

    // Skills & Interests
    skills: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        level: {
          type: String,
          enum: ["beginner", "intermediate", "advanced", "expert"],
          default: "beginner",
        },
        category: {
          type: String,
          enum: ["technical", "creative", "business", "academic", "soft", "other"],
          default: "other",
        },
        verified: {
          type: Boolean,
          default: false,
        },
        endorsements: [
          {
            userId: {
              type: Schema.Types.ObjectId,
              ref: "User",
            },
            endorsedAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
      },
    ],
    interests: [String],
    categories: [
      {
        type: String,
        enum: [
          "competition",
          "scholarship",
          "internship",
          "hackathon",
          "workshop",
          "fellowship",
          "conference",
        ],
      },
    ],

    // Portfolio & Achievements
    portfolioItems: [
      {
        id: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
          maxlength: [200, "Portfolio title cannot exceed 200 characters"],
        },
        description: {
          type: String,
          required: true,
          maxlength: [1000, "Portfolio description cannot exceed 1000 characters"],
        },
        type: {
          type: String,
          enum: [
            "project",
            "competition",
            "internship",
            "research",
            "certification",
            "publication",
            "other",
          ],
          default: "project",
        },
        url: String,
        images: [String],
        technologies: [String],
        startDate: Date,
        endDate: Date,
        isOngoing: {
          type: Boolean,
          default: false,
        },
        achievements: [String],
        collaborators: [
          {
            name: {
              type: String,
              required: true,
            },
            role: {
              type: String,
              required: true,
            },
            profileUrl: String,
          },
        ],
        featured: {
          type: Boolean,
          default: false,
        },
        order: {
          type: Number,
          default: 0,
        },
      },
    ],

    // Competition & Achievement History
    achievements: [
      {
        opportunityId: {
          type: Schema.Types.ObjectId,
          ref: "Opportunity",
        },
        title: {
          type: String,
          required: true,
          maxlength: [200, "Achievement title cannot exceed 200 characters"],
        },
        description: {
          type: String,
          required: true,
          maxlength: [500, "Achievement description cannot exceed 500 characters"],
        },
        type: {
          type: String,
          enum: ["win", "runner_up", "finalist", "participant", "certification", "recognition"],
          required: true,
        },
        position: Number,
        date: {
          type: Date,
          required: true,
        },
        organizer: String,
        certificateUrl: String,
        verificationUrl: String,
        isVerified: {
          type: Boolean,
          default: false,
        },
        skills: [String],
      },
    ],

    // Statistics & Gamification
    stats: {
      totalSubmissions: {
        type: Number,
        default: 0,
        min: [0, "Total submissions cannot be negative"],
      },
      totalWins: {
        type: Number,
        default: 0,
        min: [0, "Total wins cannot be negative"],
      },
      totalParticipations: {
        type: Number,
        default: 0,
        min: [0, "Total participations cannot be negative"],
      },
      streakCount: {
        type: Number,
        default: 0,
        min: [0, "Streak count cannot be negative"],
      },
      longestStreak: {
        type: Number,
        default: 0,
        min: [0, "Longest streak cannot be negative"],
      },
      lastActivity: {
        type: Date,
        default: Date.now,
      },
      joinDate: {
        type: Date,
        default: Date.now,
      },

      // Leaderboard stats
      universityRank: Number,
      cityRank: Number,
      globalRank: Number,

      // Engagement stats
      profileViews: {
        type: Number,
        default: 0,
        min: [0, "Profile views cannot be negative"],
      },
      followerCount: {
        type: Number,
        default: 0,
        min: [0, "Follower count cannot be negative"],
      },
      followingCount: {
        type: Number,
        default: 0,
        min: [0, "Following count cannot be negative"],
      },
      postCount: {
        type: Number,
        default: 0,
        min: [0, "Post count cannot be negative"],
      },
      commentCount: {
        type: Number,
        default: 0,
        min: [0, "Comment count cannot be negative"],
      },
      upvoteCount: {
        type: Number,
        default: 0,
        min: [0, "Upvote count cannot be negative"],
      },

      // Experience points
      experiencePoints: {
        type: Number,
        default: 0,
        min: [0, "Experience points cannot be negative"],
      },
      level: {
        type: Number,
        default: 1,
        min: [1, "Level must be at least 1"],
      },
    },

    // Social & Networking
    socialLinks: {
      linkedin: String,
      github: String,
      twitter: String,
      instagram: String,
      portfolio: String,
      resume: String,
      behance: String,
      dribbble: String,
      medium: String,
      youtube: String,
    },

    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Privacy & Settings
    privacy: {
      profileVisibility: {
        type: String,
        enum: ["public", "university_only", "private"],
        default: "public",
      },
      showEmail: {
        type: Boolean,
        default: false,
      },
      showLocation: {
        type: Boolean,
        default: true,
      },
      showUniversity: {
        type: Boolean,
        default: true,
      },
      showStats: {
        type: Boolean,
        default: true,
      },
      allowMessages: {
        type: Boolean,
        default: true,
      },
      allowTeamInvites: {
        type: Boolean,
        default: true,
      },
      showOnLeaderboard: {
        type: Boolean,
        default: true,
      },
    },

    // Preferences
    preferences: {
      preferredOpportunityTypes: [String],
      preferredLocations: [String],
      remoteOnly: {
        type: Boolean,
        default: false,
      },
      teamWorkPreference: {
        type: String,
        enum: ["solo", "team", "both"],
        default: "both",
      },
      availabilityStatus: {
        type: String,
        enum: ["available", "busy", "unavailable"],
        default: "available",
      },
      notificationSettings: {
        emailNotifications: {
          type: Boolean,
          default: true,
        },
        pushNotifications: {
          type: Boolean,
          default: true,
        },
        weeklyDigest: {
          type: Boolean,
          default: true,
        },
        opportunityAlerts: {
          type: Boolean,
          default: true,
        },
        teamInvitations: {
          type: Boolean,
          default: true,
        },
        achievements: {
          type: Boolean,
          default: true,
        },
        followers: {
          type: Boolean,
          default: true,
        },
      },
    },

    // Verification & Trust
    verification: {
      universityVerified: {
        type: Boolean,
        default: false,
      },
      universityVerifiedAt: Date,
      emailVerified: {
        type: Boolean,
        default: false,
      },
      phoneVerified: {
        type: Boolean,
        default: false,
      },
      identityVerified: {
        type: Boolean,
        default: false,
      },
      backgroundCheckPassed: {
        type: Boolean,
        default: false,
      },
    },

    // Activity & Engagement
    recentActivity: [
      {
        type: {
          type: String,
          enum: ["submission", "win", "join_team", "post", "comment", "follow", "achievement"],
          required: true,
        },
        description: {
          type: String,
          required: true,
          maxlength: [200, "Activity description cannot exceed 200 characters"],
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        relatedId: Schema.Types.ObjectId,
        visibility: {
          type: String,
          enum: ["public", "followers", "private"],
          default: "public",
        },
      },
    ],

    // Badges & Rewards
    badges: [
      {
        id: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        icon: {
          type: String,
          required: true,
        },
        unlockedAt: {
          type: Date,
          default: Date.now,
        },
        rarity: {
          type: String,
          enum: ["common", "uncommon", "rare", "epic", "legendary"],
          default: "common",
        },
        category: {
          type: String,
          required: true,
        },
      },
    ],

    // Team & Collaboration History
    teamHistory: [
      {
        teamId: {
          type: Schema.Types.ObjectId,
          ref: "Team",
          required: true,
        },
        teamName: {
          type: String,
          required: true,
        },
        role: {
          type: String,
          required: true,
        },
        joinedAt: {
          type: Date,
          required: true,
        },
        leftAt: Date,
        status: {
          type: String,
          enum: ["current", "completed", "left"],
          default: "current",
        },
        achievements: [String],
      },
    ],

    // Recommendations & Endorsements
    recommendations: [
      {
        fromUserId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        content: {
          type: String,
          required: true,
          maxlength: [1000, "Recommendation cannot exceed 1000 characters"],
        },
        relationship: {
          type: String,
          enum: ["teammate", "mentor", "peer", "competitor", "other"],
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        isVisible: {
          type: Boolean,
          default: true,
        },
      },
    ],

    // Search & Discovery
    searchKeywords: [String],
    tags: [String],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance and search
userProfileSchema.index({ userId: 1 }, { unique: true });
userProfileSchema.index({ username: 1 }, { unique: true });
userProfileSchema.index({ displayName: "text", bio: "text", searchKeywords: "text" });
userProfileSchema.index({ university: 1 });
userProfileSchema.index({ "location.city": 1 });
userProfileSchema.index({ "location.country": 1 });
userProfileSchema.index({ "skills.name": 1 });
userProfileSchema.index({ interests: 1 });
userProfileSchema.index({ "stats.experiencePoints": -1 });
userProfileSchema.index({ "stats.level": -1 });
userProfileSchema.index({ "stats.totalWins": -1 });
userProfileSchema.index({ "privacy.profileVisibility": 1 });

// Compound indexes for leaderboards
userProfileSchema.index({ university: 1, "stats.experiencePoints": -1 });
userProfileSchema.index({ "location.city": 1, "stats.experiencePoints": -1 });
userProfileSchema.index({ "privacy.showOnLeaderboard": 1, "stats.experiencePoints": -1 });

// Pre-save middleware to calculate level and update counts
userProfileSchema.pre("save", function (next) {
  // Update follower/following counts
  this.stats.followerCount = this.followers.length;
  this.stats.followingCount = this.following.length;

  // Calculate level based on experience points
  this.stats.level = this.calculateLevel();

  // Generate username if not exists
  if (!this.username) {
    this.username = this.generateUsername();
  }

  next();
});

// Method to generate username
userProfileSchema.methods.generateUsername = function (): string {
  const timestamp = Date.now().toString().slice(-6);
  return `user${timestamp}`;
};

// Method to update experience points
userProfileSchema.methods.updateExperiencePoints = async function (
  points: number
): Promise<IUserProfile> {
  this.stats.experiencePoints += points;
  this.stats.level = this.calculateLevel();
  return this.save();
};

// Method to calculate level from experience points
userProfileSchema.methods.calculateLevel = function (): number {
  const xp = this.stats.experiencePoints;
  // Level formula: level = floor(sqrt(xp / 100)) + 1
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

// Method to add achievement
userProfileSchema.methods.addAchievement = async function (
  achievement: any
): Promise<IUserProfile> {
  this.achievements.push(achievement);

  // Update stats based on achievement type
  if (achievement.type === "win") {
    this.stats.totalWins += 1;
    this.updateExperiencePoints(100);
  } else if (achievement.type === "runner_up") {
    this.updateExperiencePoints(75);
  } else if (achievement.type === "finalist") {
    this.updateExperiencePoints(50);
  } else if (achievement.type === "participant") {
    this.updateExperiencePoints(25);
  }

  this.stats.totalParticipations += 1;
  return this.save();
};

// Method to update streak
userProfileSchema.methods.updateStreak = async function (): Promise<IUserProfile> {
  const now = new Date();
  const lastActivity = new Date(this.stats.lastActivity);
  const daysDiff = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));

  if (daysDiff === 1) {
    // Continue streak
    this.stats.streakCount += 1;
    if (this.stats.streakCount > this.stats.longestStreak) {
      this.stats.longestStreak = this.stats.streakCount;
    }
  } else if (daysDiff > 1) {
    // Break streak
    this.stats.streakCount = 1;
  }

  this.stats.lastActivity = now;
  return this.save();
};

// Method to add follower
userProfileSchema.methods.addFollower = async function (
  userId: Schema.Types.ObjectId
): Promise<IUserProfile> {
  if (!this.followers.includes(userId)) {
    this.followers.push(userId);
    this.stats.followerCount = this.followers.length;
    return this.save();
  }
  return this;
};

// Method to remove follower
userProfileSchema.methods.removeFollower = async function (
  userId: Schema.Types.ObjectId
): Promise<IUserProfile> {
  const index = this.followers.indexOf(userId);
  if (index > -1) {
    this.followers.splice(index, 1);
    this.stats.followerCount = this.followers.length;
    return this.save();
  }
  return this;
};

// Virtual for win rate
userProfileSchema.virtual("winRate").get(function () {
  return this.stats.totalParticipations > 0
    ? Math.round((this.stats.totalWins / this.stats.totalParticipations) * 100)
    : 0;
});

// Virtual for next level XP requirement
userProfileSchema.virtual("nextLevelXP").get(function () {
  const currentLevelXP = Math.pow(this.stats.level - 1, 2) * 100;
  const nextLevelXP = Math.pow(this.stats.level, 2) * 100;
  return {
    required: nextLevelXP,
    current: this.stats.experiencePoints,
    remaining: nextLevelXP - this.stats.experiencePoints,
    percentage: Math.round(
      ((this.stats.experiencePoints - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100
    ),
  };
});

// Virtual for profile completion percentage
userProfileSchema.virtual("profileCompletion").get(function () {
  let completed = 0;
  const total = 10;

  if (this.displayName) completed++;
  if (this.bio) completed++;
  if (this.university) completed++;
  if (this.major) completed++;
  if (this.skills.length > 0) completed++;
  if (this.interests.length > 0) completed++;
  if (this.portfolioItems.length > 0) completed++;
  if (this.socialLinks.linkedin || this.socialLinks.github) completed++;
  if (this.location?.city) completed++;
  if (this.achievements.length > 0) completed++;

  return Math.round((completed / total) * 100);
});

// Override toJSON to add virtuals and remove sensitive data
userProfileSchema.methods.toJSON = function () {
  const profileObject = this.toObject();
  delete profileObject.__v;

  // Remove sensitive data based on privacy settings
  if (!this.privacy.showEmail) {
    delete profileObject.universityEmail;
  }

  if (!this.privacy.showLocation) {
    delete profileObject.location;
  }

  if (!this.privacy.showUniversity) {
    delete profileObject.university;
    delete profileObject.major;
    delete profileObject.graduationYear;
  }

  if (!this.privacy.showStats) {
    delete profileObject.stats;
  }

  return profileObject;
};

export const UserProfile =
  models.UserProfile || model<IUserProfile>("UserProfile", userProfileSchema);
export default UserProfile;
