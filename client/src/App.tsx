import React, { useState } from 'react';
import { PromptInput } from './components/PromptInput';
import { CodeDisplay } from './components/CodeDisplay';
import { TestCasesTable } from './components/TestCasesTable';
import { GenerateResponse } from '../../shared/src/types';

function App() {
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (prompt: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate function');
      }

      const data: GenerateResponse = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Natural Language to TypeScript
            </h1>
            <p className="mt-2 text-gray-600">
              Generate TypeScript functions from natural language descriptions
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <PromptInput onGenerate={handleGenerate} loading={loading} />
          </div>
          
          <div className="lg:col-span-2 space-y-8">
            {result && (
              <>
                <CodeDisplay 
                  code={result.code} 
                  functionName={result.functionName}
                />
                <TestCasesTable testCases={result.testCases} />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;