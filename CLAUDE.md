# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an n8n community node package for creating custom integrations. The repository follows the n8n nodes starter template structure for building custom nodes that can be published to npm and used in n8n workflows.

## Architecture

### Core Structure
- **Node classes**: Each node extends `INodeType` and implements an `execute()` method
- **Credentials**: API credentials are defined in separate `.credentials.ts` files  
- **Type safety**: Full TypeScript with strict configuration targeting ES2019
- **Build system**: TypeScript compilation + Gulp for asset copying

### Key Directories
- `nodes/`: Contains node implementations (`.node.ts` files)
- `credentials/`: Contains credential definitions (`.credentials.ts` files)
- `dist/`: Compiled output directory (generated during build)

### Node Implementation Pattern
Nodes implement the `INodeType` interface with:
- `description`: Node metadata (display name, properties, inputs/outputs)
- `execute()`: Async function that processes input data and returns results
- Error handling with `continueOnFail()` and `NodeOperationError`

## Development Commands

### Build and Development
```bash
npm run build          # Full build: clean, compile TypeScript, copy icons
npm run dev            # Watch mode for development
npm run format         # Format code with Prettier
```

### Code Quality
```bash
npm run lint           # Lint nodes, credentials, and package.json
npm run lintfix        # Auto-fix linting errors
```

### Publishing
```bash
npm run prepublishOnly # Pre-publish checks: build + strict linting
```

## ESLint Configuration

The project uses n8n-specific ESLint rules with different configurations for:
- `package.json`: Community package rules
- `credentials/*.ts`: Credential-specific rules (naming, OAuth2, documentation)
- `nodes/*.ts`: Node-specific rules (descriptions, parameters, operations)

## Build Process

1. **TypeScript compilation**: Outputs to `dist/` with declarations and source maps
2. **Icon copying**: Gulp task copies `.png/.svg` files from nodes/credentials to dist
3. **Strict linting**: Enhanced rules for pre-publish validation

## Testing Locally

Install the package locally in n8n to test nodes:
```bash
# In n8n installation directory
npm install /path/to/this/package
```

Then restart n8n to see the new nodes in the interface.