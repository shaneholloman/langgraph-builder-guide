# LangGraph Builder Exports

This directory contains the raw exports from LangGraph Builder that serve as the starting point for our implementations.

## Contents

- **langgraph-agent.zip**: The original export zip file for the Claude chat example
- **langgraph-agent-export/**: Ephemerally extracted contents of the agent export (for reference only, to be deleted after use)

## Conventions

- New exports should be stored as zip files in this directory
- Zip files should generally not be extracted to avoid linting noise in the IDE
- Extracted files are temporary and intended only for immediate reference, not long-term storage
- After examining or copying the exported files to a new example, the extracted content should be deleted

## File Structure

Each LangGraph Builder export typically contains three files:

1. **spec.yml**: Defines the graph architecture (nodes, edges, conditions)
2. **stub.ts**: Provides the TypeScript scaffolding that implements the graph structure
3. **implementation.ts**: Contains placeholders for business logic

These files provide the foundation for implementations in the `/examples` directory.
