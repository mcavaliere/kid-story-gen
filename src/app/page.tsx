import { Heading } from '@/components/Heading';
import { Separator } from '@/components/ui/separator';
import { StoryContextProvider } from '@/context/StoryContext';
import { StoryFormContainer } from '../components/StoryFormContainer';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col mb-32 text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <div>
          <Heading
            size="h1"
            tagName="h1"
            className="font-bold text-center mb-2"
          >
            StoryTime
          </Heading>

          <p className="col-span-3 text-center">
            New and novel bedtime stories for your kids every night.
          </p>
        </div>

        <Separator className="my-10" />

        <StoryContextProvider>
          <StoryFormContainer />
        </StoryContextProvider>
      </div>
    </main>
  );
}
