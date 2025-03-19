// jest is available globally in the test environment
import * as readline from 'readline';
import { Anthropic } from '@anthropic-ai/sdk';

import { createInitialState } from '../../examples/claude-chat/types';
import { DEFAULT_SYSTEM_PROMPT } from '../../examples/claude-chat/constants';
import { MockAnthropic, MockReadline, mockConsole } from '../common';

// Import the compiled agent from implementation
import { compiledAgent } from '../../examples/claude-chat/implementation';

// Mock dependencies
jest.mock('@anthropic-ai/sdk');
jest.mock('readline');

describe('Claude Chat Example', () => {
  // Setup console mocking to capture output
  const consoleMock = mockConsole();

  // Create instances of our mocks
  const mockAnthropicInstance = new MockAnthropic();
  const mockReadlineInstance = new MockReadline();

  // Setup before each test
  beforeEach(() => {
    // Clear mocks
    jest.clearAllMocks();
    mockAnthropicInstance.reset();
    mockReadlineInstance.reset();

    // Setup Anthropic mock
    (Anthropic as jest.MockedClass<typeof Anthropic>).mockImplementation(() => {
      return mockAnthropicInstance as unknown as Anthropic;
    });

    // Setup readline mock
    (readline.createInterface as jest.Mock).mockImplementation(() => {
      return mockReadlineInstance.createInterface();
    });
  });

  test('creates initial state correctly', () => {
    // Test initial state creation
    const initialState = createInitialState(DEFAULT_SYSTEM_PROMPT);

    // Verify state structure
    expect(initialState).toHaveProperty('messages');
    expect(initialState.messages).toHaveLength(1);
    expect(initialState.messages[0]).toEqual({
      role: 'system',
      content: DEFAULT_SYSTEM_PROMPT
    });
    expect(initialState.userInput).toBeUndefined();
    expect(initialState.currentResponse).toBeUndefined();
  });

  test('processes user input and generates responses', async () => {
    // Create an initial state
    const initialState = createInitialState('You are a test assistant');

    // Initialize state with user input
    const stateWithInput = {
      ...initialState,
      userInput: 'Hello, Claude!'
    };

    // Setup mock response
    mockAnthropicInstance.setMockResponse({
      content: [{ text: 'Hello! I am Claude, how can I help you today?' }]
    });

    // Queue user response for the readline mock
    mockReadlineInstance.queueUserInput('Tell me about AI');

    // Invoke the agent with the initial state
    const result = await compiledAgent.invoke(stateWithInput);

    // Verify Claude API was called
    expect(mockAnthropicInstance.messagesCalls.length).toBeGreaterThan(0);

    // Verify response handling
    const logs = consoleMock.getLogs();
    expect(logs.some(log => log.includes('Hello! I am Claude'))).toBeTruthy();
  });

  test('handles API errors gracefully', async () => {
    // Create initial state with user input
    const stateWithInput = {
      ...createInitialState('You are a test assistant'),
      userInput: 'Trigger an error'
    };

    // Setup mock to throw an error
    mockAnthropicInstance.setMockError(new Error('API Error'));

    // Queue user response for the readline mock
    mockReadlineInstance.queueUserInput('exit');

    // Invoke the agent
    await compiledAgent.invoke(stateWithInput);

    // Verify error handling in console output
    const logs = consoleMock.getLogs();
    expect(logs.some(log => log.includes('Error') || log.includes('Sorry'))).toBeTruthy();
  });
});
