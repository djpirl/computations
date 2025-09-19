import React, { useEffect, useState } from 'react';
import { DatasetInfo } from '../../../shared/types';

interface DatasetSelectorProps {
  onDatasetSelect: (dataset: DatasetInfo | null) => void;
  selectedDatasets?: DatasetInfo[];
}

export const DatasetSelector: React.FC<DatasetSelectorProps> = ({
  onDatasetSelect,
  selectedDatasets = []
}) => {
  const [datasets, setDatasets] = useState<DatasetInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDataset, setSelectedDataset] = useState<string>('');
  const [showSchema, setShowSchema] = useState(false);

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

  const handleDatasetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const datasetName = e.target.value;
    setSelectedDataset(datasetName);

    if (datasetName) {
      const dataset = datasets.find(d => d.name === datasetName);
      onDatasetSelect(dataset || null);
      setShowSchema(true);
    } else {
      onDatasetSelect(null);
      setShowSchema(false);
    }
  };

  const getCurrentDataset = () => {
    return datasets.find(d => d.name === selectedDataset);
  };

  if (loading) {
    return (
      <div className="dataset-selector">
        <div className="loading">Loading datasets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dataset-selector">
        <div className="error">Error: {error}</div>
        <button onClick={fetchDatasets} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  const currentDataset = getCurrentDataset();

  return (
    <div className="dataset-selector">
      <div className="selector-header">
        <label htmlFor="dataset-select">Select Dataset:</label>
        <select
          id="dataset-select"
          value={selectedDataset}
          onChange={handleDatasetChange}
          className="dataset-select"
        >
          <option value="">-- Choose a dataset --</option>
          {datasets.map(dataset => (
            <option key={dataset.name} value={dataset.name}>
              {dataset.name} ({dataset.rowCount} rows)
            </option>
          ))}
        </select>
      </div>

      {showSchema && currentDataset && (
        <div className="dataset-info">
          <div className="schema-section">
            <h3>Dataset Schema</h3>
            <div className="schema-columns">
              {currentDataset.schema.columns.map(col => (
                <div key={col.name} className="column-info">
                  <span className="column-name">{col.name}</span>
                  <span className="column-type">{col.type}</span>
                </div>
              ))}
            </div>
          </div>

          {currentDataset.sample && currentDataset.sample.length > 0 && (
            <div className="sample-section">
              <h3>Sample Data (First 3 rows)</h3>
              <div className="sample-data">
                <pre>{JSON.stringify(currentDataset.sample, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};