import { Schema, model, models, Document, Types } from 'mongoose';

export interface IGoal extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  category: 'personal' | 'professional' | 'health' | 'financial' | 'education' | 'relationships' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'draft' | 'active' | 'completed' | 'paused' | 'cancelled';
  userId: Types.ObjectId;
  teamId?: Types.ObjectId;
  
  // SMART Goal attributes
  specific: string;
  measurable: {
    metric: string;
    targetValue: number;
    currentValue: number;
    unit: string;
  };
  achievable: boolean;
  relevant: string;
  timeBound: {
    startDate: Date;
    endDate: Date;
    milestones: Array<{
      title: string;
      description?: string;
      targetDate: Date;
      completed: boolean;
      completedAt?: Date;
    }>;
  };
  
  // Progress tracking
  progressPercentage: number;
  lastUpdated: Date;
  
  // Collaboration
  isPublic: boolean;
  collaborators: Array<{
    userId: Types.ObjectId;
    role: 'viewer' | 'contributor' | 'editor';
    addedAt: Date;
  }>;
  
  // Analytics
  viewCount: number;
  likeCount: number;
  commentCount: number;
  
  // Metadata
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const GoalSchema = new Schema<IGoal>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000,
  },
  category: {
    type: String,
    enum: ['personal', 'professional', 'health', 'financial', 'education', 'relationships', 'other'],
    default: 'personal',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'paused', 'cancelled'],
    default: 'draft',
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  teamId: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
    index: true,
  },
  specific: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
  },
  measurable: {
    metric: {
      type: String,
      required: true,
      trim: true,
    },
    targetValue: {
      type: Number,
      required: true,
      min: 0,
    },
    currentValue: {
      type: Number,
      default: 0,
      min: 0,
    },
    unit: {
      type: String,
      required: true,
      trim: true,
    },
  },
  achievable: {
    type: Boolean,
    default: true,
  },
  relevant: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
  },
  timeBound: {
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    milestones: [{
      title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
      },
      description: {
        type: String,
        trim: true,
        maxlength: 500,
      },
      targetDate: {
        type: Date,
        required: true,
      },
      completed: {
        type: Boolean,
        default: false,
      },
      completedAt: {
        type: Date,
      },
    }],
  },
  progressPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  collaborators: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['viewer', 'contributor', 'editor'],
      default: 'viewer',
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  viewCount: {
    type: Number,
    default: 0,
  },
  likeCount: {
    type: Number,
    default: 0,
  },
  commentCount: {
    type: Number,
    default: 0,
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
  }],
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
});

// Indexes for performance
GoalSchema.index({ userId: 1, status: 1 });
GoalSchema.index({ teamId: 1, status: 1 });
GoalSchema.index({ category: 1, priority: 1 });
GoalSchema.index({ 'timeBound.endDate': 1 });
GoalSchema.index({ tags: 1 });
GoalSchema.index({ createdAt: -1 });
GoalSchema.index({ progressPercentage: 1 });

// Virtual for days remaining
GoalSchema.virtual('daysRemaining').get(function() {
  const now = new Date();
  const endDate = this.timeBound.endDate;
  const diffTime = endDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for completion status
GoalSchema.virtual('isOverdue').get(function() {
  return new Date() > this.timeBound.endDate && this.status !== 'completed';
});

// Pre-save middleware to update progress percentage
GoalSchema.pre('save', function(next) {
  if (this.isModified('measurable.currentValue') || this.isModified('measurable.targetValue')) {
    this.progressPercentage = Math.min(
      Math.round((this.measurable.currentValue / this.measurable.targetValue) * 100),
      100
    );
    this.lastUpdated = new Date();
  }
  next();
});

// Pre-save validation
GoalSchema.pre('save', function(next) {
  if (this.timeBound.startDate >= this.timeBound.endDate) {
    next(new Error('End date must be after start date'));
  }
  
  if (this.measurable.currentValue > this.measurable.targetValue) {
    this.measurable.currentValue = this.measurable.targetValue;
  }
  
  next();
});

export const Goal = models.Goal || model<IGoal>('Goal', GoalSchema);