import { Schema, model, models, Document } from "mongoose";

export interface ITeam extends Document {
  _id: string;
  name: string;
  description: string;
  slug: string;

  // Team Leadership
  leaderId: Schema.Types.ObjectId;
  coLeaderIds: Schema.Types.ObjectId[];

  // Team Membership
  members: {
    userId: Schema.Types.ObjectId;
    role: string;
    joinedAt: Date;
    status: "active" | "inactive" | "left" | "removed";
    skills: string[];
    bio?: string;
    contribution?: string;
  }[];

  // Team Configuration
  maxMembers: number;
  minMembers: number;
  isPrivate: boolean;
  requiresApproval: boolean;

  // Team Purpose & Goals
  teamType:
    | "hackathon"
    | "competition"
    | "project"
    | "study_group"
    | "startup"
    | "research"
    | "other";
  targetOpportunities: Schema.Types.ObjectId[]; // Linked opportunities
  goals: string[];
  timeline?: {
    startDate?: Date;
    endDate?: Date;
    milestones: {
      title: string;
      description: string;
      dueDate: Date;
      completed: boolean;
      completedAt?: Date;
    }[];
  };

  // Skills & Requirements
  requiredSkills: string[];
  preferredSkills: string[];
  skillsNeeded: {
    skill: string;
    count: number;
    filled: number;
    priority: "high" | "medium" | "low";
  }[];

  // Location & Meeting Preferences
  location?: {
    type: "remote" | "hybrid" | "in_person";
    city?: string;
    country?: string;
    timeZone?: string;
  };
  meetingPreferences: {
    frequency: "daily" | "weekly" | "biweekly" | "monthly" | "as_needed";
    preferredTimes: string[];
    communicationChannels: ("discord" | "slack" | "telegram" | "zoom" | "meet" | "other")[];
  };

  // Team Performance & Analytics
  achievements: {
    opportunityId: Schema.Types.ObjectId;
    result: string;
    placement?: number;
    date: Date;
    description?: string;
    certificateUrl?: string;
  }[];
  statistics: {
    totalProjects: number;
    successRate: number;
    averageRating: number;
    completedOpportunities: number;
    activeProjects: number;
  };

  // Team Resources
  resources: {
    name: string;
    type: "document" | "link" | "tool" | "template" | "other";
    url: string;
    description?: string;
    addedBy: Schema.Types.ObjectId;
    addedAt: Date;
  }[];

  // Communication & Updates
  updates: {
    authorId: Schema.Types.ObjectId;
    title: string;
    content: string;
    timestamp: Date;
    isImportant: boolean;
    reactions: {
      emoji: string;
      count: number;
      users: Schema.Types.ObjectId[];
    }[];
  }[];

  // Applications & Invitations
  applications: {
    userId: Schema.Types.ObjectId;
    message: string;
    skills: string[];
    experience?: string;
    portfolioUrls?: string[];
    status: "pending" | "approved" | "rejected" | "withdrawn";
    appliedAt: Date;
    reviewedAt?: Date;
    reviewedBy?: Schema.Types.ObjectId;
    reviewNotes?: string;
  }[];

  invitations: {
    userId: Schema.Types.ObjectId;
    invitedBy: Schema.Types.ObjectId;
    message?: string;
    status: "pending" | "accepted" | "declined" | "expired";
    sentAt: Date;
    respondedAt?: Date;
    expiresAt: Date;
  }[];

  // Social & Discovery
  tags: string[];
  visibility: "public" | "university_only" | "invite_only" | "private";
  socialLinks?: {
    github?: string;
    discord?: string;
    slack?: string;
    website?: string;
  };

  // Status & Moderation
  status: "active" | "completed" | "paused" | "disbanded" | "archived";
  completedAt?: Date;
  disbandedAt?: Date;
  disbandReason?: string;

  // Images & Media
  avatarUrl?: string;
  bannerUrl?: string;
  portfolioImages?: string[];

  createdAt: Date;
  updatedAt: Date;

