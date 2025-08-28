import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required')
    .toLowerCase(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password cannot exceed 100 characters'),
  remember: z.boolean().optional()
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required')
    .toLowerCase(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password cannot exceed 100 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions'
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required')
    .toLowerCase()
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password cannot exceed 100 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'New password must be at least 8 characters')
    .max(100, 'New password cannot exceed 100 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'New password must contain at least one lowercase letter, one uppercase letter, and one number'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "New password must be different from current password",
  path: ["newPassword"],
});

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required')
    .toLowerCase(),
  bio: z
    .string()
    .max(500, 'Bio cannot exceed 500 characters')
    .optional(),
  website: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  location: z
    .string()
    .max(100, 'Location cannot exceed 100 characters')
    .optional()
});

export const apiKeySchema = z.object({
  name: z
    .string()
    .min(1, 'API key name is required')
    .max(50, 'API key name cannot exceed 50 characters'),
  permissions: z
    .array(z.enum(['read', 'write', 'delete', 'admin', 'analytics', 'billing']))
    .min(1, 'At least one permission is required'),
  expiresAt: z
    .string()
    .datetime()
    .optional()
    .or(z.literal(''))
});

export const inviteUserSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required')
    .toLowerCase(),
  role: z
    .enum(['user', 'admin', 'moderator'])
    .default('user'),
  message: z
    .string()
    .max(500, 'Message cannot exceed 500 characters')
    .optional()
});

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ApiKeyInput = z.infer<typeof apiKeySchema>;
export type InviteUserInput = z.infer<typeof inviteUserSchema>;