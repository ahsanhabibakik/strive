import mongoose, { Schema, Document, Model } from 'mongoose'
import { 
  GOAL_CATEGORIES, 
  GOAL_PRIORITIES, 
  GOAL_STATUSES, 
  VISIBILITY_LEVELS,
  type GoalCategory,
  type GoalPriority,
  type GoalStatus,
  type VisibilityLevel
} from '@/lib/config/constants'

export interface IMilestone {
  _id?: string
  title: string
  description?: string
  targetDate?: Date
  completedAt?: Date
  order: number
  isCompleted: boolean
  createdAt: Date
  updatedAt: Date
}

export interface IProgressEntry {
  _id?: string
  value: number
  unit: 'percentage' | 'numeric' | 'boolean'
  target?: number
  note?: string
  attachments?: string[]
  createdAt: Date
  userId: mongoose.Types.ObjectId
}

export interface IGoal extends Document {
  _id: mongoose.Types.ObjectId
  title: string
  description?: string
  category: GoalCategory
  priority: GoalPriority
  difficulty: 'easy' | 'moderate' | 'challenging' | 'expert'
  visibility: VisibilityLevel
  status: GoalStatus
  
  // Dates
  startDate: Date
  targetDate: Date
  completedAt?: Date
  
  // User
  userId: mongoose.Types.ObjectId
  
  // Progress
  progress: number // 0-100
  milestones: IMilestone[]
  progressEntries: IProgressEntry[]
  
  // Metadata
  tags: string[]
  color?: string
  isArchived: boolean
  
  // Reminders
  reminders?: {
    enabled: boolean
    frequency: 'daily' | 'weekly' | 'monthly'
    time?: string
  }
  
  // Social
  sharedWith: Array<{
    userId: mongoose.Types.ObjectId
    permissions: {
      canView: boolean
      canComment: boolean
      canEdit: boolean
    }
  }>
  isPublic: boolean
  
  // Stats
  viewCount: number
  likeCount: number
  commentCount: number
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
  
  // Virtual methods
  isOverdue: boolean
  timeRemaining: number
  progressPercentage: number
  
  // Instance methods
  addMilestone(milestone: Omit<IMilestone, '_id' | 'createdAt' | 'updatedAt'>): Promise<IGoal>
  updateProgress(value: number, note?: string, attachments?: string[]): Promise<IGoal>
  complete(): Promise<IGoal>
  archive(): Promise<IGoal>
  shareWith(userId: string, permissions: IMilestone['_id']): Promise<IGoal>
}

const MilestoneSchema = new Schema<IMilestone>({
  title: { type: String, required: true, maxlength: 200 },
  description: { type: String, maxlength: 500 },
  targetDate: { type: Date },
  completedAt: { type: Date },
  order: { type: Number, default: 0 },
  isCompleted: { type: Boolean, default: false }
}, {
  timestamps: true
})

const ProgressEntrySchema = new Schema<IProgressEntry>({
  value: { type: Number, required: true, min: 0, max: 100 },
  unit: { 
    type: String, 
    enum: ['percentage', 'numeric', 'boolean'], 
    default: 'percentage' 
  },
  target: { type: Number, min: 0 },
  note: { type: String, maxlength: 500 },
  attachments: [{ type: String }],
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
})

const GoalSchema = new Schema<IGoal>({
  title: { 
    type: String, 
    required: true, 
    trim: true,
    minlength: 1,
    maxlength: 100,
    index: true
  },
  description: { 
    type: String, 
    trim: true,
    maxlength: 1000 
  },
  category: { 
    type: String, 
    enum: Object.values(GOAL_CATEGORIES), 
    default: GOAL_CATEGORIES.PERSONAL,
    index: true
  },
  priority: { 
    type: String, 
    enum: Object.values(GOAL_PRIORITIES), 
    default: GOAL_PRIORITIES.MEDIUM,
    index: true
  },
  difficulty: { 
    type: String, 
    enum: ['easy', 'moderate', 'challenging', 'expert'], 
    default: 'moderate' 
  },
  visibility: { 
    type: String, 
    enum: Object.values(VISIBILITY_LEVELS), 
    default: VISIBILITY_LEVELS.PRIVATE,
    index: true
  },
  status: { 
    type: String, 
    enum: Object.values(GOAL_STATUSES), 
    default: GOAL_STATUSES.DRAFT,
    index: true
  },
  
  // Dates
  startDate: { type: Date, required: true },
  targetDate: { type: Date, required: true, index: true },
  completedAt: { type: Date },
  
  // User
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true
  },
  
  // Progress
  progress: { type: Number, default: 0, min: 0, max: 100 },
  milestones: [MilestoneSchema],
  progressEntries: [ProgressEntrySchema],
  
  // Metadata
  tags: [{ type: String, trim: true, maxlength: 50 }],
  color: { 
    type: String, 
    match: /^#[0-9A-F]{6}$/i 
  },
  isArchived: { type: Boolean, default: false, index: true },
  
  // Reminders
  reminders: {
    enabled: { type: Boolean, default: false },
    frequency: { 
      type: String, 
      enum: ['daily', 'weekly', 'monthly'], 
      default: 'daily' 
    },
    time: { 
      type: String, 
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ 
    }
  },
  
  // Social
  sharedWith: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    permissions: {
      canView: { type: Boolean, default: true },
      canComment: { type: Boolean, default: false },
      canEdit: { type: Boolean, default: false }
    }
  }],
  isPublic: { type: Boolean, default: false, index: true },
  
  // Stats
  viewCount: { type: Number, default: 0 },
  likeCount: { type: Number, default: 0 },
  commentCount: { type: Number, default: 0 }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Indexes
