import { Schema, model, models, Document } from "mongoose";

export interface IPost extends Document {
  _id: string;
  title: string;
  content: string;
  contentType: "text" | "link" | "image" | "poll" | "event";

  // Author & Hub
  authorId: Schema.Types.ObjectId;
  hubId: Schema.Types.ObjectId;
  hubSlug: string; // For faster queries

  // Content Details
  contentData?: {
    // For link posts
    url?: string;
    linkTitle?: string;
    linkDescription?: string;
    linkImage?: string;

    // For image posts
    images?: {
      url: string;
      caption?: string;
      alt?: string;
    }[];

    // For polls
    poll?: {
      question: string;
      options: {
        id: string;
        text: string;
        votes: number;
        voters: Schema.Types.ObjectId[];
      }[];
      allowMultiple: boolean;
      expiresAt?: Date;
    };

    // For events
    event?: {
      eventDate: Date;
      location?: string;
      isOnline: boolean;
      registrationUrl?: string;
      description?: string;
    };
  };

  // Tags & Categories
  tags: string[];
  flair?: string; // Hub-specific post flair

  // Engagement & Analytics
  upvotes: number;
  downvotes: number;
  commentCount: number;
  viewCount: number;
  shareCount: number;
  bookmarkCount: number;

  // Voting tracking
  votes: {
    userId: Schema.Types.ObjectId;
    type: "up" | "down";
    timestamp: Date;
  }[];

  // Comments (we'll have a separate Comment model too)
  comments: Schema.Types.ObjectId[];

  // Status & Moderation
  status: "published" | "draft" | "removed" | "spam" | "pending_approval";
  removedBy?: Schema.Types.ObjectId;
  removalReason?: string;
  removedAt?: Date;

  // Post Features
  isPinned: boolean;
  isFeatured: boolean;
  isLocked: boolean; // No new comments allowed
  isSpoiler: boolean;
  isNSFW: boolean;

  // Weekly Theme Integration
  weeklyTheme?: {
    day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
    theme: string;
    emoji: string;
  };

  // External Integration
  linkedOpportunityId?: Schema.Types.ObjectId; // Link to opportunity
  linkedTeamId?: Schema.Types.ObjectId; // Link to team

  // Analytics
  analytics: {
    clicks: number; // For link posts
    impressions: number;
    engagementRate: number;
    peakActivity: Date;
    lastEngagement: Date;
  };

  // SEO & Discovery
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;

  createdAt: Date;
  updatedAt: Date;

  // Methods
  generateSlug(): string;
  upvote(userId: Schema.Types.ObjectId): Promise<IPost>;
  downvote(userId: Schema.Types.ObjectId): Promise<IPost>;
  removeVote(userId: Schema.Types.ObjectId): Promise<IPost>;
  incrementView(): Promise<IPost>;
  incrementShare(): Promise<IPost>;
  addComment(commentId: Schema.Types.ObjectId): Promise<IPost>;
  removeComment(commentId: Schema.Types.ObjectId): Promise<IPost>;
  toJSON(): any;
}

