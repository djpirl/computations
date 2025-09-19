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

export interface TableSchema {
  columns: Array<{
    name: string;
    type: 'string' | 'number' | 'boolean' | 'date';
  }>;
}

export interface DatasetInfo {
  name: string;
  path: string;
  category: string;
  rowCount: number;
  schema: TableSchema;
  sample: any[];
}