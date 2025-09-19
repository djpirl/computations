import React from 'react';
import { DataViewer } from '../dataViewer/DataViewer';
import { DatasetInfo } from '../../../../shared/src/types';

interface DataViewerTabProps {
  selectedDataset: DatasetInfo | null;
  onDatasetSelect: (dataset: DatasetInfo) => void;
  generatedCode?: string;
  functionName?: string;
}

export const DataViewerTab: React.FC<DataViewerTabProps> = ({
  selectedDataset,
  onDatasetSelect,
  generatedCode,
  functionName
}) => {
  return (
    <div className="data-viewer-tab">
      <DataViewer
        selectedDataset={selectedDataset}
        onDatasetSelect={onDatasetSelect}
        generatedCode={generatedCode}
        functionName={functionName}
      />
    </div>
  );
};