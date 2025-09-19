# CSV Dataset Integration Plan

## Overview

This document outlines the approach for integrating CSV datasets with our interactive TypeScript computation generator to support testing and development of:
- Single-table aggregations (group by, sum, avg, count)
- Multi-table computations (joins and lookups)
- Multi-table aggregations (complex joins with aggregations)

## Current Architecture Context

### Existing System
- **Frontend**: React app with Monaco editor and real-time function execution
- **Backend**: Express server with Claude API integration for function generation
- **Function Execution**: Browser-based execution with TypeScript-to-JavaScript conversion
- **Test Cases**: JSON-based input/output validation with live feedback

### Integration Goals
1. **Dataset Awareness**: Functions should understand available CSV data structure
2. **Context-Aware Generation**: Claude should generate functions based on actual data schemas
3. **Live Testing**: Execute functions against real CSV data in the browser
4. **Multi-table Support**: Handle relationships and joins between datasets

## Proposed CSV Dataset Structure

### File Organization
```
/data/
├── single-table/
│   ├── sales.csv           # Sales transactions
│   ├── products.csv        # Product catalog
│   ├── customers.csv       # Customer information
│   └── employees.csv       # Employee data
├── multi-table/
│   ├── ecommerce/
│   │   ├── orders.csv      # Order records
│   │   ├── order_items.csv # Order line items
│   │   ├── products.csv    # Product details
│   │   └── customers.csv   # Customer profiles
│   └── hr/
│       ├── employees.csv   # Employee records
│       ├── departments.csv # Department info
│       └── salaries.csv    # Salary history
└── schemas/
    ├── single-table.json   # Schema definitions for single tables
    └── multi-table.json    # Relationship definitions
```

### Sample Dataset Designs

#### Single-Table Aggregation Examples

**sales.csv** - For aggregation operations
```csv
id,date,product_id,customer_id,quantity,price,category,region
1,2024-01-15,101,1001,2,29.99,Electronics,North
2,2024-01-15,102,1002,1,49.99,Books,South
3,2024-01-16,101,1003,3,29.99,Electronics,North
```

**products.csv** - For lookup and filtering
```csv
product_id,name,category,price,supplier,in_stock
101,Wireless Mouse,Electronics,29.99,TechCorp,true
102,Programming Guide,Books,49.99,BookPress,true
103,Keyboard,Electronics,79.99,TechCorp,false
```

#### Multi-Table Computation Examples

**ecommerce/orders.csv**
```csv
order_id,customer_id,order_date,total_amount,status,shipping_address
1001,501,2024-01-15,159.97,completed,"123 Main St"
1002,502,2024-01-16,49.99,pending,"456 Oak Ave"
```

**ecommerce/order_items.csv**
```csv
item_id,order_id,product_id,quantity,unit_price
1,1001,101,2,29.99
2,1001,103,1,79.99
3,1002,102,1,49.99
```

## Technical Implementation Plan

### Phase 1: CSV Data Loading & Schema Detection

#### Backend Enhancements
1. **CSV Parser Service**
   ```typescript
   class CSVDataService {
     loadDataset(path: string): Promise<any[]>
     inferSchema(data: any[]): TableSchema
     getAvailableDatasets(): DatasetInfo[]
   }
   ```

2. **Schema API Endpoints**
   ```
   GET /api/datasets - List available CSV datasets
   GET /api/datasets/:name/schema - Get schema for specific dataset
   GET /api/datasets/:name/sample - Get sample rows
   ```

#### Frontend Integration
1. **Dataset Selector Component**
   - Dropdown to choose available datasets
   - Schema preview with column types
   - Sample data display

2. **Context-Aware Function Generation**
   - Include dataset schema in Claude prompts
   - Generate functions with appropriate input types

### Phase 2: Enhanced Function Generation

#### Prompt Engineering Updates
```typescript
const generateWithDataContext = async (prompt: string, datasets: Dataset[]) => {
  const contextPrompt = `
