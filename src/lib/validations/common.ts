import { z } from 'zod';

// Common validation schemas that can be reused across the application

export const idSchema = z.string().min(1, 'ID is required');

export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .min(1, 'Email is required')
  .toLowerCase();

export const urlSchema = z
  .string()
  .url('Please enter a valid URL')
  .optional()
  .or(z.literal(''));

export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number')
  .optional()
  .or(z.literal(''));

export const slugSchema = z
  .string()
  .min(1, 'Slug is required')
  .max(100, 'Slug cannot exceed 100 characters')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug can only contain lowercase letters, numbers, and hyphens');

export const tagSchema = z
  .string()
  .min(1, 'Tag cannot be empty')
  .max(50, 'Tag cannot exceed 50 characters')
  .regex(/^[a-zA-Z0-9\s-_]+$/, 'Tag can only contain letters, numbers, spaces, hyphens, and underscores');

export const tagsSchema = z
  .array(tagSchema)
  .max(10, 'Cannot have more than 10 tags');

export const dateSchema = z
  .string()
  .datetime('Please enter a valid date')
  .or(z.date());

export const colorSchema = z
  .string()
  .regex(/^#[0-9A-F]{6}$/i, 'Please enter a valid hex color (e.g., #FF0000)');

export const currencySchema = z
  .number()
  .min(0, 'Amount must be positive')
  .multipleOf(0.01, 'Amount must have at most 2 decimal places');

export const percentageSchema = z
  .number()
  .min(0, 'Percentage must be positive')
  .max(100, 'Percentage cannot exceed 100');

export const coordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180)
});

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc')
});

export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  filters: z.record(z.string()).optional(),
  ...paginationSchema.shape
});

export const fileUploadSchema = z.object({
  fileName: z.string().min(1, 'File name is required'),
  fileSize: z.number().min(1, 'File size must be greater than 0'),
  fileType: z.string().min(1, 'File type is required'),
  fileUrl: z.string().url('Invalid file URL').optional()
});

export const metadataSchema = z.record(
  z.string(),
  z.union([z.string(), z.number(), z.boolean(), z.null()])
);

export const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'ZIP code is required'),
  country: z.string().min(1, 'Country is required')
});

export const socialLinksSchema = z.object({
  website: urlSchema,
  twitter: z.string().regex(/^@?[a-zA-Z0-9_]{1,15}$/, 'Invalid Twitter handle').optional(),
  linkedin: urlSchema,
  github: z.string().regex(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i, 'Invalid GitHub username').optional(),
  facebook: urlSchema,
  instagram: z.string().regex(/^[a-zA-Z0-9._]{1,30}$/, 'Invalid Instagram handle').optional()
});

export const preferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  language: z.string().min(2).max(5).default('en'),
  timezone: z.string().default('UTC'),
  dateFormat: z.enum(['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD']).default('MM/DD/YYYY'),
  timeFormat: z.enum(['12h', '24h']).default('12h'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(true),
    marketing: z.boolean().default(false),
    updates: z.boolean().default(true),
    security: z.boolean().default(true)
  })
});

// Webhook validation
export const webhookSchema = z.object({
  url: z.string().url('Please enter a valid webhook URL'),
  events: z.array(z.string()).min(1, 'At least one event must be selected'),
  secret: z.string().min(8, 'Webhook secret must be at least 8 characters').optional(),
  isActive: z.boolean().default(true)
});

// API response schemas
export const successResponseSchema = z.object({
  success: z.literal(true),
  data: z.any(),
  message: z.string().optional(),
  meta: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number()
  }).optional()
});

export const errorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  message: z.string().optional(),
  details: z.any().optional()
});

// Type exports
export type IdInput = z.infer<typeof idSchema>;
export type EmailInput = z.infer<typeof emailSchema>;
export type UrlInput = z.infer<typeof urlSchema>;
export type PhoneInput = z.infer<typeof phoneSchema>;
export type SlugInput = z.infer<typeof slugSchema>;
export type TagInput = z.infer<typeof tagSchema>;
export type TagsInput = z.infer<typeof tagsSchema>;
export type DateInput = z.infer<typeof dateSchema>;
export type ColorInput = z.infer<typeof colorSchema>;
export type CurrencyInput = z.infer<typeof currencySchema>;
export type PercentageInput = z.infer<typeof percentageSchema>;
export type CoordinatesInput = z.infer<typeof coordinatesSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type FileUploadInput = z.infer<typeof fileUploadSchema>;
export type MetadataInput = z.infer<typeof metadataSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type SocialLinksInput = z.infer<typeof socialLinksSchema>;
export type PreferencesInput = z.infer<typeof preferencesSchema>;
export type WebhookInput = z.infer<typeof webhookSchema>;
export type SuccessResponse = z.infer<typeof successResponseSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;