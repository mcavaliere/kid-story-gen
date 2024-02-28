import { CreateImageResponse } from '@/app/actions';
import { parseCompletion } from '@/lib/parseCompletion';
import { ImageGenerationResponse } from '@/lib/server/stabilityai';
import { StoryFormSchemaType, storyFormSchema } from '@/lib/storyFormSchema';
import { UseFormReturn } from 'react-hook-form';
import { EffectReducerExec } from 'use-effect-reducer';
import * as z from 'zod';
export type StoryContextType = {
  form?: UseFormReturn<z.infer<typeof storyFormSchema>>;
  imageGenResponse?: ImageGenerationResponse;
  imageGenerationError?: any;
  imageIsGenerating: boolean;
  imagePath?: string;
  completion?: string;
  completionJson?: Record<string, unknown | any>;
  previousCompletion?: string;
  setting?: string;
  characterDescriptions?: string;
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

  // Commands that trigger state changes & effects
  | {
      type: 'GENERATE_STORY_IMAGE';
      characterDescriptions: string;
      setting: string;
    }

  // State changes
  | { type: 'STORY_GENERATION_COMPLETE'; completion: string }
  | { type: 'STORY_GENERATION_STARTED' }
  | { type: 'STORY_GENERATION_PROGRESS'; completion: string }
  | { type: 'IMAGE_GENERATION_STARTED' }
  | { type: 'IMAGE_GENERATION_COMPLETE'; response: CreateImageResponse }
  | { type: 'IMAGE_GENERATION_ERROR'; error: any };

export const initialState = defaultStoryContext;

export type StoryState = StoryContextType;

export function extractStoryContent(
  state: StoryState,
  action: StoryAction & { completion: string }
) {
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
  const setting = completionJson?.setting;
  const characterDescriptions = completionJson?.characterDescriptions;

  return {
    completionJson,
    storyBody,
    storyTitle,
    setting,
    characterDescriptions,
  };
}

export function storyReducer(
  state: StoryState = initialState,
  action: StoryAction,
  exec: EffectReducerExec<StoryState, StoryAction, any>
): StoryState {
  switch (action.type) {
    case 'STORY_GENERATION_STARTED':
      return {
        ...state,
        storyContentIsLoading: true,
        storyGenerationComplete: false,
      };

    case 'STORY_GENERATION_PROGRESS': {
      const { imageGenResponse, imageIsGenerating } = state;
      const {
        completionJson,
        storyBody,
        storyTitle,
        setting,
        characterDescriptions,
      } = extractStoryContent(state, action);

      // console.log(
      //   { completionJson },
      //   { setting },
      //   { characterDescriptions },
      //   { imageGenResponse },
      //   { imageIsGenerating }
      // );

      if (
        completionJson &&
        setting &&
        characterDescriptions &&
        !imageGenResponse &&
        !imageIsGenerating
      ) {
        exec({ type: 'generateImage' });
      }

      return {
        ...state,
        completion: action.completion,
        completionJson,
        storyBody,
        storyTitle,
      };
    }

    case 'STORY_GENERATION_COMPLETE': {
      const { completionJson, storyBody, storyTitle } = extractStoryContent(
        state,
        action
      );
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

    case 'IMAGE_GENERATION_STARTED':
      return {
        ...state,
        imageIsGenerating: true,
      };

    case 'IMAGE_GENERATION_COMPLETE':
      return {
        ...state,
        imageIsGenerating: false,
        imageGenResponse: action.response,
      };

    case 'IMAGE_GENERATION_ERROR':
      return {
        ...state,
        imageIsGenerating: false,
        imageGenerationError: action.error,
      };

    default:
      return state;
  }
}
