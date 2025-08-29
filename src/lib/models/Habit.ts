import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IHabitEntry {
  _id?: string
  date: string // YYYY-MM-DD format
  value: number
  note?: string
  createdAt: Date
  updatedAt: Date
}

export interface IHabit extends Document {
  _id: mongoose.Types.ObjectId
  title: string
  description?: string
  frequency: 'daily' | 'weekly' | 'monthly'
  targetCount: number
  unit: string
  color?: string
  
  // User
  userId: mongoose.Types.ObjectId
  
  // Entries
  entries: IHabitEntry[]
  
  // Settings
  reminders: string[] // Array of times in HH:MM format
  isActive: boolean
  isArchived: boolean
  
  // Stats
  currentStreak: number
  longestStreak: number
  totalCompletions: number
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
  
  // Virtual methods
  todayEntry: IHabitEntry | undefined
  weeklyProgress: number
  monthlyProgress: number
  completionRate: number
  
  // Instance methods
  addEntry(date: string, value: number, note?: string): Promise<IHabit>
  updateEntry(date: string, value: number, note?: string): Promise<IHabit>
  removeEntry(date: string): Promise<IHabit>
  calculateStreaks(): Promise<IHabit>
  getEntriesInRange(startDate: Date, endDate: Date): IHabitEntry[]
  isCompletedOnDate(date: string): boolean
}

const HabitEntrySchema = new Schema<IHabitEntry>({
  date: { 
    type: String, 
    required: true,
    match: /^\d{4}-\d{2}-\d{2}$/
  },
  value: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  note: { 
    type: String, 
    maxlength: 200 
  }
}, {
  timestamps: true
})

const HabitSchema = new Schema<IHabit>({
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
    maxlength: 500 
  },
  frequency: { 
    type: String, 
    enum: ['daily', 'weekly', 'monthly'], 
    default: 'daily',
    index: true
  },
  targetCount: { 
    type: Number, 
    required: true, 
    min: 1,
    default: 1
  },
  unit: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 20,
    default: 'times'
  },
  color: { 
    type: String, 
    match: /^#[0-9A-F]{6}$/i 
  },
  
  // User
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true
  },
  
  // Entries
  entries: [HabitEntrySchema],
  
  // Settings
  reminders: [{ 
    type: String, 
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ 
  }],
  isActive: { type: Boolean, default: true, index: true },
  isArchived: { type: Boolean, default: false, index: true },
  
  // Stats
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  totalCompletions: { type: Number, default: 0 }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Indexes
HabitSchema.index({ userId: 1, isActive: 1, createdAt: -1 })
HabitSchema.index({ userId: 1, frequency: 1 })
HabitSchema.index({ 'entries.date': 1 })
HabitSchema.index({ title: 'text', description: 'text' })

// Compound index for entry date uniqueness per habit
HabitEntrySchema.index({ date: 1 })

// Virtuals
HabitSchema.virtual('todayEntry').get(function(this: IHabit) {
  const today = new Date().toISOString().split('T')[0]
  return this.entries.find(entry => entry.date === today)
})

HabitSchema.virtual('weeklyProgress').get(function(this: IHabit) {
  const today = new Date()
  const weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay())
  const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
  
  const weekEntries = this.getEntriesInRange(weekStart, weekEnd)
  const targetForWeek = this.frequency === 'daily' ? 7 : this.frequency === 'weekly' ? 1 : 0.25
  const completedDays = weekEntries.filter(entry => entry.value >= this.targetCount).length
  
  return Math.min(100, (completedDays / targetForWeek) * 100)
})

HabitSchema.virtual('monthlyProgress').get(function(this: IHabit) {
  const today = new Date()
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  
  const monthEntries = this.getEntriesInRange(monthStart, monthEnd)
  const daysInMonth = monthEnd.getDate()
  const targetForMonth = this.frequency === 'daily' ? daysInMonth : 
                        this.frequency === 'weekly' ? Math.ceil(daysInMonth / 7) : 1
  const completedDays = monthEntries.filter(entry => entry.value >= this.targetCount).length
  
  return Math.min(100, (completedDays / targetForMonth) * 100)
})

HabitSchema.virtual('completionRate').get(function(this: IHabit) {
  if (this.entries.length === 0) return 0
  
  const completedEntries = this.entries.filter(entry => entry.value >= this.targetCount).length
  return Math.round((completedEntries / this.entries.length) * 100)
})

// Instance methods
HabitSchema.methods.addEntry = async function(date: string, value: number, note?: string) {
  // Remove existing entry for the date if it exists
  this.entries = this.entries.filter(entry => entry.date !== date)
  
  // Add new entry
  this.entries.push({ date, value, note })
  
  // Update stats
  if (value >= this.targetCount) {
    this.totalCompletions += 1
  }
  
  // Sort entries by date
  this.entries.sort((a, b) => a.date.localeCompare(b.date))
  
  // Recalculate streaks
  await this.calculateStreaks()
  
  return this.save()
}

