import OpenAI from 'openai';
import fs from 'fs';
import { OpenAIStream, StreamingTextResponse } from 'ai';

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
  // const { prompt } = await req.json();

  const response = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: CREATE_STORY_PROMPT },
    ],
    model: 'gpt-3.5-turbo',
    stream: true,
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
