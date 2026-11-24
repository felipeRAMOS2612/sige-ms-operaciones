import { z } from 'zod';

export const idSchema = z.coerce.number().int().positive();

export const createAnnouncementSchema = z.strictObject({
  title: z.string().trim().min(1).max(150),
  body: z.string().trim().min(1).max(2000),
});

export const updateAnnouncementSchema = createAnnouncementSchema.partial();

export type CreateAnnouncement = z.infer<typeof createAnnouncementSchema>;
export type UpdateAnnouncement = z.infer<typeof updateAnnouncementSchema>;
