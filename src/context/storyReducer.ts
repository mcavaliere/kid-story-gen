import { CreateImageResponse } from '@/app/actions';
import { parseCompletion } from '@/lib/parseCompletion';
import { StoryFormSchemaType, storyFormSchema } from '@/lib/storyFormSchema';
import { Prisma } from '@prisma/client';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { UseFormReturn } from 'react-hook-form';
import { EffectReducerExec } from 'use-effect-reducer';
import * as z from 'zod';
export type StoryContextType = {
  form?: UseFormReturn<z.infer<typeof storyFormSchema>>;
  imageGenResponse?: CreateImageResponse;
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
  mutateCreateStory?: UseMutateAsyncFunction<
    any,
    Error,
    Prisma.StoryCreateInput,
    unknown
  >;
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
  | {
      type: 'SAVE_STORY_TO_DB';
      story: Prisma.StoryCreateInput;
    }

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
  console.log({ action });
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

      console.log(`story generation complete, saving story`);
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
        storyGenerationComplete: true,
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

    default:
      return state;
  }
}
