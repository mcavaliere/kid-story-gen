'use client';

import * as z from 'zod';

export const storyFormSchema = z.object({
  ageGroup: z.string().min(1, { message: 'required' }),
  topic: z.string().min(1, { message: 'required' }),
  length: z.number().min(1, { message: 'required' }),
});

export type StoryFormSchemaType = z.infer<typeof storyFormSchema>;