  // Methods
  generateSlug(): string;
  addMember(userId: Schema.Types.ObjectId, role: string, skills: string[]): Promise<ITeam>;
  removeMember(userId: Schema.Types.ObjectId): Promise<ITeam>;
  updateMemberStatus(userId: Schema.Types.ObjectId, status: string): Promise<ITeam>;
  addApplication(userId: Schema.Types.ObjectId, applicationData: any): Promise<ITeam>;
  approveApplication(
    userId: Schema.Types.ObjectId,
    reviewerId: Schema.Types.ObjectId
  ): Promise<ITeam>;
  rejectApplication(
    userId: Schema.Types.ObjectId,
    reviewerId: Schema.Types.ObjectId,
    reason: string
  ): Promise<ITeam>;
  inviteMember(
    userId: Schema.Types.ObjectId,
    invitedBy: Schema.Types.ObjectId,
    message?: string
  ): Promise<ITeam>;
  addUpdate(
    authorId: Schema.Types.ObjectId,
    title: string,
    content: string,
    isImportant: boolean
  ): Promise<ITeam>;
  toJSON(): any;
}

const teamSchema = new Schema<ITeam>(
  {
    name: {
      type: String,
      required: [true, "Team name is required"],
      trim: true,
      minlength: [3, "Team name must be at least 3 characters"],
      maxlength: [100, "Team name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Team description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    slug: {
      type: String,
      unique: true,
      required: [true, "Team slug is required"],
    },

    // Team Leadership
    leaderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Team leader is required"],
    },
    coLeaderIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Team Membership
    members: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          required: true,
          maxlength: [50, "Role cannot exceed 50 characters"],
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ["active", "inactive", "left", "removed"],
          default: "active",
        },
        skills: [String],
        bio: {
          type: String,
          maxlength: [300, "Bio cannot exceed 300 characters"],
        },
        contribution: {
          type: String,
          maxlength: [500, "Contribution cannot exceed 500 characters"],
        },
      },
    ],

    // Team Configuration
    maxMembers: {
      type: Number,
      required: [true, "Maximum members is required"],
      min: [1, "Maximum members must be at least 1"],
      max: [50, "Maximum members cannot exceed 50"],
    },
    minMembers: {
      type: Number,
      required: [true, "Minimum members is required"],
      min: [1, "Minimum members must be at least 1"],
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    requiresApproval: {
      type: Boolean,
      default: true,
    },

    // Team Purpose & Goals
    teamType: {
      type: String,
      required: [true, "Team type is required"],
      enum: ["hackathon", "competition", "project", "study_group", "startup", "research", "other"],
    },
    targetOpportunities: [
      {
        type: Schema.Types.ObjectId,
        ref: "Opportunity",
      },
    ],
    goals: {
      type: [String],
      default: [],
    },
    timeline: {
      startDate: Date,
      endDate: Date,
      milestones: [
        {
          title: {
            type: String,
            required: true,
            maxlength: [200, "Milestone title cannot exceed 200 characters"],
          },
          description: {
            type: String,
            maxlength: [500, "Milestone description cannot exceed 500 characters"],
          },
          dueDate: {
            type: Date,
            required: true,
          },
          completed: {
            type: Boolean,
            default: false,
          },
          completedAt: Date,
        },
      ],
    },

    // Skills & Requirements
    requiredSkills: {
      type: [String],
      default: [],
    },
    preferredSkills: {
      type: [String],
      default: [],
    },
    skillsNeeded: [
      {
        skill: {
          type: String,
          required: true,
        },
        count: {
          type: Number,
          required: true,
          min: [1, "Skill count must be at least 1"],
        },
        filled: {
          type: Number,
          default: 0,
          min: [0, "Filled count cannot be negative"],
        },
        priority: {
          type: String,
          enum: ["high", "medium", "low"],
          default: "medium",
        },
      },
    ],

    // Location & Meeting Preferences
    location: {
      type: {
        type: String,
        enum: ["remote", "hybrid", "in_person"],
        default: "remote",
      },
      city: String,
      country: String,
      timeZone: String,
    },
    meetingPreferences: {
      frequency: {
        type: String,
        enum: ["daily", "weekly", "biweekly", "monthly", "as_needed"],
        default: "weekly",
      },
      preferredTimes: [String],
      communicationChannels: [
        {
          type: String,
          enum: ["discord", "slack", "telegram", "zoom", "meet", "other"],
        },
      ],
    },

    // Team Performance & Analytics
    achievements: [
      {
        opportunityId: {
          type: Schema.Types.ObjectId,
          ref: "Opportunity",
          required: true,
        },
        result: {
          type: String,
          required: true,
        },
        placement: Number,
        date: {
          type: Date,
          required: true,
        },
        description: String,
        certificateUrl: String,
      },
    ],
    statistics: {
      totalProjects: {
        type: Number,
        default: 0,
        min: [0, "Total projects cannot be negative"],
      },
      successRate: {
        type: Number,
        default: 0,
        min: [0, "Success rate cannot be negative"],
        max: [100, "Success rate cannot exceed 100"],
      },
      averageRating: {
        type: Number,
        default: 0,
        min: [0, "Average rating cannot be negative"],
        max: [5, "Average rating cannot exceed 5"],
      },
      completedOpportunities: {
        type: Number,
        default: 0,
        min: [0, "Completed opportunities cannot be negative"],
      },
      activeProjects: {
        type: Number,
        default: 0,
        min: [0, "Active projects cannot be negative"],
      },
    },

    // Team Resources
    resources: [
      {
        name: {
          type: String,
          required: true,
          maxlength: [200, "Resource name cannot exceed 200 characters"],
        },
        type: {
          type: String,
          enum: ["document", "link", "tool", "template", "other"],
          default: "link",
        },
        url: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          maxlength: [500, "Resource description cannot exceed 500 characters"],
        },
        addedBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Communication & Updates
    updates: [
      {
        authorId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        title: {
          type: String,
          required: true,
          maxlength: [200, "Update title cannot exceed 200 characters"],
        },
        content: {
          type: String,
          required: true,
          maxlength: [2000, "Update content cannot exceed 2000 characters"],
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        isImportant: {
          type: Boolean,
          default: false,
        },
        reactions: [
          {
            emoji: {
              type: String,
              required: true,
            },
            count: {
              type: Number,
              default: 0,
            },
            users: [
              {
                type: Schema.Types.ObjectId,
                ref: "User",
              },
            ],
          },
        ],
      },
    ],

    // Applications & Invitations
    applications: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        message: {
          type: String,
          required: true,
          maxlength: [1000, "Application message cannot exceed 1000 characters"],
        },
        skills: [String],
        experience: {
          type: String,
          maxlength: [1000, "Experience cannot exceed 1000 characters"],
        },
        portfolioUrls: [String],
        status: {
          type: String,
          enum: ["pending", "approved", "rejected", "withdrawn"],
          default: "pending",
        },
        appliedAt: {
          type: Date,
          default: Date.now,
        },
        reviewedAt: Date,
        reviewedBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        reviewNotes: {
          type: String,
          maxlength: [500, "Review notes cannot exceed 500 characters"],
        },
      },
    ],

    invitations: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        invitedBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        message: {
          type: String,
          maxlength: [500, "Invitation message cannot exceed 500 characters"],
        },
        status: {
          type: String,
          enum: ["pending", "accepted", "declined", "expired"],
          default: "pending",
        },
        sentAt: {
          type: Date,
          default: Date.now,
        },
        respondedAt: Date,
        expiresAt: {
          type: Date,
          required: true,
        },
      },
    ],

    // Social & Discovery
    tags: {
      type: [String],
      default: [],
    },
    visibility: {
      type: String,
      enum: ["public", "university_only", "invite_only", "private"],
      default: "public",
    },
    socialLinks: {
      github: String,
      discord: String,
      slack: String,
      website: String,
    },

    // Status & Moderation
    status: {
      type: String,
      enum: ["active", "completed", "paused", "disbanded", "archived"],
      default: "active",
    },
    completedAt: Date,
    disbandedAt: Date,
    disbandReason: String,

    // Images & Media
    avatarUrl: String,
    bannerUrl: String,
    portfolioImages: [String],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance and search
