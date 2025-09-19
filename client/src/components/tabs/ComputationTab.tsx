import React from 'react';
import { PromptInput } from '../PromptInput';
import { CodeDisplay } from '../CodeDisplay';
import { TestCasesTable } from '../TestCasesTable';
import { DatasetSelector } from '../DatasetSelector';
import { DatasetTestRunner } from '../DatasetTestRunner';
import { GenerateResponse, TestCase, DatasetInfo } from '../../../../shared/src/types';

interface ComputationTabProps {
  result: GenerateResponse | null;
  loading: boolean;
  currentCode: string;
  currentTestCases: TestCase[];
  actualResults: any[];
  selectedDataset: DatasetInfo | null;
  onGenerate: (prompt: string) => Promise<void>;
  onCodeChange: (code: string) => void;
  onTestCaseChange: (index: number, testCase: TestCase) => void;
  onDatasetSelect: (dataset: DatasetInfo | null) => void;
}

export const ComputationTab: React.FC<ComputationTabProps> = ({
  result,
  loading,
  currentCode,
  currentTestCases,
  actualResults,
  selectedDataset,
  onGenerate,
  onCodeChange,
  onTestCaseChange,
  onDatasetSelect
}) => {
  return (
    <>
      <div className="mb-8">
        <DatasetSelector
          onDatasetSelect={onDatasetSelect}
          selectedDatasets={selectedDataset ? [selectedDataset] : []}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <PromptInput onGenerate={onGenerate} loading={loading} />
          {selectedDataset && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Using dataset: <strong>{selectedDataset.name}</strong>
              </p>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-8">
          {result && (
            <>
              <CodeDisplay
                code={currentCode}
                functionName={result.functionName}
                onCodeChange={onCodeChange}
              />
              <TestCasesTable
                testCases={currentTestCases}
                actualResults={actualResults}
                onTestCaseChange={onTestCaseChange}
              />
              {selectedDataset && (
                <DatasetTestRunner
                  dataset={selectedDataset}
                  code={currentCode}
                  functionName={result.functionName}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};