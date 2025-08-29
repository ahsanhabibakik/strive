import { z } from 'zod'
import { dateSchema, tagsSchema, colorSchema } from './common'

export const goalSchema = z.object({
  title: z
    .string()
    .min(1, 'Goal title is required')
    .max(100, 'Goal title cannot exceed 100 characters'),
  description: z
    .string()
    .max(1000, 'Description cannot exceed 1000 characters')
    .optional(),
  category: z
    .enum(['personal', 'professional', 'health', 'education', 'financial', 'relationships', 'hobbies', 'other'])
    .default('personal'),
  priority: z
    .enum(['low', 'medium', 'high', 'critical'])
    .default('medium'),
  difficulty: z
    .enum(['easy', 'moderate', 'challenging', 'expert'])
    .default('moderate'),
  visibility: z
    .enum(['private', 'friends', 'public'])
    .default('private'),
  status: z
    .enum(['draft', 'active', 'paused', 'completed', 'cancelled'])
    .default('draft'),
  startDate: dateSchema,
  targetDate: dateSchema,
  completedAt: dateSchema.optional(),
  tags: tagsSchema.optional(),
  color: colorSchema.optional(),
  isArchived: z.boolean().default(false),
  reminders: z.object({
    enabled: z.boolean().default(false),
    frequency: z.enum(['daily', 'weekly', 'monthly']).default('daily'),
    time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format').optional()
  }).optional()
})

export const milestoneSchema = z.object({
  title: z
    .string()
    .min(1, 'Milestone title is required')
    .max(200, 'Milestone title cannot exceed 200 characters'),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
  targetDate: dateSchema.optional(),
  completedAt: dateSchema.optional(),
  order: z.number().min(0).default(0),
  isCompleted: z.boolean().default(false)
})

export const goalProgressSchema = z.object({
  value: z.number().min(0).max(100),
  unit: z.enum(['percentage', 'numeric', 'boolean']).default('percentage'),
  target: z.number().min(0).optional(),
  note: z.string().max(500, 'Note cannot exceed 500 characters').optional(),
  attachments: z.array(z.string().url()).max(5, 'Cannot have more than 5 attachments').optional()
})

export const habitSchema = z.object({
  title: z
    .string()
    .min(1, 'Habit title is required')
    .max(100, 'Habit title cannot exceed 100 characters'),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
  frequency: z
    .enum(['daily', 'weekly', 'monthly'])
    .default('daily'),
  targetCount: z.number().min(1).default(1),
  unit: z
    .string()
    .max(20, 'Unit cannot exceed 20 characters')
    .default('times'),
  color: colorSchema.optional(),
  reminders: z.array(z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format')).max(5, 'Cannot have more than 5 reminders').optional(),
  isActive: z.boolean().default(true)
})

export const habitEntrySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  value: z.number().min(0),
  note: z.string().max(200, 'Note cannot exceed 200 characters').optional()
})

export const goalCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment cannot exceed 1000 characters'),
  parentId: z.string().optional() // For replies
})

export const goalShareSchema = z.object({
  goalId: z.string().min(1, 'Goal ID is required'),
  shareWith: z.enum(['friends', 'public', 'specific']),
  users: z.array(z.string()).optional(), // For specific sharing
  permissions: z.object({
    canView: z.boolean().default(true),
    canComment: z.boolean().default(false),
    canEdit: z.boolean().default(false)
  }).optional(),
  message: z.string().max(500, 'Message cannot exceed 500 characters').optional()
})

export const goalTemplateSchema = z.object({
  title: z
    .string()
    .min(1, 'Template title is required')
    .max(100, 'Template title cannot exceed 100 characters'),
  description: z
    .string()
    .max(1000, 'Description cannot exceed 1000 characters')
    .optional(),
  category: z
    .enum(['personal', 'professional', 'health', 'education', 'financial', 'relationships', 'hobbies', 'other'])
    .default('personal'),
  difficulty: z
    .enum(['easy', 'moderate', 'challenging', 'expert'])
    .default('moderate'),
  estimatedDuration: z.number().min(1).max(365), // days
  milestones: z.array(milestoneSchema.pick({ title: true, description: true, order: true })).optional(),
  tags: tagsSchema.optional(),
  isPublic: z.boolean().default(false)
})

// Type exports
export type GoalInput = z.infer<typeof goalSchema>
export type MilestoneInput = z.infer<typeof milestoneSchema>
export type GoalProgressInput = z.infer<typeof goalProgressSchema>
export type HabitInput = z.infer<typeof habitSchema>
export type HabitEntryInput = z.infer<typeof habitEntrySchema>
export type GoalCommentInput = z.infer<typeof goalCommentSchema>
export type GoalShareInput = z.infer<typeof goalShareSchema>
export type GoalTemplateInput = z.infer<typeof goalTemplateSchema>