'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCompletion } from 'ai/react';

import Image from 'next/image';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';

import { AGE_GROUPS } from '@/lib/constants';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

import { ImageGenerationResponse, createImage } from '@/app/actions';
import { useEffect, useState } from 'react';
import { parseCompletion } from '../lib/parseCompletion';
import { StoryFormSchemaType, storyFormSchema } from '../lib/storyFormSchema';
import { Heading } from './Heading';
import { StoryDisplay } from './StoryDisplay';
import { StoryImageLoader } from './StoryImageLoader';
import Spinner from './svgs/Spinner';

export function GeneratorFormContext() {
  const { completion, isLoading, complete } = useCompletion({
    api: '/api/stories/create',
  });

  const form = useForm<z.infer<typeof storyFormSchema>>({
    resolver: zodResolver(storyFormSchema),
    defaultValues: {
      ageGroup: '', // Set the default value to the first option
      topic: '',
    },
  });
  const currentAgeGroup = form.watch('ageGroup');
  const themes = AGE_GROUPS.find((ag) => ag.name === currentAgeGroup)?.themes;

  // For image generation
  const [imageGenResponse, setImageGenResponse] = useState<
    ImageGenerationResponse | undefined
  >(undefined);
  const [imageIsGenerating, setImageIsGenerating] = useState<boolean>(false);

  async function onSubmit(values: StoryFormSchemaType) {
    // Reset this so we can generate a new image.
    setImageGenResponse(undefined);
    await complete(JSON.stringify(form.getValues()));
  }

  // JSONified streaming chat response.
  const completionJson = parseCompletion(completion);

  // Generate an image for the story title one time, once the title exists.
  useEffect(() => {
    // console.log({completionJson});
    if (
      completionJson?.title &&
      completionJson?.synopsis &&
      completionJson?.characters &&
      completionJson?.characterDescriptions &&
      !imageGenResponse &&
      !imageIsGenerating
    ) {
      setImageIsGenerating(true);
      createImage(completionJson).then((image) => {
        // console.log(`image response:  `, { image });
        setImageGenResponse(image);
        setImageIsGenerating(false);
      });
    }
  }, [completionJson, imageGenResponse, imageIsGenerating]);

  const imagePath = imageGenResponse?.url;
  // Static image for testing.
  // const imagePath = "https://oaidalleapiprodscus.blob.core.windows.net/private/org-Ai6FnzlH3437nQyQTuNvsFot/user-bg6ZdeJvNKqLmlYdr5Mn39VJ/img-CU3JL6V6IoX85jGTOln1deGA.png?st=2024-01-26T16%3A17%3A30Z&se=2024-01-26T18%3A17%3A30Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-01-25T21%3A26%3A57Z&ske=2024-01-26T21%3A26%3A57Z&sks=b&skv=2021-08-06&sig=NfkchL8Lnb9%2B/Bxe3ax/gd44vxAevKZYEY7ArLIC2cc%3D&w=640&q=75"

  return (
    <div className="p-4 rounded-md bg-gray-100">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-row">
          <Heading size="h3" className="inline-block mr-2">
            Give me a story for a{' '}
          </Heading>

          <FormField
            control={form.control}
            name="ageGroup"
            render={({ field }) => {
              return (
                <FormItem className="inline-block">
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
              <FormItem className="inline-block">
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
              </FormItem>
            )}
          />

          <Button type="submit" className="inline-block ml-2">
            Submit
          </Button>

          {isLoading ? (
            <Spinner className="inline-block ml-2 text-black" />
          ) : null}
        </form>
      </Form>

      <div className="mt-4 flex flex-col md:flex-row bg--100 w-full">
        <div className="w-full md:w-1/2">
          {imageIsGenerating || imagePath ? (
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
          ) : null}
        </div>
        <div className="w-full md:w-1/2 md:pl-4">
          {completion ? (
            <StoryDisplay {...parseCompletion(completion)} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
