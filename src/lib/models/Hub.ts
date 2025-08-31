import { Schema, model, models, Document } from "mongoose";

export interface IHub extends Document {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: "industry" | "university" | "location" | "interest" | "event";
  subCategory?: string;

  // Visual & Branding
  avatarUrl?: string;
  bannerUrl?: string;
  color?: string;
  emoji?: string;

  // Settings & Rules
  rules: string[];
  guidelines?: string;
  isPrivate: boolean;
  requiresApproval: boolean;
  allowedDomains?: string[]; // For university hubs

  // Membership & Moderation
  createdBy: Schema.Types.ObjectId;
  moderatorIds: Schema.Types.ObjectId[];
  memberIds: Schema.Types.ObjectId[];
  bannedUserIds?: Schema.Types.ObjectId[];

  // Statistics
  memberCount: number;
  postCount: number;
  activeMembers: number; // Members active in last 30 days

  // Content Organization
  pinnedPostIds?: Schema.Types.ObjectId[];
  featuredPostIds?: Schema.Types.ObjectId[];
  tags: string[];

  // Engagement Features
  weeklyThemes?: {
    day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
    theme: string;
    description: string;
    emoji: string;
    isActive: boolean;
  }[];

  // Hub-specific Settings
  settings: {
    allowPolls: boolean;
    allowImages: boolean;
    allowLinks: boolean;
    requirePostApproval: boolean;
    minAccountAge?: number; // Days
    minKarma?: number;
    autoModeration: boolean;
  };

  // Discovery & SEO
  searchKeywords: string[];
  isVerified: boolean;
  isFeatured: boolean;
  isOfficial: boolean; // For official university/company hubs

  // Analytics
  analytics: {
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
    averagePostsPerDay: number;
    engagementRate: number;
    lastCalculated: Date;
  };

  // External Integration
  externalLinks?: {
    website?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    discord?: string;
    slack?: string;
  };

  // Status & Admin
  status: "active" | "inactive" | "suspended" | "archived";
  suspensionReason?: string;
  suspendedBy?: Schema.Types.ObjectId;
  suspendedAt?: Date;

  createdAt: Date;
  updatedAt: Date;

  // Methods
  generateSlug(): string;
  addMember(userId: Schema.Types.ObjectId): Promise<IHub>;
  removeMember(userId: Schema.Types.ObjectId): Promise<IHub>;
  addModerator(userId: Schema.Types.ObjectId): Promise<IHub>;
  removeModerator(userId: Schema.Types.ObjectId): Promise<IHub>;
  incrementPostCount(): Promise<IHub>;
  updateAnalytics(): Promise<IHub>;
  toJSON(): any;
}

