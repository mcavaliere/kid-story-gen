'use server';

import { StoryCompletionJson } from '@/types';
import OpenAI from 'openai';
import { replaceTemplateVars } from '@/lib/replaceTemplateVars';

import { prompt as promptTemplate } from '@/prompts/create-story-image';

export type ImageGenerationResponse = {
  url: string;
};


export async function createImage(story: StoryCompletionJson): Promise<ImageGenerationResponse> {
  console.log(`---------------- createImage `);
  const prompt = replaceTemplateVars(promptTemplate, story);

  console.log(`---------------- image creation prompt:  `, {prompt});
  try {
    const openai = new OpenAI();
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
    });

    console.log(`---------------- image creation response:  `, {response});

    return { url: response.data[0].url! };
  } catch (err) {
    console.warn(`---------------- error generating image:  `, err);
    throw err;
  }
}
