import { Schema, model, models, Document } from "mongoose";

export interface IOpportunity extends Document {
  _id: string;
  title: string;
  description: string;
  category:
    | "competition"
    | "scholarship"
    | "internship"
    | "hackathon"
    | "workshop"
    | "fellowship"
    | "conference"
    | "other";
  subCategory?: string;
  organizerId: Schema.Types.ObjectId;
  organizerName: string;
  organizerEmail: string;
  organizerWebsite?: string;

  // Location & Accessibility
  country?: string;
  city?: string;
  location?: string;
  isOnline: boolean;
  timezone?: string;

  // Dates & Deadlines
  applicationDeadline: Date;
  startDate?: Date;
  endDate?: Date;
  announcementDate?: Date;

  // Requirements & Eligibility
  eligibility: {
    minAge?: number;
    maxAge?: number;
    educationLevel?: string[];
    nationality?: string[];
    skills?: string[];
    experience?: string;
  };
  requirements: string[];
  applicationProcess: string;

  // Financials
  fee?: number;
  currency?: string;
  isFree: boolean;
  prizes?: {
    position: string;
    amount?: number;
    description: string;
  }[];

  // Difficulty & Participation
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  teamSize?: {
    min: number;
    max: number;
  };
  isTeamBased: boolean;
  maxParticipants?: number;

  // External Links
  website: string;
  applicationUrl?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };

  // Media
  logoUrl?: string;
  bannerUrl?: string;
  images?: string[];

  // Tags & Search
  tags: string[];
  keywords: string[];

  // Status & Analytics
  status: "draft" | "published" | "closed" | "cancelled";
  submissionCount: number;
  viewCount: number;
  bookmarkCount: number;
  shareCount: number;

  // Admin & Moderation
  isVerified: boolean;
  isFeatured: boolean;
  moderatedBy?: Schema.Types.ObjectId;
  moderationNotes?: string;

  // SEO & Discovery
  slug: string;
  metaTitle?: string;
  metaDescription?: string;

  createdAt: Date;
  updatedAt: Date;

  // Methods
  generateSlug(): string;
  incrementView(): Promise<IOpportunity>;
  incrementSubmission(): Promise<IOpportunity>;
  toJSON(): any;
}

