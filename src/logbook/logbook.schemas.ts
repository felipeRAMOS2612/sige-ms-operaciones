import { z } from 'zod';

export const logEntryTypeSchema = z.enum(['VISIT', 'PARCEL']);

export const idSchema = z.coerce.number().int().positive();

export const apartmentIdQuerySchema = z.coerce.number().int().positive().optional();

export const createLogEntrySchema = z.strictObject({
  type: logEntryTypeSchema,
  details: z.string().trim().min(1).max(500),
  apartmentId: z.number().int().positive(),
  recordedBy: z.number().int().positive(),
});

export const updateLogEntrySchema = createLogEntrySchema.partial();

export type LogEntryType = z.infer<typeof logEntryTypeSchema>;
export type CreateLogEntry = z.infer<typeof createLogEntrySchema>;
export type UpdateLogEntry = z.infer<typeof updateLogEntrySchema>;
