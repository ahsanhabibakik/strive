import { z } from 'zod'

// Project validation schemas
export const createProjectSchema = z.object({
  name: z.string()
    .min(1, 'Project name is required')
    .max(200, 'Project name cannot exceed 200 characters')
    .trim(),
  
  description: z.string()
    .max(2000, 'Description cannot exceed 2000 characters')
    .trim()
    .optional(),
  
  status: z.enum(['planning', 'inProgress', 'onHold', 'completed', 'cancelled'])
    .default('planning'),
  
  priority: z.enum(['low', 'medium', 'high', 'urgent'])
    .default('medium'),
  
  category: z.string()
    .min(1, 'Category is required')
    .trim(),
  
  deadline: z.string()
    .datetime()
    .optional()
    .or(z.date().optional()),
  
  startDate: z.string()
    .datetime()
    .optional()
    .or(z.date().optional()),
  
  members: z.array(z.string())
    .optional()
    .default([]),
  
  tags: z.array(z.string().max(50, 'Tag cannot exceed 50 characters'))
    .optional()
    .default([]),
  
  budget: z.object({
    allocated: z.number().min(0, 'Budget cannot be negative'),
    currency: z.string().length(3, 'Currency must be 3 characters').default('USD')
  }).optional(),
  
  notes: z.string()
    .max(5000, 'Notes cannot exceed 5000 characters')
    .trim()
    .optional()
})

export const updateProjectSchema = createProjectSchema.partial().extend({
  progress: z.number()
    .min(0, 'Progress cannot be negative')
    .max(100, 'Progress cannot exceed 100')
    .optional()
})

export const projectQuerySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().min(1)).default('1'),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).default('10'),
  status: z.enum(['planning', 'inProgress', 'onHold', 'completed', 'cancelled']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  category: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['name', 'createdAt', 'deadline', 'priority', 'progress']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  memberId: z.string().optional(),
  archived: z.string().transform(Boolean).optional()
})

// Task validation schemas
export const createTaskSchema = z.object({
  title: z.string()
    .min(1, 'Task title is required')
    .max(200, 'Title cannot exceed 200 characters')
    .trim(),
  
  description: z.string()
    .max(2000, 'Description cannot exceed 2000 characters')
    .trim()
    .optional(),
  
  status: z.enum(['todo', 'inProgress', 'review', 'done', 'blocked'])
    .default('todo'),
  
  priority: z.enum(['low', 'medium', 'high', 'urgent'])
    .default('medium'),
  
  project: z.string().optional(),
  
  assignee: z.string().optional(),
  
  dueDate: z.string()
    .datetime()
    .optional()
    .or(z.date().optional()),
  
  estimatedHours: z.number()
    .min(0, 'Estimated hours cannot be negative')
    .optional(),
  
  labels: z.array(z.string().max(30, 'Label cannot exceed 30 characters'))
    .optional()
    .default([]),
  
  dependencies: z.array(z.string())
    .optional()
    .default([]),
  
  parent: z.string().optional()
})

export const updateTaskSchema = createTaskSchema.partial().extend({
  actualHours: z.number()
    .min(0, 'Actual hours cannot be negative')
    .optional(),
  
  position: z.number().optional()
})

export const taskQuerySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().min(1)).default('1'),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).default('10'),
  status: z.enum(['todo', 'inProgress', 'review', 'done', 'blocked']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  project: z.string().optional(),
  assignee: z.string().optional(),
  reporter: z.string().optional(),
  search: z.string().optional(),
  labels: z.string().optional(), // Comma-separated labels
  overdue: z.string().transform(Boolean).optional(),
  sortBy: z.enum(['title', 'createdAt', 'dueDate', 'priority', 'status']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  archived: z.string().transform(Boolean).optional()
})

export const logTimeSchema = z.object({
  hours: z.number()
    .min(0.1, 'Minimum 0.1 hours required')
    .max(24, 'Cannot log more than 24 hours at once'),
  
  description: z.string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
  
  date: z.string()
    .datetime()
    .optional()
    .or(z.date().optional())
})

// Bulk operations
export const bulkUpdateTasksSchema = z.object({
  taskIds: z.array(z.string()).min(1, 'At least one task ID required'),
  updates: z.object({
    status: z.enum(['todo', 'inProgress', 'review', 'done', 'blocked']).optional(),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
    assignee: z.string().optional(),
    project: z.string().optional(),
    labels: z.array(z.string()).optional()
  })
})

export const bulkUpdateProjectsSchema = z.object({
  projectIds: z.array(z.string()).min(1, 'At least one project ID required'),
  updates: z.object({
    status: z.enum(['planning', 'inProgress', 'onHold', 'completed', 'cancelled']).optional(),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
    category: z.string().optional(),
    archived: z.boolean().optional()
  })
})

// Export types
export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
export type ProjectQuery = z.infer<typeof projectQuerySchema>

export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
export type TaskQuery = z.infer<typeof taskQuerySchema>

export type LogTimeInput = z.infer<typeof logTimeSchema>
export type BulkUpdateTasksInput = z.infer<typeof bulkUpdateTasksSchema>
export type BulkUpdateProjectsInput = z.infer<typeof bulkUpdateProjectsSchema>