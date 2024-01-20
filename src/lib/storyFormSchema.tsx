'use client';
import * as z from 'zod';

export const storyFormSchema = z.object({
  ageGroup: z.string().min(1),
  topic: z.string().min(1),
});

export type StoryFormSchemaType = z.infer<typeof storyFormSchema>;
