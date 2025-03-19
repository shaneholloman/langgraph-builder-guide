# LangGraph Builder Implementation Examples

This directory contains working examples of implementations created from LangGraph Builder exports.

## Contents

- **claude-chat/**: A CLI chat application using Claude as the LLM

## Purpose

Each example demonstrates the process of implementing a LangGraph Builder export. They serve as reference implementations that show how to:

1. Implement business logic for the nodes defined in the export
2. Handle state management in a LangGraph application
3. Connect to external services (like LLMs)
4. Manage application flow through properly implemented routing

## Structure

Each example follows a consistent structure:

- **implementation.ts**: Contains the implemented business logic for the graph
- **types.ts**: Defines the TypeScript interfaces for the application state
- **constants.ts**: Configuration and constants
- **index.ts**: Entry point for running the example

## Running Examples

To run an example, use:

```bash
npx ts-node examples/[example-name]/index.ts
```

Or use the root-level index.ts which imports the selected example:

```bash
npx ts-node index.ts
```
