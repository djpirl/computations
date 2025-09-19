import React, { useState, useEffect } from 'react';
import { DatasetInfo } from '../../../shared/src/types';
import { CSVProcessor } from '../services/csvProcessor';

interface DatasetTestRunnerProps {
  dataset: DatasetInfo;
  code: string;
  functionName: string;
}

export const DatasetTestRunner: React.FC<DatasetTestRunnerProps> = ({
  dataset,
  code,
  functionName
}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [results, setResults] = useState<any>([]);
  const [error, setError] = useState<string | null>(null);
  const [isAggregation, setIsAggregation] = useState(false);

  useEffect(() => {
    loadDataset();
  }, [dataset]);

  useEffect(() => {
    if (data.length > 0 && code) {
      executeOnDataset();
    }
  }, [code, data]);

  const loadDataset = async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedData = await CSVProcessor.loadFromServer(dataset.name);
      setData(loadedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dataset');
    } finally {
      setLoading(false);
    }
  };

  const executeOnDataset = () => {
    try {
      // Strip TypeScript type annotations
      const jsCode = code
        // Remove type definitions: type Name = {...}
        .replace(/type\s+\w+\s*=\s*\{[^}]*\}\s*;?\s*/g, '')
        // Remove interface definitions: interface Name {...}
        .replace(/interface\s+\w+\s*\{[^}]*\}\s*/g, '')
        // Remove parameter type annotations: (param: Type) -> (param)
        .replace(/\(\s*([^)]+)\s*:\s*[^)]+\s*\)/g, '($1)')
        // Remove return type annotations: ): Type { -> ) {
        .replace(/\):\s*[^{]+\{/g, ') {')
        // Remove type annotations from parameters: param: Type -> param
        .replace(/(\w+)\s*:\s*[^,)]+/g, '$1')
        // Remove optional parameter markers: param? -> param
        .replace(/(\w+)\?\s*/g, '$1 ')
        // Remove remaining TypeScript keywords
        .replace(/\b(readonly|public|private|protected)\s+/g, '')
        // Clean up any remaining artifacts and extra whitespace
        .replace(/\s+/g, ' ')
        .trim();

      // Check if this is an aggregation function (takes array as input)
      const isAgg = code.includes('Array<') || code.includes('[]');
      setIsAggregation(isAgg);

      // Create and execute the function
      const executionCode = `
        ${jsCode}
        return ${functionName};
      `;

      const func = new Function(executionCode)();

      if (typeof func !== 'function') {
        throw new Error('Failed to create function');
      }

      const result = CSVProcessor.executeFunction(data, func, isAgg);
      setResults(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Execution failed');
      setResults([]);
    }
  };

  const renderResults = () => {
    if (isAggregation) {
      // Render aggregation results
      if (typeof results === 'object' && !Array.isArray(results)) {
        return (
          <div className="aggregation-results">
            <h4>Aggregation Results</h4>
            <table className="results-table">
              <thead>
                <tr>
                  <th>Group</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(results).map(([key, value]) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{JSON.stringify(value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      } else {
        return (
          <div className="aggregation-results">
            <h4>Result</h4>
            <pre>{JSON.stringify(results, null, 2)}</pre>
          </div>
        );
      }
    } else {
      // Render row-level transformation results
      return (
        <div className="transformation-results">
          <h4>Transformation Results (First 10 rows)</h4>
          <table className="results-table">
            <thead>
              <tr>
                <th>Row</th>
                <th>Input</th>
                <th>Output</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 10).map((row, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <pre>{JSON.stringify(row, null, 2)}</pre>
                  </td>
                  <td>
                    <pre>{JSON.stringify(results[index], null, 2)}</pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  };

  if (loading) {
    return <div className="dataset-test-runner loading">Loading dataset...</div>;
  }

  if (error) {
    return (
      <div className="dataset-test-runner error">
        <div className="error-message">Error: {error}</div>
        <button onClick={loadDataset}>Retry</button>
      </div>
    );
  }

  if (data.length === 0) {
    return <div className="dataset-test-runner">No data loaded</div>;
  }

  return (
    <div className="dataset-test-runner">
      <div className="dataset-info-bar">
        <span>Dataset: <strong>{dataset.name}</strong></span>
        <span>Rows: <strong>{data.length}</strong></span>
        <span>Type: <strong>{isAggregation ? 'Aggregation' : 'Row Transformation'}</strong></span>
      </div>
      {results && renderResults()}
    </div>
  );
};