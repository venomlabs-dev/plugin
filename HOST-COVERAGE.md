# Host coverage — 16 November 2026 (0.9.0)

Every app below connects to the same Venom MCP server,
`https://mcp.venomlabs.dev`, with OAuth and no API key. The guidance that tells
the agent to find and log work in Venom comes from up to five places:

1. **Hooks that call Venom.** Claude Code and Codex with Venom Full, and Amp
   with its Venom plugin, call the server's `get_guidance` at fixed moments.
2. **Server instructions.** Many apps put them in the system prompt.
3. **Tool descriptions and tool-response reminders.** Every app gets them, but
   only while the agent calls Venom.
4. **A plugin that adds text at events.** The OpenCode plugin carries the same
   texts as `get_guidance` for compaction, subagents and milestones.
5. **A skill or always-on rules file.** This is [VENOM.md](VENOM.md), the
   `venom` skill, or a copy of either in the app's rules format.

The store builds (Claude, Codex and Cursor plugins, Gemini extension, Kiro
Power) hold only Markdown, JSON and images, and no hooks. Anthropic's directory
accepts hooks only from Verified organizations, and OpenAI's plugin directory
refuses lifecycle hooks. Hooks and code live in
[venom-full](https://github.com/venomlabs-dev/venom-full).

## Matrix

"Tested" means installed on macOS in an isolated config on 16 Nov 2026, with
the result shown. OAuth sign-in itself needs a person in a browser, so "MCP
registered" means the app lists the `venom` server and, where it connects, gets
Venom's sign-in challenge.

| App | Remote MCP + OAuth | Venom package | Install | Tested |
| --- | --- | --- | --- | --- |
| Claude Code, chat, Cowork | Yes | `venom` plugin; Venom Full hooks for Claude Code | `/plugin install venom@venom` or `venom-full@venom` | Claude Code 2.1.311: `claude plugin validate` passes for the plugin and marketplace; installs 0.9.0 |
| Codex | Yes | `venom` plugin; Venom Full hooks | `codex plugin add venom@venom` | Codex 0.155: installs 0.9.0; `codex mcp list` shows `venom` with OAuth; skill present |
| Cursor | Yes | Cursor plugin: `.cursor-plugin/plugin.json`, `mcp.json`, `rules/venom.mdc`, `skills/venom` | Cursor Marketplace once listed; local clone into `~/.cursor/plugins/local/venom` | Cursor's `validate-template.mjs` passes. No Cursor app on the test machine |
| Gemini CLI | Yes (`httpUrl`) | Extension at the repository root | `gemini extensions install https://github.com/venomlabs-dev/plugin` | Gemini CLI 0.68.0: lists context file `VENOM.md`, MCP server `venom`, skill `venom` |
| GitHub Copilot CLI | Yes | This repository via its marketplace | `copilot plugin marketplace add venomlabs-dev/plugin`, `copilot plugin install venom@venom` | Copilot CLI 1.0.112: installs; `copilot mcp list` shows `venom (http)`; 1 skill |
| VS Code (Copilot) | Yes | Copilot CLI plugins; or `.vscode/mcp.json` and instructions | `code --add-mcp …` | Not tested (needs a Copilot sign-in) |
| OpenCode | Yes | OpenCode plugin in venom-full | `opencode plugin add github:venomlabs-dev/venom-full` | OpenCode 1.19.5 and 2.3.0: plugin active, `venom` skill listed, `venom` server reaches Venom and waits for sign-in. Compaction, subagent and milestone hooks are unit-tested only (they need a model) |
| Amp | Yes | Amp plugin in venom-full, calling `get_guidance` | `amp mcp add`, `amp skill add`, `amp plugins add` | Typechecked against `@ampcode/plugin` and unit-tested; not run (needs an Amp account) |
| Qwen Code | Yes (`httpUrl`) | This repository (converted on install) | `qwen extensions install venomlabs-dev/plugin` | Qwen Code 0.27.4: offers `venom` and `venom-full` from the marketplace; `venom` installs with context, skill and MCP |
| Factory Droid | Yes | This repository via its marketplace | `droid plugin marketplace add venomlabs-dev/plugin` | Not tested |
| JetBrains Junie | Yes | This repository via its marketplace | `/extensions marketplace add venomlabs-dev/plugin` | Not tested |
| Devin CLI / Desktop | Yes | This repository as a plugin, or config + `AGENTS.md` | `.devin/mcp_config.json` | Not tested (needs a Devin sign-in) |
| Kiro | Yes | Kiro Power in `platforms/kiro/power`, plus steering | Powers → Import power from a folder | Not tested (needs a Kiro sign-in) |
| Windsurf / Devin Desktop (Cascade) | Yes | Config + `trigger: always_on` rule | `mcp_config.json` | Not tested |
| Cline | CLI documents OAuth | Config + `.clinerules` | MCP settings | Not tested |
| Kilo Code | Yes | Config with `instructions` | `kilo.jsonc` | Not tested |
| Zed | Yes | Config + `AGENTS.md` | `context_servers` in settings | Not tested. Zed's MCP extensions run local commands only, and Zed is moving to the MCP Registry, where Venom is listed |
| Warp, Goose, Crush, Continue, Augment, Trae, Antigravity, JetBrains AI Assistant | Varies | Config + rules file | See the README | Not tested |
| T3 Code | Uses the apps it runs | None needed | Install Venom for Claude Code, Codex, OpenCode or Cursor | Not applicable |
| Roo Code | — | None | — | Not supported: the extension shut down on 15 May 2026 |

## Stores

| Store | Status | Who submits |
| --- | --- | --- |
| Claude plugin directory | In review | Venom Labs owner |
| OpenAI plugin directory (ChatGPT, Codex) | ZIP ready (`venom-openai-0.9.0.zip`) | Alex |
| Cursor Marketplace | Package ready (`.cursor-plugin/plugin.json`) | Alex, at cursor.com/marketplace/publish |
| Muse (Meta) | Form answers ready | Alex |
| Official MCP Registry | Listed as `io.github.venomlabs-dev/venom` | Done |
| Gemini CLI extension gallery | Ready: root `gemini-extension.json` | Alex adds the `gemini-cli-extension` topic to this repository |
| awesome-copilot, Cline MCP Marketplace, Kilo marketplace, Factory plugins, Docker MCP Catalog | Texts ready | Alex |

## Release gate

The checks for this repository live in the Venom monorepo
(`tests/plugin/check-plugin.mjs`). They verify:

- the Claude, Codex, Cursor, Gemini and Kiro manifests, with one version
  across them;
- that no store build declares hooks;
- that the repository holds only Markdown, JSON and images;
- that the Codex listing fits OpenAI's limits;
- that every copy of `VENOM.md` and of the skill matches its source.

They don't call the Venom server or run authenticated agent turns.

Before claiming more host behavior than this table shows, run an authenticated
trial in that app. It should:

- sign in;
- check that the skill or rule loads and Venom tools answer;
- resume after compaction;
- confirm a question creates no task;
- confirm a subagent reports to its parent.

Record the app version.
