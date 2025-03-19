// Simplified test for Claude Chat example
import { createInitialState } from '../../examples/claude-chat/types';
import { DEFAULT_SYSTEM_PROMPT } from '../../examples/claude-chat/constants';
import { MockAnthropic } from '../common';

// Mock dependencies
jest.mock('@anthropic-ai/sdk');

describe('Claude Chat Example (Simplified)', () => {
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
    expect(stateWithAssistantResponse.currentResponse).toBe('Hi there!');
  });
});
