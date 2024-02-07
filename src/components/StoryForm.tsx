import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { useStoryContext } from '@/context/StoryContext';
import { AGE_GROUPS } from '@/lib/constants';
import { StoryFormSchemaType } from '@/lib/storyFormSchema';
import { type UseFormReturn } from 'react-hook-form';
import { Heading } from './Heading';
import Spinner from './svgs/Spinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export type GenratorFormProps = {
  form: UseFormReturn<StoryFormSchemaType>;
};

export function StoryForm({ form }: GenratorFormProps) {
  const { onSubmit, storyContentIsLoading, themes } = useStoryContext()!;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col md:flex-row justify-center items-center">
          <Heading size="h3" className="inline-block mr-2">
            Give me a story for{' '}
          </Heading>

          <FormField
            control={form.control}
            name="ageGroup"
            render={({ field }) => {
              return (
                <FormItem className="inline-block relative">
                  <FormControl>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Age Group" />
                      </SelectTrigger>
                      <SelectContent>
                        {AGE_GROUPS.map(({ name }) => (
                          <SelectItem key={name} value={name}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="pl-3 absolute" />
                </FormItem>
              );
            }}
          />

          <Heading size="h3" className="inline-block mx-2">
            about
          </Heading>

          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem className="inline-block relative">
                <FormControl>
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {themes?.map((theme) => (
                        <SelectItem key={theme} value={theme}>
                          {theme}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="absolute pl-3" />
              </FormItem>
            )}
          />

          <Button type="submit" className="inline-block ml-2">
            Make the story!
          </Button>
        </div>

        {/* <div className="flex flex-col w-full justify-center items-center mt-4">
          <div className="flex flex-row w-full">
            <Heading size="h3" className="inline-block mx-auto text-center">
              Options
            </Heading>
          </div>
          <div className="flex flex-row w-1/3">
            <FormField
              control={form.control}
              name="length"
              render={({ field }) => {
                return (
                  <div className="flex flex-col w-full">
                    <FormItem className="w-full">
                      <FormLabel>Story Length</FormLabel>
                      <FormControl>
                        <Slider
                          defaultValue={[
                            // Start in the middle.
                            Math.round(
                              STORY_LENGTH_RANGE.min / STORY_LENGTH_RANGE.max
                            ),
                          ]}
                          min={STORY_LENGTH_RANGE.min}
                          max={STORY_LENGTH_RANGE.max}
                          step={50}
                          onValueChange={(value) => {
                            form.setValue(field.name, value[0]);
                          }}
                          value={[field.value]}
                        />
                      </FormControl>
                    </FormItem>
                    <span>{field.value} words</span>
                  </div>
                );
              }}
            />
          </div>
        </div> */}

        {/* <div className="flex flex-row justify-end">

        </div> */}

        {storyContentIsLoading ? (
          <Spinner className="inline-block ml-2 text-black" />
        ) : null}
      </form>
    </Form>
  );
}