HabitSchema.methods.updateEntry = async function(date: string, value: number, note?: string) {
  const existingEntry = this.entries.find(entry => entry.date === date)
  
  if (existingEntry) {
    // Update existing entry
    const wasCompleted = existingEntry.value >= this.targetCount
    const isCompleted = value >= this.targetCount
    
    existingEntry.value = value
    if (note !== undefined) existingEntry.note = note
    
    // Update completion count
    if (!wasCompleted && isCompleted) {
      this.totalCompletions += 1
    } else if (wasCompleted && !isCompleted) {
      this.totalCompletions = Math.max(0, this.totalCompletions - 1)
    }
  } else {
    // Add new entry
    return this.addEntry(date, value, note)
  }
  
  await this.calculateStreaks()
  return this.save()
}

HabitSchema.methods.removeEntry = async function(date: string) {
  const existingEntry = this.entries.find(entry => entry.date === date)
  
  if (existingEntry && existingEntry.value >= this.targetCount) {
    this.totalCompletions = Math.max(0, this.totalCompletions - 1)
  }
  
  this.entries = this.entries.filter(entry => entry.date !== date)
  await this.calculateStreaks()
  return this.save()
}

HabitSchema.methods.calculateStreaks = async function() {
  if (this.entries.length === 0) {
    this.currentStreak = 0
    this.longestStreak = 0
    return this
  }
  
  // Sort entries by date
  const sortedEntries = this.entries
    .filter(entry => entry.value >= this.targetCount)
    .sort((a, b) => a.date.localeCompare(b.date))
  
  if (sortedEntries.length === 0) {
    this.currentStreak = 0
    this.longestStreak = 0
    return this
  }
  
  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 1
  
  const today = new Date().toISOString().split('T')[0]
  
  // Calculate longest streak
  for (let i = 1; i < sortedEntries.length; i++) {
    const prevDate = new Date(sortedEntries[i - 1].date)
    const currDate = new Date(sortedEntries[i].date)
    const dayDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (24 * 60 * 60 * 1000))
    
    if (this.frequency === 'daily' && dayDiff === 1) {
      tempStreak++
    } else if (this.frequency === 'weekly' && dayDiff <= 7) {
      tempStreak++
    } else if (this.frequency === 'monthly' && dayDiff <= 31) {
      tempStreak++
    } else {
      longestStreak = Math.max(longestStreak, tempStreak)
      tempStreak = 1
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak)
  
  // Calculate current streak (working backwards from today)
  const recentEntries = sortedEntries.reverse()
  const todayEntry = recentEntries.find(entry => entry.date === today)
  
  if (todayEntry) {
    currentStreak = 1
    let checkDate = new Date(today)
    
    for (let i = 1; i < recentEntries.length; i++) {
      checkDate.setDate(checkDate.getDate() - (this.frequency === 'daily' ? 1 : this.frequency === 'weekly' ? 7 : 30))
      const targetDate = checkDate.toISOString().split('T')[0]
      
      const entry = recentEntries.find(entry => entry.date === targetDate)
      if (entry) {
        currentStreak++
      } else {
        break
      }
    }
  }
  
  this.currentStreak = currentStreak
  this.longestStreak = Math.max(this.longestStreak, longestStreak)
  
  return this
}

HabitSchema.methods.getEntriesInRange = function(startDate: Date, endDate: Date) {
  const start = startDate.toISOString().split('T')[0]
  const end = endDate.toISOString().split('T')[0]
  
  return this.entries.filter(entry => 
    entry.date >= start && entry.date <= end
  ).sort((a, b) => a.date.localeCompare(b.date))
}

HabitSchema.methods.isCompletedOnDate = function(date: string) {
  const entry = this.entries.find(entry => entry.date === date)
  return entry ? entry.value >= this.targetCount : false
}

// Static methods
HabitSchema.statics.findByUser = function(userId: string, options: any = {}) {
  const query = { userId, isArchived: false, ...options }
  return this.find(query).sort({ createdAt: -1 })
}

HabitSchema.statics.findActive = function(userId: string) {
  return this.find({ 
    userId, 
    isActive: true, 
    isArchived: false 
  }).sort({ createdAt: -1 })
}

// Pre-save middleware
HabitSchema.pre('save', function(next) {
  // Ensure entries are unique by date
  const uniqueEntries = new Map()
  this.entries.forEach(entry => {
    uniqueEntries.set(entry.date, entry)
  })
  this.entries = Array.from(uniqueEntries.values())
  
  // Sort entries by date
  this.entries.sort((a, b) => a.date.localeCompare(b.date))
  
  next()
})

// Post-save middleware
HabitSchema.post('save', function(doc) {
  console.log(`Habit ${doc.title} saved for user ${doc.userId}`)
})

export const Habit: Model<IHabit> = mongoose.models.Habit || mongoose.model<IHabit>('Habit', HabitSchema)
export default Habit