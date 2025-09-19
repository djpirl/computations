import React from 'react';

export type TabType = 'computation' | 'dataViewer';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange
}) => {
  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'computation', label: 'Computation', icon: '⚡' },
    { id: 'dataViewer', label: 'Data Viewer', icon: '📊' }
  ];

  return (
    <div className="tab-navigation">
      <div className="tab-container">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};