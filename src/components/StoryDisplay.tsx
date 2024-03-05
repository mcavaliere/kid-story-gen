import { useStoryContext } from '@/context/StoryContext';
import { StoryBody } from './StoryBody';
import { StoryTitle } from './StoryTitle';
import Spinner from './svgs/Spinner';

export function StoryDisplay() {
  const { storyTitle, storyBody, storyContentIsLoading } = useStoryContext()!;

  return (
    <div className="whitespace-pre-wrap my-4 md:mt-0 text-left">
      {storyTitle ? <StoryTitle title={storyTitle} /> : null}
      <div className="md:h-[450px] md:overflow-y-auto">
        {storyBody ? <StoryBody content={storyBody} /> : null}

        {storyContentIsLoading ? (
          <div className="w-full flex flex-row justify-center">
            <Spinner className="inline-block ml-2 text-black w-10 h-10" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
