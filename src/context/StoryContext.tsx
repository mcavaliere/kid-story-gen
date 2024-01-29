'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useCompletion } from 'ai/react';
import { createContext, useContext } from 'react';
import { UseFormReturn, useForm } from 'react-hook-form';
import * as z from 'zod';

import { ImageGenerationResponse, createImage } from '@/app/actions';
import { AGE_GROUPS } from '@/lib/constants';
import { parseCompletion } from '@/lib/parseCompletion';
import { Prisma } from '@prisma/client';
import { useEffect, useState } from 'react';
import { StoryFormSchemaType, storyFormSchema } from '../lib/storyFormSchema';

export type StoryContextType = {
  form: UseFormReturn<z.infer<typeof storyFormSchema>>;
  imageGenResponse?: ImageGenerationResponse;
  imageIsGenerating: boolean;
  imagePath?: string;
  completion?: string;
  completionJson?: Record<string, unknown | any>;
  storyContentIsLoading?: boolean;
  onSubmit: (values: StoryFormSchemaType) => Promise<void>;
  themes?: string[];
};

export const StoryContext = createContext<StoryContextType | undefined>(
  undefined
);

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
    },
  });
  const currentAgeGroup = form.watch('ageGroup');
  const themes = AGE_GROUPS.find((ag) => ag.name === currentAgeGroup)?.themes;

  // For image generation
  const [imageGenResponse, setImageGenResponse] = useState<
    ImageGenerationResponse | undefined
  >(undefined);
  const [imageIsGenerating, setImageIsGenerating] = useState<boolean>(false);

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

  // Generate an image for the story title one time, once the title exists.
  useEffect(() => {
    // console.log({completionJson});
    if (
      completionJson?.title &&
      completionJson?.synopsis &&
      completionJson?.characters &&
      completionJson?.characterDescriptions &&
      !imageGenResponse &&
      !imageIsGenerating
    ) {
      setImageIsGenerating(true);
      createImage(completionJson)
        .then((image) => {
          console.log(`image response:  `, { image });
          setImageGenResponse(image);
          setImageIsGenerating(false);
        })
        .catch((err) => {
          console.warn(`---------------- error creating image: `, err);
        });
    }
  }, [completionJson, imageGenResponse, imageIsGenerating]);

  const imagePath = imageGenResponse?.url;
  // Static image for testing.
  // const imagePath = "https://oaidalleapiprodscus.blob.core.windows.net/private/org-Ai6FnzlH3437nQyQTuNvsFot/user-bg6ZdeJvNKqLmlYdr5Mn39VJ/img-CU3JL6V6IoX85jGTOln1deGA.png?st=2024-01-26T16%3A17%3A30Z&se=2024-01-26T18%3A17%3A30Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-01-25T21%3A26%3A57Z&ske=2024-01-26T21%3A26%3A57Z&sks=b&skv=2021-08-06&sig=NfkchL8Lnb9%2B/Bxe3ax/gd44vxAevKZYEY7ArLIC2cc%3D&w=640&q=75"

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
        onSubmit,
        themes,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
}
