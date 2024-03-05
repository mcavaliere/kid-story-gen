import { CreateImageResponse } from '@/app/actions';
import { parseCompletion } from '@/lib/parseCompletion';
import { StoryFormSchemaType, storyFormSchema } from '@/lib/storyFormSchema';
import { Prisma } from '@prisma/client';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { UseFormReturn } from 'react-hook-form';
import { EffectReducerExec } from 'use-effect-reducer';
import * as z from 'zod';
export type StoryContextType = {
  characterDescriptions?: string;
  completion?: string;
  completionJson?: Record<string, unknown | any>;
  form?: UseFormReturn<z.infer<typeof storyFormSchema>>;
  imageGenerationError?: any;
  imageGenResponse?: CreateImageResponse;
  imageIsGenerating: boolean;
  imagePath?: string;
  mutateCreateStory?: UseMutateAsyncFunction<
    any,
    Error,
    Prisma.StoryCreateInput,
    unknown
  >;
  onSubmit: (values: StoryFormSchemaType) => Promise<void>;
  previousCompletion?: string;
  setting?: string;
  storyBody: string[];
  storyContentIsLoading: boolean;
  storyTitle: string;
  themes?: string[];
};

// Initial context state. Note that this is also used to partially reset the state when submitting the form,
//  to remove any previous story content.
export const defaultStoryContext: StoryContextType = {
  characterDescriptions: undefined,
  completion: undefined,
  completionJson: undefined,
  imageGenerationError: undefined,
  imageGenResponse: undefined,
  imageIsGenerating: false,
  imagePath: undefined,
  onSubmit: async (values) => {
    console.log(`----------------  🚨DEFAULT ONSUBMIT 🚨  `);
    return Promise.resolve(void 0);
  },
  previousCompletion: undefined,
  setting: undefined,
  storyBody: [],
  storyContentIsLoading: false,
  storyTitle: '',
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
  | {
      type: 'SAVE_STORY_TO_DB';
      story: Prisma.StoryCreateInput;
    }
  | { type: 'SET_THEMES'; themes: string[] }

  // State changes
  | { type: 'STORY_SAVE_STARTED' }
  | { type: 'STORY_SAVE_COMPLETE'; story: Prisma.StoryCreateInput }
  | { type: 'STORY_SAVE_ERROR'; error: any }
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
  console.log(action.type, action);
  switch (action.type) {
    case 'STORY_GENERATION_STARTED':
      return {
        // Reset any previous story content.
        ...state,
        characterDescriptions: undefined,
        completion: undefined,
        completionJson: undefined,
        imageGenerationError: undefined,
        imageGenResponse: undefined,
        imageIsGenerating: false,
        imagePath: undefined,
        previousCompletion: undefined,
        setting: undefined,
        storyBody: [],
        storyTitle: '',
        storyContentIsLoading: true,
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

      if (
        completionJson &&
        setting &&
        characterDescriptions &&
        !imageGenResponse &&
        !imageIsGenerating
      ) {
        exec({ type: 'generateImage', characterDescriptions, setting });
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
      const { imageGenResponse } = state;

      exec({
        type: 'saveStoryToDB',
        completionJson,
        imageGenResponse,
      });

      return {
        ...state,
        previousCompletion: state.completion,
        completion: action.completion,
        completionJson,
        storyContentIsLoading: false,
        storyBody,
        storyTitle,
      };
    }

    case 'IMAGE_GENERATION_STARTED':
      console.log(`IMAGE_GENERATION_STARTED`);
      return {
        ...state,
        imageIsGenerating: true,
      };

    case 'IMAGE_GENERATION_COMPLETE':
      console.log(`IMAGE_GENERATION_COMPLETe:`, action.response);
      return {
        ...state,
        imageIsGenerating: false,
        imageGenResponse: action.response,
        imagePath: action.response.url,
      };

    case 'IMAGE_GENERATION_ERROR':
      console.log(`IMAGE_GENERATION_ERROR`, action.error);
      return {
        ...state,
        imageIsGenerating: false,
        imageGenerationError: action.error,
      };

    case 'SET_THEMES':
      return {
        ...state,
        themes: action.themes,
      };

    default:
      return state;
  }
}
