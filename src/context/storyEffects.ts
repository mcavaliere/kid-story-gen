import { createImage } from '@/app/actions';
import { EffectFunction } from 'use-effect-reducer';
import { StoryAction, StoryState } from './storyReducer';

export type StoryEffectFunction = EffectFunction<StoryState, StoryAction, any>;

export const generateImage: StoryEffectFunction = (state, effect, dispatch) => {
  const { setting, characterDescriptions } = effect;

  dispatch({ type: 'IMAGE_GENERATION_STARTED' });
  createImage({
    setting,
    characterDescriptions,
  })
    .then((image) => {
      dispatch({ type: 'IMAGE_GENERATION_COMPLETE', response: image });
    })
    .catch((error) => {
      dispatch({ type: 'IMAGE_GENERATION_ERROR', error });
    });
};

export const saveStoryToDB: StoryEffectFunction = (state, effect, dispatch) => {
  const { mutateCreateStory } = state;
  const { completionJson, imageGenResponse } = effect;
  console.log(
    `saveStoryToDB: `,
    { mutateCreateStory },
    { completionJson, imageGenResponse }
  );

  if (!mutateCreateStory) {
    console.warn(`mutateCreateStory not defined, returning. `);
    return;
  }

  dispatch({ type: 'STORY_SAVE_STARTED' });
  mutateCreateStory({
    ...completionJson,
    imageUrl: imageGenResponse?.url,
  })
    .then((story: any) => {
      dispatch({ type: 'STORY_SAVE_COMPLETE', story });
    })
    .catch((error: any) => {
      dispatch({ type: 'STORY_SAVE_ERROR', error });
    });
};

export const storyEffects = {
  generateImage,
  saveStoryToDB,
};