const hubSchema = new Schema<IHub>(
  {
    name: {
      type: String,
      required: [true, "Hub name is required"],
      trim: true,
      minlength: [3, "Hub name must be at least 3 characters"],
      maxlength: [100, "Hub name cannot exceed 100 characters"],
    },
    slug: {
      type: String,
      required: [true, "Hub slug is required"],
      unique: true,
      lowercase: true,
      match: [/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"],
    },
    description: {
      type: String,
      required: [true, "Hub description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    category: {
      type: String,
      required: [true, "Hub category is required"],
      enum: ["industry", "university", "location", "interest", "event"],
    },
    subCategory: {
      type: String,
      trim: true,
      maxlength: [50, "Sub-category cannot exceed 50 characters"],
    },

    // Visual & Branding
    avatarUrl: {
      type: String,
      match: [/^https?:\/\/.+/, "Avatar URL must be a valid URL"],
    },
    bannerUrl: {
      type: String,
      match: [/^https?:\/\/.+/, "Banner URL must be a valid URL"],
    },
    color: {
      type: String,
      match: [/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex code"],
      default: "#FF5722",
    },
    emoji: {
      type: String,
      maxlength: [10, "Emoji cannot exceed 10 characters"],
    },

    // Settings & Rules
    rules: {
      type: [String],
      default: [],
      validate: {
        validator: function (v: string[]) {
          return v.length <= 10;
        },
        message: "Cannot have more than 10 rules",
      },
    },
    guidelines: {
      type: String,
      maxlength: [2000, "Guidelines cannot exceed 2000 characters"],
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    requiresApproval: {
      type: Boolean,
      default: false,
    },
    allowedDomains: {
      type: [String],
      default: [],
    },

    // Membership & Moderation
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator is required"],
    },
    moderatorIds: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    memberIds: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    bannedUserIds: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },

    // Statistics
    memberCount: {
      type: Number,
      default: 1, // Creator is first member
      min: [0, "Member count cannot be negative"],
    },
    postCount: {
      type: Number,
      default: 0,
      min: [0, "Post count cannot be negative"],
    },
    activeMembers: {
      type: Number,
      default: 1,
      min: [0, "Active member count cannot be negative"],
    },

    // Content Organization
    pinnedPostIds: {
      type: [Schema.Types.ObjectId],
      ref: "Post",
      default: [],
      validate: {
        validator: function (v: Schema.Types.ObjectId[]) {
          return v.length <= 5;
        },
        message: "Cannot have more than 5 pinned posts",
      },
    },
    featuredPostIds: {
      type: [Schema.Types.ObjectId],
      ref: "Post",
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },

    // Engagement Features
    weeklyThemes: [
      {
        day: {
          type: String,
          enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
          required: true,
        },
        theme: {
          type: String,
          required: true,
          maxlength: [100, "Theme name cannot exceed 100 characters"],
        },
        description: {
          type: String,
          maxlength: [300, "Theme description cannot exceed 300 characters"],
        },
        emoji: {
          type: String,
          maxlength: [5, "Theme emoji cannot exceed 5 characters"],
        },
        isActive: {
          type: Boolean,
          default: true,
        },
      },
    ],

    // Hub-specific Settings
    settings: {
      allowPolls: {
        type: Boolean,
        default: true,
      },
      allowImages: {
        type: Boolean,
        default: true,
      },
      allowLinks: {
        type: Boolean,
        default: true,
      },
      requirePostApproval: {
        type: Boolean,
        default: false,
      },
      minAccountAge: {
        type: Number,
        min: [0, "Minimum account age cannot be negative"],
        max: [365, "Minimum account age cannot exceed 365 days"],
      },
      minKarma: {
        type: Number,
        min: [0, "Minimum karma cannot be negative"],
      },
      autoModeration: {
        type: Boolean,
        default: false,
      },
    },

    // Discovery & SEO
    searchKeywords: {
      type: [String],
      default: [],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isOfficial: {
      type: Boolean,
      default: false,
    },

    // Analytics
    analytics: {
      dailyActiveUsers: {
        type: Number,
        default: 0,
        min: [0, "Daily active users cannot be negative"],
      },
      weeklyActiveUsers: {
        type: Number,
        default: 0,
        min: [0, "Weekly active users cannot be negative"],
      },
      monthlyActiveUsers: {
        type: Number,
        default: 0,
        min: [0, "Monthly active users cannot be negative"],
      },
      averagePostsPerDay: {
        type: Number,
        default: 0,
        min: [0, "Average posts per day cannot be negative"],
      },
      engagementRate: {
        type: Number,
        default: 0,
        min: [0, "Engagement rate cannot be negative"],
        max: [100, "Engagement rate cannot exceed 100"],
      },
      lastCalculated: {
        type: Date,
        default: Date.now,
      },
    },

    // External Integration
    externalLinks: {
      website: String,
      linkedin: String,
      twitter: String,
      facebook: String,
      instagram: String,
      discord: String,
      slack: String,
    },

    // Status & Admin
    status: {
      type: String,
      enum: ["active", "inactive", "suspended", "archived"],
      default: "active",
    },
    suspensionReason: String,
    suspendedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    suspendedAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance and search
hubSchema.index({ slug: 1 }, { unique: true });
hubSchema.index({ name: "text", description: "text", searchKeywords: "text" });
hubSchema.index({ category: 1 });
hubSchema.index({ status: 1 });
hubSchema.index({ isPrivate: 1 });
hubSchema.index({ memberCount: -1 });
hubSchema.index({ postCount: -1 });
hubSchema.index({ createdAt: -1 });
hubSchema.index({ isVerified: 1, isFeatured: 1 });

// Compound indexes
hubSchema.index({ category: 1, status: 1, memberCount: -1 });
hubSchema.index({ isPrivate: 1, status: 1, memberCount: -1 });

// Pre-save middleware to generate slug and add creator as member/moderator
hubSchema.pre("save", function (next) {
  if (this.isModified("name") && (!this.slug || this.isNew)) {
    this.slug = this.generateSlug();
  }

  // Add creator as first member and moderator
  if (this.isNew) {
    if (!this.memberIds.includes(this.createdBy)) {
      this.memberIds.push(this.createdBy);
    }
    if (!this.moderatorIds.includes(this.createdBy)) {
      this.moderatorIds.push(this.createdBy);
    }
    this.memberCount = this.memberIds.length;
  }

  next();
});

// Method to generate slug from name
hubSchema.methods.generateSlug = function (): string {
  return this.name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 50);
};

// Method to add member
hubSchema.methods.addMember = async function (userId: Schema.Types.ObjectId): Promise<IHub> {
  if (!this.memberIds.includes(userId) && !this.bannedUserIds?.includes(userId)) {
    this.memberIds.push(userId);
    this.memberCount = this.memberIds.length;
    return this.save();
  }
  return this;
};

// Method to remove member
hubSchema.methods.removeMember = async function (userId: Schema.Types.ObjectId): Promise<IHub> {
  const memberIndex = this.memberIds.indexOf(userId);
  if (memberIndex > -1) {
    this.memberIds.splice(memberIndex, 1);
    this.memberCount = this.memberIds.length;

    // Also remove from moderators if they were one
    const modIndex = this.moderatorIds.indexOf(userId);
    if (modIndex > -1) {
      this.moderatorIds.splice(modIndex, 1);
    }

    return this.save();
  }
  return this;
};

// Method to add moderator
hubSchema.methods.addModerator = async function (userId: Schema.Types.ObjectId): Promise<IHub> {
  if (this.memberIds.includes(userId) && !this.moderatorIds.includes(userId)) {
    this.moderatorIds.push(userId);
    return this.save();
  }
  return this;
};

// Method to remove moderator
hubSchema.methods.removeModerator = async function (userId: Schema.Types.ObjectId): Promise<IHub> {
  // Cannot remove creator as moderator
  if (userId.toString() === this.createdBy.toString()) {
    return this;
  }

  const modIndex = this.moderatorIds.indexOf(userId);
  if (modIndex > -1) {
    this.moderatorIds.splice(modIndex, 1);
    return this.save();
  }
  return this;
};

// Method to increment post count
hubSchema.methods.incrementPostCount = async function (): Promise<IHub> {
  this.postCount += 1;
  return this.save();
};

// Method to update analytics
hubSchema.methods.updateAnalytics = async function (): Promise<IHub> {
  // This would be implemented with actual analytics calculation
  this.analytics.lastCalculated = new Date();
  return this.save();
};

// Virtual for member growth rate
hubSchema.virtual("memberGrowthRate").get(function () {
  const daysSinceCreated = Math.floor(
    (Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );
  return daysSinceCreated > 0 ? this.memberCount / daysSinceCreated : this.memberCount;
});

// Virtual for engagement rate
hubSchema.virtual("dailyEngagementRate").get(function () {
  if (this.memberCount === 0) return 0;
  return Math.round((this.analytics.dailyActiveUsers / this.memberCount) * 100);
});

// Virtual for average posts per member
hubSchema.virtual("averagePostsPerMember").get(function () {
  return this.memberCount > 0 ? Math.round((this.postCount / this.memberCount) * 100) / 100 : 0;
});

// Override toJSON to add virtuals and clean up
hubSchema.methods.toJSON = function () {
  const hubObject = this.toObject();
  delete hubObject.__v;
  return hubObject;
};

export const Hub = models.Hub || model<IHub>("Hub", hubSchema);
export default Hub;
