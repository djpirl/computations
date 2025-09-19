export interface GenerateRequest {
  prompt: string;
  context?: {
    schema?: Record<string, string>;
    sampleData?: any[];
  };
}

export interface TestCase {
  input: any;
  expectedOutput: any;
}

export interface GenerateResponse {
  code: string;
  functionName: string;
  testCases: TestCase[];
}

export interface SavedFunction {
  id: string;
  name: string;
  description: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}