const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, "Post title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [300, "Title cannot exceed 300 characters"],
    },
    content: {
      type: String,
      trim: true,
      maxlength: [10000, "Content cannot exceed 10000 characters"],
    },
    contentType: {
      type: String,
      required: [true, "Content type is required"],
      enum: ["text", "link", "image", "poll", "event"],
      default: "text",
    },

    // Author & Hub
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
    hubId: {
      type: Schema.Types.ObjectId,
      ref: "Hub",
      required: [true, "Hub is required"],
    },
    hubSlug: {
      type: String,
      required: [true, "Hub slug is required"],
      index: true,
    },

    // Content Details
    contentData: {
      // For link posts
      url: {
        type: String,
        match: [/^https?:\/\/.+/, "URL must be a valid link"],
      },
      linkTitle: String,
      linkDescription: String,
      linkImage: String,

      // For image posts
      images: [
        {
          url: {
            type: String,
            required: true,
          },
          caption: {
            type: String,
            maxlength: [500, "Caption cannot exceed 500 characters"],
          },
          alt: {
            type: String,
            maxlength: [200, "Alt text cannot exceed 200 characters"],
          },
        },
      ],

      // For polls
      poll: {
        question: {
          type: String,
          maxlength: [500, "Poll question cannot exceed 500 characters"],
        },
        options: [
          {
            id: {
              type: String,
              required: true,
            },
            text: {
              type: String,
              required: true,
              maxlength: [200, "Poll option cannot exceed 200 characters"],
            },
            votes: {
              type: Number,
              default: 0,
              min: [0, "Vote count cannot be negative"],
            },
            voters: [
              {
                type: Schema.Types.ObjectId,
                ref: "User",
              },
            ],
          },
        ],
        allowMultiple: {
          type: Boolean,
          default: false,
        },
        expiresAt: Date,
      },

      // For events
      event: {
        eventDate: {
          type: Date,
          required: function () {
            return this.contentType === "event";
          },
        },
        location: String,
        isOnline: {
          type: Boolean,
          default: false,
        },
        registrationUrl: String,
        description: String,
      },
    },

    // Tags & Categories
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (v: string[]) {
          return v.length <= 10;
        },
        message: "Cannot have more than 10 tags",
      },
    },
    flair: {
      type: String,
      maxlength: [50, "Flair cannot exceed 50 characters"],
    },

    // Engagement & Analytics
    upvotes: {
      type: Number,
      default: 0,
      min: [0, "Upvotes cannot be negative"],
    },
    downvotes: {
      type: Number,
      default: 0,
      min: [0, "Downvotes cannot be negative"],
    },
    commentCount: {
      type: Number,
      default: 0,
      min: [0, "Comment count cannot be negative"],
    },
    viewCount: {
      type: Number,
      default: 0,
      min: [0, "View count cannot be negative"],
    },
    shareCount: {
      type: Number,
      default: 0,
      min: [0, "Share count cannot be negative"],
    },
    bookmarkCount: {
      type: Number,
      default: 0,
      min: [0, "Bookmark count cannot be negative"],
    },

    // Voting tracking
    votes: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        type: {
          type: String,
          enum: ["up", "down"],
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Comments
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],

    // Status & Moderation
    status: {
      type: String,
      enum: ["published", "draft", "removed", "spam", "pending_approval"],
      default: "published",
    },
    removedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    removalReason: String,
    removedAt: Date,

    // Post Features
    isPinned: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    isSpoiler: {
      type: Boolean,
      default: false,
    },
    isNSFW: {
      type: Boolean,
      default: false,
    },

    // Weekly Theme Integration
    weeklyTheme: {
      day: {
        type: String,
        enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
      },
      theme: String,
      emoji: String,
    },

    // External Integration
    linkedOpportunityId: {
      type: Schema.Types.ObjectId,
      ref: "Opportunity",
    },
    linkedTeamId: {
      type: Schema.Types.ObjectId,
      ref: "Team",
    },

    // Analytics
    analytics: {
      clicks: {
        type: Number,
        default: 0,
        min: [0, "Clicks cannot be negative"],
      },
      impressions: {
        type: Number,
        default: 0,
        min: [0, "Impressions cannot be negative"],
      },
      engagementRate: {
        type: Number,
        default: 0,
        min: [0, "Engagement rate cannot be negative"],
        max: [100, "Engagement rate cannot exceed 100"],
      },
      peakActivity: Date,
      lastEngagement: Date,
    },

    // SEO & Discovery
    slug: String,
    metaTitle: String,
    metaDescription: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance and search
postSchema.index({ title: "text", content: "text", tags: "text" });
postSchema.index({ authorId: 1 });
postSchema.index({ hubId: 1, createdAt: -1 });
postSchema.index({ hubSlug: 1, createdAt: -1 });
postSchema.index({ status: 1 });
postSchema.index({ upvotes: -1 });
postSchema.index({ commentCount: -1 });
postSchema.index({ viewCount: -1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ isPinned: -1, isFeatured: -1 });

// Compound indexes for common queries
postSchema.index({ hubId: 1, status: 1, isPinned: -1, createdAt: -1 });
postSchema.index({ status: 1, isFeatured: 1, upvotes: -1 });
postSchema.index({ contentType: 1, status: 1, createdAt: -1 });

// Pre-save middleware
postSchema.pre("save", function (next) {
  if (this.isModified("title") && !this.slug) {
    this.slug = this.generateSlug();
  }
  next();
});

// Method to generate slug from title
postSchema.methods.generateSlug = function (): string {
  return (
    this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .substring(0, 100) +
    "-" +
    this._id.toString().slice(-6)
  );
};

