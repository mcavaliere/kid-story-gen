'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

import { createContext, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useEffectReducer } from 'use-effect-reducer';

import * as z from 'zod';

import { AGE_GROUPS } from '@/lib/constants';

import {
  StoryAction,
  StoryContextType,
  defaultStoryContext,
  storyReducer,
} from '@/context/storyReducer';
import { createStory } from '@/lib/client/api';
import { useCompletion } from 'ai/react';
import { useState } from 'react';
import { StoryFormSchemaType, storyFormSchema } from '../lib/storyFormSchema';
import { storyEffects } from './storyEffects';

export const StoryContext =
  createContext<StoryContextType>(defaultStoryContext);

export const StoryDispatchContext = createContext<
  React.Dispatch<StoryAction> | undefined
>(undefined);

export function useStoryContext() {
  return useContext(StoryContext);
}

export function useStoryDispatch() {
  const dispatch = useContext(StoryDispatchContext);
  if (!dispatch) {
    console.warn(`---------------- dispatch not defined.  `);
    return;
  }
  return dispatch;
}

export function StoryContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useEffectReducer(
    storyReducer,
    defaultStoryContext,
    storyEffects
  );

  const [storySaved, setStorySaved] = useState<boolean>(false);

  const {
    completion,
    isLoading: storyContentIsLoading,
    complete,
  } = useCompletion({
    api: '/api/stories/generate',
    onFinish: async (_prompt, completion) => {
      dispatch({ type: 'STORY_GENERATION_COMPLETE', completion });
    },
  });

  useEffect(() => {
    if (completion) {
      dispatch({ type: 'STORY_GENERATION_PROGRESS', completion });
    }
  }, [completion]);

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

  async function onSubmit(values: StoryFormSchemaType) {
    // Reset this so we can generate a new image.
    // setImageGenResponse(undefined);
    dispatch({ type: 'STORY_GENERATION_STARTED' });
    await complete(JSON.stringify(form.getValues()));
  }

  // For saving the story when generation is complete.
  const { isPending: isCreatingStory, mutateAsync: mutateCreateStory } =
    useMutation({
      mutationFn: createStory,
    });

  // useEffect(() => {
  //   if (
  //     storyGenerationComplete &&
  //     !storyContentIsLoading &&
  //     imageGenResponse &&
  //     !imageIsGenerating &&
  //     !isCreatingStory &&
  //     !storySaved
  //   ) {
  //     console.log(`story generation complete, saving story`);
  //     mutateCreateStory({
  //       ...completionJson,
  //       imageUrl: imageGenResponse.url,
  //     }).then(() => {
  //       setStorySaved(true);
  //     });
  //   }
  // }, [
  //   completionJson,
  //   imageGenResponse,
  //   imageIsGenerating,
  //   isCreatingStory,
  //   mutateCreateStory,
  //   storyContentIsLoading,
  //   storyGenerationComplete,
  //   storySaved,
  // ]);

  return (
    <StoryContext.Provider
      value={{
        ...state,
        // completion,
        // completionJson,
        form,
        // imagePath,
        // imageGenResponse,
        // imageIsGenerating,
        storyContentIsLoading,
        // storyBody,
        // storyTitle,
        onSubmit,
        themes,
      }}
    >
      <StoryDispatchContext.Provider value={dispatch}>
        {children}
      </StoryDispatchContext.Provider>
    </StoryContext.Provider>
  );
}
