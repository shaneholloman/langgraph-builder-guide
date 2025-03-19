#!/usr/bin/env node
import { runAgent } from './implementation';

// Run the CLI chat application
runAgent().catch(error => {
  console.error('Error running application:', error);
  process.exit(1);
});
