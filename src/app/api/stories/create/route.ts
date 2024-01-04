import OpenAI from 'openai';
import fs from 'fs';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { replaceTemplateVars } from '@/lib/replaceTemplateVars';

const SYSTEM_PROMPT = fs.readFileSync(
  `${process.cwd()}/src/prompts/system.md`,
  'utf8'
);
const CREATE_STORY_PROMPT = fs.readFileSync(
  `${process.cwd()}/src/prompts/create-story.md`,
  'utf8'
);

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI();

// Set the runtime to edge for best performance
// export const runtime = 'edge';

export async function POST(req: Request) {
  const input = await req.json();

  const promptParams = JSON.parse(input.prompt);
  const storyPrompt = replaceTemplateVars(CREATE_STORY_PROMPT, promptParams);

  console.log(`---------------- promptParams: `, promptParams);
  console.log(`---------------- storyPrompt: `, storyPrompt);

  const response = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: storyPrompt },
    ],
    model: 'gpt-3.5-turbo',
    stream: true,
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
