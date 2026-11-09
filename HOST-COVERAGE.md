# Host coverage — 8 November 2026 (0.7.0)

The design has two parts: the authenticated Venom MCP connection holds the
team's projects, tasks, decisions and skills, and a short guidance text tells
the agent to find and log work there. Claude and Codex get that guidance from
the `venom` skill, the server's MCP instructions, and a reminder on every Venom
tool response. Neither plugin ships hooks: Anthropic's directory accepts hooks
only from Verified organizations, and OpenAI's plugin directory refuses
plugins with lifecycle hooks. Other hosts use the local `VENOM.md` text, copied
into each host's rules or context file.

The table describes implemented delivery, not a ranking or an assertion that
every agent behaves identically. All adapters use the development endpoint.

| Host | Implemented delivery | Limit that remains |
| --- | --- | --- |
| Codex | Plugin MCP plus the `venom` skill; server instructions; a reminder line on every Venom tool response | No hooks, so a turn that never calls Venom gets no reminder. [Plugin submission rules](https://developers.openai.com/plugins/deploy/submission) |
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

## Claude and Codex without hooks

Both plugins hold only Markdown, JSON and an icon. The `venom` skill carries
the workflow, including logging before the final reply in place of a Stop hook.
The server's instructions reach Claude Code, Cowork and Codex, and every Venom tool
response starts with a one-line reminder matched to the tool. The server skips
those reminders for clients whose hooks called `get_guidance` in the last day.

## Venom Full

Developers can add the `venom-full` plugin from this repository's marketplace;
its files live in the separate venomlabs-dev/venom-full repository.
It depends on `venom` and ships only `mcp_tool` hooks that call `get_guidance`
on the `venom` plugin's server: after compaction, before compaction (Claude
Code), at subagent start, on each prompt, and after commits, pushes and pull
requests. It is not submitted to either directory. The official `venom` plugin
in this repository still holds no hooks, and no hook file is in this repository.

## Verification and release gate

The checks for this repository live in the Venom monorepo. They verify the
manifests, that neither the Claude nor the Codex plugin declares hooks, that
the repository holds only Markdown, JSON and images, that the Codex listing
fields fit OpenAI's limits, and that the copied rules match `VENOM.md`.
They do not call the Venom server or launch authenticated agent turns.

Before claiming verified host behavior, run an authenticated trial: confirm
the Claude skill loads and tool reminders appear, the Codex skill loads and tool reminders
appear, resume after compaction, confirm questions create no task, and preserve a
consequential decision for a fresh session. Check that subagents report to the
parent instead of writing. Record the host version.

Hosts without a demonstrated host-managed OAuth connection are not presented
as authenticated integrations merely because their settings accept a URL.
The server remains organization-scoped; no template embeds credentials or
opens anonymous access.
