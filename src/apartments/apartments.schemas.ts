import { z } from 'zod';

export const idSchema = z.coerce.number().int().positive();

export const createApartmentSchema = z.strictObject({
  number: z.string().trim().min(1).max(10),
  floor: z.number().int().min(-5).max(200),
  residentId: z.number().int().positive().nullable().optional(),
});

export const updateApartmentSchema = createApartmentSchema.partial();

export type CreateApartment = z.infer<typeof createApartmentSchema>;
export type UpdateApartment = z.infer<typeof updateApartmentSchema>;
