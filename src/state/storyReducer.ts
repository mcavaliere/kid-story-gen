import { parseCompletion } from '@/lib/parseCompletion';
import { ImageGenerationResponse } from '@/lib/server/stabilityai';
import { StoryFormSchemaType, storyFormSchema } from '@/lib/storyFormSchema';
import { UseFormReturn } from 'react-hook-form';
import * as z from 'zod';
export type StoryContextType = {
  form?: UseFormReturn<z.infer<typeof storyFormSchema>>;
  imageGenResponse?: ImageGenerationResponse;
  imageIsGenerating: boolean;
  imagePath?: string;
  completion?: string;
  completionJson?: Record<string, unknown | any>;
  previousCompletion?: string;
  storyBody: string[];
  storyTitle: string;
  storyContentIsLoading: boolean;
  storyGenerationComplete: boolean;
  onSubmit: (values: StoryFormSchemaType) => Promise<void>;
  themes?: string[];
};

export const defaultStoryContext: StoryContextType = {
  completion: undefined,
  completionJson: undefined,
  previousCompletion: undefined,
  imageIsGenerating: false,
  storyContentIsLoading: false,
  storyGenerationComplete: false,
  storyBody: [],
  storyTitle: '',
  onSubmit: async (values) => Promise.resolve(void 0),
};

export type StoryAction =
  // User interactions
  | { type: 'SUBMIT_CLICKED' }

  // State changes
  | { type: 'STORY_GENERATION_COMPLETE'; completion: string }
  | { type: 'STORY_GENERATION_STARTED' }
  | { type: 'STORY_GENERATION_PROGRESS'; completion: string }
  | { type: 'IMAGE_GENERATION_STARTED' }
  | { type: 'IMAGE_GENERATION_COMPLETE' }
  | { type: 'IMAGE_GENERATION_ERROR' };

export const initialState = defaultStoryContext;

export type StoryState = StoryContextType;

export function storyReducer(
  state: StoryState = initialState,
  action: StoryAction
): StoryState {
  console.log(`reducer: ${action.type}`);
  switch (action.type) {
    case 'STORY_GENERATION_STARTED':
      return {
        ...state,
        storyContentIsLoading: true,
        storyGenerationComplete: false,
      };
    case 'STORY_GENERATION_PROGRESS': {
      const completionJson = parseCompletion({
        completion: action.completion,
        fallback: state.previousCompletion
          ? parseCompletion({ completion: state.previousCompletion })
          : undefined,
      });
      const storyBody = completionJson?.content?.split(/\n\n/) || [];
      const storyTitle = completionJson?.title || '';
      return {
        ...state,
        completion: action.completion,
        completionJson,
        storyBody,
        storyTitle,
      };
    }
    case 'STORY_GENERATION_COMPLETE': {
      // JSONified streaming chat response.
      // We track the last completion value as a fallback. If any error throws midway through streaming,
      //  we can use the last completion value to display the story briefly and prevent flicker from the story going blank.
      const completionJson = parseCompletion({
        completion: action.completion,
        fallback: state.previousCompletion
          ? parseCompletion({ completion: state.previousCompletion })
          : undefined,
      });
      const storyBody = completionJson?.content?.split(/\n\n/) || [];
      const storyTitle = completionJson?.title || '';
      return {
        ...state,
        previousCompletion: state.completion,
        completion: action.completion,
        completionJson,
        storyContentIsLoading: false,
        storyGenerationComplete: true,
        storyBody,
        storyTitle,
      };
    }
    default:
      return state;
  }
}
