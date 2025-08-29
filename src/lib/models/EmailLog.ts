import mongoose, { Document, Schema } from "mongoose";

export interface IEmailLog extends Document {
  to: string[];
  from: string;
  subject: string;
  template?: string;
  provider: string;
  messageId?: string;
  status: "sent" | "failed" | "bounced" | "delivered" | "opened" | "clicked";
  error?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  sentAt: Date;
  deliveredAt?: Date;
  openedAt?: Date;
  clickedAt?: Date;
  bounceReason?: string;
  userId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const emailLogSchema = new Schema<IEmailLog>(
  {
    to: [
      {
        type: String,
        required: true,
      },
    ],
    from: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
      index: true,
    },
    template: {
      type: String,
      index: true,
    },
    provider: {
      type: String,
      required: true,
      enum: ["resend", "smtp", "sendgrid", "mailgun"],
    },
    messageId: {
      type: String,
      index: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["sent", "failed", "bounced", "delivered", "opened", "clicked"],
      default: "sent",
      index: true,
    },
    error: String,
    tags: [
      {
        type: String,
        index: true,
      },
    ],
    metadata: {
      type: Schema.Types.Mixed,
    },
    sentAt: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    deliveredAt: Date,
    openedAt: Date,
    clickedAt: Date,
    bounceReason: String,
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
emailLogSchema.index({ sentAt: -1 });
emailLogSchema.index({ status: 1, sentAt: -1 });
emailLogSchema.index({ template: 1, sentAt: -1 });
emailLogSchema.index({ userId: 1, sentAt: -1 });
emailLogSchema.index({ to: 1, sentAt: -1 });

// Static methods
emailLogSchema.statics.getEmailStats = async function (
  startDate: Date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  endDate: Date = new Date()
) {
  const pipeline = [
    {
      $match: {
        sentAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: null,
        totalSent: { $sum: 1 },
        totalDelivered: {
          $sum: {
            $cond: [{ $eq: ["$status", "delivered"] }, 1, 0],
          },
        },
        totalOpened: {
          $sum: {
            $cond: [{ $eq: ["$status", "opened"] }, 1, 0],
          },
        },
        totalClicked: {
          $sum: {
            $cond: [{ $eq: ["$status", "clicked"] }, 1, 0],
          },
        },
        totalBounced: {
          $sum: {
            $cond: [{ $eq: ["$status", "bounced"] }, 1, 0],
          },
        },
        totalFailed: {
          $sum: {
            $cond: [{ $eq: ["$status", "failed"] }, 1, 0],
          },
        },
        providers: {
          $addToSet: "$provider",
        },
        templates: {
          $addToSet: "$template",
        },
      },
    },
  ];

  const [stats] = await this.aggregate(pipeline);

  if (!stats) {
    return {
      totalSent: 0,
      totalDelivered: 0,
      totalOpened: 0,
      totalClicked: 0,
      totalBounced: 0,
      totalFailed: 0,
      deliveryRate: 0,
      openRate: 0,
      clickRate: 0,
      bounceRate: 0,
      providers: [],
      templates: [],
    };
  }

  return {
    ...stats,
    deliveryRate: stats.totalSent > 0 ? (stats.totalDelivered / stats.totalSent) * 100 : 0,
    openRate: stats.totalDelivered > 0 ? (stats.totalOpened / stats.totalDelivered) * 100 : 0,
    clickRate: stats.totalOpened > 0 ? (stats.totalClicked / stats.totalOpened) * 100 : 0,
    bounceRate: stats.totalSent > 0 ? (stats.totalBounced / stats.totalSent) * 100 : 0,
  };
};

emailLogSchema.statics.getTemplateStats = async function (
  startDate: Date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  endDate: Date = new Date()
) {
  return this.aggregate([
    {
      $match: {
        sentAt: { $gte: startDate, $lte: endDate },
        template: { $exists: true, $ne: null },
      },
    },
    {
      $group: {
        _id: "$template",
        totalSent: { $sum: 1 },
        totalDelivered: {
          $sum: {
            $cond: [{ $eq: ["$status", "delivered"] }, 1, 0],
          },
        },
        totalOpened: {
          $sum: {
            $cond: [{ $eq: ["$status", "opened"] }, 1, 0],
          },
        },
        totalClicked: {
          $sum: {
            $cond: [{ $eq: ["$status", "clicked"] }, 1, 0],
          },
        },
        totalFailed: {
          $sum: {
            $cond: [{ $eq: ["$status", "failed"] }, 1, 0],
          },
        },
      },
    },
    {
      $addFields: {
        template: "$_id",
        deliveryRate: {
          $cond: [
            { $gt: ["$totalSent", 0] },
            { $multiply: [{ $divide: ["$totalDelivered", "$totalSent"] }, 100] },
            0,
          ],
        },
        openRate: {
          $cond: [
            { $gt: ["$totalDelivered", 0] },
            { $multiply: [{ $divide: ["$totalOpened", "$totalDelivered"] }, 100] },
            0,
          ],
        },
        clickRate: {
          $cond: [
            { $gt: ["$totalOpened", 0] },
            { $multiply: [{ $divide: ["$totalClicked", "$totalOpened"] }, 100] },
            0,
          ],
        },
      },
    },
    {
      $project: {
        _id: 0,
        template: 1,
        totalSent: 1,
        totalDelivered: 1,
        totalOpened: 1,
        totalClicked: 1,
        totalFailed: 1,
        deliveryRate: 1,
        openRate: 1,
        clickRate: 1,
      },
    },
    {
      $sort: { totalSent: -1 },
    },
  ]);
};

emailLogSchema.statics.getRecentActivity = async function (limit: number = 50) {
  return this.find(
    {},
    {
      to: 1,
      subject: 1,
      template: 1,
      status: 1,
      provider: 1,
      sentAt: 1,
      error: 1,
    }
  )
    .sort({ sentAt: -1 })
    .limit(limit)
    .lean();
};

// Instance methods
emailLogSchema.methods.markAsDelivered = function () {
  this.status = "delivered";
  this.deliveredAt = new Date();
  return this.save();
};

emailLogSchema.methods.markAsOpened = function () {
  if (this.status === "delivered" || this.status === "sent") {
    this.status = "opened";
    this.openedAt = new Date();
    return this.save();
  }
};

emailLogSchema.methods.markAsClicked = function () {
  if (this.status === "opened") {
    this.status = "clicked";
    this.clickedAt = new Date();
    return this.save();
  }
};

emailLogSchema.methods.markAsBounced = function (reason: string) {
  this.status = "bounced";
  this.bounceReason = reason;
  return this.save();
};

emailLogSchema.methods.markAsFailed = function (error: string) {
  this.status = "failed";
  this.error = error;
  return this.save();
};

export const EmailLog =
  mongoose.models.EmailLog || mongoose.model<IEmailLog>("EmailLog", emailLogSchema);
