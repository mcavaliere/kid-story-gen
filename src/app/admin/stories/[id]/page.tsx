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

  const { title, content: rawContent, imageUrl } = story;

  const content = rawContent.split(/\n\n/).map((p, i) => (
    <p key={i} className="mb-2">
      {p}
    </p>
  ));

  return (
    <div className="grid gap-10 place-items-start grid-cols-1 sm:grid-cols-2 content-start items-center p-2 sm:p-4">
      <div className="h-full">
        {!imageUrl ? null : (
          <Image
            src={imageUrl}
            alt={`Cover image for story`}
            width="512"
            height="512"
            className="rounded-xl"
          />
        )}
      </div>

      <div>
        <Heading className="md:mb-4">{title}</Heading>

        {content}
      </div>
    </div>
  );
}
