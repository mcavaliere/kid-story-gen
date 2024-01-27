'use client';
import { StoryCompletionJson } from '@/types';
import { parse } from 'best-effort-json-parser';


export function parseCompletion(
  completion: string | undefined,
  defaultValue: StoryCompletionJson = {
    title: '',
    content: '',
  }
): StoryCompletionJson {
  if (!completion) return defaultValue;

  try {
    return parse(completion);
  } catch (error) {
    console.log(`can't parse `, { error }, { completion });
    return defaultValue;
  }
}
