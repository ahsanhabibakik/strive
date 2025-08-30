import mongoose, { Document, Schema } from "mongoose";

export interface IApplication extends Document {
  opportunityId: mongoose.Types.ObjectId;
  userEmail: string;
  userName: string;
  responses: Record<string, any>;
  status: "submitted" | "under_review" | "accepted" | "rejected" | "waitlisted" | "withdrawn";
  submittedAt: Date;
  reviewedAt?: Date;
  reviewerNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    opportunityId: {
      type: Schema.Types.ObjectId,
      ref: "Opportunity",
      required: true,
      index: true,
    },
    userEmail: {
      type: String,
      required: true,
      index: true,
    },
    userName: {
      type: String,
      required: true,
    },
    responses: {
      type: Schema.Types.Mixed,
      required: true,
    },
    status: {
      type: String,
      enum: ["submitted", "under_review", "accepted", "rejected", "waitlisted", "withdrawn"],
      default: "submitted",
      index: true,
    },
    submittedAt: {
      type: Date,
      required: true,
      index: true,
    },
    reviewedAt: {
      type: Date,
    },
    reviewerNotes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one application per user per opportunity
ApplicationSchema.index({ opportunityId: 1, userEmail: 1 }, { unique: true });

// Index for filtering by status and date
ApplicationSchema.index({ status: 1, submittedAt: -1 });

const Application =
  mongoose.models.Application || mongoose.model<IApplication>("Application", ApplicationSchema);

export default Application;
