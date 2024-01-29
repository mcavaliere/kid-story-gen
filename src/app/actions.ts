'use server';

import { replaceTemplateVars } from '@/lib/replaceTemplateVars';
import { StoryCompletionJson } from '@/types';
import OpenAI from 'openai';

import { prisma } from '@/lib/server/prismaClientInstance';
import { prompt as promptTemplate } from '@/prompts/create-story-image';
import { Prisma, Story } from '@prisma/client';

export type ImageGenerationResponse = {
  url: string;
};

export async function createImage(
  story: StoryCompletionJson
): Promise<ImageGenerationResponse> {
  const prompt = replaceTemplateVars(promptTemplate, story);

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