// Method to upvote post
postSchema.methods.upvote = async function (userId: Schema.Types.ObjectId): Promise<IPost> {
  const existingVoteIndex = this.votes.findIndex(
    (vote: any) => vote.userId.toString() === userId.toString()
  );

  if (existingVoteIndex > -1) {
    const existingVote = this.votes[existingVoteIndex];
    if (existingVote.type === "up") {
      // Remove upvote
      this.votes.splice(existingVoteIndex, 1);
      this.upvotes = Math.max(0, this.upvotes - 1);
    } else {
      // Change from downvote to upvote
      this.votes[existingVoteIndex] = {
        userId,
        type: "up",
        timestamp: new Date(),
      };
      this.upvotes += 1;
      this.downvotes = Math.max(0, this.downvotes - 1);
    }
  } else {
    // New upvote
    this.votes.push({
      userId,
      type: "up",
      timestamp: new Date(),
    });
    this.upvotes += 1;
  }

  this.analytics.lastEngagement = new Date();
  return this.save();
};

// Method to downvote post
postSchema.methods.downvote = async function (userId: Schema.Types.ObjectId): Promise<IPost> {
  const existingVoteIndex = this.votes.findIndex(
    (vote: any) => vote.userId.toString() === userId.toString()
  );

  if (existingVoteIndex > -1) {
    const existingVote = this.votes[existingVoteIndex];
    if (existingVote.type === "down") {
      // Remove downvote
      this.votes.splice(existingVoteIndex, 1);
      this.downvotes = Math.max(0, this.downvotes - 1);
    } else {
      // Change from upvote to downvote
      this.votes[existingVoteIndex] = {
        userId,
        type: "down",
        timestamp: new Date(),
      };
      this.downvotes += 1;
      this.upvotes = Math.max(0, this.upvotes - 1);
    }
  } else {
    // New downvote
    this.votes.push({
      userId,
      type: "down",
      timestamp: new Date(),
    });
    this.downvotes += 1;
  }

  this.analytics.lastEngagement = new Date();
  return this.save();
};

// Method to remove vote
postSchema.methods.removeVote = async function (userId: Schema.Types.ObjectId): Promise<IPost> {
  const existingVoteIndex = this.votes.findIndex(
    (vote: any) => vote.userId.toString() === userId.toString()
  );

  if (existingVoteIndex > -1) {
    const existingVote = this.votes[existingVoteIndex];
    this.votes.splice(existingVoteIndex, 1);

    if (existingVote.type === "up") {
      this.upvotes = Math.max(0, this.upvotes - 1);
    } else {
      this.downvotes = Math.max(0, this.downvotes - 1);
    }

    return this.save();
  }

  return this;
};

// Method to increment view count
postSchema.methods.incrementView = async function (): Promise<IPost> {
  this.viewCount += 1;
  this.analytics.impressions += 1;
  return this.save();
};

// Method to increment share count
postSchema.methods.incrementShare = async function (): Promise<IPost> {
  this.shareCount += 1;
  return this.save();
};

// Method to add comment
postSchema.methods.addComment = async function (commentId: Schema.Types.ObjectId): Promise<IPost> {
  this.comments.push(commentId);
  this.commentCount += 1;
  this.analytics.lastEngagement = new Date();
  return this.save();
};

// Method to remove comment
postSchema.methods.removeComment = async function (
  commentId: Schema.Types.ObjectId
): Promise<IPost> {
  const commentIndex = this.comments.indexOf(commentId);
  if (commentIndex > -1) {
    this.comments.splice(commentIndex, 1);
    this.commentCount = Math.max(0, this.commentCount - 1);
    return this.save();
  }
  return this;
};

// Virtual for net score (upvotes - downvotes)
postSchema.virtual("score").get(function () {
  return this.upvotes - this.downvotes;
});

// Virtual for hot score (Reddit-style algorithm)
postSchema.virtual("hotScore").get(function () {
  const score = this.upvotes - this.downvotes;
  const order = Math.log10(Math.max(Math.abs(score), 1));
  const sign = score > 0 ? 1 : score < 0 ? -1 : 0;
  const seconds = (this.createdAt.getTime() - new Date("2025-01-01").getTime()) / 1000;
  return sign * order + seconds / 45000;
});

// Virtual for engagement rate
postSchema.virtual("calculatedEngagementRate").get(function () {
  if (this.viewCount === 0) return 0;
  const engagements = this.upvotes + this.downvotes + this.commentCount + this.shareCount;
  return Math.round((engagements / this.viewCount) * 100);
});

// Virtual for post age in hours
postSchema.virtual("ageInHours").get(function () {
  return Math.floor((Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60));
});

// Override toJSON to add virtuals and clean up
postSchema.methods.toJSON = function () {
  const postObject = this.toObject();
  delete postObject.__v;
  delete postObject.votes; // Don't expose individual votes
  return postObject;
};

export const Post = models.Post || model<IPost>("Post", postSchema);
export default Post;
