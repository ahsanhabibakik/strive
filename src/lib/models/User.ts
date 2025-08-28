import { Schema, model, models, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password?: string;
  image?: string;
  role: 'user' | 'admin' | 'moderator';
  emailVerified?: Date;
  isActive: boolean;
  lastLoginAt?: Date;
  subscription?: {
    plan: 'free' | 'pro' | 'enterprise';
    status: 'active' | 'inactive' | 'cancelled';
    currentPeriodStart?: Date;
    currentPeriodEnd?: Date;
    customerId?: string;
    subscriptionId?: string;
  };
  profile?: {
    bio?: string;
    website?: string;
    location?: string;
    avatar?: string;
    preferences?: {
      theme: 'light' | 'dark' | 'system';
      notifications: {
        email: boolean;
        marketing: boolean;
        updates: boolean;
      };
    };
  };
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  toJSON(): any;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  image: String,
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  emailVerified: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  lastLoginAt: Date,
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'cancelled'],
      default: 'inactive'
    },
    currentPeriodStart: Date,
    currentPeriodEnd: Date,
    customerId: String,
    subscriptionId: String
  },
  profile: {
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    website: String,
    location: String,
    avatar: String,
    preferences: {
      theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'system'
      },
      notifications: {
        email: { type: Boolean, default: true },
        marketing: { type: Boolean, default: false },
        updates: { type: Boolean, default: true }
      }
    }
  },
  metadata: {
    type: Map,
    of: Schema.Types.Mixed
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ 'subscription.plan': 1 });
userSchema.index({ 'subscription.status': 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ lastLoginAt: -1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Override toJSON to remove sensitive fields
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

// Virtual for full name
userSchema.virtual('isSubscribed').get(function () {
  return this.subscription?.status === 'active';
});

userSchema.virtual('subscriptionPlan').get(function () {
  return this.subscription?.plan || 'free';
});

export const User = models.User || model<IUser>('User', userSchema);
export default User;