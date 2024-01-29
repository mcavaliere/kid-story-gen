'use server';

import { replaceTemplateVars } from '@/lib/replaceTemplateVars';
import { StoryCompletionJson } from '@/types';

import { prisma } from '@/lib/server/prismaClientInstance';
import * as stabilityai from '@/lib/server/stabilityai';
import { prompt as promptTemplate } from '@/prompts/openai/create-story-image';
import { Prisma, Story } from '@prisma/client';

export type ImageGenerationResponse = {
  url: string;
};

export async function createImage(story: StoryCompletionJson): Promise<any> {
  const prompt = replaceTemplateVars(promptTemplate, story);

  try {
    // const openai = new OpenAI();
    // const response = await openai.images.generate({
    //   model: 'dall-e-3',
    //   prompt,
    //   n: 1,
    //   size: '1024x1024',
    // });

    // return { url: response.data[0].url! };

    const response = await stabilityai.generation(prompt);
    console.log('image response:', { response });
    return {
      url: `data:image/png;base64, ${response.artifacts[0].base64}`,
    };

    return response;
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
