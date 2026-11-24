import { z } from 'zod';

export const incidentStatusSchema = z.enum(['OPEN', 'IN_PROGRESS', 'CLOSED']);

export const idSchema = z.coerce.number().int().positive();

export const createIncidentSchema = z.strictObject({
  title: z.string().trim().min(1).max(150),
  description: z.string().trim().min(1).max(1000),
  apartmentId: z.number().int().positive(),
});

export const updateIncidentSchema = createIncidentSchema
  .partial()
  .extend({ status: incidentStatusSchema.optional() });

export type IncidentStatus = z.infer<typeof incidentStatusSchema>;
export type CreateIncident = z.infer<typeof createIncidentSchema>;
export type UpdateIncident = z.infer<typeof updateIncidentSchema>;
