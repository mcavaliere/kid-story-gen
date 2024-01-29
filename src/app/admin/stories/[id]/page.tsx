import { getStory } from '@/app/actions';
import { Heading } from '@/components/Heading';
import { StoryNotFoundError } from '@/lib/errors/StoryNotFoundError';
import Image from 'next/image';

export type StoryDetailPageProps = {
  params: {
    id: string;
  };
};

export default async function StoryDetailPage({
  params: { id },
}: StoryDetailPageProps) {
  const story = await getStory(id);

  if (!story) {
    throw new StoryNotFoundError();
  }

  const { title, content, imageUrl } = story;

  return (
    <div className="flex flex-col items-center">
      <Heading>{title}</Heading>

      {!imageUrl ? null : (
        <Image
          src={imageUrl}
          alt={`Cover image for story`}
          width="512"
          height="512"
        />
      )}

      <div>{content}</div>
    </div>
  );
}
