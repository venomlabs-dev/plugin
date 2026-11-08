# Host coverage — 8 November 2026

The design has two parts: the authenticated Venom MCP connection holds the
team's projects, tasks, decisions and skills, and a short guidance text tells
the agent to find and log work there. Claude gets that guidance from the
`venom` skill, the server's MCP instructions, and a reminder on every Venom
tool response; the Claude plugin ships no hooks because Anthropic's directory
accepts hooks only from Verified organizations. Codex gets it from the server
through `mcp_tool` hooks. Other hosts use the local `VENOM.md` text, copied
into each host's rules or context file.

The table describes implemented delivery, not a ranking or an assertion that
every agent behaves identically. All adapters use the development endpoint.

| Host | Implemented delivery | Limit that remains |
| --- | --- | --- |
| Codex | Plugin MCP; `mcp_tool` hooks calling Venom `get_guidance` on `SessionStart` (compact), `SubagentStart`, `UserPromptSubmit`, and `PostToolUse` (Bash) | Hooks must be trusted once via `/hooks`. Hooks use an existing MCP connection, so they are skipped until Venom is connected. No `PreCompact` hook, because Codex `PreCompact` cannot add context. [Official hooks reference](https://learn.chatgpt.com/docs/hooks) |
| Claude (chat, Cowork, Claude Code) | Plugin MCP plus the `venom` skill; server instructions; a reminder line on every Venom tool response | No hooks. Chat doesn't show MCP instructions to the model, so it relies on the skill and tool responses. A turn that never calls Venom gets no reminder. [Platform support](https://claude.com/docs/plugins/platform-support) |
| Gemini CLI | Extension folder `platforms/gemini` with `contextFileName: VENOM.md` | No hook; the context file loads in every session. [Extension reference](https://geminicli.com/docs/extensions/reference/) |
| Cursor Agent | HTTP MCP plus an always-applied rule (`venom.md`, saved as `.mdc`) | Rules apply to Agent conversations; this does not configure inline completion or Bugbot. [MCP](https://docs.cursor.com/context/model-context-protocol), [rules](https://prod.cursor.com/docs/rules) |
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

## Codex hooks

Codex registers `.codex-plugin/hooks.json`. Every handler is an `mcp_tool`
hook that calls the Venom server's `get_guidance` tool with the event name and
a few fields from the hook input (`source`, `session_id`, the Bash command).
The server returns JSON `hookSpecificOutput` with `additionalContext`, or an
empty string when there is nothing to add. Codex has no `if` field, so its
single Bash handler sends every command and the server ignores the ones it
does not care about. `SessionStart` matches only `compact`.

Hooks call the existing MCP connection; they never start OAuth or reconnect a
server. If Venom is not connected, the hook is a nonblocking error and the
session continues. Hooks never write to Venom.

## Claude without hooks

The Claude plugin holds only Markdown and JSON. The `venom` skill carries the
workflow, including logging before the final reply in place of a Stop hook.
The server's instructions reach Claude Code and Cowork, and every Venom tool
response starts with a one-line reminder matched to the tool. The server skips
those reminders for clients whose hooks called `get_guidance` in the last day.

## Verification and release gate

The checks for this repository live in the Venom monorepo. They verify the
manifests, the Codex hook structure, that the Claude plugin declares no hooks
and holds only Markdown and JSON, and that the copied rules match `VENOM.md`.
They do not call the Venom server or launch authenticated agent turns.

Before claiming verified host behavior, run an authenticated trial: confirm
the Claude skill loads and tool reminders appear, each Codex hook reaches
`get_guidance` and its output appears in context, resume
after compaction, confirm questions create no task, and preserve a
consequential decision for a fresh session. Check that subagents report to the
parent instead of writing. Record the host version.

Hosts without a demonstrated host-managed OAuth connection are not presented
as authenticated integrations merely because their settings accept a URL.
The server remains organization-scoped; no template embeds credentials or
opens anonymous access.
