# LangGraph Builder Testing Guide

This document outlines the testing approach, structure, and commands for the LangGraph Builder implementation guide project.

## Testing Philosophy

The testing approach for this project follows these key principles:

1. **Simplicity over Complexity**: Each example app has a single consolidated test file to minimize maintenance overhead.
2. **Focus on Core Functionality**: Tests prioritize state management and core logic over implementation details.
3. **Judicious Mocking**: External dependencies are mocked to isolate the components being tested.
4. **Maintainable Tests**: The testing structure is designed to be easy to maintain as the project evolves.

## Test Structure

```tree
/tests
  /examples
    claude-chat-simplified.test.ts     # Simplified tests for claude-chat example
    claude-chat.test.ts                # More comprehensive tests (disabled for now)
  /common
    common.ts                          # Shared testing utilities and mocks
  test-all.ts                          # Master test runner
```

### Test Categories

1. **State Management Tests**: Verify the correct functioning of the state interface and transitions.
2. **Service Mocks**: Mock external services (Anthropic API, readline interface) to isolate tests.
3. **Integration Tests**: Test the flow through the state graph (simplified when needed).

## Test Commands

The following npm scripts are available for running tests:

```bash
# Run all tests
pnpm test

# Run tests in watch mode during development
pnpm test:watch

# Run tests with verbose output
pnpm test -- --verbose

# Run specific tests by pattern
pnpm test -- -t "State management"

# Generate coverage report
pnpm test

# Run only specific test files
pnpm test -- tests/examples/claude-chat-simplified.test.ts
```

## Mock Implementation

### Anthropic API Mock

The `MockAnthropic` class in `tests/common.ts` provides a mock implementation of the Anthropic API:

```typescript
export class MockAnthropic {
  // Store calls for verification in tests
  public messagesCalls: any[] = [];
  public mockResponse: any = {
    content: [{ text: 'Mock response from Claude' }]
  };
  public mockError: Error | null = null;

  messages = {
    create: jest.fn(async (options: any) => {
      this.messagesCalls.push(options);

      if (this.mockError) {
        throw this.mockError;
      }

      return this.mockResponse;
    })
  };

  // Helper methods for test setup
  setMockResponse(response: any) {...}
  setMockError(error: Error) {...}
  reset() {...}
}
```

### Readline Mock

The `MockReadline` class simulates user input for tests:

```typescript
export class MockReadline {
  private responseQueue: string[] = [];
  private questionCallback: ((answer: string) => void) | null = null;

  // Methods for simulating user input
  createInterface() {...}
  queueUserInput(...responses: string[]) {...}
  answerQuestion(response: string) {...}
  reset() {...}
}
```

### Console Mock

The `mockConsole` function captures console output for verification:

```typescript
export function mockConsole() {
  // Implementation details
  return {
    getLogs: () => logs,
    clear: () => { logs.length = 0; }
  };
}
```

## Test Examples

### State Management Tests

```typescript
test('creates initial state correctly', () => {
  const initialState = createInitialState(DEFAULT_SYSTEM_PROMPT);

  // Verify state structure
  expect(initialState).toHaveProperty('messages');
  expect(initialState.messages).toHaveLength(1);
  expect(initialState.messages[0]).toEqual({
    role: 'system',
    content: DEFAULT_SYSTEM_PROMPT
  });
});
```

### State Transition Tests

```typescript
test('state management works as expected', () => {
  // Create initial state
  const initialState = createInitialState('You are a test assistant');

  // Add a user message
  const stateWithUserMessage = {
    ...initialState,
    messages: [
      ...initialState.messages,
      { role: 'user', content: 'Hello' }
    ]
  };

  // Simulate adding an assistant response
  const stateWithAssistantResponse = {
    ...stateWithUserMessage,
    messages: [
      ...stateWithUserMessage.messages,
      { role: 'assistant', content: 'Hi there!' }
    ],
    currentResponse: 'Hi there!'
  };

  // Verify the state transitions
  expect(stateWithUserMessage.messages).toHaveLength(2);
  expect(stateWithAssistantResponse.messages).toHaveLength(3);
});
```

## Testing Challenges

### Module-Level Variables

The current implementation uses module-level variables for external dependencies, which makes testing more challenging:

```typescript
// In implementation.ts
const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
```

This makes it difficult to mock these dependencies effectively. Future refactoring (as outlined in `docs/plans/implementation-testability-refactoring.md`) will address this by introducing dependency injection.

### Asynchronous Testing

Testing LangGraph implementations requires careful handling of asynchronous operations. All async tests use the `async/await` pattern:

```typescript
test('processes user input and generates responses', async () => {
  // Setup...

  // Invoke the agent with the initial state
  const result = await compiledAgent.invoke(stateWithInput);

  // Assertions...
});
```

## Future Testing Improvements

As outlined in the [Implementation Testability Refactoring Plan](../plans/implementation-testability-refactoring.md), future improvements will:

1. Refactor the implementation to use dependency injection
2. Separate I/O operations from core business logic
3. Create reusable testing patterns for LangGraph Builder exports
4. Expand test coverage while maintaining simplicity

## Recommended Testing Practices

When adding new examples or modifying existing ones:

1. Focus on state management tests first
2. Create mocks for any external services
3. Test core logic in isolation when possible
4. Keep tests simple and focused on one aspect at a time
5. Use the shared utilities in `tests/common.ts`
6. Update the master test runner (`test-all.ts`) to include new tests
