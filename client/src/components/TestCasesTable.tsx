import React, { useState } from 'react';
import { TestCase } from '../../../shared/src/types';

interface TestCasesTableProps {
  testCases: TestCase[];
  actualResults?: any[];
  onTestCaseChange: (index: number, updatedTestCase: TestCase) => void;
}

export const TestCasesTable: React.FC<TestCasesTableProps> = ({ testCases, actualResults, onTestCaseChange }) => {
  const [editingInputs, setEditingInputs] = useState<{ [key: number]: string }>({});
  const [editingOutputs, setEditingOutputs] = useState<{ [key: number]: string }>({});
  const [jsonErrors, setJsonErrors] = useState<{ [key: string]: string }>({});

  const formatValue = (value: any): string => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'string') return `"${value}"`;
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  };

  const validateAndParseJSON = (jsonString: string, fallback: any) => {
    try {
      return { value: JSON.parse(jsonString), error: null };
    } catch (error) {
      return { value: fallback, error: error.message };
    }
  };

  const handleInputChange = (index: number, newInput: string) => {
    setEditingInputs(prev => ({ ...prev, [index]: newInput }));
    
    const { value, error } = validateAndParseJSON(newInput, testCases[index].input);
    setJsonErrors(prev => ({ 
      ...prev, 
      [`input-${index}`]: error 
    }));
    
    if (!error) {
      const updatedTestCase = { ...testCases[index], input: value };
      onTestCaseChange(index, updatedTestCase);
    }
  };

  const handleExpectedOutputChange = (index: number, newOutput: string) => {
    setEditingOutputs(prev => ({ ...prev, [index]: newOutput }));
    
    const { value, error } = validateAndParseJSON(newOutput, testCases[index].expectedOutput);
    setJsonErrors(prev => ({ 
      ...prev, 
      [`output-${index}`]: error 
    }));
    
    if (!error) {
      const updatedTestCase = { ...testCases[index], expectedOutput: value };
      onTestCaseChange(index, updatedTestCase);
    }
  };

  const getInputValue = (index: number) => {
    return editingInputs[index] !== undefined ? editingInputs[index] : formatValue(testCases[index].input);
  };

  const getOutputValue = (index: number) => {
    return editingOutputs[index] !== undefined ? editingOutputs[index] : formatValue(testCases[index].expectedOutput);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Test Cases</h2>
        <p className="text-sm text-gray-600 mt-1">
          {testCases.length} test cases generated to validate your function
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Input
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expected Output
              </th>
              {actualResults && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actual Result
                </th>
              )}
              {actualResults && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {testCases.map((testCase, index) => {
              const actualResult = actualResults?.[index];
              const isMatch = actualResult !== undefined && JSON.stringify(actualResult) === JSON.stringify(testCase.expectedOutput);
              
              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="space-y-1">
                      <textarea
                        className={`w-full font-mono text-xs p-2 rounded border resize-none ${
                          jsonErrors[`input-${index}`] 
                            ? 'bg-red-50 border-red-300' 
                            : 'bg-gray-50 border-gray-200'
                        }`}
                        rows={3}
                        value={getInputValue(index)}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        placeholder="Edit input (JSON format)..."
                      />
                      {jsonErrors[`input-${index}`] && (
                        <div className="text-xs text-red-600">
                          JSON Error: {jsonErrors[`input-${index}`]}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="space-y-1">
                      <textarea
                        className={`w-full font-mono text-xs p-2 rounded border resize-none ${
                          jsonErrors[`output-${index}`] 
                            ? 'bg-red-50 border-red-300' 
                            : 'bg-gray-50 border-gray-200'
                        }`}
                        rows={3}
                        value={getOutputValue(index)}
                        onChange={(e) => handleExpectedOutputChange(index, e.target.value)}
                        placeholder="Edit expected output (JSON format)..."
                      />
                      {jsonErrors[`output-${index}`] && (
                        <div className="text-xs text-red-600">
                          JSON Error: {jsonErrors[`output-${index}`]}
                        </div>
                      )}
                    </div>
                  </td>
                  {actualResults && (
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <pre className="whitespace-pre-wrap font-mono text-xs bg-gray-50 p-2 rounded">
                        {formatValue(actualResult)}
                      </pre>
                    </td>
                  )}
                  {actualResults && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          actualResult === undefined
                            ? 'bg-gray-100 text-gray-800'
                            : isMatch
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {actualResult === undefined ? 'Not Run' : isMatch ? 'Pass' : 'Fail'}
                      </span>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};