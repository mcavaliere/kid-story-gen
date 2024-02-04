'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useCompletion } from 'ai/react';
import { createContext, useContext } from 'react';
import { UseFormReturn, useForm } from 'react-hook-form';
import * as z from 'zod';

import { ImageGenerationResponse, createImage } from '@/app/actions';
import { AGE_GROUPS, STORY_LENGTH_MIDPOINT } from '@/lib/constants';
import { parseCompletion } from '@/lib/parseCompletion';
import { Prisma } from '@prisma/client';
import { useEffect, useState } from 'react';
import { StoryFormSchemaType, storyFormSchema } from '../lib/storyFormSchema';

export type StoryContextType = {
  form?: UseFormReturn<z.infer<typeof storyFormSchema>>;
  imageGenResponse?: ImageGenerationResponse;
  imageIsGenerating: boolean;
  imagePath?: string;
  completion?: string;
  completionJson?: Record<string, unknown | any>;
  storyBody: string[];
  storyTitle: string;
  storyContentIsLoading: boolean;
  onSubmit: (values: StoryFormSchemaType) => Promise<void>;
  themes?: string[];
};

export const defaultStoryContext: StoryContextType = {
  imageIsGenerating: false,
  storyContentIsLoading: false,
  storyBody: [],
  storyTitle: '',
  onSubmit: async (values) => Promise.resolve(void 0),
};

export const StoryContext =
  createContext<StoryContextType>(defaultStoryContext);

export function useStoryContext() {
  return useContext(StoryContext);
}

export function StoryContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [storyGenerationComplete, setStoryGenerationComplete] =
    useState<boolean>(false);
  const [storySaved, setStorySaved] = useState<boolean>(false);

  const {
    completion,
    isLoading: storyContentIsLoading,
    complete,
  } = useCompletion({
    api: '/api/stories/generate',
    onFinish: async () => {
      setStoryGenerationComplete(true);
    },
  });

  const form = useForm<z.infer<typeof storyFormSchema>>({
    resolver: zodResolver(storyFormSchema),
    defaultValues: {
      ageGroup: '', // Set the default value to the first option
      topic: '',
      length: STORY_LENGTH_MIDPOINT,
    },
  });
  const currentAgeGroup = form.watch('ageGroup');
  const themes = AGE_GROUPS.find((ag) => ag.name === currentAgeGroup)?.themes;

  // For image generation
  const [imageGenResponse, setImageGenResponse] = useState<
    ImageGenerationResponse | undefined
  >(undefined);
  const [imageIsGenerating, setImageIsGenerating] = useState<boolean>(false);

  const imagePath = imageGenResponse?.url;

  async function onSubmit(values: StoryFormSchemaType) {
    // Reset this so we can generate a new image.
    setImageGenResponse(undefined);
    await complete(JSON.stringify(form.getValues()));
  }

  // For saving the story when generation is complete.
  const { isPending: isCreatingStory, mutateAsync: mutateCreateStory } =
    useMutation({
      mutationFn: async (data: Prisma.StoryCreateInput) => {
        const response = await fetch('/api/stories/create', {
          method: 'POST',
          body: JSON.stringify(data),
        });

        const json = await response.json();

        if (!response.ok) throw new Error(response.statusText);

        return json;
      },
    });

  // JSONified streaming chat response.
  const completionJson = parseCompletion(completion);
  const storyBody = completionJson?.content?.split(/\n\n/);
  const storyTitle = completionJson?.title;

  // Generate an image for the story title one time, once the title exists.
  useEffect(() => {
    if (
      completionJson?.setting &&
      completionJson?.characterDescriptions &&
      !imageGenResponse &&
      !imageIsGenerating
    ) {
      setImageIsGenerating(true);
      createImage({
        setting: completionJson.setting,
        characterDescriptions: completionJson.characterDescriptions,
      })
        .then((image) => {
          setImageGenResponse(image);
          setImageIsGenerating(false);
        })
        .catch((err) => {
          console.warn(`---------------- error creating image: `, err);
        });
    }
  }, [completionJson, imageGenResponse, imageIsGenerating]);

  useEffect(() => {
    if (
      storyGenerationComplete &&
      !storyContentIsLoading &&
      imageGenResponse &&
      !imageIsGenerating &&
      !isCreatingStory &&
      !storySaved
    ) {
      console.log(`story generation complete, saving story`);
      mutateCreateStory({
        ...completionJson,
        imageUrl: imageGenResponse.url,
      }).then((response) => {
        setStorySaved(true);
      });
    }
  }, [
    storyGenerationComplete,
    storyContentIsLoading,
    imageGenResponse,
    imageIsGenerating,
    isCreatingStory,
    storySaved,
  ]);

  return (
    <StoryContext.Provider
      value={{
        completion,
        completionJson,
        form,
        imagePath,
        imageGenResponse,
        imageIsGenerating,
        storyContentIsLoading,
        storyBody,
        storyTitle,
        onSubmit,
        themes,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
}
