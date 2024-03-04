'use server';

import { replaceTemplateVars } from '@/lib/replaceTemplateVars';

import { prisma } from '@/lib/server/prismaClientInstance';
import * as stabilityai from '@/lib/server/stabilityai';
import { prompt as promptTemplate } from '@/prompts/stabilityai/create-story-image';
import { Prisma, Story } from '@prisma/client';
import { OpenAI } from 'openai';

export type ImageGenerationResponse = {
  url: string;
};

export type CreateImageParams = {
  characterDescriptions?: string;
  setting?: string;
};

export type CreateImageResponse = {
  url: string;
};

export async function createImage(
  params: CreateImageParams
): Promise<CreateImageResponse> {
  const prompt = replaceTemplateVars(promptTemplate, params);

  try {
    const response = await stabilityai.generation(prompt);
    return {
      url: `data:image/png;base64, ${response.artifacts[0].base64}`,
    };
  } catch (err) {
    console.warn(`---------------- error generating image:  `, err);
    throw err;
  }
}

export async function createOpenAIImage(prompt: string) {
  const openai = new OpenAI();
  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt,
    n: 1,
    size: '1024x1024',
  });

  return { url: response.data[0].url! };
}

export async function createStory(
  data: Prisma.StoryCreateInput
): Promise<{ storyId: Story['id'] | undefined }> {
  try {
    const story = await prisma.story.create({
      data,
    });

    return { storyId: story?.id || undefined };
  } catch (error: any) {
    throw new Error(`story create error:  `, error.toString());
  }
}

export async function getStories(): Promise<Story[]> {
  return await prisma.story.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function getStory(id: string): Promise<Story | null> {
  return await prisma.story.findUnique({
    where: {
      id,
    },
  });
}
