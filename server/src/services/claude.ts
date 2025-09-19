import Anthropic from '@anthropic-ai/sdk';
import { GenerateResponse, TestCase } from '../../../shared/src/types';

export class ClaudeService {
  private anthropic: Anthropic;

  constructor() {
    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      throw new Error('CLAUDE_API_KEY environment variable is required');
    }
    this.anthropic = new Anthropic({ apiKey });
  }

  async generateFunction(prompt: string, context?: any): Promise<GenerateResponse> {
    const systemPrompt = `You are an expert TypeScript developer generating data transformation functions.

Requirements:
- Generate pure TypeScript functions only
- Include proper type annotations
- Handle edge cases gracefully (null, undefined, empty values)
- Return single values or objects
- No side effects or external dependencies
- Function should be for single table row-level computations only

Response format should be JSON with:
{
  "functionName": "descriptiveFunctionName",
  "code": "complete TypeScript function code",
  "testCases": [
    {"input": {...}, "expectedOutput": ...},
    // exactly 10 test cases covering edge cases
  ]
}

Examples:
- "Calculate 20% tax on price" -> function that takes {price: number} and returns number
- "Format full name" -> function that takes {firstName: string, lastName: string} and returns string
- "Calculate age from birthdate" -> function that takes {birthDate: string} and returns number`;

    const userPrompt = context 
      ? `Context: ${JSON.stringify(context, null, 2)}\n\nTask: ${prompt}`
      : `Task: ${prompt}`;

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        temperature: 0.1,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      let responseText = content.text;
      
      // Extract JSON from markdown code blocks if present
      const jsonMatch = responseText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      if (jsonMatch) {
        responseText = jsonMatch[1];
      }
      
      // Clean up any remaining markdown artifacts
      responseText = responseText.replace(/```/g, '').trim();

      const result = JSON.parse(responseText);
      
      return {
        code: result.code,
        functionName: result.functionName,
        testCases: result.testCases
      };
    } catch (error) {
      console.error('Claude API error:', error);
      throw new Error('Failed to generate function with Claude API');
    }
  }
}