GoalSchema.index({ userId: 1, status: 1, createdAt: -1 })
GoalSchema.index({ category: 1, isPublic: 1, createdAt: -1 })
GoalSchema.index({ tags: 1, isPublic: 1 })
GoalSchema.index({ targetDate: 1, status: 1 })
GoalSchema.index({ title: 'text', description: 'text', tags: 'text' })

// Virtuals
GoalSchema.virtual('isOverdue').get(function(this: IGoal) {
  return new Date() > this.targetDate && this.status !== GOAL_STATUSES.COMPLETED
})

GoalSchema.virtual('timeRemaining').get(function(this: IGoal) {
  const now = new Date()
  const target = this.targetDate
  return Math.max(0, target.getTime() - now.getTime())
})

GoalSchema.virtual('progressPercentage').get(function(this: IGoal) {
  return Math.round(this.progress)
})

// Instance methods
GoalSchema.methods.addMilestone = async function(
  milestone: Omit<IMilestone, '_id' | 'createdAt' | 'updatedAt'>
) {
  this.milestones.push(milestone)
  return this.save()
}

GoalSchema.methods.updateProgress = async function(
  value: number, 
  note?: string, 
  attachments: string[] = []
) {
  // Add progress entry
  this.progressEntries.push({
    value,
    unit: 'percentage',
    note,
    attachments,
    userId: this.userId
  })
  
  // Update overall progress
  this.progress = Math.max(this.progress, value)
  
  // Auto-complete if 100%
  if (value >= 100 && this.status === GOAL_STATUSES.ACTIVE) {
    this.status = GOAL_STATUSES.COMPLETED
    this.completedAt = new Date()
  }
  
  return this.save()
}

GoalSchema.methods.complete = async function() {
  this.status = GOAL_STATUSES.COMPLETED
  this.progress = 100
  this.completedAt = new Date()
  return this.save()
}

GoalSchema.methods.archive = async function() {
  this.isArchived = true
  return this.save()
}

GoalSchema.methods.shareWith = async function(
  userId: string, 
  permissions = { canView: true, canComment: false, canEdit: false }
) {
  // Remove existing share if exists
  this.sharedWith = this.sharedWith.filter(
    share => share.userId.toString() !== userId
  )
  
  // Add new share
  this.sharedWith.push({ userId: new mongoose.Types.ObjectId(userId), permissions })
  return this.save()
}

// Static methods
GoalSchema.statics.findByUser = function(userId: string, options: any = {}) {
  const query = { userId, ...options }
  return this.find(query).sort({ createdAt: -1 })
}

GoalSchema.statics.findPublic = function(options: any = {}) {
  const query = { isPublic: true, isArchived: false, ...options }
  return this.find(query).sort({ createdAt: -1 })
}

GoalSchema.statics.findByCategory = function(category: GoalCategory, userId?: string) {
  const query: any = { category, isArchived: false }
  if (userId) {
    query.$or = [
      { userId },
      { isPublic: true },
      { 'sharedWith.userId': userId }
    ]
  } else {
    query.isPublic = true
  }
  return this.find(query).sort({ createdAt: -1 })
}

// Pre-save middleware
GoalSchema.pre('save', function(next) {
  // Ensure dates are valid
  if (this.startDate > this.targetDate) {
    next(new Error('Start date must be before target date'))
  }
  
  // Sort milestones by order
  this.milestones.sort((a, b) => a.order - b.order)
  
  next()
})

// Post-save middleware
GoalSchema.post('save', function(doc) {
  // Could trigger notifications, analytics, etc.
  console.log(`Goal ${doc.title} saved for user ${doc.userId}`)
})

export const Goal: Model<IGoal> = mongoose.models.Goal || mongoose.model<IGoal>('Goal', GoalSchema)
export default Goal