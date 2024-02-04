export type StoryContentType = {
  content: string[];
};

export function StoryBody({ content }: StoryContentType) {
  return (
    <>
      {content?.map((paragraph, index) => (
        <p key={index} className="mb-2">
          {paragraph}
        </p>
      ))}
    </>
  );
}
