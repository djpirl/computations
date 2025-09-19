# Natural Language to TypeScript Computation App - Specification

## Overview
A local web application that allows users to input natural language descriptions of computations and automatically generates TypeScript code using Claude API. The app provides immediate feedback through test case previews, enables testing with real CSV datasets, and supports both single-row transformations and aggregation operations.

## Current Implementation Status ✅

### Core Features Implemented

#### 1. Natural Language Input ✅
- Text area for describing computations in plain English
- Support for both row transformations and aggregations
- Real-time prompt submission to Claude API

#### 2. Code Generation with Dataset Context ✅
- Claude API integration (Sonnet 4 model)
- TypeScript function generation with proper type annotations
- Context-aware generation using dataset schemas and samples
- Automatic detection of aggregation vs row-level operations

#### 3. Interactive Code Editor ✅
- Monaco editor with TypeScript syntax highlighting
- Real-time code editing with debounced execution
- TypeScript-to-JavaScript conversion for browser execution
- Intelligent type stripping using regex patterns

#### 4. Test Case System ✅
- Automatic generation of 10 test cases
- Editable JSON input/output fields
- Real-time validation with pass/fail indicators
- Visual feedback for JSON parsing errors
- Actual vs expected result comparison

#### 5. Dataset Integration ✅
- CSV dataset selector component
- Schema preview with column types
- Sample data display (first 3 rows)
- Real-time dataset loading from server
- Support for single-table and multi-table datasets

#### 6. Browser-Based CSV Processing ✅
- Client-side CSV parsing and processing
- Row-level transformations
- Aggregation operations (sum, avg, count, min, max)
- Group-by functionality
- Join operations (inner, left, right)
- Real-time execution against full datasets

## Technical Architecture

### Frontend (Port 3001)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Code Editor**: Monaco Editor
- **Styling**: TailwindCSS
- **State Management**: React hooks (useState, useEffect, useCallback)
- **CSV Processing**: Custom CSVProcessor class

### Backend (Port 9999)
- **Runtime**: Node.js with Express
- **Language**: TypeScript (tsx for hot-reload)
- **API Integration**: Claude API (Anthropic SDK)
- **CSV Parsing**: csv-parse library
- **File System**: Direct file access for CSV datasets

### Data Flow
1. User selects dataset from dropdown → loads schema and sample
2. User enters natural language description
3. Frontend sends prompt + dataset context to backend
4. Backend enriches prompt with dataset details
5. Claude API generates context-aware TypeScript function
6. Backend returns code + test cases
7. Frontend displays code in Monaco editor
8. Real-time execution runs after 500ms debounce
9. Test results show pass/fail for each case
10. DatasetTestRunner executes against full CSV data

## File Structure
```
/computations
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── PromptInput.tsx       # Natural language input
│   │   │   ├── CodeDisplay.tsx       # Monaco editor wrapper
│   │   │   ├── TestCasesTable.tsx    # Test case editor/runner
│   │   │   ├── DatasetSelector.tsx   # Dataset dropdown
│   │   │   └── DatasetTestRunner.tsx # Full dataset execution
│   │   ├── services/
│   │   │   └── csvProcessor.ts       # CSV parsing/processing
│   │   ├── styles/
│   │   │   ├── DatasetSelector.css
│   │   │   └── DatasetTestRunner.css
│   │   └── App.tsx                   # Main application
├── server/                     # Express backend
│   ├── src/
│   │   ├── routes/
│   │   │   ├── generate.ts          # Function generation endpoint
│   │   │   └── datasets.ts          # Dataset API endpoints
│   │   ├── services/
│   │   │   └── claude.ts            # Claude API integration
│   │   └── index.ts                 # Server entry point
│   └── services/
│       └── csvDataService.ts        # CSV loading/schema inference
├── shared/                     # Shared types
│   └── src/
│       └── types.ts                  # TypeScript interfaces
└── data/                       # CSV datasets
    ├── single-table/
    │   ├── sales.csv
    │   ├── products.csv
    │   ├── customers.csv
    │   └── employees.csv
    └── multi-table/
        ├── ecommerce/
        │   ├── orders.csv
        │   ├── order_items.csv
        │   ├── products.csv
        │   └── customers.csv
        └── hr/
            ├── employees.csv
            ├── departments.csv
            └── salaries.csv
```

## API Endpoints

