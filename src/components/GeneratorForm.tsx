'use client';

import { useCompletion } from 'ai/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { parse } from 'best-effort-json-parser';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

import { AGE_GROUPS } from '@/lib/constants';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

import { StoryFormSchemaType, storyFormSchema } from '../lib/storyFormSchema';
import { Heading } from './Heading';
import Spinner from './svgs/Spinner';
import { StoryDisplay } from './StoryDisplay';
import { useEffect, useState } from 'react';
import { create } from 'domain';
import { createImage } from '@/app/actions';
import { GenerationResponse } from '@/lib/server/stabilityai';

export const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

export async function generateStory(params: StoryFormSchemaType) {
  return await fetch('/api/stories/create', {
    method: 'POST',
    body: JSON.stringify(params),
    headers,
  });
}

function onResponse(res: Response): void {
  console.log(`---------------- response: `, { res });
}

function onFinish(prompt: string, completion: string): void {
  console.log(`---------------- onFinish: `, { prompt }, { completion });
}

function onError(err: Error): void {
  console.log(`---------------- onError: `, { err });
}

export type StoryCompletionJson = {
  title: string;
  content: string;
};



export function parseCompletion(completion: string | undefined, defaultValue: StoryCompletionJson = {title: "", content: ""}): StoryCompletionJson {
  if (!completion) return defaultValue

  try {
    return parse(completion);
  } catch (e) {
    console.log(`can't parse `, e, {completion});
    return defaultValue
  }
}

export function GeneratorForm() {
  const { completion, isLoading, complete } = useCompletion({
    api: '/api/stories/create',
    onResponse,
    onFinish,
    onError,
  });

  const form = useForm<z.infer<typeof storyFormSchema>>({
    resolver: zodResolver(storyFormSchema),
    defaultValues: {
      ageGroup: '', // Set the default value to the first option
      topic: '',
    },
  });



  const [imageGenResponse, setImageGenResponse] = useState<GenerationResponse | undefined>(undefined);
  const imageData = imageGenResponse?.artifacts[0].base64;
  const imagePath = !imageData ? undefined : `data:image/png;base64,${imageData}`;
  const [imageIsGenerating, setImageIsGenerating] = useState<boolean>(false);



  async function onSubmit(values: StoryFormSchemaType) {
    // Reset this so we can generate a new image.
    setImageGenResponse(undefined);
    await complete(JSON.stringify(form.getValues()));
  }

  const currentAgeGroup = form.watch('ageGroup');
  const themes = AGE_GROUPS.find((ag) => ag.name === currentAgeGroup)?.themes;
  const completionJson = parseCompletion(completion);

  useEffect(() => {
    if (completionJson?.title && !imageGenResponse && !imageIsGenerating) {
      setImageIsGenerating(true);
      console.log({imageIsGenerating}, {imageGenResponse}, {title: completionJson?.title});
      createImage(completionJson?.title).then((image) => {
        setImageGenResponse(image);
        setImageIsGenerating(false);
        console.log({imageIsGenerating}, {imageGenResponse}, {title: completionJson?.title});
      })
    }
  }, [completionJson?.title, imageGenResponse, imageIsGenerating])



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

      {!imagePath ? null : (
        <div className="flex justify-center">
          <img src={imagePath} />
        </div>
      )}

      {completion ? <StoryDisplay {...parseCompletion(completion)} /> : null}
    </div>
  );
}
