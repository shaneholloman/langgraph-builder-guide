// Define the message structure
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Define the state interface for our LangGraph application
export interface ChatState {
  messages: Message[];
  userInput?: string;
  currentResponse?: string;
}

// Initial state factory function
export function createInitialState(systemPrompt: string): ChatState {
  return {
    messages: [
      {
        role: 'system',
        content: systemPrompt
      }
    ]
  };
}
