'use server';

import OpenAI from 'openai';

export type ImageGenerationResponse = {
  url: string;
};

export async function createImage(prompt: string): Promise<ImageGenerationResponse> {
  try {
    const openai = new OpenAI();
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
    });

    return { url: response.data[0].url! };
  } catch (err) {
    console.warn(`---------------- error generating image:  `, err);
    throw err;
  }
}
