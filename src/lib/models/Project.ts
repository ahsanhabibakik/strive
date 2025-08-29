import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IProject extends Document {
  _id: Types.ObjectId
  name: string
  description?: string
  status: 'planning' | 'inProgress' | 'onHold' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category: string
  deadline?: Date
  startDate?: Date
  completedAt?: Date
  progress: number // 0-100
  owner: Types.ObjectId
  members: Types.ObjectId[]
  tags: string[]
  budget?: {
    allocated: number
    spent: number
    currency: string
  }
  tasks: Types.ObjectId[]
  files: string[]
  notes?: string
  isArchived: boolean
  createdAt: Date
  updatedAt: Date
}

const ProjectSchema = new Schema<IProject>({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    maxlength: [200, 'Project name cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  status: {
    type: String,
    enum: ['planning', 'inProgress', 'onHold', 'completed', 'cancelled'],
    default: 'planning',
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    index: true
  },
  category: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  deadline: {
    type: Date,
    index: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    index: true
  },
  progress: {
    type: Number,
    min: [0, 'Progress cannot be negative'],
    max: [100, 'Progress cannot exceed 100'],
    default: 0
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  budget: {
    allocated: {
      type: Number,
      min: [0, 'Budget cannot be negative']
    },
    spent: {
      type: Number,
      min: [0, 'Spent amount cannot be negative'],
      default: 0
    },
    currency: {
      type: String,
      uppercase: true,
      default: 'USD'
    }
  },
  tasks: [{
    type: Schema.Types.ObjectId,
    ref: 'Task'
  }],
  files: [{
    type: String,
    trim: true
  }],
  notes: {
    type: String,
    trim: true,
    maxlength: [5000, 'Notes cannot exceed 5000 characters']
  },
  isArchived: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id
      delete ret._id
      delete ret.__v
      return ret
    }
  }
})

// Indexes for performance
ProjectSchema.index({ owner: 1, status: 1 })
ProjectSchema.index({ owner: 1, createdAt: -1 })
ProjectSchema.index({ members: 1, status: 1 })
ProjectSchema.index({ deadline: 1, status: 1 })
ProjectSchema.index({ tags: 1 })
ProjectSchema.index({ category: 1, status: 1 })

// Virtual for task count
ProjectSchema.virtual('taskCount', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'project',
  count: true
})

// Virtual for completion percentage based on tasks
ProjectSchema.virtual('completionRate').get(function() {
  if (!this.tasks || this.tasks.length === 0) {
    return this.progress
  }
  // This would need to be populated with actual task data
  return this.progress
})

// Pre-save middleware
ProjectSchema.pre('save', function(next) {
  // Auto-complete project when progress reaches 100%
  if (this.progress === 100 && this.status !== 'completed') {
    this.status = 'completed'
    this.completedAt = new Date()
  }
  
  // Clear completedAt if status changes from completed
  if (this.status !== 'completed' && this.completedAt) {
    this.completedAt = undefined
  }
  
  next()
})

// Static methods
ProjectSchema.statics.findByOwner = function(userId: string | Types.ObjectId) {
  return this.find({ owner: userId, isArchived: false })
    .populate('owner', 'name email')
    .populate('members', 'name email')
    .sort({ createdAt: -1 })
}

ProjectSchema.statics.findByMember = function(userId: string | Types.ObjectId) {
  return this.find({ 
    $or: [
      { owner: userId },
      { members: userId }
    ],
    isArchived: false 
  })
    .populate('owner', 'name email')
    .populate('members', 'name email')
    .sort({ createdAt: -1 })
}

ProjectSchema.statics.getProjectStats = function(userId: string | Types.ObjectId) {
  return this.aggregate([
    {
      $match: {
        $or: [
          { owner: new mongoose.Types.ObjectId(userId) },
          { members: new mongoose.Types.ObjectId(userId) }
        ]
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        completed: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        inProgress: {
          $sum: { $cond: [{ $eq: ['$status', 'inProgress'] }, 1, 0] }
        },
        overdue: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $ne: ['$status', 'completed'] },
                  { $lt: ['$deadline', new Date()] }
                ]
              },
              1,
              0
            ]
          }
        }
      }
    }
  ])
}

// Instance methods
ProjectSchema.methods.addMember = function(userId: string | Types.ObjectId) {
  if (!this.members.includes(userId)) {
    this.members.push(userId)
    return this.save()
  }
  return Promise.resolve(this)
}

ProjectSchema.methods.removeMember = function(userId: string | Types.ObjectId) {
  this.members = this.members.filter(member => 
    !member.equals(userId)
  )
  return this.save()
}

ProjectSchema.methods.updateProgress = function(progress: number) {
  this.progress = Math.max(0, Math.min(100, progress))
  return this.save()
}

const Project = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema)

export { Project }
export default Project