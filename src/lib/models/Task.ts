import mongoose, { Schema, Document, Types } from 'mongoose'

export interface ITask extends Document {
  _id: Types.ObjectId
  title: string
  description?: string
  status: 'todo' | 'inProgress' | 'review' | 'done' | 'blocked'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  project?: Types.ObjectId
  assignee?: Types.ObjectId
  reporter: Types.ObjectId
  dueDate?: Date
  startDate?: Date
  completedAt?: Date
  estimatedHours?: number
  actualHours?: number
  labels: string[]
  attachments: string[]
  comments: Types.ObjectId[]
  dependencies: Types.ObjectId[]
  subtasks: Types.ObjectId[]
  parent?: Types.ObjectId
  position: number
  isArchived: boolean
  createdAt: Date
  updatedAt: Date
}

const TaskSchema = new Schema<ITask>({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  status: {
    type: String,
    enum: ['todo', 'inProgress', 'review', 'done', 'blocked'],
    default: 'todo',
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    index: true
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    index: true
  },
  assignee: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  reporter: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  dueDate: {
    type: Date,
    index: true
  },
  startDate: {
    type: Date
  },
  completedAt: {
    type: Date,
    index: true
  },
  estimatedHours: {
    type: Number,
    min: [0, 'Estimated hours cannot be negative']
  },
  actualHours: {
    type: Number,
    min: [0, 'Actual hours cannot be negative'],
    default: 0
  },
  labels: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [30, 'Label cannot exceed 30 characters']
  }],
  attachments: [{
    type: String,
    trim: true
  }],
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  dependencies: [{
    type: Schema.Types.ObjectId,
    ref: 'Task'
  }],
  subtasks: [{
    type: Schema.Types.ObjectId,
    ref: 'Task'
  }],
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Task'
  },
  position: {
    type: Number,
    default: 0
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

// Compound indexes for performance
TaskSchema.index({ project: 1, status: 1 })
TaskSchema.index({ assignee: 1, status: 1 })
TaskSchema.index({ assignee: 1, dueDate: 1 })
TaskSchema.index({ reporter: 1, createdAt: -1 })
TaskSchema.index({ status: 1, priority: -1 })
TaskSchema.index({ labels: 1 })
TaskSchema.index({ dueDate: 1, status: 1 })

// Virtual for overdue status
TaskSchema.virtual('isOverdue').get(function() {
  return this.dueDate && 
         this.status !== 'done' && 
         new Date() > this.dueDate
})

// Virtual for time tracking
TaskSchema.virtual('timeStats').get(function() {
  const estimated = this.estimatedHours || 0
  const actual = this.actualHours || 0
  
  return {
    estimated,
    actual,
    remaining: Math.max(0, estimated - actual),
    overTime: Math.max(0, actual - estimated),
    efficiency: estimated > 0 ? (estimated / actual) * 100 : 0
  }
})

// Pre-save middleware
TaskSchema.pre('save', function(next) {
  // Auto-set completedAt when task is marked as done
  if (this.status === 'done' && !this.completedAt) {
    this.completedAt = new Date()
  }
  
  // Clear completedAt if status changes from done
  if (this.status !== 'done' && this.completedAt) {
    this.completedAt = undefined
  }
  
  // Set start date when task moves to inProgress
  if (this.status === 'inProgress' && !this.startDate) {
    this.startDate = new Date()
  }
  
  next()
})

// Post-save middleware to update project progress
TaskSchema.post('save', async function(doc) {
  if (doc.project) {
    try {
      const Project = mongoose.model('Project')
      const project = await Project.findById(doc.project)
      
      if (project) {
        // Calculate project progress based on completed tasks
        const totalTasks = await TaskSchema.countDocuments({ 
          project: doc.project, 
          isArchived: false 
        })
        
        const completedTasks = await TaskSchema.countDocuments({ 
          project: doc.project, 
          status: 'done', 
          isArchived: false 
        })
        
        const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
        
        await Project.findByIdAndUpdate(doc.project, { progress })
      }
    } catch (error) {
      console.error('Error updating project progress:', error)
    }
  }
})

// Static methods
TaskSchema.statics.findByAssignee = function(userId: string | Types.ObjectId, options = {}) {
  const query = { 
    assignee: userId, 
    isArchived: false,
    ...options
  }
  
  return this.find(query)
    .populate('project', 'name')
    .populate('assignee', 'name email')
    .populate('reporter', 'name email')
    .sort({ priority: -1, dueDate: 1 })
}

TaskSchema.statics.findOverdue = function(userId?: string | Types.ObjectId) {
  const query: any = {
    dueDate: { $lt: new Date() },
    status: { $ne: 'done' },
    isArchived: false
  }
  
  if (userId) {
    query.assignee = userId
  }
  
  return this.find(query)
    .populate('project', 'name')
    .populate('assignee', 'name email')
    .sort({ dueDate: 1 })
}

TaskSchema.statics.getTaskStats = function(userId: string | Types.ObjectId) {
  return this.aggregate([
    {
      $match: {
        $or: [
          { assignee: new mongoose.Types.ObjectId(userId) },
          { reporter: new mongoose.Types.ObjectId(userId) }
        ]
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        todo: {
          $sum: { $cond: [{ $eq: ['$status', 'todo'] }, 1, 0] }
        },
        inProgress: {
          $sum: { $cond: [{ $eq: ['$status', 'inProgress'] }, 1, 0] }
        },
        review: {
          $sum: { $cond: [{ $eq: ['$status', 'review'] }, 1, 0] }
        },
        done: {
          $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] }
        },
        overdue: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $ne: ['$status', 'done'] },
                  { $lt: ['$dueDate', new Date()] }
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
TaskSchema.methods.markComplete = function() {
  this.status = 'done'
  this.completedAt = new Date()
  return this.save()
}

TaskSchema.methods.assignTo = function(userId: string | Types.ObjectId) {
  this.assignee = userId
  return this.save()
}

TaskSchema.methods.addLabel = function(label: string) {
  const normalizedLabel = label.toLowerCase().trim()
  if (!this.labels.includes(normalizedLabel)) {
    this.labels.push(normalizedLabel)
    return this.save()
  }
  return Promise.resolve(this)
}

TaskSchema.methods.removeLabel = function(label: string) {
  const normalizedLabel = label.toLowerCase().trim()
  this.labels = this.labels.filter(l => l !== normalizedLabel)
  return this.save()
}

TaskSchema.methods.logTime = function(hours: number) {
  this.actualHours = (this.actualHours || 0) + hours
  return this.save()
}

const Task = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema)

export { Task }
export default Task