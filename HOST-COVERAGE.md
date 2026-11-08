# Host coverage — 7 November 2026

The design has two parts: the authenticated Venom MCP connection holds the
team's projects, tasks, decisions and skills, and a short guidance text tells
the agent to find and log work there. Claude Code and Codex get that guidance
from the Venom server itself through `mcp_tool` hooks, so its wording lives
server-side. Hosts without `mcp_tool` hooks use the local `VENOM.md` text,
copied into each host's rules or context file.

The table describes implemented delivery, not a ranking or an assertion that
every agent behaves identically. All adapters use the development endpoint.

| Host | Implemented delivery | Limit that remains |
| --- | --- | --- |
| Codex | Plugin MCP; `mcp_tool` hooks calling Venom `get_guidance` on `SessionStart` (compact), `SubagentStart`, `UserPromptSubmit`, and `PostToolUse` (Bash) | Hooks must be trusted once via `/hooks`. Hooks use an existing MCP connection, so they are skipped until Venom is connected. No `PreCompact` hook, because Codex `PreCompact` cannot add context. [Official hooks reference](https://learn.chatgpt.com/docs/hooks) |
| Claude Code | Plugin MCP; `mcp_tool` hooks calling Venom `get_guidance` on `SessionStart` (compact), `PreCompact`, `SubagentStart`, `UserPromptSubmit`, and `PostToolUse` for `git commit`, `git push`, `gh pr create`, `gh pr merge` | Claude Code skips `mcp_tool` hooks on `SessionStart` at launch, before MCP servers connect, so launch guidance comes from the server's MCP instructions. Tool approvals remain host-owned. [Official hooks reference](https://code.claude.com/docs/en/hooks) |
| Gemini CLI | Separate extension bundle with `contextFileName: VENOM.md`, `SessionStart` | Persistent context and SessionStart provide the entry point. No AfterAgent continuation is installed; timeouts are milliseconds. [Extension reference](https://geminicli.com/docs/extensions/reference/), [hook reference](https://geminicli.com/docs/hooks/reference/) |
| Cursor Agent | HTTP MCP plus an always-applied `.mdc` rule | Rules apply to Agent conversations; this does not configure inline completion or Bugbot. [MCP](https://docs.cursor.com/context/model-context-protocol), [rules](https://prod.cursor.com/docs/rules) |
| Kiro IDE / CLI | MCP plus always-included steering | Custom agents require the steering resource in their configuration; no claim of a universal session event across Kiro surfaces. [MCP](https://kiro.dev/docs/mcp/), [steering](https://kiro.dev/docs/steering/) |
| OpenCode | Remote MCP plus `instructions: ["VENOM.md"]` | Merge with existing instructions. Host manages remote OAuth. [MCP](https://opencode.ai/docs/mcp-servers/), [rules](https://opencode.ai/docs/rules/) |
| Copilot CLI | HTTP MCP plus persistent Copilot instructions | Command-hook output at userPromptSubmitted is discarded, so no fake prompt reminder is installed. [MCP setup](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers), [instructions](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/comparing-cli-features), [hooks](https://docs.github.com/en/copilot/reference/hooks-reference) |
| VS Code Copilot Agent | VS Code's `servers` MCP schema plus repository instructions | Server/organization trust and authentication must be completed in VS Code. [MCP setup](https://code.visualstudio.com/docs/agent-customization/mcp-servers), [custom instructions](https://code.visualstudio.com/docs/agent-customization/custom-instructions) |
| Cline | Explicit `streamableHttp` MCP plus enabled `.clinerules` file | Connection and rule must be enabled; actual OAuth with Venom needs a host trial. Omitting transport can select legacy SSE. [MCP](https://docs.cline.bot/mcp/mcp-overview), [rules](https://docs.cline.bot/customization/cline-rules) |
| Windsurf / Devin Desktop legacy Cascade | Remote MCP plus `trigger: always_on` rule | Current docs distinguish Cascade from the new default Local agent. [Cascade MCP](https://docs.devin.ai/desktop/cascade/mcp), [rules](https://docs.devin.ai/desktop/cascade/memories) |
| Devin CLI / Desktop Local | Dedicated `mcp_config.json` plus AGENTS.md guidance | Dedicated MCP file applies to v3000.3+; authenticate this client separately. [MCP configuration](https://docs.devin.ai/cli/extensibility/mcp/configuration), [AGENTS.md](https://docs.devin.ai/onboard-devin/agents-md) |

Kiro steering provides the entry point on both IDE and CLI without creating an
extra agent turn; the old Kiro hook template is no longer shipped. Current Kiro
hooks have a different schema and surface-specific triggers.
[Current hook schema](https://kiro.dev/docs/hooks/).

## Hooks

Claude Code registers `hooks/claude-hooks.json` and Codex registers
`hooks/codex-hooks.json` in their manifests. Every handler is an `mcp_tool`
hook that calls the Venom server's `get_guidance` tool with the event name and
a few fields from the hook input (`source`, `session_id`, the Bash command).
The server returns the exact hook output: JSON `hookSpecificOutput` with
`additionalContext`, plain text for Claude's `PreCompact` (compaction
instructions), or an empty string when there is nothing to add. No local
program runs, so neither host needs Node.js. Claude uses the plugin-scoped
server name `plugin:venom:venom`; Codex uses the manifest's server key `venom`.

Claude filters `PostToolUse` with one `if` permission rule per command
(`Bash(git commit*)`, `Bash(git push*)`, `Bash(gh pr create*)`,
`Bash(gh pr merge*)`). Codex has no `if` field, so its single Bash handler
sends every command and the server ignores the ones it does not care about.
`SessionStart` matches only `compact`: Claude skips `mcp_tool` hooks at launch,
and the server returns nothing for other sources.

Hooks call the existing MCP connection; they never start OAuth or reconnect a
server. If Venom is not connected, the hook is a nonblocking error and the
session continues. There is no root `hooks/hooks.json`, avoiding duplicate
auto-discovery. Gemini supports only command hooks: its separate package
generates that default file with a `SessionStart` command hook that runs
`hooks/venom-context.js` to inject `VENOM.md`, with its own path variable and
millisecond timeouts. Node.js 18+ is needed only for that Gemini hook.

`VENOM.md` is canonical for local hosts; persistent adapters are generated
from it. Hooks never write to Venom. The agent uses its authenticated
connection; user instructions and denied approvals remain binding. No shutdown
or background writer is installed.

## Verification and release gate

Local checks verify the Claude and Codex `mcp_tool` hook structure, the Gemini
startup script (JSON output, silent other events, open stdin, missing-file
fallback, closed pipes, package isolation), adapter configuration, and
canonical rule synchronization. Tests do not call the Venom server or launch
authenticated agent turns.

Before claiming verified host behavior, run an authenticated trial: confirm
each hook reaches `get_guidance` and its output appears in context, resume
after compaction, confirm questions create no task, and preserve a
consequential decision for a fresh session. Check that subagents report to the
parent instead of writing. Record the host version.

Hosts without a demonstrated host-managed OAuth connection are not presented
as authenticated integrations merely because their settings accept a URL.
The server remains organization-scoped; no template embeds credentials or
opens anonymous access.
