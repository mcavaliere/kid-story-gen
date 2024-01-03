'use server';

import { type StoryFormSchemaType } from '@/lib/storyFormSchema';
import OpenAI from 'openai';
import fs from 'fs';

const openai = new OpenAI();

const SYSTEM_PROMPT = fs.readFileSync(
  `${process.cwd()}/src/prompts/system.md`,
  'utf8'
);
const CREATE_STORY_PROMPT = fs.readFileSync(
  `${process.cwd()}/src/prompts/create-story.md`,
  'utf8'
);

export async function submitGeneratorForm(values: StoryFormSchemaType) {
  console.log(`---------------- submitGeneratorForm action `, { values });
  console.log(`---------------- SYSTEM_PROMPT `, SYSTEM_PROMPT);
  console.log(`---------------- CREATE_STORY_PROMPT `, CREATE_STORY_PROMPT);

  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: CREATE_STORY_PROMPT },
    ],
    model: 'gpt-3.5-turbo',
  });

  console.log(completion.choices[0]);

  return { success: true, values, completion };
}