Available datasets:
${datasets.map(ds => `
${ds.name}: ${ds.columns.map(col => `${col.name}: ${col.type}`).join(', ')}
Sample: ${JSON.stringify(ds.sample[0])}
`).join('\n')}

Task: ${prompt}

Generate a TypeScript function that works with this data structure.
For aggregations, return grouped results as objects.
For joins, specify the relationship keys clearly.
`;
}
```

#### Enhanced Test Case Generation
- Generate test cases using actual CSV data samples
- Create realistic scenarios based on data patterns
- Include edge cases specific to the dataset

### Phase 3: Live CSV Data Execution

#### Browser-based CSV Processing
```typescript
class CSVProcessor {
  loadCSV(csvContent: string): any[]
  executeAggregation(data: any[], func: Function): any
  executeJoin(leftData: any[], rightData: any[], func: Function): any[]
}
```

#### Real-time Testing Integration
- Load CSV data into browser for function testing
- Execute functions against full datasets
- Display aggregation results in tabular format
- Support multi-table operations with relationship validation

### Phase 4: Advanced Features

#### Multi-Table Relationship Management
```typescript
interface TableRelationship {
  leftTable: string;
  rightTable: string;
  leftKey: string;
  rightKey: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
}
```

#### Performance Optimization
- Lazy loading for large datasets
- Chunked processing for aggregations
- IndexedDB caching for frequently used datasets

## Function Type Examples

### Single-Table Aggregations
```typescript
// Generated function example
function salesByCategory(data: Sales[]): Record<string, number> {
  return data.reduce((acc, row) => {
    acc[row.category] = (acc[row.category] || 0) + row.price * row.quantity;
    return acc;
  }, {} as Record<string, number>);
}
```

### Multi-Table Computations
```typescript
// Generated function example
function orderDetailsWithProducts(
  orders: Order[], 
  orderItems: OrderItem[], 
  products: Product[]
): EnrichedOrder[] {
  return orders.map(order => ({
    ...order,
    items: orderItems
      .filter(item => item.order_id === order.order_id)
      .map(item => ({
        ...item,
        product: products.find(p => p.product_id === item.product_id)
      }))
  }));
}
```

## UI/UX Enhancements

### Dataset Explorer
- Tree view of available datasets
- Column metadata display
- Data preview with pagination
- Schema visualization

### Enhanced Test Results
- Tabular display for aggregation results
- Relationship visualization for joins
- Performance metrics (rows processed, execution time)
- Export results to CSV

### Function Templates
- Pre-built function templates for common operations
- Dataset-specific examples
- Pattern recognition for similar operations

## Implementation Timeline

### Sprint 1: Foundation
- [ ] Create sample CSV datasets
- [ ] Implement CSV loading service
- [ ] Add dataset selection to UI
- [ ] Basic schema inference

### Sprint 2: Context-Aware Generation
- [ ] Update Claude prompts with dataset context
- [ ] Generate functions with proper data types
- [ ] Enhanced test case generation with real data

### Sprint 3: Live Execution
- [ ] Browser-based CSV processing
- [ ] Real-time function testing with datasets
- [ ] Aggregation result visualization

### Sprint 4: Multi-Table Operations
- [ ] Relationship definition system
- [ ] Join operation support
- [ ] Complex aggregation handling
- [ ] Performance optimization

## Success Metrics

1. **Functionality**: Generate accurate functions for all computation types
2. **Usability**: Intuitive dataset selection and result visualization
3. **Performance**: Handle datasets up to 10,000 rows smoothly
4. **Accuracy**: Functions execute correctly against real data
5. **Coverage**: Support for 80% of common business computation patterns

## Technical Considerations

### Data Size Limits
- Browser memory limitations for large datasets
- Streaming/chunking for files > 50MB
- Progressive loading strategies

### Type Safety
- Runtime type validation for CSV data
- Schema migration handling
- Type inference improvements

### Error Handling
- Invalid CSV format handling
- Missing relationship key detection
- Performance timeout management

### Security
- CSV content sanitization
- No server-side file execution
- Client-side data processing only

This approach leverages our existing real-time execution architecture while adding the data context needed for more sophisticated computation types.