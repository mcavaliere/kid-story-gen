import { StoryFormSchemaType } from '../storyFormSchema';

export const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};
export async function generateStory(params: StoryFormSchemaType) {
  return await fetch('/api/stories/create', {
    method: 'POST',
    body: JSON.stringify(params),
    headers,
  });
}
