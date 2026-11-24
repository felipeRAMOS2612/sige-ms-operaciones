import { z } from 'zod';

export const userRoleSchema = z.enum(['ADMIN', 'CONCIERGE', 'RESIDENT']);

export const idSchema = z.coerce.number().int().positive();

export const createUserSchema = z.strictObject({
  rut: z.string().trim().min(8).max(12),
  name: z.string().trim().min(1).max(120),
  email: z.email().max(160),
  role: userRoleSchema,
});

export const updateUserSchema = createUserSchema
  .partial()
  .extend({ active: z.boolean().optional() });

export type UserRole = z.infer<typeof userRoleSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
