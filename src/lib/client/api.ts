import { Prisma } from '@prisma/client';
import { StoryFormSchemaType } from '../storyFormSchema';

export const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};
export async function generateStory(params: StoryFormSchemaType) {
  return await fetch('/api/stories/generate', {
    method: 'POST',
    body: JSON.stringify(params),
    headers,
  });
}

export async function createStory(params: Prisma.StoryCreateInput) {
  const response = await fetch('/api/stories/create', {
    method: 'POST',
    body: JSON.stringify(params),
    headers,
  });

  const json = await response.json();

  if (!response.ok) throw new Error(response.statusText);

  return json;
}
