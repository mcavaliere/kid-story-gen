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

export const storyEffects = {
  generateImage,
};