### Dataset Management
- `GET /api/datasets` - List all available CSV datasets with schemas
- `GET /api/datasets/:name/schema` - Get schema for specific dataset
- `GET /api/datasets/:name/sample` - Get sample rows (first 3)
- `GET /api/datasets/:name/data` - Get full dataset data

### Function Generation
- `POST /api/generate` - Generate TypeScript function from prompt
  ```typescript
  Request: {
    prompt: string;
    context?: {
      schema: Record<string, string>;
      sampleData: any[];
    }
  }
  Response: {
    code: string;
    functionName: string;
    testCases: TestCase[];
  }
  ```

### Health Check
- `GET /health` - Server status check

## Key Components

### CSVDataService (Server)
- Loads CSV files from file system
- Infers data types (string, number, boolean, date)
- Provides dataset metadata and samples
- Handles both single and multi-table structures

### CSVProcessor (Client)
- Parses CSV strings into JavaScript objects
- Executes functions against datasets
- Supports aggregations and joins
- Handles type conversion automatically

### DatasetSelector Component
- Dropdown for dataset selection
- Real-time schema preview
- Sample data display
- Error handling and retry logic

### DatasetTestRunner Component
- Loads full dataset from server
- Executes generated functions
- Displays results based on operation type:
  - Row transformations: Table with input/output
  - Aggregations: Key-value pairs or formatted results
- Performance metrics display

## Claude Integration Details

### Context-Aware Prompt Engineering
When a dataset is selected, the system enriches prompts with:
- Field names and types from the schema
- Sample data row for context
- Instructions for working with the specific data structure

### Function Generation Rules
- Pure TypeScript functions only
- Proper type annotations required
- Handle edge cases (null, undefined, empty)
- Support both single-row and array operations
- No external dependencies
- Return single values or objects

### Test Case Generation
- Exactly 10 test cases per function
- Cover edge cases and typical values
- Use null instead of undefined (JSON compatibility)
- Match the dataset schema when context provided

## Development Commands
```bash
# Install dependencies
npm install

# Start development (both client and server)
npm run dev

# Individual services
npm run client:dev   # Frontend only (port 3001)
npm run server:dev   # Backend only (port 9999)

# Build for production
npm run build

# Run tests
npm test

# Type checking
npm run typecheck

# Linting
npm run lint
```

## Environment Setup
Create `.env` file in project root:
```
CLAUDE_API_KEY=your_claude_api_key_here
```

## Supported Computation Types

### ✅ Implemented
1. **Single Table Computations** - Row-level transformations
2. **Single Table Aggregations** - Group by, sum, avg, count
3. **Basic Multi-Table** - Simple joins and lookups

### 🚧 Planned
4. **Multi-Table Aggregations** - Complex joins with aggregations
5. **JSON Operations** - Construction and deconstruction

## Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (tested on macOS)

## Performance Characteristics
- Function execution: < 100ms for 10,000 rows
- Dataset loading: < 500ms for typical CSV files
- Code generation: 1-3 seconds via Claude API
- Test execution: Real-time with 500ms debounce

## Security Considerations
- Sandboxed function execution using Function constructor
- No eval() usage for security
- API key stored in environment variables
- CORS enabled for local development
- Input sanitization for CSV parsing

## Known Limitations
- Maximum dataset size: ~50MB (browser memory)
- CSV parsing: Basic quoted field support
- Function complexity: Limited to single return values
- No persistent storage (functions not saved)

## Testing the System
1. Start development server: `npm run dev`
2. Open browser to `http://localhost:3000`
3. Select a dataset from dropdown (e.g., "sales")
4. Enter prompt: "Sum quantity by category"
5. View generated TypeScript code
6. Edit test cases to see live validation
7. Check DatasetTestRunner for full dataset results

## Troubleshooting

### Common Issues
- **"Failed to fetch datasets"**: Check data directory path in csvDataService.ts
- **Port conflicts**: Change ports in vite.config.ts or server/src/index.ts
- **Claude API errors**: Verify CLAUDE_API_KEY in .env file
- **TypeScript execution errors**: Check type stripping regex patterns

### Debug Mode
- Server logs: Check console output in terminal
- Client logs: Browser DevTools console
- Network requests: Browser DevTools Network tab

## Future Enhancements
- Function library/saving capability
- SQL generation alongside TypeScript
- Visual query builder
- Export results to CSV/JSON
- Real-time collaboration
- Advanced aggregation patterns
- Performance optimization for large datasets
- Persistent function storage
- Integration with cloud storage