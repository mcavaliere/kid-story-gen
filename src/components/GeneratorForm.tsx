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

export function GeneratorForm() {
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

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await complete(JSON.stringify(form.getValues()));
  }

  const currentAgeGroup = form.watch('ageGroup');

  const themes = AGE_GROUPS.find((ag) => ag.name === currentAgeGroup)?.themes;

  return (
    <>
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-8">
          <FormField
            control={form.control}
            name="ageGroup"
            render={({ field }) => {
              return (
                <FormItem>
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

          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
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

          <Button type="submit">Submit</Button>
        </form>
      </Form>
      {completion ? (
        <div className="whitespace-pre-wrap my-4">{completion}</div>
      ) : null}
    </>
  );
}
