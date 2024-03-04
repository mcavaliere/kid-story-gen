import { replaceTemplateVars } from '@/lib/replaceTemplateVars';
import { prompt as CREATE_STORY_PROMPT } from '@/prompts/openai/create-story';
import { prompt as SYSTEM_PROMPT } from '@/prompts/openai/system';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI();

// Set the runtime to edge for best performance
export const runtime = 'edge';

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
      model: 'gpt-4-0125-preview',
      response_format: { type: 'json_object' },
      stream: true,
      temperature: 0.9,
    })
    .on('error', (err) => {
      console.log(`---------------- OpenAI ERROR:  `, err);
    });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
