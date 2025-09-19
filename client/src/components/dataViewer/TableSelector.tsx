import React, { useState, useEffect } from 'react';
import { DatasetInfo } from '../../../../shared/src/types';

interface TableSelectorProps {
  selectedDataset: DatasetInfo | null;
  onDatasetSelect: (dataset: DatasetInfo) => void;
}

export const TableSelector: React.FC<TableSelectorProps> = ({
  selectedDataset,
  onDatasetSelect
}) => {
  const [datasets, setDatasets] = useState<DatasetInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDatasets();
  }, []);

  const fetchDatasets = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:9999/api/datasets');
      if (!response.ok) {
        throw new Error('Failed to fetch datasets');
      }
      const data = await response.json();
      setDatasets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const groupedDatasets = datasets.reduce((acc, dataset) => {
    if (!acc[dataset.category]) {
      acc[dataset.category] = [];
    }
    acc[dataset.category].push(dataset);
    return acc;
  }, {} as Record<string, DatasetInfo[]>);

  if (loading) {
    return (
      <div className="table-selector loading">
        <div className="loading-text">Loading tables...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="table-selector error">
        <div className="error-text">Error: {error}</div>
        <button onClick={fetchDatasets} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="table-selector">
      <div className="selector-header">
        <h3>Available Tables</h3>
        <div className="table-count">{datasets.length} tables</div>
      </div>

      <div className="table-groups">
        {Object.entries(groupedDatasets).map(([category, categoryDatasets]) => (
          <div key={category} className="table-group">
            <h4 className="group-header">
              {category === 'single-table' ? 'Single Tables' :
               category.includes('multi-table') ?
               category.split('/')[1]?.toUpperCase() || 'Multi-Table' :
               category}
            </h4>

            <div className="table-list">
              {categoryDatasets.map(dataset => (
                <button
                  key={dataset.name}
                  className={`table-item ${selectedDataset?.name === dataset.name ? 'selected' : ''}`}
                  onClick={() => onDatasetSelect(dataset)}
                >
                  <div className="table-info">
                    <div className="table-name">{dataset.name.split('/').pop()}</div>
                    <div className="table-meta">
                      <span className="row-count">{dataset.rowCount} rows</span>
                      <span className="col-count">{dataset.schema.columns.length} cols</span>
                    </div>
                  </div>
                  <div className="table-preview">
                    {dataset.schema.columns.slice(0, 3).map(col => (
                      <span key={col.name} className="col-type" title={col.name}>
                        {col.type.charAt(0)}
                      </span>
                    ))}
                    {dataset.schema.columns.length > 3 && (
                      <span className="more-cols">+{dataset.schema.columns.length - 3}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedDataset && (
        <div className="selected-table-info">
          <h4>Selected Table</h4>
          <div className="table-details">
            <div className="detail-row">
              <span className="label">Name:</span>
              <span className="value">{selectedDataset.name}</span>
            </div>
            <div className="detail-row">
              <span className="label">Rows:</span>
              <span className="value">{selectedDataset.rowCount.toLocaleString()}</span>
            </div>
            <div className="detail-row">
              <span className="label">Columns:</span>
              <span className="value">{selectedDataset.schema.columns.length}</span>
            </div>
          </div>

          <div className="column-list">
            <h5>Columns</h5>
            <div className="columns">
              {selectedDataset.schema.columns.map(col => (
                <div key={col.name} className="column-item">
                  <span className="column-name">{col.name}</span>
                  <span className={`column-type type-${col.type}`}>{col.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};