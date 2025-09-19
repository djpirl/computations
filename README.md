# Natural Language to TypeScript Computation Generator

An interactive web application that converts natural language descriptions into editable TypeScript functions with real-time test execution and live feedback.

## ✨ Features

- 🧠 **Natural Language Input**: Describe computations in plain English
- 🔧 **Interactive TypeScript Editor**: Editable Monaco editor with syntax highlighting
- 🧪 **Live Test Execution**: Real-time function testing with pass/fail indicators
- ✏️ **Editable Test Cases**: Modify inputs and expected outputs with JSON validation
- ⚡ **Real-time Updates**: Functions execute automatically as you edit code or tests
- 🎯 **Intelligent Execution**: TypeScript-to-JavaScript conversion for browser compatibility
- 🔍 **Visual Feedback**: Color-coded test results and error messages

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- Claude API key from Anthropic

### Setup

1. **Clone and navigate to the project**:
   ```bash
   git clone <repository-url>
   cd computations
   ```

2. **Install dependencies**:
   ```bash
   npm install
   cd server && npm install
   cd ../client && npm install
   cd ../shared && npm install && npm run build
   cd ..
   ```

3. **Configure environment**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Claude API key:
   ```
   CLAUDE_API_KEY=your_claude_api_key_here
   ```

4. **Start the application**:
   ```bash
   npm run dev
   ```

   This starts:
   - Frontend: http://localhost:3001 (auto-detects available port)
   - Backend: http://localhost:9999

## 🚀 Usage

1. **Enter a natural language prompt** describing your desired function
2. **Click "Generate Code"** to create a TypeScript function with test cases
3. **Edit the generated code** in the Monaco editor - changes execute automatically
4. **Modify test cases** - edit inputs and expected outputs in JSON format
5. **View real-time results** - see pass/fail status and actual outputs immediately
6. **Iterate and refine** - make changes and see results update in real-time

### Example Prompts

- "Calculate 20% tax on price"
- "Format full name from first and last name"
- "Calculate age from birth date"
- "Convert temperature from Celsius to Fahrenheit"
- "Extract domain from email address"

## Project Structure

```
/computations
├── client/          # React frontend (Vite + TailwindCSS)
├── server/          # Express backend with Claude API
├── shared/          # Shared TypeScript types
├── data/            # Sample CSV files
├── functions/       # Saved functions
├── .env            # Environment variables
├── CLAUDE.md       # Claude integration guide
└── SPEC.md         # Full specification
```

## Development Commands

```bash
# Start development servers (frontend + backend)
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Run linters
npm run lint

# Type checking
npm run typecheck
```

## Individual Service Commands

### Server
```bash
cd server
npm run dev      # Development with hot reload
npm run build    # Build TypeScript
npm run start    # Production server
```

### Client
```bash
cd client
npm run dev      # Vite dev server
npm run build    # Production build
npm run preview  # Preview production build
```

## API Endpoints

- `POST /api/generate` - Generate TypeScript from natural language
- `GET /health` - Health check

## 🎯 Current Implementation Status

### ✅ **Fully Implemented Features**
- **Interactive Code Generation**: Natural language → TypeScript functions
- **Real-time Code Editing**: Monaco editor with TypeScript syntax highlighting
- **Live Test Execution**: Functions execute as you type with 500ms debouncing
- **Editable Test Cases**: JSON-validated input/output editing with error feedback
- **TypeScript Compatibility**: Intelligent type stripping for browser execution
- **Visual Test Results**: Pass/fail indicators with actual vs expected comparison
- **Error Handling**: Comprehensive error messages for JSON and execution errors
- **Development Environment**: Hot-reload setup with client/server separation

### 🚧 **Future Roadmap**
- **CSV Dataset Integration**: Apply functions to uploaded CSV files
- **Function Persistence**: Save and load generated functions
- **Advanced Computations**: Multi-table joins and aggregations
- **Export Options**: Download functions as standalone TypeScript files
- **Performance Analytics**: Execution time and memory usage metrics

## 🔧 Environment Variables

- `CLAUDE_API_KEY` - Your Anthropic Claude API key (required)
- `PORT` - Server port (default: 9999)

## Troubleshooting

### Common Issues

1. **"CLAUDE_API_KEY not found"**
   - Ensure `.env` file exists with valid API key
   - Restart the server after adding the key

2. **Port conflicts**
   - Frontend auto-detects available port (usually 3001)
   - Backend runs on port 9999 by default
   - Check console output for actual ports being used

3. **Module not found errors**
   - Run `npm install` in root, server, client, and shared directories
   - Build shared types: `cd shared && npm run build`

### Development Tips

- **Testing Functions**: Use the example prompts to test different scenarios
- **Debugging**: Check browser console and server logs for detailed error info  
- **JSON Editing**: Test cases must be valid JSON - watch for red error indicators
- **Real-time Feedback**: Changes execute automatically after 500ms - no need to manually run
- **TypeScript vs JavaScript**: Code displays as TypeScript but executes as JavaScript
- **Shared Types**: Build shared types before running: `cd shared && npm run build`

### 🎉 **What's Working Now**

This project successfully demonstrates:
- **AI-Powered Code Generation** with Claude API integration
- **Real-time Interactive Development** with live code execution
- **Type-Safe Development** with full TypeScript support
- **Modern Web Architecture** with React, Vite, Express, and Monaco Editor
- **Robust Error Handling** for both development and runtime errors

## Contributing

1. Follow existing code conventions
2. Test with various natural language prompts
3. Ensure TypeScript strict mode compliance
4. Update tests when adding features

## License

MIT