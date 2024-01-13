export type StoryContentType = {
  title: string;
  content: string;
};

export function StoryDisplay({ title, content }: StoryContentType) {
  return (
    <div className="whitespace-pre-wrap my-4 text-left">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {content}
    </div>
  );
}
