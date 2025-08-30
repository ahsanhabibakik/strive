import { Schema, model, models, Document } from "mongoose";

export interface IContact extends Document {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  ipAddress?: string;
  userAgent?: string;
  source?: string;
  tags?: string[];
  notes?: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new Schema<IContact>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
      maxlength: [200, "Subject cannot exceed 200 characters"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      maxlength: [5000, "Message cannot exceed 5000 characters"],
    },
    status: {
      type: String,
      enum: ["new", "read", "replied", "closed"],
      default: "new",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    ipAddress: {
      type: String,
      maxlength: [45, "IP address is too long"], // IPv6 support
    },
    userAgent: {
      type: String,
      maxlength: [500, "User agent is too long"],
    },
    source: {
      type: String,
      default: "website",
      maxlength: [50, "Source cannot exceed 50 characters"],
    },
    tags: [
      {
        type: String,
        maxlength: [30, "Tag cannot exceed 30 characters"],
      },
    ],
    notes: {
      type: String,
      maxlength: [2000, "Notes cannot exceed 2000 characters"],
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
contactSchema.index({ email: 1 });
contactSchema.index({ status: 1 });
contactSchema.index({ priority: 1 });
contactSchema.index({ createdAt: -1 });
contactSchema.index({ assignedTo: 1 });
contactSchema.index({ tags: 1 });

// Compound indexes
contactSchema.index({ status: 1, priority: 1 });
contactSchema.index({ status: 1, createdAt: -1 });

// Virtual for full contact info
contactSchema.virtual("fullContact").get(function () {
  return `${this.name} <${this.email}>`;
});

// Virtual for age
contactSchema.virtual("age").get(function () {
  const now = new Date();
  const diff = now.getTime() - this.createdAt.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
});

// Instance method to mark as read
contactSchema.methods.markAsRead = function () {
  if (this.status === "new") {
    this.status = "read";
    return this.save();
  }
  return this;
};

// Instance method to assign to user
contactSchema.methods.assignTo = function (userId: string) {
  this.assignedTo = userId;
  return this.save();
};

// Instance method to add tag
contactSchema.methods.addTag = function (tag: string) {
  if (!this.tags.includes(tag)) {
    this.tags.push(tag);
    return this.save();
  }
  return this;
};

// Static method to get unread count
contactSchema.statics.getUnreadCount = function () {
  return this.countDocuments({ status: "new" });
};

// Static method to get by status
contactSchema.statics.getByStatus = function (status: string, limit = 10) {
  return this.find({ status })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("assignedTo", "name email");
};

export const Contact = models.Contact || model<IContact>("Contact", contactSchema);
export default Contact;
