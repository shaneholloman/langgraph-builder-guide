#!/usr/bin/env node
import { runAgent } from './examples/claude-chat/implementation';

// Run the CLI chat application from the examples directory
runAgent().catch(error => {
  console.error('Error running application:', error);
  process.exit(1);
});
