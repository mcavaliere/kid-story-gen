import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse, AIStream } from 'ai';
import { replaceTemplateVars } from '@/lib/replaceTemplateVars';

import { prompt as SYSTEM_PROMPT } from '@/prompts/system';
import { prompt as CREATE_STORY_PROMPT } from '@/prompts/create-story';
import { prisma } from '@/lib/server/prismaClientInstance';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI();

// Set the runtime to edge for best performance
export const runtime = 'edge';

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

      // console.log(divider);
    })
    .on('error', (err) => {
      console.log(`---------------- OpenAI ERROR:  `, err);
    });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response, {
    // onStart: () => console.log('Starting stream...', divider),
    // onCompletion: (completion) =>
    //   console.log('Completion: \n', divider, completion, divider),
    // onFinal: (completion) => {
    //   console.log(divider, 'Stream finalized.');
    // },
    // onToken: (token) => {
    //   console.log('Received Token: ', token);
    //   console.log(``);
    // },
  });

  console.log(`---------------- api/stories/create END `);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
