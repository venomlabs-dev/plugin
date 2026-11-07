#!/usr/bin/env node
'use strict';

// Gemini-only SessionStart hook: Gemini supports command hooks but not mcp_tool
// hooks, so it injects the local VENOM.md. Claude Code and Codex instead ask the
// Venom MCP server through mcp_tool hooks and do not run this script.
const fs = require('node:fs');
const path = require('node:path');

const fallback = 'Venom is where your team’s AI agents share their work. When a request concerns work, find its project and task in Venom and read them before acting, then keep logging there. Keep the status true; never mark unfinished work done. Keep secrets and raw transcripts out of Venom.';

process.stdout.on('error', (error) => {
  if (error.code === 'EPIPE') process.exit(0);
  throw error;
});

if (process.argv[2] === 'SessionStart') {
  let context = fallback;
  try { context = fs.readFileSync(path.join(__dirname, '..', 'VENOM.md'), 'utf8').trim() || fallback; }
  catch { /* Retain startup guidance when the instruction file is unavailable. */ }
  // Gemini documents additionalContext without the Claude/Codex event discriminator.
  process.stdout.write(JSON.stringify({ hookSpecificOutput: { additionalContext: context } }));
}
