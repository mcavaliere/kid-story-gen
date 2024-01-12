'use client';

import { useCompletion } from 'ai/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

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

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await complete(JSON.stringify(form.getValues()));
  }

  const currentAgeGroup = form.watch('ageGroup');

  const themes = AGE_GROUPS.find((ag) => ag.name === currentAgeGroup)?.themes;

  console.log(completion);

  return (
    <div className="p-4 rounded-md bg-gray-100">
      <Form {...form}>
        <form onSubmit={onSubmit} className="flex-row">
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

                  <FormMessage />
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

                <FormMessage />
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
      {completion ? (
        <div className="whitespace-pre-wrap my-4">{completion}</div>
      ) : null}
    </div>
  );
}
