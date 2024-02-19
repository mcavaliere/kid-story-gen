import { replaceTemplateVars } from './replaceTemplateVars';

describe('replaceTemplateVars()', () => {
  it('should replace a single variable', () => {
    const template = 'Hello, {{name}}!';
    const vars = { name: 'world' };
    const result = replaceTemplateVars(template, vars);
    expect(result).toBe('Hello, world!');
  });

  it('should replace multiple variables', () => {
    const template = 'Hello, {{name}}! My name is {{myName}}.';
    const vars = { name: 'world', myName: 'John' };
    const result = replaceTemplateVars(template, vars);
    expect(result).toBe('Hello, world! My name is John.');
  });

  it('should replace multiple instances of the same variable', () => {
    const template = 'Hello, {{name}}! My name is {{name}}.';
    const vars = { name: 'world' };
    const result = replaceTemplateVars(template, vars);
    expect(result).toBe('Hello, world! My name is world.');
  });
});
