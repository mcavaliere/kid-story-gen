import { StoryContextType, defaultStoryContext } from '@/context/StoryContext';
import { useReducer } from 'react';

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
