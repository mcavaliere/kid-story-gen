'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

import { createContext, useContext, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
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
  async function onSubmit(values: StoryFormSchemaType) {
    console.log(`onSubmit: `, values);
    // Reset this so we can generate a new image.
    // setImageGenResponse(undefined);
    dispatch({ type: 'STORY_GENERATION_STARTED' });
    await complete(JSON.stringify(form.getValues()));
  }

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

  // For saving the story when generation is complete.
  const { mutateAsync: mutateCreateStory } = useMutation({
    mutationFn: createStory,
  });

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
  const currentAgeGroup = useWatch({
    control: form.control,
    name: 'ageGroup',
  });

  useEffect(() => {
    if (currentAgeGroup) {
      const themes =
        AGE_GROUPS.find((ag) => ag.name === currentAgeGroup)?.themes || [];

      dispatch({ type: 'SET_THEMES', themes });
    }
  }, [currentAgeGroup]);

  const [state, dispatch] = useEffectReducer(
    storyReducer,
    {
      ...defaultStoryContext,
      form,
      mutateCreateStory,
      storyContentIsLoading,
      onSubmit,
    },
    storyEffects
  );

  useEffect(() => {
    if (completion) {
      dispatch({ type: 'STORY_GENERATION_PROGRESS', completion });
    }
  }, [completion]);

  console.log(`form.errors`, form.formState.errors);

  return (
    <StoryContext.Provider
      value={{
        ...state,
      }}
    >
      <StoryDispatchContext.Provider value={dispatch}>
        {children}
      </StoryDispatchContext.Provider>
    </StoryContext.Provider>
  );
}
