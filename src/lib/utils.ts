import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculate time to read a story based on the user's reading speed, and length of the article.
 */
export function calculateTimeToRead(
  story: string,
  wordsPerMinute: number = 200
) {
  const words = story.split(' ').length;
  const minutes = words / wordsPerMinute;
  return Math.ceil(minutes);
}
