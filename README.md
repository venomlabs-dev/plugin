# Venom MCP plugin

**[Venom AI](https://venomlabs.dev)** by **Venom Labs** makes the coding agents
your team already uses multiplayer. One MCP server connects Claude Code, Codex,
Cursor, Gemini CLI, GitHub Copilot, OpenCode and other MCP clients, so your
team's agents share tasks, decisions, skills and tools. There is no new
harness to adopt.

[Website](https://venomlabs.dev) · [How it works](https://docs.venomlabs.dev/how-it-works) · [Quickstart](https://docs.venomlabs.dev/quickstart) · [MCP setup](https://docs.venomlabs.dev/agents/mcp) · [Pricing](https://venomlabs.dev/pricing)

Venom is where your team's AI agents share their work: projects, tasks,
decisions and skills, so any agent or teammate can pick up where another left
off. Agents reach it through the host-managed MCP connection at
`https://mcp.venomlabs.dev`.

This repository is one package that many agent apps install directly: the
Venom MCP connection, a `venom` skill, an always-on rule, and setup files for
apps that take a config file instead. Connections remain authenticated and
organization-scoped; the app manages OAuth and tool approval. Installing this
plugin does not disable those controls.

## What this plugin does

Venom connects Claude to your team's Venom workspace through one remote MCP
server, `https://mcp.venomlabs.dev`, which you sign in to with your Venom
account. The plugin ships a `venom` skill that tells Claude when to read and
update Venom projects and tasks. It registers no hooks and runs no
code on your machine. Claude sends data to Venom only through the Venom tools it calls, and
only to your organization's workspace.

## Pick your app

| App | What you install | Section |
| --- | --- | --- |
| Claude Code, Claude chat, Cowork | `venom` plugin, plus Venom Full hooks for Claude Code | [Claude](#claude-chat-cowork-and-claude-code) |
| Codex | `venom` plugin, plus Venom Full hooks | [Codex](#codex) |
| Cursor | Venom plugin: MCP, rule and skill | [Cursor](#cursor) |
| Gemini CLI | Venom extension | [Gemini CLI](#gemini-cli) |
| GitHub Copilot CLI and VS Code | Venom plugin | [GitHub Copilot](#github-copilot-cli-and-vs-code) |
| OpenCode | Venom plugin for OpenCode | [OpenCode](#opencode) |
| Amp | MCP, skill and the Venom plugin for Amp | [Amp](#amp) |
| Qwen Code, Factory Droid, JetBrains Junie | This repository as a plugin | [Apps that read Claude plugins](#apps-that-read-claude-plugins) |
| Kiro | Venom Power and steering | [Kiro](#kiro) |
| Cline, Kilo Code, Windsurf, Devin, Zed, Warp, Goose, Crush, Continue and others | MCP config and a rules file | [Other apps](#other-apps) |

T3 Code runs Claude Code, Codex, OpenCode and Cursor with their own
configuration, so install Venom for those and T3 Code uses it.

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
the marketplace fetches them for you. It is for Claude Code and Codex only;
the same repository holds the OpenCode and Amp plugins.

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

## Cursor

The Venom plugin for Cursor adds the Venom MCP server, an always-applied rule
and the `venom` skill. Once it's listed in the Cursor Marketplace, install it
from there. Until then, install it locally:

```bash
git clone https://github.com/venomlabs-dev/plugin ~/.cursor/plugins/local/venom
```

Run **Developer: Reload Window**, then open **Cursor Settings → MCP** and
connect `venom`. To add only the MCP server, merge
[mcp.json](platforms/cursor/mcp.json) into `~/.cursor/mcp.json` and copy
[venom.md](platforms/cursor/venom.md) into the project's `.cursor/rules/` as
`venom.mdc`.

## Gemini CLI

```bash
gemini extensions install https://github.com/venomlabs-dev/plugin --ref main
```

`--ref main` installs from the repository: without it, Gemini installs the
latest GitHub release, which is still an old 0.3.x build. Restart Gemini and
authorize Venom (`/mcp auth venom`). The extension adds the
Venom MCP server, loads [VENOM.md](VENOM.md) as a context file in every
session, and adds the `venom` skill. Update with `gemini extensions update venom`.

If you installed an earlier version from the `platforms/gemini` folder, remove
it first with `gemini extensions uninstall venom`.

## GitHub Copilot (CLI and VS Code)

Copilot CLI reads this repository's marketplace:

```bash
copilot plugin marketplace add venomlabs-dev/plugin
copilot plugin install venom@venom
```

This adds the Venom MCP server and the `venom` skill. Run `/mcp` in Copilot to
authenticate `venom`. Install `venom`, not `venom-full`, in Copilot.

In VS Code, plugins installed by Copilot CLI show up too. Or add only the MCP
server: run `code --add-mcp '{"name":"venom","type":"http","url":"https://mcp.venomlabs.dev"}'`,
or merge [mcp.json](platforms/vscode/mcp.json) into `.vscode/mcp.json`. Append
[copilot-instructions.md](platforms/copilot/copilot-instructions.md) to
`.github/copilot-instructions.md`.

## OpenCode

The Venom plugin for OpenCode adds the MCP server and the `venom` skill, and
guides the agent at compaction, in subagents and after commits and pull
requests. It lives in [venom-full](https://github.com/venomlabs-dev/venom-full#opencode):

```bash
opencode plugin add github:venomlabs-dev/venom-full   # OpenCode 2.x
opencode plugin -g github:venomlabs-dev/venom-full    # OpenCode 1.x
opencode mcp auth venom
```

Without the plugin, merge [opencode.json](platforms/opencode/opencode.json)
into the project's `opencode.json` and copy [VENOM.md](VENOM.md) next to it.

## Amp

```bash
amp mcp add venom https://mcp.venomlabs.dev
amp skill add venomlabs-dev/plugin --global
amp plugins add https://raw.githubusercontent.com/venomlabs-dev/venom-full/main/amp/venom.ts
```

The [Amp plugin](https://github.com/venomlabs-dev/venom-full#amp) calls the
Venom server's guidance on each prompt, after milestones and at the end of a
turn, as Venom Full does in Claude Code. If `amp plugins add` doesn't take the
URL, save `venom.ts` in `~/.config/amp/plugins/`. Without the plugin, append
[VENOM.md](VENOM.md) to your `AGENTS.md`. These commands follow Amp's docs and
haven't been run in Amp yet.

## Apps that read Claude plugins

These apps read this repository's Claude plugin and marketplace, so they can
install it as it is, with the Venom MCP server and the `venom` skill. Qwen Code
was tested; for the others, the commands follow each app's docs and haven't
been run yet. If one doesn't work, use the app's row in [Other apps](#other-apps).

| App | Install | Tested |
| --- | --- | --- |
| Qwen Code | `qwen extensions install venomlabs-dev/plugin`, then pick `venom` | Yes, 0.27.4 |
| Factory Droid | `droid plugin marketplace add venomlabs-dev/plugin`, then `droid plugin install venom@venom --scope user` | No |
| JetBrains Junie | `/extensions marketplace add venomlabs-dev/plugin`, then `/extensions install venom` | No |
| Devin CLI and Devin Desktop | Install this repository as a Devin plugin, or use the [Devin config](#other-apps) | No |

Pick `venom`, not `venom-full`: Venom Full's hooks run only in Claude Code
and Codex.

## Kiro

[platforms/kiro/power](platforms/kiro/power) is a Kiro Power with the Venom MCP
server and the `venom` skill, in Kiro's current Power format (`plugin.json`,
`mcp.json`, `skills/`). It hasn't been tried in Kiro yet. In Kiro, open **Powers → Add Custom Power →
Import power from a folder** and pick that folder from a clone of this
repository. For always-on guidance, copy [venom.md](platforms/kiro/venom.md)
into `.kiro/steering/`; custom agents must include it as a resource. Without the
Power, merge [mcp.json](platforms/kiro/mcp.json) into `.kiro/settings/mcp.json`.

## Other apps

Merge MCP entries into existing configuration; never overwrite other servers.
Add the instruction file alongside existing rules. Where an app reads
`AGENTS.md`, append [VENOM.md](VENOM.md) to it.

| App | MCP configuration | Instructions |
| --- | --- | --- |
| Cline | Merge [mcp.json](platforms/cline/mcp.json) through Cline's MCP settings | Copy [venom.md](platforms/cline/venom.md) into `.clinerules/` and enable it |
| Kilo Code | Merge [kilo.json](platforms/kilo/kilo.json) into `kilo.jsonc` | Copy [VENOM.md](VENOM.md) next to it (listed in `instructions`) |
| Windsurf / Devin Desktop (Cascade) | Merge [mcp_config.json](platforms/windsurf/mcp_config.json) into `~/.codeium/windsurf/mcp_config.json` | Copy [venom.md](platforms/windsurf/venom.md) into `.windsurf/rules/` |
| Devin CLI / Desktop Local | Merge [mcp_config.json](platforms/devin/mcp_config.json) into `.devin/mcp_config.json`, then `devin mcp login venom` | Append [VENOM.md](VENOM.md) to `AGENTS.md` |
| Zed | Merge [settings.json](platforms/zed/settings.json) into Zed's `settings.json` | Append [VENOM.md](VENOM.md) to `AGENTS.md` |
| JetBrains Junie (MCP only) | Merge [mcp.json](platforms/junie/mcp.json) into `~/.junie/mcp/mcp.json`, then `/mcp` and Authorize | Append [VENOM.md](VENOM.md) to `.junie/AGENTS.md` |
| JetBrains AI Assistant | Paste [mcp.json](platforms/junie/mcp.json) in **Settings → Tools → AI Assistant → MCP** | Add [VENOM.md](VENOM.md) to the project's rules |
| Factory Droid (MCP only) | `droid mcp add venom https://mcp.venomlabs.dev --type http`, or merge [mcp.json](platforms/factory/mcp.json) | Append [VENOM.md](VENOM.md) to `AGENTS.md` |
| Qwen Code (MCP only) | Merge [settings.json](platforms/qwen/settings.json) into `~/.qwen/settings.json` | Append [VENOM.md](VENOM.md) to `QWEN.md` |
| Amp (MCP only) | Merge [settings.json](platforms/amp/settings.json) into `~/.config/amp/settings.json` | Append [VENOM.md](VENOM.md) to `AGENTS.md` |
| Crush | Merge [crush.json](platforms/crush/crush.json) into `crush.json` | Append [VENOM.md](VENOM.md) to `AGENTS.md` |
| Warp | Add a remote MCP server named `venom` at `https://mcp.venomlabs.dev` in **Settings → MCP Servers** | Append [VENOM.md](VENOM.md) to `AGENTS.md` |
| Goose | Click `goose://extension?url=https%3A%2F%2Fmcp.venomlabs.dev&type=streamable_http&id=venom&name=Venom&description=Your%20team%27s%20projects%2C%20tasks%20and%20decisions`, or `goose configure` → Add Extension → Remote (Streamable HTTP) | Copy [skills/venom](skills/venom) into `~/.agents/skills/` |
| Continue | Add `.continue/mcpServers/venom.yaml` (below) | Copy [VENOM.md](VENOM.md) into `.continue/rules/` |
| Augment, Trae, Antigravity and any other MCP client | Add a remote MCP server (Streamable HTTP) named `venom` at `https://mcp.venomlabs.dev`, with OAuth and no API key | Add [VENOM.md](VENOM.md) to the app's rules file |

Continue's file:

```yaml
name: Venom
version: 0.0.1
schema: v1
mcpServers:
  - name: venom
    type: streamable-http
    url: https://mcp.venomlabs.dev
```

Authorize each connection in its app. Use current supported releases. The
[coverage notes](HOST-COVERAGE.md) say what was tested where. These are
local/IDE adapters; unattended cloud agents need a separately supported
authentication path.

## Troubleshooting

If your agent says Venom isn't connected, or never uses Venom, sign in again:
run `/mcp` and authenticate `venom` in Claude Code, run `codex mcp login venom`
for Codex, or reconnect Venom on the plugin's **Connectors** tab in Claude chat
and Cowork. In Cursor, open **Cursor Settings → MCP**; in Gemini CLI, run
`/mcp auth venom`; in OpenCode, run `opencode mcp auth venom`; in Copilot CLI,
run `/mcp`. A sign-in lasts while you use it; after 30 days without use you
sign in again.

## Upgrading to 0.9.1

Venom's icon is the black tile everywhere: Claude, Codex, Cursor and the
Gemini release. The Cursor rule is `rules/venom.md`. Nothing else changes.

## Upgrading to 0.9.0

- Cursor, Copilot CLI, Qwen Code, Factory Droid and Junie can install this
  repository as a plugin, and Kiro has a Venom Power.
- The Gemini extension moved to the repository root. Reinstall it with
  `gemini extensions install https://github.com/venomlabs-dev/plugin --ref main`.
- [VENOM.md](VENOM.md) and the copied rules now match the Venom server's
  current instructions. Refresh manually copied rules files from this release.
- The `venom` skill gives the sign-in step for more apps.

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

The repository holds only Markdown, JSON and images, as the directory requires
for organizations that aren't Verified. Edit [VENOM.md](VENOM.md), then update
the copies in `rules/` and `platforms/` to match; edit
[skills/venom/SKILL.md](skills/venom/SKILL.md), then update the Kiro Power's
copy. The checks for this repository live in the Venom monorepo.
