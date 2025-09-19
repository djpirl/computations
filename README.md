# Natural Language to TypeScript Computation Generator

A local web application that converts natural language descriptions into TypeScript functions with automatic test case generation and preview.

## Features

- 🧠 **Natural Language Input**: Describe computations in plain English
- 🔧 **TypeScript Generation**: Pure functions with proper type annotations  
- 🧪 **Test Case Preview**: Automatic generation of 10 diverse test cases
- 💻 **Code Display**: Syntax-highlighted Monaco editor
- 🎯 **Single Table Focus**: Row-level transformations and calculations

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
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

## Usage

1. **Enter a natural language prompt** in the input area
2. **Click "Generate Code"** to create a TypeScript function
3. **Review the generated code** in the Monaco editor
4. **Examine test cases** to understand function behavior

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

## Supported Computation Types (Current MVP)

✅ **Single Table Computations**
- Row-level transformations
- Simple calculations
- String manipulations
- Date/time operations

🚧 **Coming Soon**
- Single table aggregations
- Multi-table computations
- JSON operations

## Environment Variables

- `CLAUDE_API_KEY` - Your Anthropic Claude API key (required)
- `PORT` - Server port (default: 3001)

## Troubleshooting

### Common Issues

1. **"CLAUDE_API_KEY not found"**
   - Ensure `.env` file exists with valid API key
   - Restart the server after adding the key

2. **Port conflicts**
   - Frontend runs on port 3000, backend on 3001
   - Change ports in `vite.config.ts` and server if needed

3. **Module not found errors**
   - Run `npm install` in root, server, client, and shared directories
   - Build shared types: `cd shared && npm run build`

### Development Tips

- Use the example prompts to test functionality
- Check browser console and server logs for errors
- Shared types must be built before running server/client

## Contributing

1. Follow existing code conventions
2. Test with various natural language prompts
3. Ensure TypeScript strict mode compliance
4. Update tests when adding features

## License

MIT