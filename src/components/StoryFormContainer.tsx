'use client';

import { StoryForm } from '@/components/StoryForm';

import Image from 'next/image';

import { parseCompletion } from '../lib/parseCompletion';

import { useStoryContext } from '@/context/StoryContext';
import { StoryDisplay } from './StoryDisplay';
import { StoryImageLoader } from './StoryImageLoader';

export function StoryFormContainer() {
  const { form, imageIsGenerating, imagePath, completion } = useStoryContext()!;

  return (
    <div className="p-4 rounded-md bg-gray-100">
      {form ? <StoryForm form={form} /> : null}

      <div className="mt-4 flex flex-col md:flex-row bg--100 w-full">
        <div className="w-full md:w-1/2">
          {imageIsGenerating || imagePath ? (
            <div className="flex justify-center items-center w-full h-auto min-h-[200px] relative">
              {imageIsGenerating ? <StoryImageLoader /> : null}

              {imagePath ? (
                <Image
                  src={imagePath}
                  alt={`Cover image for story`}
                  width="512"
                  height="512"
                  style={{ width: '100%' }}
                />
              ) : null}
            </div>
          ) : null}
        </div>
        <div className="w-full md:w-1/2 md:pl-4">
          {completion ? (
            <StoryDisplay {...parseCompletion(completion)} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
