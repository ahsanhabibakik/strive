import { Schema, model, models, Document } from 'mongoose';

export interface ISubscription extends Document {
  _id: string;
  userId: string;
  customerId: string;
  subscriptionId: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'inactive' | 'cancelled' | 'past_due' | 'trialing';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  trialStart?: Date;
  trialEnd?: Date;
  canceledAt?: Date;
  endedAt?: Date;
  priceId: string;
  quantity: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>({
  userId: {
    type: String,
    required: true,
    ref: 'User',
    index: true
  },
  customerId: {
    type: String,
    required: true,
    index: true
  },
  subscriptionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  plan: {
    type: String,
    enum: ['free', 'pro', 'enterprise'],
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'cancelled', 'past_due', 'trialing'],
    required: true,
    index: true
  },
  currentPeriodStart: {
    type: Date,
    required: true
  },
  currentPeriodEnd: {
    type: Date,
    required: true,
    index: true
  },
  cancelAtPeriodEnd: {
    type: Boolean,
    default: false
  },
  trialStart: Date,
  trialEnd: Date,
  canceledAt: Date,
  endedAt: Date,
  priceId: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1
  },
  metadata: {
    type: Map,
    of: Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes
subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ status: 1, currentPeriodEnd: 1 });
subscriptionSchema.index({ plan: 1, status: 1 });

// Virtual for isActive
subscriptionSchema.virtual('isActive').get(function () {
  return this.status === 'active' || this.status === 'trialing';
});

// Virtual for isExpired
subscriptionSchema.virtual('isExpired').get(function () {
  return this.currentPeriodEnd < new Date();
});

export const Subscription = models.Subscription || model<ISubscription>('Subscription', subscriptionSchema);
export default Subscription;