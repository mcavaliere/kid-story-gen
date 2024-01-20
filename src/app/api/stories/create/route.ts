import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse, AIStream } from 'ai';
import { replaceTemplateVars } from '@/lib/replaceTemplateVars';

import { prompt as SYSTEM_PROMPT } from '@/prompts/system';
import { prompt as CREATE_STORY_PROMPT } from '@/prompts/create-story';
import { prisma } from '@/lib/server/prismaClientInstance';
import { parse } from 'best-effort-json-parser';
import { generation, GenerationResponse } from '@/lib/server/stabilityai';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI();

// Set the runtime to edge for best performance
// TODO: prisma doesn't work with the edge runtime, unless you use Accelerate. Re-examine when we
//  are working on performance improvements.
// export const runtime = 'edge';

const divider = '----------------------------------------------------\n';

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
    })
    .on('chunk', (_chunk, snapshot) => {
      const currentCompletion = snapshot.choices[0].message.content;
      // console.log(divider);
      // console.log(`snapshot: `, currentCompletion);

      // Detect when two paragraphs have been generated.
      if (currentCompletion?.match(/.+(\\n\\n).+(\\n\\n)/)) {
        // TODO: This is where we'll kick off image generation.
        // console.log(`LONG ENOUGH`);
      }
    })
    .on('finalContent', (snapshot: string) => {
      const story = JSON.parse(snapshot);
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

  console.log(`---------------- api/stories/create END `);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
