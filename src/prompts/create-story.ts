export const prompt = `
Write a short children's bedtime story.

It should be engaging to children who are in the {{ageGroup}} age group.

The topic of the story will be {{topic}}.

Make the story exactly 5 paragraphs long. Keep all paragraphs brief, no more than 3 sentences each.

Output the story as a JSON object, using the following template. Output will consist of the template and its content, nothing else. Output will always be perfectly valid JSON. Here is what you will fill into each field:

- title: The title of the story.
- synopsis: A one sentence description of the story.
- characters: The names of the characters in the story.
- characterDescriptions: A visual description of each of the characters.
- content: The content of the story.

Fill them in from left to right. Here is the template:

{"title": "{{storyTitle}}", "synopsis": "{{oneSentenceSynopsis}}", "characters": "{{characterNames}}", "characterDescriptions": "{{characterDescriptions}}", "content": "{{storyContent}}"}

`;