teamSchema.index({ name: "text", description: "text", tags: "text" });
teamSchema.index({ slug: 1 }, { unique: true });
teamSchema.index({ leaderId: 1 });
teamSchema.index({ teamType: 1 });
teamSchema.index({ status: 1 });
teamSchema.index({ visibility: 1 });
teamSchema.index({ requiredSkills: 1 });
teamSchema.index({ createdAt: -1 });
teamSchema.index({ "members.userId": 1 });

// Compound indexes
teamSchema.index({ status: 1, visibility: 1, teamType: 1 });
teamSchema.index({ teamType: 1, requiredSkills: 1, status: 1 });

// Pre-save middleware to generate slug and add leader as first member
teamSchema.pre("save", function (next) {
  if (this.isModified("name") && (!this.slug || this.isNew)) {
    this.slug = this.generateSlug();
  }

  // Add leader as first member
  if (this.isNew) {
    const leaderExists = this.members.some(
      member => member.userId.toString() === this.leaderId.toString()
    );

    if (!leaderExists) {
      this.members.push({
        userId: this.leaderId,
        role: "Leader",
        joinedAt: new Date(),
        status: "active",
        skills: [],
      });
    }
  }

  next();
});

// Method to generate slug from name
teamSchema.methods.generateSlug = function (): string {
  return (
    this.name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .substring(0, 50) +
    "-" +
    this._id.toString().slice(-6)
  );
};

