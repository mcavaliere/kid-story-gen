import { useStoryContext } from '@/context/StoryContext';
import { StoryBody } from './StoryBody';
import { StoryTitle } from './StoryTitle';

export function StoryDisplay() {
  const { storyTitle, storyBody } = useStoryContext()!;

  return (
    <div className="whitespace-pre-wrap my-4 md:mt-0 text-left">
      {storyTitle ? <StoryTitle title={storyTitle} /> : null}
      <div className="md:h-[450px] md:overflow-y-auto">
        {storyBody ? <StoryBody content={storyBody} /> : null}
      </div>
    </div>
  );
}
