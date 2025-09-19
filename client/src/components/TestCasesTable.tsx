import React from 'react';
import { TestCase } from '../../../shared/src/types';

interface TestCasesTableProps {
  testCases: TestCase[];
}

export const TestCasesTable: React.FC<TestCasesTableProps> = ({ testCases }) => {
  const formatValue = (value: any): string => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'string') return `"${value}"`;
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
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
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {testCases.map((testCase, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <pre className="whitespace-pre-wrap font-mono text-xs bg-gray-50 p-2 rounded">
                    {formatValue(testCase.input)}
                  </pre>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <pre className="whitespace-pre-wrap font-mono text-xs bg-gray-50 p-2 rounded">
                    {formatValue(testCase.expectedOutput)}
                  </pre>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};