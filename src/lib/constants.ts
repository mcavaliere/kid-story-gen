export type AgeGroupData = {
  start_age: number;
  end_age: number;
  name: string;
  themes: string[];
}[];

export const AGE_GROUPS: AgeGroupData = [
  {
    start_age: 0,
    end_age: 2,
    name: 'Infant',
    themes: [
      'Basic Concepts (e.g., Shapes, Colors)',
      'Bath Time',
      'Bedtime',
      'Lullabies',
      'Nature and Seasons',
      'On the Farm',
      'Peekaboo',
      'Sensory Exploration',
    ],
  },
  {
    start_age: 2,
    end_age: 3,
    name: 'Toddler',
    themes: [
      'All About Me',
      'Animals',
      'Bugs',
      'Butterflies',
      'Colors',
      'Community Helpers',
    ],
  },
  {
    start_age: 3,
    end_age: 5,
    name: 'Preschool',
    themes: [
      'Acceptance',
      'Adventure',
      'Animals',
      'Bedtime',
      'Big Changes',
      'Courage',
      'Discovery (Learning)',
      'Empathy',
      'Family',
      'Friendship',
      'Growing Up',
      'Holidays',
      'Imagination',
      'Nature',
      'Numbers',
      'Opposites',
      'School',
      'Seasons',
      'Shapes',
      'Sharing',
      'Social Issues',
      'Suffering',
      'Teamwork',
      'Transportation',
    ],
  },
  {
    start_age: 5,
    end_age: 7,
    name: 'Kindergarten',
    themes: [
      'Community',
      'Creativity',
      'Curiosity',
      'Fairy Tales',
      'History',
      'Independence',
      'Magic',
      'Perseverance',
      'Problem Solving',
      'Science',
      'Space',
      'Superheroes',
      'Wonders of the World',
    ],
  },
  {
    start_age: 7,
    end_age: 9,
    name: 'Early Elementary',
    themes: [
      'Conservation',
      'Diversity',
      'Environment',
      'Exploration',
      'Friendship',
      'Identity',
      'Innovation',
      'Invention',
      'Leadership',
      'Overcoming Challenges',
      'Self-Discovery',
      'Teamwork',
    ],
  },
  {
    start_age: 9,
    end_age: 11,
    name: 'Middle Elementary',
    themes: [
      'Coming of Age',
      'Cultural Diversity',
      'Empowerment',
      'Future',
      'Global Awareness',
      'Human Rights',
      'Identity',
      'Making a Difference',
      'Resilience',
      'Social Justice',
      'Technology',
    ],
  },
  {
    start_age: 11,
    end_age: 13,
    name: 'Late Elementary',
    themes: [
      'Adolescence',
      'Decision Making',
      'Ethics',
      'Growing Pains',
      'Identity',
      'Independence',
      'Morality',
      'Peer Relationships',
      'Personal Growth',
      'Self-Expression',
      'Transition',
    ],
  },
];

export type StoryLengthRange = {
  min: number;
  max: number;
};

export const STORY_LENGTH_RANGE: StoryLengthRange = {
  min: 100,
  max: 5000,
};

export const STORY_LENGTH_MIDPOINT = Math.floor(
  (STORY_LENGTH_RANGE.max + STORY_LENGTH_RANGE.min) / 2
);