const opportunitySchema = new Schema<IOpportunity>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "competition",
        "scholarship",
        "internship",
        "hackathon",
        "workshop",
        "fellowship",
        "conference",
        "other",
      ],
    },
    subCategory: {
      type: String,
      trim: true,
      maxlength: [100, "Sub-category cannot exceed 100 characters"],
    },
    organizerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Organizer is required"],
    },
    organizerName: {
      type: String,
      required: [true, "Organizer name is required"],
      trim: true,
      maxlength: [100, "Organizer name cannot exceed 100 characters"],
    },
    organizerEmail: {
      type: String,
      required: [true, "Organizer email is required"],
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    organizerWebsite: {
      type: String,
      match: [/^https?:\/\/.+/, "Please enter a valid URL"],
    },

    // Location & Accessibility
    country: {
      type: String,
      trim: true,
      maxlength: [100, "Country cannot exceed 100 characters"],
    },
    city: {
      type: String,
      trim: true,
      maxlength: [100, "City cannot exceed 100 characters"],
    },
    location: {
      type: String,
      trim: true,
      maxlength: [200, "Location cannot exceed 200 characters"],
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    timezone: String,

    // Dates & Deadlines
    applicationDeadline: {
      type: Date,
      required: [true, "Application deadline is required"],
    },
    startDate: Date,
    endDate: Date,
    announcementDate: Date,

    // Requirements & Eligibility
    eligibility: {
      minAge: {
        type: Number,
        min: [0, "Minimum age cannot be negative"],
        max: [100, "Minimum age cannot exceed 100"],
      },
      maxAge: {
        type: Number,
        min: [0, "Maximum age cannot be negative"],
        max: [100, "Maximum age cannot exceed 100"],
      },
      educationLevel: [String],
      nationality: [String],
      skills: [String],
      experience: String,
    },
    requirements: {
      type: [String],
      default: [],
    },
    applicationProcess: {
      type: String,
      required: [true, "Application process is required"],
      maxlength: [2000, "Application process cannot exceed 2000 characters"],
    },

    // Financials
    fee: {
      type: Number,
      min: [0, "Fee cannot be negative"],
    },
    currency: {
      type: String,
      default: "USD",
      maxlength: [3, "Currency code cannot exceed 3 characters"],
    },
    isFree: {
      type: Boolean,
      default: true,
    },
    prizes: [
      {
        position: {
          type: String,
          required: true,
        },
        amount: Number,
        description: {
          type: String,
          required: true,
        },
      },
    ],

    // Difficulty & Participation
    difficulty: {
      type: String,
      required: [true, "Difficulty level is required"],
      enum: ["beginner", "intermediate", "advanced", "expert"],
    },
    teamSize: {
      min: {
        type: Number,
        min: [1, "Minimum team size must be at least 1"],
        default: 1,
      },
      max: {
        type: Number,
        min: [1, "Maximum team size must be at least 1"],
        default: 1,
      },
    },
    isTeamBased: {
      type: Boolean,
      default: false,
    },
    maxParticipants: {
      type: Number,
      min: [1, "Maximum participants must be at least 1"],
    },

    // External Links
    website: {
      type: String,
      required: [true, "Website URL is required"],
      match: [/^https?:\/\/.+/, "Please enter a valid URL"],
    },
    applicationUrl: {
      type: String,
      match: [/^https?:\/\/.+/, "Please enter a valid URL"],
    },
    socialLinks: {
      linkedin: String,
      twitter: String,
      facebook: String,
      instagram: String,
    },

    // Media
    logoUrl: String,
    bannerUrl: String,
    images: [String],

    // Tags & Search
    tags: {
      type: [String],
      default: [],
    },
    keywords: {
      type: [String],
      default: [],
    },

    // Status & Analytics
    status: {
      type: String,
      enum: ["draft", "published", "closed", "cancelled"],
      default: "draft",
    },
    submissionCount: {
      type: Number,
      default: 0,
      min: [0, "Submission count cannot be negative"],
    },
    viewCount: {
      type: Number,
      default: 0,
      min: [0, "View count cannot be negative"],
    },
    bookmarkCount: {
      type: Number,
      default: 0,
      min: [0, "Bookmark count cannot be negative"],
    },
    shareCount: {
      type: Number,
      default: 0,
      min: [0, "Share count cannot be negative"],
    },

    // Admin & Moderation
    isVerified: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    moderatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    moderationNotes: String,

    // SEO & Discovery
    slug: {
      type: String,
      unique: true,
      required: [true, "Slug is required"],
    },
    metaTitle: String,
    metaDescription: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for search and performance
opportunitySchema.index({ title: "text", description: "text", tags: "text" });
opportunitySchema.index({ category: 1 });
opportunitySchema.index({ status: 1 });
opportunitySchema.index({ applicationDeadline: 1 });
opportunitySchema.index({ country: 1 });
opportunitySchema.index({ city: 1 });
opportunitySchema.index({ isOnline: 1 });
opportunitySchema.index({ isFree: 1 });
opportunitySchema.index({ difficulty: 1 });
opportunitySchema.index({ isTeamBased: 1 });
opportunitySchema.index({ organizerId: 1 });
opportunitySchema.index({ slug: 1 }, { unique: true });
opportunitySchema.index({ isVerified: 1, isFeatured: 1 });
opportunitySchema.index({ createdAt: -1 });
opportunitySchema.index({ viewCount: -1 });
opportunitySchema.index({ submissionCount: -1 });

// Compound indexes for common queries
opportunitySchema.index({ status: 1, applicationDeadline: 1 });
opportunitySchema.index({ category: 1, status: 1, applicationDeadline: 1 });
opportunitySchema.index({ country: 1, status: 1, applicationDeadline: 1 });

// Pre-save middleware to generate slug
opportunitySchema.pre("save", function (next) {
  if (this.isModified("title") && !this.slug) {
    this.slug = this.generateSlug();
  }
  next();
});

// Method to generate slug from title
opportunitySchema.methods.generateSlug = function (): string {
  return (
    this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .substring(0, 100) +
    "-" +
    Date.now()
  );
};

// Method to increment view count
opportunitySchema.methods.incrementView = async function (): Promise<IOpportunity> {
  this.viewCount += 1;
  return this.save();
};

// Method to increment submission count
opportunitySchema.methods.incrementSubmission = async function (): Promise<IOpportunity> {
  this.submissionCount += 1;
  return this.save();
};

// Virtual for days until deadline
opportunitySchema.virtual("daysUntilDeadline").get(function () {
  const now = new Date();
  const deadline = new Date(this.applicationDeadline);
  const diffTime = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for status display
opportunitySchema.virtual("isOpen").get(function () {
  return this.status === "published" && new Date() < new Date(this.applicationDeadline);
});

// Virtual for full location
opportunitySchema.virtual("fullLocation").get(function () {
  if (this.isOnline) return "Online";
  if (this.city && this.country) return `${this.city}, ${this.country}`;
  if (this.country) return this.country;
  if (this.location) return this.location;
  return "Location TBD";
});

// Override toJSON to add virtuals and clean up
opportunitySchema.methods.toJSON = function () {
  const opportunityObject = this.toObject();
  delete opportunityObject.__v;
  return opportunityObject;
};

export const Opportunity =
  models.Opportunity || model<IOpportunity>("Opportunity", opportunitySchema);
export default Opportunity;
