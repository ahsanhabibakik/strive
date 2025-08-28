import { Schema, model, models, Document } from 'mongoose';

export interface ISession extends Document {
  _id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
  userAgent?: string;
  ipAddress?: string;
  lastActivity: Date;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ISession>({
  sessionToken: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: String,
    required: true,
    ref: 'User',
    index: true
  },
  expires: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 }
  },
  userAgent: String,
  ipAddress: String,
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
sessionSchema.index({ userId: 1, expires: -1 });
sessionSchema.index({ lastActivity: -1 });

export const Session = models.Session || model<ISession>('Session', sessionSchema);
export default Session;