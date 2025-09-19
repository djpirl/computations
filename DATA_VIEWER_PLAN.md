# Data Viewer Tab Implementation Plan

## Overview
Add a dedicated data viewer tab separate from the computation interface, allowing users to:
- View full datasets with all rows and columns
- Compare original data with transformed results
- Sort, filter, and search through data
- Better verify computation results

## UI Architecture

### Tab Structure
```
[Computation] [Data Viewer]
```

#### Computation Tab (existing)
- Natural language input
- Generated code editor
- Test cases
- Dataset selector

#### Data Viewer Tab (new)
- Full dataset table view
- Transformation results view
- Before/After comparison mode
- Export functionality

## Component Breakdown

### 1. TabNavigation Component
```typescript
interface TabNavigationProps {
  activeTab: 'computation' | 'dataViewer';
  onTabChange: (tab: string) => void;
}
```
- Simple tab switcher at the top of the app
- Maintains state of active tab
- Styled with active/inactive states

### 2. DataViewer Component
```typescript
interface DataViewerProps {
  dataset: DatasetInfo | null;
  transformedData?: any[];
  generatedFunction?: Function;
}
```

Features:
- Full table display with virtualization for performance
- Pagination (50/100/500 rows per page)
- Column sorting (ascending/descending)
- Search box for filtering rows
- Column visibility toggles
- Export to CSV button

### 3. DataTable Subcomponent
```typescript
interface DataTableProps {
  data: any[];
  columns: string[];
  pageSize: number;
  onSort: (column: string) => void;
  searchTerm: string;
}
```
- Reusable table component
- Handles pagination logic
- Implements sorting
- Applies search filtering

### 4. ComparisonView Component
```typescript
interface ComparisonViewProps {
  originalData: any[];
  transformedData: any[];
  mode: 'sideBySide' | 'overlay';
}
```
- Shows before/after transformation
- Highlights changes
- Synchronized scrolling

## Implementation Steps

### Phase 1: Basic Tab Structure
1. Create TabNavigation component
2. Modify App.tsx to support tab switching
3. Move existing computation UI into ComputationTab component
4. Create empty DataViewer component

### Phase 2: Data Table Implementation
1. Build DataTable component with basic display
2. Add pagination controls
3. Implement column sorting
4. Add search/filter functionality

### Phase 3: Data Viewer Features
1. Integrate DataTable into DataViewer
2. Add column visibility toggles
3. Implement CSV export
4. Add data statistics (row count, column info)

### Phase 4: Transformation Display
1. Execute functions on full dataset
2. Display results in separate table
3. Add comparison view
4. Implement diff highlighting

### Phase 5: Performance & Polish
1. Add virtualization for large datasets
2. Optimize re-renders
3. Add loading states
4. Improve styling and UX

## Technical Considerations

### Performance
- Use React.memo for table rows
- Implement virtual scrolling for >1000 rows
- Debounce search input
- Lazy load data on tab switch

### State Management
- Keep dataset in App component
- Pass down to both tabs
- Cache transformation results
- Maintain pagination/sort state per session

### User Experience
- Show loading indicators
- Handle empty states
- Provide clear error messages
- Maintain scroll position on tab switch

## File Structure
```
/client/src/components/
├── tabs/
│   ├── TabNavigation.tsx
│   ├── ComputationTab.tsx
│   └── DataViewerTab.tsx
├── dataViewer/
│   ├── DataViewer.tsx
│   ├── DataTable.tsx
│   ├── ComparisonView.tsx
│   └── ExportButton.tsx
└── common/
    ├── Pagination.tsx
    └── SearchBar.tsx
```

## Styling Approach
- Consistent with existing TailwindCSS theme
- Responsive design for different screen sizes
- Clear visual hierarchy
- Accessible color contrasts
- Hover states for interactive elements

## Success Criteria
- Users can view entire datasets without scrolling limitations
- Clear visibility of all data transformations
- Performance remains smooth with 10,000+ rows
- Easy comparison between original and transformed data
- Intuitive navigation between computation and viewing