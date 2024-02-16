import { ImageGenerationResponse, createImage } from '@/app/actions';
import { StoryCompletionJson } from '@/types';
import { useEffect, useState } from 'react';

export type UseStoryImageGenerationReturn = {
  imageGenResponse?: ImageGenerationResponse;
  imageIsGenerating: boolean;
};

export type UseStoryImageGenerationParams = {
  completionJson: StoryCompletionJson;
};

export function useStoryImageGeneration({
  completionJson,
}: UseStoryImageGenerationParams) {
  // Generate an image for the story title one time, once the title exists.
  // For image generation
  const [imageGenResponse, setImageGenResponse] = useState<
    ImageGenerationResponse | undefined
  >(undefined);
  const [imageIsGenerating, setImageIsGenerating] = useState<boolean>(false);

  useEffect(() => {
    if (
      completionJson?.setting &&
      completionJson?.characterDescriptions &&
      !imageGenResponse &&
      !imageIsGenerating
    ) {
      setImageIsGenerating(true);
      createImage({
        setting: completionJson.setting,
        characterDescriptions: completionJson.characterDescriptions,
      })
        .then((image) => {
          setImageGenResponse(image);
          setImageIsGenerating(false);
        })
        .catch((err) => {
          console.warn(`---------------- error creating image: `, err);
        });
    }
  }, [completionJson, imageGenResponse, imageIsGenerating]);

  return {
    setImageGenResponse,
    imageGenResponse,
    imageIsGenerating,
  };
}
