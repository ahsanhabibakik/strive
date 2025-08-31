import { Schema, model, models, Document, Types } from 'mongoose';

export interface IProgress extends Document {
  _id: Types.ObjectId;
  goalId: Types.ObjectId;
  userId: Types.ObjectId;
  
  // Progress entry details
  type: 'milestone' | 'update' | 'setback' | 'achievement';
  title: string;
  description?: string;
  
  // Quantitative data
  previousValue: number;
  currentValue: number;
  targetValue: number;
  unit: string;
  changeAmount: number;
  changePercentage: number;
  
  // Milestone specific
  milestoneId?: string;
  isCompleted: boolean;
  
  // Progress metadata
  dateRecorded: Date;
  timeSpent?: number; // in minutes
  difficulty: 1 | 2 | 3 | 4 | 5; // 1 = very easy, 5 = very difficult
  confidence: 1 | 2 | 3 | 4 | 5; // 1 = not confident, 5 = very confident
  motivation: 1 | 2 | 3 | 4 | 5; // 1 = not motivated, 5 = very motivated
  
  // Context and notes
  notes?: string;
  challenges?: string;
  lessons?: string;
  nextSteps?: string[];
  
  // Attachments and evidence
  attachments: Array<{
    type: 'image' | 'document' | 'link' | 'video';
    url: string;
    filename?: string;
    description?: string;
  }>;
  
  // Location data (optional)
  location?: {
    name?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  
  // Tags and categories
  tags: string[];
  mood: 'excellent' | 'good' | 'neutral' | 'poor' | 'terrible';
  
  // Social features
  isPublic: boolean;
  likes: number;
  comments: Array<{
    userId: Types.ObjectId;
    content: string;
    createdAt: Date;
  }>;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

const ProgressSchema = new Schema<IProgress>({
  goalId: {
    type: Schema.Types.ObjectId,
    ref: 'Goal',
    required: true,
    index: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['milestone', 'update', 'setback', 'achievement'],
    default: 'update',
  },
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
  previousValue: {
    type: Number,
    required: true,
    min: 0,
  },
  currentValue: {
    type: Number,
    required: true,
    min: 0,
  },
  targetValue: {
    type: Number,
    required: true,
    min: 0,
  },
  unit: {
    type: String,
    required: true,
    trim: true,
  },
  changeAmount: {
    type: Number,
    required: true,
  },
  changePercentage: {
    type: Number,
    required: true,
  },
  milestoneId: {
    type: String,
    trim: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  dateRecorded: {
    type: Date,
    default: Date.now,
    index: true,
  },
  timeSpent: {
    type: Number,
    min: 0,
  },
  difficulty: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
    default: 3,
  },
  confidence: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
    default: 3,
  },
  motivation: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
    default: 3,
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 2000,
  },
  challenges: {
    type: String,
    trim: true,
    maxlength: 1000,
  },
  lessons: {
    type: String,
    trim: true,
    maxlength: 1000,
  },
  nextSteps: [{
    type: String,
    trim: true,
    maxlength: 200,
  }],
  attachments: [{
    type: {
      type: String,
      enum: ['image', 'document', 'link', 'video'],
      required: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    filename: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 200,
    },
  }],
  location: {
    name: {
      type: String,
      trim: true,
    },
    coordinates: {
      latitude: {
        type: Number,
        min: -90,
        max: 90,
      },
      longitude: {
        type: Number,
        min: -180,
        max: 180,
      },
    },
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
  }],
  mood: {
    type: String,
    enum: ['excellent', 'good', 'neutral', 'poor', 'terrible'],
    default: 'neutral',
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  likes: {
    type: Number,
    default: 0,
  },
  comments: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
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
ProgressSchema.index({ goalId: 1, dateRecorded: -1 });
ProgressSchema.index({ userId: 1, dateRecorded: -1 });
ProgressSchema.index({ type: 1, dateRecorded: -1 });
ProgressSchema.index({ tags: 1 });
ProgressSchema.index({ mood: 1 });

// Virtual for progress percentage
ProgressSchema.virtual('progressPercentage').get(function() {
  if (this.targetValue === 0) return 0;
  return Math.min(Math.round((this.currentValue / this.targetValue) * 100), 100);
});

// Virtual for is improvement
ProgressSchema.virtual('isImprovement').get(function() {
  return this.currentValue > this.previousValue;
});

// Pre-save middleware to calculate change values
ProgressSchema.pre('save', function(next) {
  this.changeAmount = this.currentValue - this.previousValue;
  
  if (this.previousValue === 0 && this.currentValue > 0) {
    this.changePercentage = 100;
  } else if (this.previousValue === 0) {
    this.changePercentage = 0;
  } else {
    this.changePercentage = Math.round(((this.changeAmount) / this.previousValue) * 100);
  }
  
  next();
});

// Static methods for analytics
ProgressSchema.statics.getProgressSummary = async function(goalId: Types.ObjectId, period?: number) {
  const match: any = { goalId };
  
  if (period) {
    const since = new Date();
    since.setDate(since.getDate() - period);
    match.dateRecorded = { $gte: since };
  }
  
  return this.aggregate([
    { $match: match },
    { $sort: { dateRecorded: -1 } },
    {
      $group: {
        _id: '$goalId',
        totalEntries: { $sum: 1 },
        averageProgress: { $avg: '$currentValue' },
        latestEntry: { $first: '$$ROOT' },
        firstEntry: { $last: '$$ROOT' },
        averageDifficulty: { $avg: '$difficulty' },
        averageConfidence: { $avg: '$confidence' },
        averageMotivation: { $avg: '$motivation' },
        totalTimeSpent: { $sum: '$timeSpent' },
        improvementEntries: {
          $sum: { $cond: [{ $gt: ['$changeAmount', 0] }, 1, 0] }
        },
        setbackEntries: {
          $sum: { $cond: [{ $lt: ['$changeAmount', 0] }, 1, 0] }
        }
      }
    }
  ]);
};

ProgressSchema.statics.getMoodTrends = async function(userId: Types.ObjectId, period = 30) {
  const since = new Date();
  since.setDate(since.getDate() - period);
  
  return this.aggregate([
    { 
      $match: { 
        userId,
        dateRecorded: { $gte: since }
      }
    },
    {
      $group: {
        _id: {
          mood: '$mood',
          date: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$dateRecorded'
            }
          }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.date': 1 } }
  ]);
};

export const Progress = models.Progress || model<IProgress>('Progress', ProgressSchema);