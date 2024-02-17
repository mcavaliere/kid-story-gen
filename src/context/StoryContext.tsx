'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

import { createContext, useContext } from 'react';
import { UseFormReturn, useForm } from 'react-hook-form';

import * as z from 'zod';

import { ImageGenerationResponse } from '@/app/actions';
import { AGE_GROUPS } from '@/lib/constants';
import { useStoryGeneration } from '@/lib/hooks/useStoryGeneration';

import { useStoryImageGeneration } from '@/lib/hooks/useStoryImageGeneration';
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
  const [storySaved, setStorySaved] = useState<boolean>(false);

  const {
    complete,
    completion,
    completionJson,
    storyTitle,
    storyBody,
    storyContentIsLoading,
    storyGenerationComplete,
  } = useStoryGeneration();

  const form = useForm<z.infer<typeof storyFormSchema>>({
    resolver: zodResolver(storyFormSchema),
    defaultValues: {
      ageGroup: '', // Set the default value to the first option
      topic: '',
      // Hardcoded for now. We'll have to try other models and techniques to see how well we can control the length.
      length: 500,
    },
  });

  // Derive list of topics from the selected age group.
  const currentAgeGroup = form.watch('ageGroup');
  const themes = AGE_GROUPS.find((ag) => ag.name === currentAgeGroup)?.themes;

  const { imageGenResponse, imageIsGenerating, setImageGenResponse } =
    useStoryImageGeneration({
      completionJson,
    });

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
      }).then(() => {
        setStorySaved(true);
      });
    }
  }, [
    completionJson,
    imageGenResponse,
    imageIsGenerating,
    isCreatingStory,
    mutateCreateStory,
    storyContentIsLoading,
    storyGenerationComplete,
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