// Method to add member
teamSchema.methods.addMember = async function (
  userId: Schema.Types.ObjectId,
  role: string,
  skills: string[]
): Promise<ITeam> {
  const existingMember = this.members.find(
    member => member.userId.toString() === userId.toString()
  );

  if (!existingMember && this.members.length < this.maxMembers) {
    this.members.push({
      userId,
      role,
      joinedAt: new Date(),
      status: "active",
      skills,
    });
    return this.save();
  }
  return this;
};

// Method to remove member
teamSchema.methods.removeMember = async function (userId: Schema.Types.ObjectId): Promise<ITeam> {
  // Cannot remove team leader
  if (userId.toString() === this.leaderId.toString()) {
    return this;
  }

  const memberIndex = this.members.findIndex(
    member => member.userId.toString() === userId.toString()
  );

  if (memberIndex > -1) {
    this.members.splice(memberIndex, 1);
    return this.save();
  }
  return this;
};

// Method to update member status
teamSchema.methods.updateMemberStatus = async function (
  userId: Schema.Types.ObjectId,
  status: string
): Promise<ITeam> {
  const member = this.members.find(member => member.userId.toString() === userId.toString());

  if (member) {
    member.status = status;
    return this.save();
  }
  return this;
};

// Virtual for active member count
teamSchema.virtual("activeMemberCount").get(function () {
  return this.members.filter(member => member.status === "active").length;
});

// Virtual for available slots
teamSchema.virtual("availableSlots").get(function () {
  return this.maxMembers - this.activeMemberCount;
});

// Virtual for skills coverage
teamSchema.virtual("skillsCoverage").get(function () {
  const allMemberSkills = this.members
    .filter(member => member.status === "active")
    .flatMap(member => member.skills);

  const requiredCovered = this.requiredSkills.filter(skill => allMemberSkills.includes(skill));

  return {
    covered: requiredCovered.length,
    total: this.requiredSkills.length,
    percentage:
      this.requiredSkills.length > 0
        ? Math.round((requiredCovered.length / this.requiredSkills.length) * 100)
        : 100,
  };
});

// Override toJSON to add virtuals and clean up
teamSchema.methods.toJSON = function () {
  const teamObject = this.toObject();
  delete teamObject.__v;
  return teamObject;
};

export const Team = models.Team || model<ITeam>("Team", teamSchema);
export default Team;
