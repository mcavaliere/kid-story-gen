import { replaceTemplateVars } from '@/lib/replaceTemplateVars';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';

import { prisma } from '@/lib/server/prismaClientInstance';
import { prompt as CREATE_STORY_PROMPT } from '@/prompts/create-story';
import { prompt as SYSTEM_PROMPT } from '@/prompts/system';
import { parse } from 'best-effort-json-parser';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI();

// Set the runtime to edge for best performance
// TODO: prisma doesn't work with the edge runtime, unless you use Accelerate. Re-examine when we
//  are working on performance improvements.
// export const runtime = 'edge';

// const divider = '----------------------------------------------------\n';

export async function POST(req: Request) {
  const input = await req.json();

  const promptParams = JSON.parse(input.prompt);
  const storyPrompt = replaceTemplateVars(CREATE_STORY_PROMPT, promptParams);

  const response = await openai.beta.chat.completions
    .stream({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: storyPrompt },
      ],
      model: 'gpt-3.5-turbo',
      stream: true,
      temperature: 0.3,
    })
    .on('finalContent', (snapshot: string) => {
      const story = parse(snapshot);

      // Save the story to the database.
      prisma.story
        .create({
          data: story,
        })
        .catch((err) => {
          console.warn(`---------------- story create error:  `, err);
        });
    })
    .on('error', (err) => {
      console.log(`---------------- OpenAI ERROR:  `, err);
    });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
