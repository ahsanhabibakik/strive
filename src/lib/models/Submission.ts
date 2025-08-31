import { Schema, model, models, Document } from "mongoose";

export interface ISubmission extends Document {
  _id: string;
  userId: Schema.Types.ObjectId;
  opportunityId: Schema.Types.ObjectId;
  teamId?: Schema.Types.ObjectId;

  // Basic Info
  status: "draft" | "submitted" | "under_review" | "accepted" | "rejected" | "withdrawn";
  submittedAt?: Date;
  reviewedAt?: Date;

  // Application Data
  applicationData: {
    personalInfo: {
      fullName: string;
      email: string;
      phone?: string;
      university?: string;
      graduationYear?: number;
      major?: string;
      gpa?: number;
    };
    responses: {
      questionId: string;
      question: string;
      answer: string;
      type: "text" | "file" | "url" | "select" | "multi_select";
    }[];
    documents: {
      name: string;
      url: string;
      type: string;
      size: number;
      uploadedAt: Date;
    }[];
    portfolioItems?: {
      title: string;
      description: string;
      url?: string;
      images?: string[];
      tags?: string[];
    }[];
  };

  // Team Information (if team-based)
  teamInfo?: {
    teamName: string;
    teamMembers: {
      userId: Schema.Types.ObjectId;
      name: string;
      email: string;
      role: string;
      university?: string;
    }[];
    teamDescription?: string;
  };

  // Review & Feedback
  reviewData?: {
    score?: number;
    feedback?: string;
    reviewerId?: Schema.Types.ObjectId;
    reviewerNotes?: string;
    criteria?: {
      name: string;
      score: number;
      maxScore: number;
      comments?: string;
    }[];
  };

  // Result Information
  result?: {
    placement?: number;
    prize?: string;
    certificate?: string;
    recognitionLevel?: "winner" | "runner_up" | "finalist" | "participant";
    announcementDate?: Date;
  };

  // Metadata
  submissionSource: "strive" | "external" | "imported";
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;

  // Progress Tracking
  completionPercentage: number;
  stepsCompleted: string[];
  nextStep?: string;

  // Communication
  messages?: {
    from: "user" | "organizer" | "admin";
    message: string;
    timestamp: Date;
    read: boolean;
  }[];

  createdAt: Date;
  updatedAt: Date;

  // Methods
  calculateCompletionPercentage(): number;
  submitApplication(): Promise<ISubmission>;
  withdrawApplication(): Promise<ISubmission>;
  addMessage(from: string, message: string): Promise<ISubmission>;
  toJSON(): any;
}

