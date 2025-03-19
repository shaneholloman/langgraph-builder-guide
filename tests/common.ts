import { Anthropic } from '@anthropic-ai/sdk';
import * as readline from 'readline';

// Mock for Anthropic API
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

  // Helper to set the next response
  setMockResponse(response: any) {
    this.mockResponse = response;
  }

  // Helper to simulate an error
  setMockError(error: Error) {
    this.mockError = error;
  }

  // Helper to reset the mock state
  reset() {
    this.messagesCalls = [];
    this.mockResponse = { content: [{ text: 'Mock response from Claude' }] };
    this.mockError = null;
  }
}

// Mock for readline interface
export class MockReadline {
  private responseQueue: string[] = [];
  private questionCallback: ((answer: string) => void) | null = null;

  // Setup a mock readline interface that matches the real one's API
  createInterface() {
    return {
      question: jest.fn((query: string, callback: (answer: string) => void) => {
        this.questionCallback = callback;
        if (this.responseQueue.length > 0) {
          const response = this.responseQueue.shift() as string;
          setTimeout(() => {
            if (this.questionCallback) {
              this.questionCallback(response);
              this.questionCallback = null;
            }
          }, 0);
        }
      }),
      close: jest.fn()
    };
  }

  // Add responses to the queue
  queueUserInput(...responses: string[]) {
    this.responseQueue.push(...responses);
  }

  // Immediately answer the pending question
  answerQuestion(response: string) {
    if (this.questionCallback) {
      this.questionCallback(response);
      this.questionCallback = null;
    }
  }

  // Reset the mock state
  reset() {
    this.responseQueue = [];
    this.questionCallback = null;
  }
}

// Helper function to mock console for tests
export function mockConsole() {
  const originalLog = console.log;
  const logs: string[] = [];

  beforeEach(() => {
    logs.length = 0;
    console.log = jest.fn((...args) => {
      logs.push(args.map(String).join(' '));
    });
  });

  afterEach(() => {
    console.log = originalLog;
  });

  return {
    getLogs: () => logs,
    clear: () => { logs.length = 0; }
  };
}
