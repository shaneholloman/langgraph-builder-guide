import { Annotation, StateGraph, END } from "@langchain/langgraph";
import { Anthropic } from "@anthropic-ai/sdk";
import * as readline from 'readline';

import { ChatState, Message, createInitialState } from "./types";
import { ANTHROPIC_API_KEY, MODEL_CONFIG, DEFAULT_SYSTEM_PROMPT } from "./constants";

// Initialize the Anthropic client
const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
});

// Create a readline interface for CLI interaction
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Define our agent state
const StateType = Annotation.Root({
  messages: Annotation<Message[]>(),
  userInput: Annotation<string | undefined>(),
  currentResponse: Annotation<string | undefined>()
});

// Create a model node that handles Claude interactions
async function modelNode(state: any) {
  console.log("In node: model");

  if (!state.userInput) {
    return { currentResponse: undefined };
  }

  // Extract system message and prepare messages array for Anthropic
  let systemPrompt = DEFAULT_SYSTEM_PROMPT;
  // Find the system message in the array
  for (const msg of state.messages) {
    if (msg.role === 'system') {
      systemPrompt = msg.content;
      break;
    }
  }

  // Filter out system messages and prepare user/assistant messages
  const filteredMessages = state.messages
    .filter((msg: Message) => msg.role !== 'system')
    .map((msg: Message) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content
    }));

  // Add the current user input
  const messages = [
    ...filteredMessages,
    { role: 'user' as const, content: state.userInput }
  ];

  try {
    // Call Claude to generate a response
    const response = await anthropic.messages.create({
      model: MODEL_CONFIG.model,
      temperature: MODEL_CONFIG.temperature,
      max_tokens: MODEL_CONFIG.max_tokens,
      system: systemPrompt,
      messages: messages
    });

    // Extract the assistant's response
    let assistantMessage = "";
    if (response.content && response.content.length > 0) {
      const content = response.content[0];
      if ('text' in content) {
        assistantMessage = content.text;
      }
    }

    // Create a new array with all messages including system message
    const systemMessages = state.messages.filter((msg: Message) => msg.role === 'system');
    const newMessages = [
      ...systemMessages,
      ...messages,
      { role: 'assistant', content: assistantMessage }
    ];

    // Return the updated state
    return {
      messages: newMessages,
      currentResponse: assistantMessage,
      userInput: undefined
    };
  } catch (error) {
    console.error("Error calling Claude:", error);
    return {
      currentResponse: "Sorry, I encountered an error while generating a response.",
      userInput: undefined
    };
  }
}

// Create a tools node that handles user input
async function toolsNode(state: any) {
  console.log("In node: tools");

  // If we have a current response, display it
  if (state.currentResponse) {
    console.log("\nAssistant: " + state.currentResponse + "\n");
  }

  // Get the next user input
  const userInput = await new Promise<string>(resolve => {
    rl.question("You: ", resolve);
  });

  // If user types 'exit', we can signal to close the readline interface
  if (userInput.toLowerCase() === 'exit') {
    rl.close();
    process.exit(0);
  }

  // Return the updated state with the new user input
  return {
    userInput
  };
}

// Define routing logic
function routeAfterModel(state: any) {
  console.log("In condition: route_after_model");
  return "tools"; // Always route to tools for this simple implementation
}

// Create the graph directly rather than using the stub
// This avoids the TypeScript errors we were encountering
const workflow = new StateGraph(StateType)
  .addNode("model", modelNode)
  .addNode("tools", toolsNode)
  .addEdge("model", "tools")
  .addEdge("tools", "model")
  .setEntryPoint("tools");

// Compile the workflow
export const compiledAgent = workflow.compile();

// Function to run the agent with an initial state
export async function runAgent() {
  try {
    // Create initial state with system prompt
    const initialState = createInitialState(DEFAULT_SYSTEM_PROMPT);

    // Welcome message
    console.log("Claude Chat CLI");
    console.log("Type 'exit' to end the conversation.\n");

    // Invoke the agent with the initial state
    await compiledAgent.invoke(initialState);
  } catch (error) {
    console.error("Error running agent:", error);
  } finally {
    // Ensure we close the readline interface
    rl.close();
  }
}
