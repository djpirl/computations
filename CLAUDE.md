# Claude Integration Guide

## Project Overview
Interactive natural language to TypeScript computation generator with real-time code editing, test case validation, and live execution feedback.

## Key Context for Claude

### Function Generation Requirements
- Generate pure TypeScript functions
- Include proper type annotations
- Handle edge cases gracefully
- Return single values or objects
- No side effects or external dependencies

### Test Case Generation
- Create 10 diverse test cases
- Cover edge cases (null, undefined, empty strings)
- Include typical and boundary values
- Match the expected input schema

### Supported Computation Types
1. **Single Table Computations**: Row-level transformations
2. **Single Table Aggregations**: Group by, sum, avg, count
3. **Multi-Table Computations**: Joins and lookups
4. **Multi-Table Aggregations**: Complex joins with aggregations
5. **JSON Operations**: Construction and deconstruction

## Example Prompts and Expected Outputs

### Single Table Computation
**Prompt**: "Calculate 20% tax on price"
**Expected Function**:
```typescript
function calculateTax(row: { price: number }): number {
  return row.price * 0.20;
}
```

### Single Table Aggregation
**Prompt**: "Sum sales by category"
**Expected Function**:
```typescript
function sumSalesByCategory(rows: Array<{ category: string; sales: number }>): Record<string, number> {
  return rows.reduce((acc, row) => {
    acc[row.category] = (acc[row.category] || 0) + row.sales;
    return acc;
  }, {} as Record<string, number>);
}
```

## Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Run linter
- `npm run typecheck` - Check TypeScript types

## Project Structure
```
/computations
  /client         - React frontend
  /server         - Express backend
  /shared         - Shared types and utilities
  /data           - Sample CSV files
  /functions      - Saved functions
  CLAUDE.md       - This file
  SPEC.md         - Full specification
```

## Current Implementation Status ✅

### Core Features (Completed)
- ✅ **Function Generation**: Claude API integration generates TypeScript functions from natural language
- ✅ **Interactive Code Editor**: Monaco editor with TypeScript syntax highlighting and real-time editing
- ✅ **Editable Test Cases**: JSON-validated input/output fields with inline error feedback
- ✅ **Live Execution**: Real-time function execution with TypeScript-to-JavaScript conversion
- ✅ **Test Validation**: Pass/fail indicators with actual vs expected result comparison
- ✅ **Error Handling**: Comprehensive error handling for JSON parsing and function execution
- ✅ **Development Environment**: Hot-reload development server with client/server separation

### Architecture Overview

#### Client (React + Vite + TypeScript)
- **Port**: 3001 (auto-detects if 3000 is in use)
- **Monaco Editor**: Editable TypeScript code with syntax highlighting
- **Real-time Execution**: Functions execute 500ms after code/test changes (debounced)
- **TypeScript Stripping**: Intelligent regex-based type annotation removal for browser execution
- **JSON Validation**: Real-time JSON parsing with visual error feedback

#### Server (Express + TypeScript)
- **Port**: 9999 
- **Claude API**: Sonnet 4 integration for function generation
- **JSON Response Parsing**: Robust handling of Claude's markdown-wrapped responses
- **Type Safety**: Shared types between client and server

#### Key Technical Solutions
1. **TypeScript Execution**: Browser-compatible execution by stripping type annotations
2. **JSON Robustness**: Replaces `undefined` with `null` for valid JSON
3. **Real-time Updates**: Debounced execution prevents excessive API calls
4. **Error Isolation**: Invalid test cases don't break other test execution

### API Endpoints
- `POST /api/generate` - Generate function from natural language prompt
- `GET /health` - Server health check

### Development Workflow
```bash
npm run dev          # Start both client (3001) and server (9999)
npm run client:dev   # Client only
npm run server:dev   # Server only
```

## API Key Setup
Store Claude API key in `.env` file:
```
CLAUDE_API_KEY=your_key_here
```

## Repository
- **GitHub**: https://github.com/djpirl/computations
- **Commits**: Track progress and implementation history