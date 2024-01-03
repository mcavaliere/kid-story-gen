'use client';
import * as z from 'zod';

export const storyFormSchema = z.object({
  ageGroup: z.string(),
  topic: z.string(),
});

export type StoryFormSchemaType = z.infer<typeof storyFormSchema>;
