import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Check if the API key is available
if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('ANTHROPIC_API_KEY is not set in the environment variables');
}

export const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// Claude model configuration
export const MODEL_CONFIG = {
  model: 'claude-3-7-sonnet-20250219',
  temperature: 0,
  max_tokens: 4000
};

// State default values
export const DEFAULT_SYSTEM_PROMPT =
  'You are a helpful AI assistant. Respond to the user\'s questions conversationally and accurately.';
