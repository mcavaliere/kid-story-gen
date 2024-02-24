import { ImageGenerationResponse } from '@/lib/server/stabilityai';
import { StoryFormSchemaType, storyFormSchema } from '@/lib/storyFormSchema';
import { useReducer } from 'react';
import { UseFormReturn } from 'react-hook-form';
import * as z from 'zod';
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

export type StoryAction =
  // User interactions
  | { type: 'SUBMIT_CLICKED' }

  // State changes
  | { type: 'STORY_GENERATION_COMPLETE' }
  | { type: 'STORY_GENERATION_STARTED' }
  | { type: 'STORY_GENERATION_CHUNK' }
  | { type: 'IMAGE_GENERATION_STARTED' }
  | { type: 'IMAGE_GENERATION_COMPLETE' }
  | { type: 'IMAGE_GENERATION_ERROR' };

export const initialState = defaultStoryContext;

export type StoryState = StoryContextType;

export function storyReducer(
  state: StoryState = initialState,
  action: StoryAction
): StoryState {
  switch (action.type) {
    // Add your reducer cases here
    default:
      return state;
  }
}

export function useStoryReducer() {
  return useReducer(storyReducer, initialState);
}
