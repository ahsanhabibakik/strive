import { Schema, model, models, Document } from "mongoose";

// Email Log Model
export interface IEmailLog extends Document {
  _id: string;
  to: string;
  from?: string;
  subject: string;
  html?: string;
  text?: string;
  provider: string;
  status: "pending" | "sent" | "delivered" | "bounced" | "failed" | "complaint";
  messageId?: string;
  templateId?: string;
  userId?: string;
  category?: string;
  tags?: string[];
  priority: "high" | "normal" | "low";
  variables?: Record<string, any>;
  error?: string;
  sentAt?: Date;
  deliveredAt?: Date;
  openedAt?: Date;
  lastClickedAt?: Date;
  bouncedAt?: Date;
  complaintAt?: Date;
  unsubscribedAt?: Date;
  openCount: number;
  clickCount: number;
  clickedUrls?: Array<{ url: string; clickedAt: Date }>;
  bounceType?: string;
  bounceReason?: string;
  complaintType?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const emailLogSchema = new Schema<IEmailLog>(
  {
    to: {
      type: String,
      required: true,
      index: true,
    },
    from: String,
    subject: {
      type: String,
      required: true,
    },
    html: String,
    text: String,
    provider: {
      type: String,
      required: true,
      enum: ["resend", "smtp", "sendgrid", "ses"],
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "sent", "delivered", "bounced", "failed", "complaint"],
      default: "pending",
      index: true,
    },
    messageId: {
      type: String,
      index: true,
    },
    templateId: {
      type: Schema.Types.ObjectId,
      ref: "EmailTemplate",
    },
    userId: {
      type: String,
      index: true,
    },
    category: {
      type: String,
      index: true,
    },
    tags: [String],
    priority: {
      type: String,
      enum: ["high", "normal", "low"],
      default: "normal",
      index: true,
    },
    variables: {
      type: Map,
      of: Schema.Types.Mixed,
    },
    error: String,
    sentAt: {
      type: Date,
      index: true,
    },
    deliveredAt: Date,
    openedAt: Date,
    lastClickedAt: Date,
    bouncedAt: Date,
    complaintAt: Date,
    unsubscribedAt: Date,
    openCount: {
      type: Number,
      default: 0,
    },
    clickCount: {
      type: Number,
      default: 0,
    },
    clickedUrls: [
      {
        url: String,
        clickedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    bounceType: String,
    bounceReason: String,
    complaintType: String,
    metadata: {
      type: Map,
      of: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance
emailLogSchema.index({ to: 1, sentAt: -1 });
emailLogSchema.index({ userId: 1, sentAt: -1 });
emailLogSchema.index({ category: 1, sentAt: -1 });
emailLogSchema.index({ status: 1, createdAt: -1 });
emailLogSchema.index({ messageId: 1 }, { unique: true, sparse: true });

// Email Preference Model
export interface IEmailPreference extends Document {
  _id: string;
  email: string;
  preferences: {
    marketing: boolean;
    notifications: boolean;
    updates: boolean;
    security: boolean;
    billing: boolean;
    reports: boolean;
  };
  frequency: {
    marketing: "daily" | "weekly" | "monthly" | "never";
    reports: "daily" | "weekly" | "monthly" | "never";
  };
  unsubscribedAt?: Date;
  unsubscribeReason?: string;
  bounceCount: number;
  complaintCount: number;
  lastEmailSent?: Date;
  isBlocked: boolean;
  blockedReason?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const emailPreferenceSchema = new Schema<IEmailPreference>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    preferences: {
      marketing: { type: Boolean, default: false },
      notifications: { type: Boolean, default: true },
      updates: { type: Boolean, default: true },
      security: { type: Boolean, default: true },
      billing: { type: Boolean, default: true },
      reports: { type: Boolean, default: false },
    },
    frequency: {
      marketing: {
        type: String,
        enum: ["daily", "weekly", "monthly", "never"],
        default: "weekly",
      },
      reports: {
        type: String,
        enum: ["daily", "weekly", "monthly", "never"],
        default: "weekly",
      },
    },
    unsubscribedAt: Date,
    unsubscribeReason: String,
    bounceCount: {
      type: Number,
      default: 0,
    },
    complaintCount: {
      type: Number,
      default: 0,
    },
    lastEmailSent: Date,
    isBlocked: {
      type: Boolean,
      default: false,
      index: true,
    },
    blockedReason: String,
    metadata: {
      type: Map,
      of: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Email Template Model
export interface IEmailTemplate extends Document {
  _id: string;
  name: string;
  displayName: string;
  description?: string;
  category: string;
  subject: string;
  html: string;
  text?: string;
  variables: Array<{
    name: string;
    type: "string" | "number" | "boolean" | "date" | "array" | "object";
    required: boolean;
    defaultValue?: any;
    description?: string;
  }>;
  isActive: boolean;
  version: number;
  parentId?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  createdBy: string;
  lastUsedAt?: Date;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const emailTemplateSchema = new Schema<IEmailTemplate>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    description: String,
    category: {
      type: String,
      required: true,
      index: true,
    },
    subject: {
      type: String,
      required: true,
    },
    html: {
      type: String,
      required: true,
    },
    text: String,
    variables: [
      {
        name: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ["string", "number", "boolean", "date", "array", "object"],
          required: true,
        },
        required: {
          type: Boolean,
          default: false,
        },
        defaultValue: Schema.Types.Mixed,
        description: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    version: {
      type: Number,
      default: 1,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "EmailTemplate",
    },
    tags: [String],
    metadata: {
      type: Map,
      of: Schema.Types.Mixed,
    },
    createdBy: {
      type: String,
      required: true,
      index: true,
    },
    lastUsedAt: Date,
    usageCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

emailTemplateSchema.index({ category: 1, isActive: 1 });
emailTemplateSchema.index({ createdBy: 1, createdAt: -1 });

// Email Queue Model
export interface IEmailQueue extends Document {
  _id: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
  templateId?: string;
  variables?: Record<string, any>;
  priority: "high" | "normal" | "low";
  status: "pending" | "processing" | "sent" | "failed" | "cancelled";
  error?: string;
  retryCount: number;
  maxRetries: number;
  scheduleAt: Date;
  processedAt?: Date;
  sentAt?: Date;
  provider?: string;
  messageId?: string;
  userId?: string;
  category?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const emailQueueSchema = new Schema<IEmailQueue>(
  {
    to: {
      type: String,
      required: true,
      index: true,
    },
    subject: {
      type: String,
      required: true,
    },
    html: {
      type: String,
      required: true,
    },
    text: String,
    templateId: {
      type: Schema.Types.ObjectId,
      ref: "EmailTemplate",
    },
    variables: {
      type: Map,
      of: Schema.Types.Mixed,
    },
    priority: {
      type: String,
      enum: ["high", "normal", "low"],
      default: "normal",
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "sent", "failed", "cancelled"],
      default: "pending",
      index: true,
    },
    error: String,
    retryCount: {
      type: Number,
      default: 0,
    },
    maxRetries: {
      type: Number,
      default: 3,
    },
    scheduleAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    processedAt: Date,
    sentAt: Date,
    provider: String,
    messageId: String,
    userId: {
      type: String,
      index: true,
    },
    category: {
      type: String,
      index: true,
    },
    tags: [String],
    metadata: {
      type: Map,
      of: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for queue processing
emailQueueSchema.index({ status: 1, scheduleAt: 1, priority: 1 });
emailQueueSchema.index({ status: 1, createdAt: -1 });
emailQueueSchema.index({ userId: 1, status: 1 });

// Email Campaign Model
export interface IEmailCampaign extends Document {
  _id: string;
  name: string;
  description?: string;
  templateId: string;
  status: "draft" | "scheduled" | "sending" | "sent" | "paused" | "cancelled";
  recipients: Array<{
    email: string;
    variables?: Record<string, any>;
    status?: "pending" | "sent" | "failed" | "bounced" | "opened" | "clicked";
    sentAt?: Date;
    openedAt?: Date;
    lastClickedAt?: Date;
    error?: string;
  }>;
  segmentCriteria?: Record<string, any>;
  scheduleAt?: Date;
  sentAt?: Date;
  completedAt?: Date;
  stats: {
    total: number;
    sent: number;
    delivered: number;
    bounced: number;
    opened: number;
    clicked: number;
    unsubscribed: number;
    complained: number;
  };
  settings: {
    batchSize: number;
    batchDelay: number; // milliseconds between batches
    trackOpens: boolean;
    trackClicks: boolean;
  };
  createdBy: string;
  tags?: string[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const emailCampaignSchema = new Schema<IEmailCampaign>(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    description: String,
    templateId: {
      type: Schema.Types.ObjectId,
      ref: "EmailTemplate",
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "scheduled", "sending", "sent", "paused", "cancelled"],
      default: "draft",
      index: true,
    },
    recipients: [
      {
        email: {
          type: String,
          required: true,
        },
        variables: {
          type: Map,
          of: Schema.Types.Mixed,
        },
        status: {
          type: String,
          enum: ["pending", "sent", "failed", "bounced", "opened", "clicked"],
          default: "pending",
        },
        sentAt: Date,
        openedAt: Date,
        lastClickedAt: Date,
        error: String,
      },
    ],
    segmentCriteria: {
      type: Map,
      of: Schema.Types.Mixed,
    },
    scheduleAt: Date,
    sentAt: Date,
    completedAt: Date,
    stats: {
      total: { type: Number, default: 0 },
      sent: { type: Number, default: 0 },
      delivered: { type: Number, default: 0 },
      bounced: { type: Number, default: 0 },
      opened: { type: Number, default: 0 },
      clicked: { type: Number, default: 0 },
      unsubscribed: { type: Number, default: 0 },
      complained: { type: Number, default: 0 },
    },
    settings: {
      batchSize: { type: Number, default: 100 },
      batchDelay: { type: Number, default: 1000 },
      trackOpens: { type: Boolean, default: true },
      trackClicks: { type: Boolean, default: true },
    },
    createdBy: {
      type: String,
      required: true,
      index: true,
    },
    tags: [String],
    metadata: {
      type: Map,
      of: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

emailCampaignSchema.index({ createdBy: 1, status: 1 });
emailCampaignSchema.index({ status: 1, scheduleAt: 1 });
emailCampaignSchema.index({ createdAt: -1 });

// Virtual for calculating open rate
emailCampaignSchema.virtual("openRate").get(function () {
  if (this.stats.sent === 0) return 0;
  return (this.stats.opened / this.stats.sent) * 100;
});

// Virtual for calculating click rate
emailCampaignSchema.virtual("clickRate").get(function () {
  if (this.stats.sent === 0) return 0;
  return (this.stats.clicked / this.stats.sent) * 100;
});

// Virtual for calculating bounce rate
emailCampaignSchema.virtual("bounceRate").get(function () {
  if (this.stats.sent === 0) return 0;
  return (this.stats.bounced / this.stats.sent) * 100;
});

// Email Webhook Log Model (for tracking provider webhooks)
export interface IEmailWebhookLog extends Document {
  _id: string;
  provider: string;
  eventType: string;
  messageId?: string;
  email?: string;
  timestamp: Date;
  data: Record<string, any>;
  processed: boolean;
  error?: string;
  createdAt: Date;
}

const emailWebhookLogSchema = new Schema<IEmailWebhookLog>(
  {
    provider: {
      type: String,
      required: true,
      index: true,
    },
    eventType: {
      type: String,
      required: true,
      index: true,
    },
    messageId: {
      type: String,
      index: true,
    },
    email: {
      type: String,
      index: true,
    },
    timestamp: {
      type: Date,
      required: true,
      index: true,
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
    processed: {
      type: Boolean,
      default: false,
      index: true,
    },
    error: String,
  },
  {
    timestamps: true,
  }
);

emailWebhookLogSchema.index({ provider: 1, eventType: 1, timestamp: -1 });
emailWebhookLogSchema.index({ processed: 1, createdAt: 1 });

// Export models
export const EmailLog = models.EmailLog || model<IEmailLog>("EmailLog", emailLogSchema);
export const EmailPreference =
  models.EmailPreference || model<IEmailPreference>("EmailPreference", emailPreferenceSchema);
export const EmailTemplate =
  models.EmailTemplate || model<IEmailTemplate>("EmailTemplate", emailTemplateSchema);
export const EmailQueue = models.EmailQueue || model<IEmailQueue>("EmailQueue", emailQueueSchema);
export const EmailCampaign =
  models.EmailCampaign || model<IEmailCampaign>("EmailCampaign", emailCampaignSchema);
export const EmailWebhookLog =
  models.EmailWebhookLog || model<IEmailWebhookLog>("EmailWebhookLog", emailWebhookLogSchema);
