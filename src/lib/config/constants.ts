// Application Constants

// General App Constants
export const APP_NAME = 'Strive'
export const APP_DESCRIPTION = 'Achieve Your Goals'
export const APP_VERSION = '1.0.0'

// User Roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
} as const

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

// Goal Categories
export const GOAL_CATEGORIES = {
  PERSONAL: 'personal',
  PROFESSIONAL: 'professional',
  HEALTH: 'health',
  EDUCATION: 'education',
  FINANCIAL: 'financial',
  RELATIONSHIPS: 'relationships',
  HOBBIES: 'hobbies',
  OTHER: 'other',
} as const

export type GoalCategory = (typeof GOAL_CATEGORIES)[keyof typeof GOAL_CATEGORIES]

// Goal Priorities
export const GOAL_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const

export type GoalPriority = (typeof GOAL_PRIORITIES)[keyof typeof GOAL_PRIORITIES]

// Goal Statuses
export const GOAL_STATUSES = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const

export type GoalStatus = (typeof GOAL_STATUSES)[keyof typeof GOAL_STATUSES]

// Visibility Levels
export const VISIBILITY_LEVELS = {
  PRIVATE: 'private',
  FRIENDS: 'friends',
  PUBLIC: 'public',
} as const

export type VisibilityLevel = (typeof VISIBILITY_LEVELS)[keyof typeof VISIBILITY_LEVELS]

// Theme Options
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const

export type Theme = (typeof THEMES)[keyof typeof THEMES]

// Language Options
export const LANGUAGES = {
  EN: 'en',
  ES: 'es',
  FR: 'fr',
  DE: 'de',
  IT: 'it',
  PT: 'pt',
  JA: 'ja',
  KO: 'ko',
  ZH: 'zh',
} as const

export type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES]

// Date Formats
export const DATE_FORMATS = {
  US: 'MM/DD/YYYY',
  EU: 'DD/MM/YYYY',
  ISO: 'YYYY-MM-DD',
} as const

export type DateFormat = (typeof DATE_FORMATS)[keyof typeof DATE_FORMATS]

// Time Formats
export const TIME_FORMATS = {
  TWELVE_HOUR: '12h',
  TWENTY_FOUR_HOUR: '24h',
} as const

export type TimeFormat = (typeof TIME_FORMATS)[keyof typeof TIME_FORMATS]

// File Upload Constants
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: {
    IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    DOCUMENTS: ['application/pdf', 'text/plain', 'application/msword'],
  },
  MAX_FILES: 5,
} as const

// API Constants
export const API_ROUTES = {
  AUTH: {
    SIGN_IN: '/auth/signin',
    SIGN_UP: '/auth/signup',
    SIGN_OUT: '/auth/signout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
    PREFERENCES: '/users/preferences',
    AVATAR: '/users/avatar',
  },
  GOALS: {
    BASE: '/goals',
    BY_ID: (id: string) => `/goals/${id}`,
    MILESTONES: (id: string) => `/goals/${id}/milestones`,
    PROGRESS: (id: string) => `/goals/${id}/progress`,
    COMMENTS: (id: string) => `/goals/${id}/comments`,
    SHARE: (id: string) => `/goals/${id}/share`,
  },
  HABITS: {
    BASE: '/habits',
    BY_ID: (id: string) => `/habits/${id}`,
    ENTRIES: (id: string) => `/habits/${id}/entries`,
  },
  ANALYTICS: {
    BASE: '/analytics',
    GOALS: '/analytics/goals',
    HABITS: '/analytics/habits',
    PROGRESS: '/analytics/progress',
  },
} as const

// Pagination Constants
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1,
} as const

// Cache Keys
export const CACHE_KEYS = {
  USER_PROFILE: (userId: string) => `user:profile:${userId}`,
  USER_GOALS: (userId: string) => `user:goals:${userId}`,
  GOAL_DETAILS: (goalId: string) => `goal:${goalId}`,
  HABIT_ENTRIES: (habitId: string, date: string) => `habit:${habitId}:${date}`,
  ANALYTICS: (userId: string, type: string) => `analytics:${userId}:${type}`,
} as const

