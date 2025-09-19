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
    // Build context-aware system prompt
    let contextDetails = '';
    if (context?.schema) {
      contextDetails += '\nAvailable fields in the dataset:\n';
      for (const [field, type] of Object.entries(context.schema)) {
        contextDetails += `- ${field}: ${type}\n`;
      }
    }
    if (context?.sampleData && context.sampleData.length > 0) {
      contextDetails += '\nSample data row:\n';
      contextDetails += JSON.stringify(context.sampleData[0], null, 2);
    }

    const systemPrompt = `You are an expert TypeScript developer generating data transformation functions.
${contextDetails}
Requirements:
- Generate pure TypeScript functions only
- Include proper type annotations
- Handle edge cases gracefully (null, undefined, empty values)
- Return single values or objects
- No side effects or external dependencies
- Function should work with the provided dataset structure when context is available
- Support both single-row transformations and aggregations over arrays

IMPORTANT: Respond with ONLY valid JSON. Do not include any markdown formatting, explanations, or code blocks.

Response format (valid JSON only):
{
  "functionName": "descriptiveFunctionName",
  "code": "complete TypeScript function code as a string",
  "testCases": [
    {"input": {"field": "value"}, "expectedOutput": "result"},
    {"input": {"field": "value"}, "expectedOutput": "result"}
  ]
}

The "code" field must be a single string containing the complete function. Include exactly 10 test cases.
CRITICAL: Do NOT use undefined in test cases - use null instead for missing values. All values must be valid JSON.

Examples:
- "Calculate 20% tax on price" -> function that takes {price: number} and returns number
- "Format full name" -> function that takes {firstName: string, lastName: string} and returns string`;

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

      let responseText = content.text.trim();
      
      // Remove any potential markdown code blocks
      responseText = responseText.replace(/```json\s*/, '').replace(/```\s*$/, '').trim();
      
      // Find the JSON object boundaries
      const jsonStart = responseText.indexOf('{');
      const jsonEnd = responseText.lastIndexOf('}');
      
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        responseText = responseText.substring(jsonStart, jsonEnd + 1);
      }

      // Replace undefined with null to make valid JSON
      responseText = responseText.replace(/:\s*undefined\b/g, ': null');

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Response text:', responseText);
        console.error('Original response:', content.text);
        throw new Error('Invalid JSON response from Claude');
      }
      
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