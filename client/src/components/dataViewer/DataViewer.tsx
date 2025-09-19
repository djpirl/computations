import React, { useState, useEffect } from 'react';
import { DataTable } from './DataTable';
import { TableSelector } from './TableSelector';
import { CSVProcessor } from '../../services/csvProcessor';
import { DatasetInfo } from '../../../../shared/src/types';

interface DataViewerProps {
  selectedDataset: DatasetInfo | null;
  onDatasetSelect: (dataset: DatasetInfo) => void;
  generatedCode?: string;
  functionName?: string;
}

export const DataViewer: React.FC<DataViewerProps> = ({
  selectedDataset,
  onDatasetSelect,
  generatedCode,
  functionName
}) => {
  const [originalData, setOriginalData] = useState<any[]>([]);
  const [transformedData, setTransformedData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'original' | 'transformed' | 'comparison'>('original');
  const [isAggregation, setIsAggregation] = useState(false);

  // Load dataset when selected
  useEffect(() => {
    if (selectedDataset) {
      loadDataset();
    }
  }, [selectedDataset]);

  // Apply transformation when code changes
  useEffect(() => {
    if (originalData.length > 0 && generatedCode && functionName) {
      applyTransformation();
    }
  }, [generatedCode, originalData]);

  const loadDataset = async () => {
    if (!selectedDataset) return;

    try {
      setLoading(true);
      setError(null);
      const data = await CSVProcessor.loadFromServer(selectedDataset.name);
      setOriginalData(data);
      setTransformedData([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dataset');
    } finally {
      setLoading(false);
    }
  };

  const applyTransformation = () => {
    if (!generatedCode || !functionName) return;

    try {
      // Strip TypeScript type annotations
      const jsCode = generatedCode
        .replace(/\(\s*([^)]+)\s*:\s*[^)]+\s*\)/g, '($1)')
        .replace(/\):\s*[^{]+\{/g, ') {')
        .replace(/(\w+)\s*:\s*[^,)]+/g, '$1')
        .replace(/(\w+)\?\s*/g, '$1 ')
        .replace(/\s+/g, ' ');

      // Check if this is an aggregation
      const isAgg = generatedCode.includes('Array<') || generatedCode.includes('[]');
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

      const result = CSVProcessor.executeFunction(originalData, func, isAgg);

      // Convert aggregation results to table format
      if (isAgg && typeof result === 'object' && !Array.isArray(result)) {
        const tableData = Object.entries(result).map(([key, value]) => ({
          group: key,
          value: value
        }));
        setTransformedData(tableData);
      } else if (Array.isArray(result)) {
        setTransformedData(result);
      } else {
        // Single value result
        setTransformedData([{ result }]);
      }

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transformation failed');
      setTransformedData([]);
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header];
          // Escape commas and quotes in values
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value ?? '';
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Don't require selectedDataset anymore - show table selector

  if (loading) {
    return (
      <div className="data-viewer-loading">
        <p>Loading dataset...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="data-viewer-error">
        <p>Error: {error}</p>
        <button onClick={loadDataset}>Retry</button>
      </div>
    );
  }

  return (
    <div className="data-viewer">
      <div className="data-viewer-layout">
        <div className="sidebar">
          <TableSelector
            selectedDataset={selectedDataset}
            onDatasetSelect={onDatasetSelect}
          />
        </div>

        <div className="main-content">
          {selectedDataset ? (
            <>
              <div className="viewer-header">
                <h2>Data Viewer: {selectedDataset.name}</h2>

                <div className="view-mode-selector">
                  <button
                    className={`mode-button ${viewMode === 'original' ? 'active' : ''}`}
                    onClick={() => setViewMode('original')}
                  >
                    Original Data
                  </button>
                  {transformedData.length > 0 && (
                    <>
                      <button
                        className={`mode-button ${viewMode === 'transformed' ? 'active' : ''}`}
                        onClick={() => setViewMode('transformed')}
                      >
                        Transformed Data
                      </button>
                      <button
                        className={`mode-button ${viewMode === 'comparison' ? 'active' : ''}`}
                        onClick={() => setViewMode('comparison')}
                      >
                        Side-by-Side
                      </button>
                    </>
                  )}
                </div>

                <div className="export-controls">
                  {viewMode === 'original' && (
                    <button
                      className="export-button"
                      onClick={() => exportToCSV(originalData, `${selectedDataset.name}_original`)}
                    >
                      Export Original CSV
                    </button>
                  )}
                  {viewMode === 'transformed' && transformedData.length > 0 && (
                    <button
                      className="export-button"
                      onClick={() => exportToCSV(transformedData, `${selectedDataset.name}_transformed`)}
                    >
                      Export Transformed CSV
                    </button>
                  )}
                </div>
              </div>

              <div className="viewer-content">
                {viewMode === 'original' && (
                  <DataTable
                    data={originalData}
                    title="Original Dataset"
                    pageSize={50}
                  />
                )}

                {viewMode === 'transformed' && (
                  <DataTable
                    data={transformedData}
                    title={isAggregation ? 'Aggregation Results' : 'Transformed Data'}
                    pageSize={50}
                  />
                )}

                {viewMode === 'comparison' && (
                  <div className="comparison-view">
                    <div className="comparison-pane">
                      <DataTable
                        data={originalData}
                        title="Original"
                        pageSize={25}
                      />
                    </div>
                    <div className="comparison-pane">
                      <DataTable
                        data={transformedData}
                        title={isAggregation ? 'Aggregation Results' : 'Transformed'}
                        pageSize={25}
                      />
                    </div>
                  </div>
                )}
              </div>

              {generatedCode && (
                <div className="function-info">
                  <p>Applied Function: <code>{functionName}</code></p>
                  <p>Type: {isAggregation ? 'Aggregation' : 'Row Transformation'}</p>
                </div>
              )}
            </>
          ) : (
            <div className="no-table-selected">
              <div className="empty-state">
                <h3>Select a table to view data</h3>
                <p>Choose a table from the sidebar to explore its contents, or generate a function in the Computation tab first.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};