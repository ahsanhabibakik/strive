import { Schema, model, models, Document } from 'mongoose';
import crypto from 'crypto';

export interface IApiKey extends Document {
  _id: string;
  userId: string;
  name: string;
  key: string;
  hashedKey: string;
  permissions: string[];
  isActive: boolean;
  lastUsed?: Date;
  usageCount: number;
  rateLimit?: {
    requests: number;
    window: number; // in seconds
  };
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  generateKey(): string;
}

const apiKeySchema = new Schema<IApiKey>({
  userId: {
    type: String,
    required: true,
    ref: 'User',
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  key: {
    type: String,
    required: true,
    unique: true,
    select: false
  },
  hashedKey: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  permissions: [{
    type: String,
    enum: ['read', 'write', 'delete', 'admin', 'analytics', 'billing']
  }],
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  lastUsed: Date,
  usageCount: {
    type: Number,
    default: 0
  },
  rateLimit: {
    requests: {
      type: Number,
      default: 1000
    },
    window: {
      type: Number,
      default: 3600 // 1 hour
    }
  },
  expiresAt: {
    type: Date,
    index: { expireAfterSeconds: 0 }
  }
}, {
  timestamps: true
});

// Indexes
apiKeySchema.index({ userId: 1, isActive: 1 });
apiKeySchema.index({ hashedKey: 1, isActive: 1 });
apiKeySchema.index({ expiresAt: 1 });

// Method to generate API key
apiKeySchema.methods.generateKey = function (): string {
  const key = `sk_${crypto.randomBytes(32).toString('hex')}`;
  this.key = key;
  this.hashedKey = crypto.createHash('sha256').update(key).digest('hex');
  return key;
};

// Static method to hash key for lookup
apiKeySchema.statics.hashKey = function (key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
};

// Pre-save middleware
apiKeySchema.pre('save', function (next) {
  if (this.isModified('key') && this.key) {
    this.hashedKey = crypto.createHash('sha256').update(this.key).digest('hex');
  }
  next();
});

export const ApiKey = models.ApiKey || model<IApiKey>('ApiKey', apiKeySchema);
export default ApiKey;