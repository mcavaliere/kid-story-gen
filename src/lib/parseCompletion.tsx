'use client';
import { StoryCompletionJson } from '@/types';
import { parse } from 'best-effort-json-parser';

export type ParseCompletionParams = {
  completion: string | undefined;
  fallback?: StoryCompletionJson;
};

export function parseCompletion({
  completion,
  fallback = { title: '', content: '' },
}: ParseCompletionParams): StoryCompletionJson {
  if (!completion) return fallback;

  try {
    return parse(completion);
  } catch (error) {
    console.log(`can't parse `, { error }, { completion });
    return fallback;
  }
}
