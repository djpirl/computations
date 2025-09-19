# Natural Language to TypeScript Computation App - Specification

## Overview
A local web application that allows users to input natural language descriptions of computations and automatically generates TypeScript code using Claude API. The app provides immediate feedback through test case previews and enables saving functions for use with real datasets.

## Core Features

### 1. Natural Language Input
- Text area for users to describe computations in plain English
- Support for various computation types (see Computation Types below)

### 2. Code Generation
- Integration with Claude API to generate TypeScript functions
- Display generated code with syntax highlighting
- Real-time code generation based on user input

### 3. Test Case Preview
- Automatic generation of 10 test cases
- Display input and output in a table format
- Immediate visual feedback on function behavior
- Ability to edit test cases manually

### 4. Function Management
- Save generated functions with custom names
- Load and edit previously saved functions
- Apply saved functions to CSV datasets

### 5. Dataset Integration
- Upload and manage CSV files
- Apply saved functions to entire datasets
- Export computation results

## Computation Types (Progressive Complexity)

### Phase 1: Single Table Computations
- Row-level transformations (e.g., "calculate tax from price", "format name as uppercase")
- Simple calculations (e.g., "add 10% to salary", "calculate age from birthdate")
- String manipulations (e.g., "extract domain from email", "combine first and last name")

### Phase 2: Single Table Aggregations
- Group by operations (e.g., "sum sales by category", "average age by department")
- Window functions (e.g., "running total", "rank by score")
- Statistical calculations (e.g., "standard deviation", "percentiles")

### Phase 3: Multi-Table Computations
- Simple joins (e.g., "match customers with orders")
- Lookup operations (e.g., "find product details for each sale")
- Cross-table calculations (e.g., "calculate customer lifetime value")

### Phase 4: Multi-Table Aggregations
- Complex joins with aggregations
- Hierarchical aggregations
- Pivot operations

### Phase 5: JSON Operations
- JSON construction from flat data
- JSON deconstruction to flat data
- Nested JSON transformations
- Schema transformations

## Technical Architecture

### Frontend
- React with TypeScript
- TailwindCSS for styling
- Monaco Editor for code display
- React Table for data display

### Backend
- Node.js/Express API server
- Claude API integration
- File system for function and dataset storage

### Data Flow
1. User enters natural language description
2. Backend sends prompt to Claude API with context
3. Claude returns TypeScript function
4. Backend generates test cases
5. Frontend displays code and test results
6. User can save function or apply to dataset

## User Interface Components

### Main Layout
- Header with app title and navigation
- Left panel: Natural language input and controls
- Center panel: Generated code display
- Right panel: Test cases table
- Bottom panel: Dataset operations

### Key Interactions
- "Generate Code" button to trigger AI generation
- "Run Tests" to execute test cases
- "Save Function" to persist for later use
- "Load Dataset" to upload CSV
- "Apply Function" to run on full dataset

## API Endpoints

### `/api/generate`
- POST: Generate TypeScript from natural language
- Request: `{ prompt: string, context?: object }`
- Response: `{ code: string, testCases: array }`

### `/api/functions`
- GET: List saved functions
- POST: Save new function
- PUT: Update existing function
- DELETE: Remove function

### `/api/datasets`
- GET: List available datasets
- POST: Upload new dataset
- DELETE: Remove dataset

### `/api/execute`
- POST: Execute function on dataset
- Request: `{ functionId: string, datasetId: string }`
- Response: `{ results: array, stats: object }`

## Prompt Engineering Strategy

### System Prompt Structure
```
You are an expert TypeScript developer generating data transformation functions.
Context: [table schema, sample data]
Task: Generate a TypeScript function that [user description]
Requirements:
- Pure functions only
- Type-safe with proper TypeScript types
- Handle edge cases
- Include JSDoc comments
```

### Progressive Examples
- Maintain library of example prompts and outputs
- Use few-shot learning for complex operations
- Context injection based on computation type

## Development Phases

### MVP (Phase 1)
- Basic UI with input/output panels
- Single table computations only
- Simple test case generation
- Local storage for functions

### Phase 2
- Add aggregation support
- Improve test case generation
- CSV upload/download

### Phase 3
- Multi-table operations
- Function composition
- Advanced prompt engineering

### Phase 4
- JSON operations
- Performance optimization
- Error handling improvements

### Phase 5
- Function library/marketplace
- Collaboration features
- Advanced debugging tools

## Success Metrics
- Code generation accuracy
- Test case relevance
- Function execution performance
- User task completion time
- Error rate reduction

## Security Considerations
- Sandboxed code execution
- Input validation
- API key management
- Rate limiting
- Data privacy

## Future Enhancements
- SQL generation alongside TypeScript
- Visual function builder
- AI-powered debugging
- Integration with popular data tools
- Real-time collaboration