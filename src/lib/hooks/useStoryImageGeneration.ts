import { ImageGenerationResponse, createImage } from '@/app/actions';
import { useStoryContext, useStoryDispatch } from '@/context/StoryContext';
import { StoryCompletionJson } from '@/types';
import { useEffect } from 'react';

export type UseStoryImageGenerationReturn = {
  imageGenResponse?: ImageGenerationResponse;
  imageIsGenerating: boolean;
};

export type UseStoryImageGenerationParams = {
  completionJson: StoryCompletionJson;
};

export function useStoryImageGeneration() {
  // Generate an image for the story title one time, once the title exists.
  // For image generation

  const {
    setting,
    characterDescriptions,
    imageGenResponse,
    imageIsGenerating,
    completionJson,
  } = useStoryContext();

  const dispatch = useStoryDispatch()!;

  useEffect(() => {
    if (
      completionJson &&
      setting &&
      characterDescriptions &&
      !imageGenResponse &&
      !imageIsGenerating
    ) {
      dispatch({ type: 'IMAGE_GENERATION_STARTED' });
      createImage({
        setting: completionJson.setting,
        characterDescriptions: completionJson.characterDescriptions,
      })
        .then((image) => {
          dispatch({ type: 'IMAGE_GENERATION_COMPLETE', response: image });
        })
        .catch((err) => {
          dispatch({ type: 'IMAGE_GENERATION_ERROR', error: err });
          console.warn(`---------------- error creating image: `, err);
        });
    }
  }, [
    completionJson,
    imageGenResponse,
    imageIsGenerating,
    setting,
    characterDescriptions,
  ]);
}