const submissionSchema = new Schema<ISubmission>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    opportunityId: {
      type: Schema.Types.ObjectId,
      ref: "Opportunity",
      required: [true, "Opportunity ID is required"],
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Team",
    },

    // Basic Info
    status: {
      type: String,
      enum: ["draft", "submitted", "under_review", "accepted", "rejected", "withdrawn"],
      default: "draft",
    },
    submittedAt: Date,
    reviewedAt: Date,

    // Application Data
    applicationData: {
      personalInfo: {
        fullName: {
          type: String,
          required: [true, "Full name is required"],
          trim: true,
          maxlength: [100, "Full name cannot exceed 100 characters"],
        },
        email: {
          type: String,
          required: [true, "Email is required"],
          lowercase: true,
          match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
        },
        phone: {
          type: String,
          match: [/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"],
        },
        university: {
          type: String,
          trim: true,
          maxlength: [200, "University name cannot exceed 200 characters"],
        },
        graduationYear: {
          type: Number,
          min: [1900, "Graduation year must be after 1900"],
          max: [2050, "Graduation year must be before 2050"],
        },
        major: {
          type: String,
          trim: true,
          maxlength: [100, "Major cannot exceed 100 characters"],
        },
        gpa: {
          type: Number,
          min: [0, "GPA cannot be negative"],
          max: [4.5, "GPA cannot exceed 4.5"],
        },
      },
      responses: [
        {
          questionId: {
            type: String,
            required: true,
          },
          question: {
            type: String,
            required: true,
          },
          answer: {
            type: String,
            required: true,
          },
          type: {
            type: String,
            enum: ["text", "file", "url", "select", "multi_select"],
            default: "text",
          },
        },
      ],
      documents: [
        {
          name: {
            type: String,
            required: true,
          },
          url: {
            type: String,
            required: true,
          },
          type: {
            type: String,
            required: true,
          },
          size: {
            type: Number,
            required: true,
          },
          uploadedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      portfolioItems: [
        {
          title: {
            type: String,
            required: true,
            maxlength: [200, "Portfolio title cannot exceed 200 characters"],
          },
          description: {
            type: String,
            maxlength: [1000, "Portfolio description cannot exceed 1000 characters"],
          },
          url: String,
          images: [String],
          tags: [String],
        },
      ],
    },

    // Team Information
    teamInfo: {
      teamName: {
        type: String,
        trim: true,
        maxlength: [100, "Team name cannot exceed 100 characters"],
      },
      teamMembers: [
        {
          userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          name: {
            type: String,
            required: true,
            trim: true,
          },
          email: {
            type: String,
            required: true,
            lowercase: true,
          },
          role: {
            type: String,
            required: true,
          },
          university: String,
        },
      ],
      teamDescription: {
        type: String,
        maxlength: [500, "Team description cannot exceed 500 characters"],
      },
    },

    // Review & Feedback
    reviewData: {
      score: {
        type: Number,
        min: [0, "Score cannot be negative"],
        max: [100, "Score cannot exceed 100"],
      },
      feedback: {
        type: String,
        maxlength: [2000, "Feedback cannot exceed 2000 characters"],
      },
      reviewerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      reviewerNotes: {
        type: String,
        maxlength: [1000, "Reviewer notes cannot exceed 1000 characters"],
      },
      criteria: [
        {
          name: {
            type: String,
            required: true,
          },
          score: {
            type: Number,
            required: true,
            min: 0,
          },
          maxScore: {
            type: Number,
            required: true,
            min: 1,
          },
          comments: String,
        },
      ],
    },

    // Result Information
    result: {
      placement: {
        type: Number,
        min: [1, "Placement must be at least 1"],
      },
      prize: String,
      certificate: String,
      recognitionLevel: {
        type: String,
        enum: ["winner", "runner_up", "finalist", "participant"],
      },
      announcementDate: Date,
    },

    // Metadata
    submissionSource: {
      type: String,
      enum: ["strive", "external", "imported"],
      default: "strive",
    },
    ipAddress: String,
    userAgent: String,
    referrer: String,

    // Progress Tracking
    completionPercentage: {
      type: Number,
      default: 0,
      min: [0, "Completion percentage cannot be negative"],
      max: [100, "Completion percentage cannot exceed 100"],
    },
    stepsCompleted: {
      type: [String],
      default: [],
    },
    nextStep: String,

    // Communication
    messages: [
      {
        from: {
          type: String,
          enum: ["user", "organizer", "admin"],
          required: true,
        },
        message: {
          type: String,
          required: true,
          maxlength: [1000, "Message cannot exceed 1000 characters"],
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        read: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance and uniqueness
submissionSchema.index({ userId: 1, opportunityId: 1 }, { unique: true });
submissionSchema.index({ userId: 1 });
submissionSchema.index({ opportunityId: 1 });
submissionSchema.index({ teamId: 1 });
submissionSchema.index({ status: 1 });
submissionSchema.index({ submittedAt: -1 });
submissionSchema.index({ createdAt: -1 });
submissionSchema.index({ completionPercentage: -1 });

// Compound indexes for common queries
submissionSchema.index({ userId: 1, status: 1, submittedAt: -1 });
submissionSchema.index({ opportunityId: 1, status: 1, submittedAt: -1 });

// Pre-save middleware to calculate completion percentage
submissionSchema.pre("save", function (next) {
  this.completionPercentage = this.calculateCompletionPercentage();
  next();
});

// Method to calculate completion percentage
submissionSchema.methods.calculateCompletionPercentage = function (): number {
  let totalFields = 5; // Basic required fields
  let completedFields = 0;

  // Check personal info
  if (this.applicationData.personalInfo.fullName) completedFields++;
  if (this.applicationData.personalInfo.email) completedFields++;
  if (this.applicationData.personalInfo.university) completedFields++;

  // Check if at least one response exists
  if (this.applicationData.responses && this.applicationData.responses.length > 0) {
    completedFields++;
    totalFields += this.applicationData.responses.length - 1;

    // Count completed responses
    this.applicationData.responses.forEach((response: any) => {
      if (response.answer && response.answer.trim()) {
        completedFields++;
      }
    });
  }

  // Check documents if required
  if (this.applicationData.documents && this.applicationData.documents.length > 0) {
    completedFields++;
  }

  return Math.round((completedFields / totalFields) * 100);
};

// Method to submit application
submissionSchema.methods.submitApplication = async function (): Promise<ISubmission> {
  this.status = "submitted";
  this.submittedAt = new Date();
  this.completionPercentage = 100;
  return this.save();
};

// Method to withdraw application
submissionSchema.methods.withdrawApplication = async function (): Promise<ISubmission> {
  this.status = "withdrawn";
  return this.save();
};

// Method to add message
submissionSchema.methods.addMessage = async function (
  from: string,
  message: string
): Promise<ISubmission> {
  if (!this.messages) {
    this.messages = [];
  }
  this.messages.push({
    from,
    message,
    timestamp: new Date(),
    read: false,
  });
  return this.save();
};

// Virtual for days since submission
submissionSchema.virtual("daysSinceSubmission").get(function () {
  if (!this.submittedAt) return null;
  const now = new Date();
  const submitted = new Date(this.submittedAt);
  const diffTime = now.getTime() - submitted.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for unread message count
submissionSchema.virtual("unreadMessageCount").get(function () {
  if (!this.messages) return 0;
  return this.messages.filter((msg: any) => !msg.read).length;
});

// Virtual for team member count
submissionSchema.virtual("teamMemberCount").get(function () {
  if (!this.teamInfo || !this.teamInfo.teamMembers) return 0;
  return this.teamInfo.teamMembers.length;
});

// Override toJSON to add virtuals and clean up
submissionSchema.methods.toJSON = function () {
  const submissionObject = this.toObject();
  delete submissionObject.__v;
  delete submissionObject.ipAddress;
  delete submissionObject.userAgent;
  return submissionObject;
};

export const Submission = models.Submission || model<ISubmission>("Submission", submissionSchema);
export default Submission;
