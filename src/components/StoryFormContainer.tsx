'use client';

import { StoryForm } from '@/components/StoryForm';

import { useStoryContext } from '@/context/StoryContext';
import { StoryDisplay } from './StoryDisplay';
import { StoryImage } from './StoryImage';

export function StoryFormContainer() {
  const { form } = useStoryContext()!;

  return (
    <div className="p-4 pb-0 rounded-md bg-card">
      {form ? <StoryForm form={form} /> : null}

      <div className="mt-4 flex flex-col md:flex-row h-auto md:max-h-[500px] w-full">
        <div className="w-full md:w-1/2">
          <StoryImage />
        </div>
        <div className="w-full md:w-1/2 md:pl-4">
          <StoryDisplay />
        </div>
      </div>
    </div>
  );
}
