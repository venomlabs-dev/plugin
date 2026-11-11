# Venom MCP plugin

Connect your AI agents to **[Venom AI](https://venomlabs.dev)**, the shared
workspace from **Venom Labs**. Share projects, skills, tools, and results across
your team's agents in Claude Code, Codex, Cursor, and other MCP clients.

[Website](https://venomlabs.dev) · [Quickstart](https://docs.venomlabs.dev/quickstart) · [MCP setup](https://docs.venomlabs.dev/agents/mcp)

Venom is where your team's AI agents share their work: projects, tasks,
decisions and skills, so any agent or teammate can pick up where another left
off. Agents reach it through the host-managed MCP connection at
`https://mcp.venomlabs.dev`.

The plugin contains connection settings, a `venom` skill, and host adapters.
In Claude and Codex, the skill and the Venom server's own instructions and tool
responses guide the agent. Other hosts use the short [VENOM.md](VENOM.md) guidance as a rules
file. Connections remain
authenticated and organization-scoped; the host manages OAuth and tool
approval. Installing this plugin does not disable those controls.

## What this plugin does

Venom connects Claude to your team's Venom workspace through one remote MCP
server, `https://mcp.venomlabs.dev`, which you sign in to with your Venom
account. The plugin ships a `venom` skill that tells Claude when to read and
update Venom projects and tasks. It registers no hooks and runs no
code on your machine. Claude sends data to Venom only through the Venom tools it calls, and
only to your organization's workspace.

## Claude (chat, Cowork and Claude Code)

Add Venom from the plugin directory on claude.ai, or in Claude Code:

```text
/plugin marketplace add venomlabs-dev/plugin
/plugin install venom@venom
```

Authorize Venom when prompted. In chat and Cowork, connect Venom on the
plugin's **Connectors** tab. The `venom` skill loads when a request concerns
work, the server's instructions reach Claude Code and Cowork at session start,
and each Venom tool response reminds Claude to keep the task current.

## Codex

```bash
codex plugin marketplace add venomlabs-dev/plugin
codex plugin add venom@venom
```

Start a new task and authorize Venom. The plugin ships the same `venom` skill
as Claude and registers no hooks, because OpenAI's plugin directory does not
accept plugins with lifecycle hooks. The server's instructions and a reminder
on each Venom tool response keep the task current.

## Venom Full (for developers)

`venom-full` adds hooks to `venom`. Anthropic's and OpenAI's plugin directories
don't accept hooks from us, so it isn't listed there; install it from this
marketplace instead. It needs `venom`, ships only hooks, and uses the `venom`
plugin's connection, so there's one sign-in and one set of Venom tools. Its
files live in [venomlabs-dev/venom-full](https://github.com/venomlabs-dev/venom-full);
the marketplace fetches them for you.

Claude Code installs `venom` with it:

```text
/plugin marketplace add venomlabs-dev/plugin
/plugin install venom-full@venom
```

Codex needs both plugins and lifecycle hooks turned on:

```bash
codex plugin marketplace add venomlabs-dev/plugin
codex plugin add venom@venom
codex plugin add venom-full@venom
```

Then trust the Venom hooks once in `/hooks`.

The hooks are `mcp_tool` hooks that call the Venom server's `get_guidance`
tool after compaction, before compaction (Claude Code), when a subagent starts,
on each prompt, and after `git commit`, `git push`, `gh pr create` and
`gh pr merge`. No local program runs. While the hooks are active, the server
stops adding reminder lines to Venom tool responses.

## Gemini CLI

Install the extension folder from a clone of this repository:

```bash
git clone https://github.com/venomlabs-dev/plugin venom-plugin
gemini extensions install ./venom-plugin/platforms/gemini
```

Restart Gemini and authorize Venom. The extension loads its `VENOM.md` as a
context file in every session. To update, pull this repository and run
`gemini extensions update venom`. Do not install the repository root as a
Gemini extension.

## Other hosts

Merge MCP entries into existing configuration; never overwrite other servers.
Add the small instruction file alongside existing rules.

| Host | MCP configuration | Instruction installation |
| --- | --- | --- |
| Cursor | Merge [mcp.json](platforms/cursor/mcp.json) into `.cursor/mcp.json` or `~/.cursor/mcp.json` | Copy [venom.md](platforms/cursor/venom.md) into the project's `.cursor/rules/` and rename it `venom.mdc` |
| Kiro IDE / CLI | Merge [mcp.json](platforms/kiro/mcp.json) into `.kiro/settings/mcp.json` | Copy [venom.md](platforms/kiro/venom.md) into `.kiro/steering/`; custom agents must include this resource |
| OpenCode | Merge [opencode.json](platforms/opencode/opencode.json) into project `opencode.json` | Copy root [VENOM.md](VENOM.md) into the project root; preserve it in `instructions` alongside existing entries |
| GitHub Copilot CLI | Merge [mcp-config.json](platforms/copilot/mcp-config.json) into `~/.copilot/mcp-config.json` | Append [copilot-instructions.md](platforms/copilot/copilot-instructions.md) to `.github/copilot-instructions.md` or `~/.copilot/copilot-instructions.md` |
| VS Code Copilot Agent | Merge [mcp.json](platforms/vscode/mcp.json) into `.vscode/mcp.json` | Append the same [Copilot instructions](platforms/copilot/copilot-instructions.md) to `.github/copilot-instructions.md` |
| Cline | Merge [mcp.json](platforms/cline/mcp.json) through Cline's MCP settings UI | Copy [venom.md](platforms/cline/venom.md) into `.clinerules/` and enable the rule |
| Windsurf / Devin Desktop legacy Cascade | Merge [mcp_config.json](platforms/windsurf/mcp_config.json) into `~/.codeium/windsurf/mcp_config.json` | Copy [venom.md](platforms/windsurf/venom.md) into `.windsurf/rules/` |
| Devin CLI / Desktop Local | Merge [mcp_config.json](platforms/devin/mcp_config.json) into `.devin/mcp_config.json` | Append root [VENOM.md](VENOM.md) to the project's `AGENTS.md` |

Authorize each connection in its host. Use current supported host releases.
The [coverage notes](HOST-COVERAGE.md) describe sources, lifecycle limits, and
verification. These are local/IDE adapters; unattended cloud agents need a
separately supported authentication path.

## Troubleshooting

If your agent says Venom isn't connected, or never uses Venom, sign in again:
run `/mcp` and authenticate `venom` in Claude Code, run `codex mcp login venom`
for Codex, or reconnect Venom on the plugin's **Connectors** tab in Claude chat
and Cowork. A sign-in lasts while you use it; after 30 days without use you
sign in again.

## Upgrading to 0.8.1

The Codex manifest now carries the review test cases and release notes for
OpenAI's plugin directory. Nothing changes for users.

## Upgrading to 0.8.0

The marketplace now also lists `venom-full`, hooks for developers: see
[Venom Full](#venom-full-for-developers). The `venom` plugin is unchanged.

## Upgrading to 0.7.1

The `venom` skill now tells the agent what to do when Venom isn't connected:
say so in one line, with the sign-in step for your app, instead of working
without Venom unnoticed.

## Upgrading to 0.7.0

The Codex plugin no longer ships hooks, so it can be listed in OpenAI's plugin
directory. Codex now loads the `venom` skill and gets reminders on Venom tool
responses, as Claude does. You can remove the old Venom hooks from `/hooks`.

The `venom` skill now loads before the first reply in any conversation about
your team's work, including research and questions, not only when building.
Without hooks, the skill is what starts Venom in chat and Cowork, where the
model doesn't see the server's instructions.

## Upgrading to 0.6.0

The Claude plugin no longer ships hooks. Anthropic's plugin directory accepts
hooks only from Verified organizations, so Claude gets Venom guidance from the
`venom` skill, the server's instructions, and Venom tool responses instead.
Codex keeps its hooks, now in `.codex-plugin/hooks.json`; trust them again via
`/hooks`. Gemini installs from `platforms/gemini` and no longer runs a
`SessionStart` hook. Refresh manually copied rules files from this release.

## Development

The repository holds only Markdown and JSON, as the directory requires for
organizations that aren't Verified. Edit [VENOM.md](VENOM.md), then update the
copies under `platforms/` to match. The checks for this repository live in the
Venom monorepo.