// Cache TTL (Time To Live) in seconds
export const CACHE_TTL = {
  SHORT: 5 * 60, // 5 minutes
  MEDIUM: 30 * 60, // 30 minutes
  LONG: 24 * 60 * 60, // 24 hours
  WEEK: 7 * 24 * 60 * 60, // 1 week
} as const

// Rate Limiting
export const RATE_LIMITS = {
  AUTH: {
    MAX_ATTEMPTS: 5,
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  },
  API: {
    MAX_REQUESTS: 100,
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  },
  UPLOAD: {
    MAX_REQUESTS: 10,
    WINDOW_MS: 60 * 1000, // 1 minute
  },
} as const

// Validation Constants
export const VALIDATION = {
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
  },
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 30,
    REGEX: /^[a-zA-Z0-9_-]+$/,
  },
  GOAL_TITLE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100,
  },
  GOAL_DESCRIPTION: {
    MAX_LENGTH: 1000,
  },
  BIO: {
    MAX_LENGTH: 500,
  },
  COMMENT: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 1000,
  },
} as const

// Notification Types
export const NOTIFICATION_TYPES = {
  GOAL_REMINDER: 'goal_reminder',
  MILESTONE_ACHIEVED: 'milestone_achieved',
  GOAL_COMPLETED: 'goal_completed',
  FRIEND_REQUEST: 'friend_request',
  GOAL_SHARED: 'goal_shared',
  COMMENT_ADDED: 'comment_added',
  HABIT_STREAK: 'habit_streak',
} as const

export type NotificationType = (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES]

// Email Templates
export const EMAIL_TEMPLATES = {
  WELCOME: 'welcome',
  VERIFICATION: 'verification',
  PASSWORD_RESET: 'password_reset',
  GOAL_REMINDER: 'goal_reminder',
  WEEKLY_SUMMARY: 'weekly_summary',
  ACHIEVEMENT: 'achievement',
} as const

// Social Platforms
export const SOCIAL_PLATFORMS = {
  TWITTER: 'twitter',
  FACEBOOK: 'facebook',
  LINKEDIN: 'linkedin',
  INSTAGRAM: 'instagram',
  REDDIT: 'reddit',
} as const

// Color Palette
export const COLORS = {
  GOAL_CATEGORIES: {
    [GOAL_CATEGORIES.PERSONAL]: '#8B5CF6',
    [GOAL_CATEGORIES.PROFESSIONAL]: '#3B82F6',
    [GOAL_CATEGORIES.HEALTH]: '#10B981',
    [GOAL_CATEGORIES.EDUCATION]: '#F59E0B',
    [GOAL_CATEGORIES.FINANCIAL]: '#059669',
    [GOAL_CATEGORIES.RELATIONSHIPS]: '#EC4899',
    [GOAL_CATEGORIES.HOBBIES]: '#F97316',
    [GOAL_CATEGORIES.OTHER]: '#6B7280',
  },
  PRIORITIES: {
    [GOAL_PRIORITIES.LOW]: '#6B7280',
    [GOAL_PRIORITIES.MEDIUM]: '#F59E0B',
    [GOAL_PRIORITIES.HIGH]: '#EF4444',
    [GOAL_PRIORITIES.CRITICAL]: '#DC2626',
  },
} as const

// Regular Expressions
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/.+/,
  PHONE: /^\+?[1-9]\d{1,14}$/,
  HEX_COLOR: /^#[0-9A-F]{6}$/i,
  USERNAME: /^[a-zA-Z0-9_-]{3,30}$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  TIME_24H: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
} as const

// Default Values
export const DEFAULTS = {
  THEME: THEMES.SYSTEM,
  LANGUAGE: LANGUAGES.EN,
  DATE_FORMAT: DATE_FORMATS.US,
  TIME_FORMAT: TIME_FORMATS.TWELVE_HOUR,
  GOAL_CATEGORY: GOAL_CATEGORIES.PERSONAL,
  GOAL_PRIORITY: GOAL_PRIORITIES.MEDIUM,
  VISIBILITY: VISIBILITY_LEVELS.PRIVATE,
  PAGE_SIZE: PAGINATION.DEFAULT_PAGE_SIZE,
} as const