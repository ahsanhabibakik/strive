import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IComment extends Document {
  _id: mongoose.Types.ObjectId
  content: string
  
  // Author
  userId: mongoose.Types.ObjectId
  
  // Target (what this comment is on)
  targetType: 'goal' | 'habit' | 'comment'
  targetId: mongoose.Types.ObjectId
  
  // Threading
  parentId?: mongoose.Types.ObjectId // For replies
  replies: mongoose.Types.ObjectId[]
  depth: number
  
  // Status
  isEdited: boolean
  editedAt?: Date
  isDeleted: boolean
  deletedAt?: Date
  deletedBy?: mongoose.Types.ObjectId
  
  // Moderation
  isReported: boolean
  reportCount: number
  isFlagged: boolean
  flaggedBy?: mongoose.Types.ObjectId
  flaggedAt?: Date
  flagReason?: string
  
  // Social
  likeCount: number
  dislikeCount: number
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
  
  // Instance methods
  addReply(replyId: mongoose.Types.ObjectId): Promise<IComment>
  removeReply(replyId: mongoose.Types.ObjectId): Promise<IComment>
  softDelete(deletedBy: mongoose.Types.ObjectId): Promise<IComment>
  flag(flaggedBy: mongoose.Types.ObjectId, reason: string): Promise<IComment>
  unflag(): Promise<IComment>
}

const CommentSchema = new Schema<IComment>({
  content: { 
    type: String, 
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 1000
  },
  
  // Author
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true
  },
  
  // Target
  targetType: { 
    type: String, 
    enum: ['goal', 'habit', 'comment'], 
    required: true,
    index: true
  },
  targetId: { 
    type: Schema.Types.ObjectId, 
    required: true,
    index: true
  },
  
  // Threading
  parentId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Comment',
    index: true
  },
  replies: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Comment' 
  }],
  depth: { 
    type: Number, 
    default: 0,
    min: 0,
    max: 5 // Limit nesting depth
  },
  
  // Status
  isEdited: { type: Boolean, default: false },
  editedAt: { type: Date },
  isDeleted: { type: Boolean, default: false, index: true },
  deletedAt: { type: Date },
  deletedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  
  // Moderation
  isReported: { type: Boolean, default: false, index: true },
  reportCount: { type: Number, default: 0 },
  isFlagged: { type: Boolean, default: false, index: true },
  flaggedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  flaggedAt: { type: Date },
  flagReason: { 
    type: String,
    enum: ['spam', 'harassment', 'inappropriate', 'off-topic', 'other']
  },
  
  // Social
  likeCount: { type: Number, default: 0 },
  dislikeCount: { type: Number, default: 0 }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      // Hide content if deleted
      if (ret.isDeleted) {
        ret.content = '[deleted]'
      }
      return ret
    }
  },
  toObject: { virtuals: true }
})

// Indexes
CommentSchema.index({ targetType: 1, targetId: 1, createdAt: -1 })
CommentSchema.index({ userId: 1, createdAt: -1 })
CommentSchema.index({ parentId: 1, createdAt: 1 })
CommentSchema.index({ isDeleted: 1, isFlagged: 1, isReported: 1 })
CommentSchema.index({ content: 'text' })

// Instance methods
CommentSchema.methods.addReply = async function(replyId: mongoose.Types.ObjectId) {
  if (!this.replies.includes(replyId)) {
    this.replies.push(replyId)
    await this.save()
  }
  return this
}

CommentSchema.methods.removeReply = async function(replyId: mongoose.Types.ObjectId) {
  this.replies = this.replies.filter(id => !id.equals(replyId))
  return this.save()
}

CommentSchema.methods.softDelete = async function(deletedBy: mongoose.Types.ObjectId) {
  this.isDeleted = true
  this.deletedAt = new Date()
  this.deletedBy = deletedBy
  return this.save()
}

CommentSchema.methods.flag = async function(flaggedBy: mongoose.Types.ObjectId, reason: string) {
  this.isFlagged = true
  this.flaggedBy = flaggedBy
  this.flaggedAt = new Date()
  this.flagReason = reason
  return this.save()
}

CommentSchema.methods.unflag = async function() {
  this.isFlagged = false
  this.flaggedBy = undefined
  this.flaggedAt = undefined
  this.flagReason = undefined
  return this.save()
}

// Static methods
CommentSchema.statics.findByTarget = function(targetType: string, targetId: string, options: any = {}) {
  const query = { 
    targetType, 
    targetId: new mongoose.Types.ObjectId(targetId),
    isDeleted: false,
    ...options 
  }
  return this.find(query)
    .populate('userId', 'name image')
    .sort({ createdAt: 1 })
}

CommentSchema.statics.findReplies = function(parentId: string) {
  return this.find({ 
    parentId: new mongoose.Types.ObjectId(parentId),
    isDeleted: false 
  })
  .populate('userId', 'name image')
  .sort({ createdAt: 1 })
}

CommentSchema.statics.findByUser = function(userId: string, options: any = {}) {
  const query = { userId, isDeleted: false, ...options }
  return this.find(query)
    .populate('targetId')
    .sort({ createdAt: -1 })
}

CommentSchema.statics.findFlagged = function() {
  return this.find({ 
    isFlagged: true,
    isDeleted: false 
  })
  .populate('userId', 'name email')
  .populate('flaggedBy', 'name email')
  .sort({ flaggedAt: -1 })
}

// Pre-save middleware
CommentSchema.pre('save', async function(next) {
  // Set depth based on parent
  if (this.parentId && !this.depth) {
    const parent = await mongoose.model('Comment').findById(this.parentId)
    if (parent) {
      this.depth = parent.depth + 1
      
      // Prevent excessive nesting
      if (this.depth > 5) {
        return next(new Error('Comment nesting too deep'))
      }
    }
  }
  
  // Mark as edited if content changed
  if (this.isModified('content') && !this.isNew) {
    this.isEdited = true
    this.editedAt = new Date()
  }
  
  next()
})

// Post-save middleware
CommentSchema.post('save', async function(doc) {
  // Add to parent's replies if this is a reply
  if (doc.parentId && doc.isNew) {
    await mongoose.model('Comment').findByIdAndUpdate(
      doc.parentId,
      { $addToSet: { replies: doc._id } }
    )
  }
  
  // Update comment count on target
  if (doc.isNew && !doc.isDeleted) {
    const targetModel = doc.targetType === 'goal' ? 'Goal' : 
                       doc.targetType === 'habit' ? 'Habit' : null
    
    if (targetModel) {
      await mongoose.model(targetModel).findByIdAndUpdate(
        doc.targetId,
        { $inc: { commentCount: 1 } }
      )
    }
  }
})

// Post-remove middleware
CommentSchema.post('findOneAndUpdate', async function(doc) {
  if (doc && this.getUpdate()?.$set?.isDeleted) {
    // Update comment count on target when soft deleted
    const targetModel = doc.targetType === 'goal' ? 'Goal' : 
                       doc.targetType === 'habit' ? 'Habit' : null
    
    if (targetModel) {
      await mongoose.model(targetModel).findByIdAndUpdate(
        doc.targetId,
        { $inc: { commentCount: -1 } }
      )
    }
  }
})

export const Comment: Model<IComment> = mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema)
export default Comment