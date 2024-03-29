import { negativePrompt } from '@/prompts/stabilityai/create-story-image';

if (!process.env.STABILITY_API_KEY) {
  throw new Error(`STABILITY_API_KEY is required`);
}

const API_KEY = process.env.STABILITY_API_KEY;
const BASE_URL = 'https://api.stability.ai';

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

export interface ImageGenerationResponse {
  artifacts: Array<{
    base64: string;
    seed: number;
    finishReason: string;
  }>;
}

export async function generation(
  prompt: string
): Promise<ImageGenerationResponse> {
  const engineId = 'stable-diffusion-xl-1024-v1-0';
  const url = `${BASE_URL}/v1/generation/${engineId}/text-to-image`;

  const prompts = [
    {
      text: prompt,
      weight: 1,
    },
    // Negative prompt, to prevent the model from generating text.
    {
      text: negativePrompt,
      weight: -1,
    },
  ];
  console.log('prompts for stability: ', { prompts });

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      text_prompts: prompts,
      cfg_scale: 20,
      height: 1024,
      width: 1024,
      steps: 20,
      samples: 1,
    }),
  });

  if (!response.ok) {
    throw new Error("Couldn't generate image.", {
      cause: response.statusText,
    });
  }

  return await response.json();
}
