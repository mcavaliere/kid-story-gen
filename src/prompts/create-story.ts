export const prompt = `
Write a short children's bedtime story.

It should be engaging to children who are in the {{ageGroup}} age group.

The topic of the story will be {{topic}}.

Make the story exactly 5 paragraphs long.

Output the story as a JSON object, using the following template. Output will consist of the template and its content, nothing else. Output will always be perfectly valid JSON.

{"title": "{{storyTitle}}", "content": "{{storyContent}}"}

`;
