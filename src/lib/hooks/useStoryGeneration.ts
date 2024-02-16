import { parseCompletion } from '@/lib/parseCompletion';
import { StoryCompletionJson } from '@/types';
import { UseCompletionHelpers, useCompletion } from 'ai/react';
import usePreviousValue from 'beautiful-react-hooks/usePreviousValue';
import { useState } from 'react';

export type UseStoryGenerationReturn = {
  completionJson: StoryCompletionJson;
  complete: UseCompletionHelpers['complete'];
  completion: UseCompletionHelpers['completion'];
  previousCompletion: UseCompletionHelpers['completion'];
  storyBody: string[];
  storyTitle: string;
  storyContentIsLoading: boolean;
  storyGenerationComplete: boolean;
};
export function useStoryGeneration(): UseStoryGenerationReturn {
  const [storyGenerationComplete, setStoryGenerationComplete] =
    useState<boolean>(false);

  const {
    completion,
    isLoading: storyContentIsLoading,
    complete,
  } = useCompletion({
    api: '/api/stories/generate',
    onFinish: async () => {
      setStoryGenerationComplete(true);
    },
  });
  const previousCompletion = usePreviousValue(completion) || '';

  // JSONified streaming chat response.
  // We track the last completion value as a fallback. If any error throws midway through streaming,
  //  we can use the last completion value to display the story briefly and prevent flicker from the story going blank.
  const completionJson = parseCompletion({
    completion,
    fallback: previousCompletion
      ? parseCompletion({ completion: previousCompletion })
      : undefined,
  });
  const storyBody = completionJson?.content?.split(/\n\n/) || [];
  const storyTitle = completionJson?.title || '';

  return {
    complete,
    completion,
    completionJson,
    previousCompletion,
    storyBody,
    storyTitle,
    storyContentIsLoading,
    storyGenerationComplete,
  };
}
