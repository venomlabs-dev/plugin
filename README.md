# Venom MCP plugin

Connect your AI agents to **[Venom AI](https://venomlabs.dev)**, the shared
workspace from **Venom Labs**. Share projects, skills, tools, and results across
your team's agents in Claude Code, Codex, Cursor, and other MCP clients.

[Website](https://venomlabs.dev) · [Quickstart](https://docs.venomlabs.dev/quickstart) · [MCP setup](https://docs.venomlabs.dev/agents/mcp)

Venom is where your team's AI agents share their work: projects, tasks,
decisions and skills, so any agent or teammate can pick up where another left
off. Agents reach it through the host-managed MCP connection at
`https://mcp.venomlabs.dev`.

The plugin contains connection settings, hooks, and host adapters. In Claude
Code and Codex, hooks ask the Venom server for guidance at key moments, so the
wording stays current without a plugin update. Other hosts use the short
[VENOM.md](VENOM.md) guidance as a rules file. Connections remain
authenticated and organization-scoped; the host manages OAuth and tool
approval. Installing this plugin does not disable those controls.

## Claude Code

```text
/plugin marketplace add venomlabs-dev/plugin
/plugin install venom@venom
```

Authorize Venom when prompted. The plugin ships `mcp_tool` hooks that call the
Venom server's `get_guidance` tool after compaction, before compaction, when a
subagent starts, on each prompt, and after `git commit`, `git push`,
`gh pr create`, and `gh pr merge`. No local program runs and Node.js is not
needed. At launch, Claude Code gets Venom's guidance from the MCP server's
instructions.

## Codex

```bash
codex plugin marketplace add venomlabs-dev/plugin
codex plugin add venom@venom
```

Start a new task, authorize Venom, and trust the bundled hooks once via
`/hooks`. The hooks are `mcp_tool` hooks that call the Venom server's
`get_guidance` tool after compaction, when a subagent starts, on each prompt,
and after Bash commands (the server picks out commits, pushes, and pull
requests). No local program runs and Node.js is not needed. If Venom is not
connected, the hooks are skipped and the MCP server's instructions remain the
baseline.

## Gemini CLI

Gemini uses a different hook schema from Claude/Codex. Use the isolated Gemini
package:

```bash
git clone https://github.com/venomlabs-dev/plugin venom-plugin
cd venom-plugin
npm run package:gemini
gemini extensions install ./dist/gemini/venom
```

Restart Gemini and authorize Venom. Gemini supports only command hooks, so the
extension loads `VENOM.md` as its context file and a local `SessionStart` hook
injects the same text, with Gemini's own timeout units and path substitution.
Node.js 18+ is needed for that hook. To update, pull this repository,
rebuild the package, and run `gemini extensions update venom` (or reinstall the
local package). Do not install the repository root as a Gemini extension.

## Other hosts

Merge MCP entries into existing configuration; never overwrite other servers.
Add the small instruction file alongside existing rules.

| Host | MCP configuration | Instruction installation |
| --- | --- | --- |
| Cursor | Merge [mcp.json](platforms/cursor/mcp.json) into `.cursor/mcp.json` or `~/.cursor/mcp.json` | Copy [venom.mdc](platforms/cursor/venom.mdc) into the project's `.cursor/rules/` |
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

## Upgrading to 0.5.0

Claude Code and Codex now get Venom guidance from the server through
`mcp_tool` hooks; the local hook script and Node.js are no longer used there.
Start a fresh session or restart the host so old hooks are unloaded, and in
Codex trust the new hooks via `/hooks`. Venom no longer uses an organization
startup skill, so remove any copied instructions that load one. Refresh
manually copied rules files from this release, and Gemini users should rebuild
and reinstall the extension package.

## Development

```bash
npm run sync:guidance  # regenerate host rule wrappers after editing VENOM.md
npm test
npm run package:gemini
```

Tests check the Claude and Codex `mcp_tool` hook structure, run the Gemini hook
script and packaged command, and catch stale adapters. CI runs on Node 18/22 on
Linux and Node 22 on Windows. Tests make no network requests and do not prove
model compliance or live OAuth interoperability.
