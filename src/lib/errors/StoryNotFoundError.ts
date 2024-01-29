export class StoryNotFoundError extends Error {
  constructor(message: string = 'Story not found') {
    super(message);
    this.name = 'StoryNotFoundError';
  }
}
