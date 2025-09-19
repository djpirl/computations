import React, { useState, useCallback, useEffect } from 'react';
import { TabNavigation, TabType } from './components/tabs/TabNavigation';
import { ComputationTab } from './components/tabs/ComputationTab';
import { DataViewerTab } from './components/tabs/DataViewerTab';
import { GenerateResponse, TestCase, DatasetInfo } from '../../shared/src/types';
import './styles/DatasetSelector.css';
import './styles/DatasetTestRunner.css';
import './styles/DataViewer.css';

function App() {
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentCode, setCurrentCode] = useState<string>('');
  const [currentTestCases, setCurrentTestCases] = useState<TestCase[]>([]);
  const [actualResults, setActualResults] = useState<any[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<DatasetInfo | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('computation');

  const handleGenerate = async (prompt: string) => {
    setLoading(true);
    try {
      const requestBody: any = { prompt };

      // Include dataset context if selected
      if (selectedDataset) {
        requestBody.context = {
          schema: selectedDataset.schema.columns.reduce((acc, col) => {
            acc[col.name] = col.type;
            return acc;
          }, {} as Record<string, string>),
          sampleData: selectedDataset.sample
        };
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to generate function');
      }

      const data: GenerateResponse = await response.json();
      setResult(data);
      setCurrentCode(data.code);
      setCurrentTestCases(data.testCases);
      setActualResults([]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const executeFunction = useCallback((code: string, testCases: TestCase[]) => {
    try {
      // Extract function name from the code
      const functionNameMatch = code.match(/function\s+(\w+)\s*\(/);
      if (!functionNameMatch) {
        setActualResults(testCases.map(() => ({ error: 'Could not find function name' })));
        return;
      }
      
      const functionName = functionNameMatch[1];
      
      // Strip TypeScript type annotations to make it valid JavaScript
      const jsCode = code
        // Remove parameter type annotations: (param: Type) -> (param)
        .replace(/\(\s*([^)]+)\s*:\s*[^)]+\s*\)/g, '($1)')
        // Remove return type annotations: ): Type { -> ) {
        .replace(/\):\s*[^{]+\{/g, ') {')
        // Remove type annotations from parameters: param: Type -> param
        .replace(/(\w+)\s*:\s*[^,)]+/g, '$1')
        // Remove optional parameter markers: param? -> param
        .replace(/(\w+)\?\s*/g, '$1 ')
        // Clean up any remaining artifacts
        .replace(/\s+/g, ' ');
      
      // Create a safe execution environment
      const executionCode = `
        ${jsCode}
        return ${functionName};
      `;
      
      const func = new Function(executionCode)();
      
      if (typeof func === 'function') {
        const results = testCases.map(testCase => {
          try {
            const result = func(testCase.input);
            return result;
          } catch (error) {
            return { error: error.message };
          }
        });
        setActualResults(results);
      } else {
        setActualResults(testCases.map(() => ({ error: 'Function not found' })));
      }
    } catch (error) {
      console.error('Error executing function:', error);
      setActualResults(testCases.map(() => ({ error: `Execution failed: ${error.message}` })));
    }
  }, []);

  // Execute function when code or test cases change
  useEffect(() => {
    if (currentCode && currentTestCases.length > 0) {
      const timeoutId = setTimeout(() => {
        executeFunction(currentCode, currentTestCases);
      }, 500); // Debounce execution

      return () => clearTimeout(timeoutId);
    }
  }, [currentCode, currentTestCases, executeFunction]);

  const handleCodeChange = useCallback((newCode: string) => {
    setCurrentCode(newCode);
  }, []);

  const handleTestCaseChange = useCallback((index: number, updatedTestCase: TestCase) => {
    setCurrentTestCases(prev => {
      const newTestCases = [...prev];
      newTestCases[index] = updatedTestCase;
      return newTestCases;
    });
  }, []);

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
        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="tab-content">
          {activeTab === 'computation' && (
            <ComputationTab
              result={result}
              loading={loading}
              currentCode={currentCode}
              currentTestCases={currentTestCases}
              actualResults={actualResults}
              selectedDataset={selectedDataset}
              onGenerate={handleGenerate}
              onCodeChange={handleCodeChange}
              onTestCaseChange={handleTestCaseChange}
              onDatasetSelect={setSelectedDataset}
            />
          )}

          {activeTab === 'dataViewer' && (
            <DataViewerTab
              selectedDataset={selectedDataset}
              onDatasetSelect={setSelectedDataset}
              generatedCode={currentCode}
              functionName={result?.functionName}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;