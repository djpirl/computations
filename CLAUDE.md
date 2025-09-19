# Claude Integration Guide

## Project Overview
Natural language to TypeScript computation generator with test case preview and CSV dataset application.

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

## API Key Setup
Store Claude API key in `.env` file:
```
CLAUDE_API_KEY=your_key_here
```