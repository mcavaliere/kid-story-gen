export type StoryContentType = {
  title: string;
  content: string[];
};

export function StoryDisplay({ title, content }: StoryContentType) {
  return (
    <div className="whitespace-pre-wrap my-4 md:mt-0 text-left">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="md:h-[450px] md:overflow-y-auto">
        {content?.map((paragraph, index) => (
          <p key={index} className="mb-2">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
