export const prompt = `
Write a short children's bedtime story.

It should be engaging to children who are in the {{ageGroup}} age group.

The topic of the story will be {{topic}}.

Make the story approximately {{length}} words long. Keep all paragraphs brief, no more than 3 sentences each.

Do not start the story with "once upon a time." Start the story in a unique and creative way.

Avoid plagiarism at all costs. The story must be original.

Output the story as a JSON object, using the following template. Output will consist of the template and its content, nothing else. Output will always be perfectly valid JSON. Here is what you will fill into each field:

- title: The title of the story.
- synopsis: A one sentence description of the story.
- characters: The names of the characters in the story.
- characterDescriptions: A visual description of each of the characters.
- content: The content of the story. Separate each paragraph with two newlines.
- setting: The setting for the cover image of the story. Includes environment, weather, the main characters, and an activity they are engaged in.

Fill them in from left to right. Replace any special characters (especially single and double quotes) with their HTML escape sequences.

Here is the template:

{"title": "{{storyTitle}}", "synopsis": "{{oneSentenceSynopsis}}", "setting": "{{setting}}", "characters": "{{characterNames}}", "characterDescriptions": "{{characterDescriptions}}", "content": "{{storyContent}}"}

`;
