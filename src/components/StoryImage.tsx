import { useStoryContext } from '@/context/StoryContext';
import Image from 'next/image';
import { StoryImageLoader } from './StoryImageLoader';

export function StoryImage() {
  const { imageIsGenerating, imagePath } = useStoryContext!();

  if (!imageIsGenerating && !imagePath) return;

  return (
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
  );
}
