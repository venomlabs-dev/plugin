# Host coverage — 18 November 2026 (0.9.2)

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

"Checked" means installed on macOS in an isolated config (16 Nov or 18 Nov
2026), with the result shown. OAuth sign-in needs a person in a browser, so
"server registered" means the app lists the `venom` server and, where it
connects, gets Venom's sign-in challenge. Levels follow the docs: plugin +
hooks, plugin + some hooks, plugin, MCP only.

| App | Level | Install | Checked |
| --- | --- | --- | --- |
| Claude Code | Plugin + hooks | `/plugin install venom-full@venom` | 2.1.311: `claude plugin validate` passes; installs 0.9.0. Used signed in every day |
| Claude chat and Cowork | Plugin | `venom` from the Claude plugin directory | Directory listing submitted; not tried in the app |
| Codex | Plugin + hooks | `codex plugin add venom@venom`, plus Venom Full | 0.155: installs; `codex mcp list` shows `venom` with OAuth; skill present. Used signed in every day |
| Amp | Plugin + hooks | `amp mcp add`, `amp skill add`, `amp plugins add` | Plugin typechecked and unit-tested. 18 Nov: every Amp command except `mcp add` needs an Amp login, so not run |
| OpenCode | Plugin + some hooks | `opencode plugin add github:venomlabs-dev/venom-full` | 1.19.5 and 2.3.0: plugin active, skill listed, server waits for sign-in. Hooks unit-tested only |
| Cursor | Plugin | Cursor Marketplace once listed; local clone into `~/.cursor/plugins/local/venom` | `validate-template.mjs` passes. Cursor CLI 2026.11.17: `~/.cursor/mcp.json` gives `venom: requires_authentication`; the CLI ignored a local plugin folder and needs a login for its marketplace. Cursor app not tried |
| GitHub Copilot CLI | Plugin | `copilot plugin marketplace add venomlabs-dev/plugin`, `copilot plugin install venom@venom` | 1.0.112: installs; `copilot mcp list` shows `venom (http)`; 1 skill |
| VS Code (Copilot) | Plugin | Copilot CLI plugins, or `.vscode/mcp.json` and instructions | Not tried (needs a Copilot sign-in) |
| Gemini CLI | Plugin | `gemini extensions install https://github.com/venomlabs-dev/plugin --ref main` | 0.68.0: context file `VENOM.md`, server `venom`, skill `venom`. Without `--ref`, Gemini installs release v0.3.3 |
| Antigravity CLI | Plugin | clone, then `agy plugin install <clone>` | 1.5.11: `agy plugin list` shows 1 skill, 1 rule, 1 MCP server; a signed-in session lists the `venom` skill. `agy plugin install` takes a local folder only. The plugin's server signs in through `/plugin` |
| Grok Build | Plugin | `grok plugin install venomlabs-dev/plugin --trust` | 1.0.89: `grok inspect` shows skill `venom` and server `venom` (http). Also picks up `venom` and `venom-full` installed in Claude Code. `venom@plugin` from the marketplace fails: Grok skips a marketplace entry whose source is the repository root. Venom Full's `mcp_tool` hooks don't run: Grok runs `command` and `http` hooks, and its `SessionStart` and `UserPromptSubmit` can't add context |
| Qwen Code | Plugin | `qwen extensions install venomlabs-dev/plugin` | 0.27.4: `venom` installs with context, skill and MCP |
| Factory Droid | Plugin | marketplace add, `droid plugin install venom@plugin --scope user`, `droid mcp add venom https://mcp.venomlabs.dev --type http` | 1.14.0, partly: skill and rules install into the plugin cache but `droid plugin list` doesn't show them; Droid rejects the plugin's root `mcp.json` (no `type`); the server from `droid mcp add` is listed as needing authentication. Venom Full's `mcp_tool` hooks are rejected |
| Kiro | Plugin | Powers → Import power from a folder, or `kiro-cli powers install <clone>/platforms/agent-plugin` | Kiro CLI 3.4.0: the Power installs (server and skill); `mcp list` needs a Kiro login. The Power carries no steering file |
| JetBrains Junie | Plugin | `/extensions marketplace add venomlabs-dev/plugin` | Junie CLI 26.9.7 (npm): every command hung on the test machine, so not checked |
| Mistral Vibe | Plugin | clone into `~/.vibe/plugins/venom`, `vibe mcp add venom --url https://mcp.venomlabs.dev --transport streamable-http` | 3.1.3: Vibe's plugin loader reads the skill; the plugin's server isn't imported, so add it with `vibe mcp add` |
| Pi | Plugin | `pi install git:github.com/venomlabs-dev/plugin`, `pi mcp add venom --url https://mcp.venomlabs.dev` | 1.5.2: `/skill:venom` present; `pi mcp list` shows `venom: needs sign-in`. `VENOM.md` isn't loaded |
| OpenClaw | Plugin | clone, then `openclaw plugins install <clone> --accept-capabilities` | 2026.11.5: plugin enabled (Codex bundle) with skill and server. The marketplace install fails on `venom-full`'s GitHub source; a `git:` install fails without `package.json` |
| Muse Code | Plugin | `muse plugins install <clone>/platforms/agent-plugin`, `muse mcp add venom --url https://mcp.venomlabs.dev --user` | 1.4.23: skill installs; the server from `muse mcp add` is listed (logged out); the plugin's own server waits for `muse plugins approve`. The repository root is refused because its `.mcp.json` server is HTTP |
| Augment (Auggie) | Plugin | `auggie install git:github.com/venomlabs-dev/plugin`, `auggie mcp add venom -t http -u https://mcp.venomlabs.dev` | 1.2.2: server listed, skill installed (the install brings the skill only) |
| Goose | Plugin | `goose plugin install https://github.com/venomlabs-dev/plugin`, plus the extension link | 1.60.1: skill listed; the install brings no server |
| Cline | MCP only | `cline skill add`, `cline mcp add`, `.clinerules/venom.md` | Cline CLI 3.0.74: server, rule and skill in `cline config`. The VS Code extension not tried |
| Hermes Agent | MCP only | skill from its raw URL, server in `config.yaml` | 0.23.2: skill enabled; `hermes mcp test venom` reaches OAuth. `hermes plugins install` refuses the repository (its scan flags README text) |
| Devin CLI | MCP only | `.devin/mcp_config.json` + `AGENTS.md` | Devin CLI 3000.14: `devin mcp list` shows `venom`; `AGENTS.md` is an always-on rule. Plugin install needs a Devin login, not tried |
| Kilo Code | MCP only | `kilo.jsonc` with `instructions` | Kilo CLI 7.8.27: server needs authentication, `VENOM.md` in instructions, skill listed. `kilo plugin github:venomlabs-dev/venom-full` installs, but its bundled skill is blocked and the plugin wasn't seen running |
| Crush | MCP only | `crush.json` + `AGENTS.md` | 0.101.0: skill loads; the server answers "Unauthorized" with no sign-in prompt seen |
| Continue | MCP only | `mcpServers` in `config.yaml` | CLI 1.5.47: reaches the server when the entry is in the config it loads; a separate `.continue/mcpServers/venom.yaml` wasn't read |
| Kimi Code | MCP only | `mcp.json` + `AGENTS.md` | 2.6.3 (code.kimi.com installer): needs a Kimi login. The PyPI `kimi-cli` is unmaintained. Kimi plugins need `kimi.plugin.json`, which this repository doesn't have |
| Windsurf / Devin Desktop (Cascade) | MCP only | `mcp_config.json` + rule | Not tried (desktop app) |
| Zed | MCP only | `context_servers` + `AGENTS.md` | Not tried (desktop app). Zed's MCP extensions run local commands only |
| Warp, JetBrains AI Assistant, Trae | MCP only | Settings + rules file | Not tried (desktop apps) |
| Grok Bot | MCP only | Custom remote connector | Not tried. Grok Bot plugins come from the Cursor Marketplace, so it gets the Cursor plugin once that listing is live |
| T3 Code | Uses the apps it runs | None needed | Not applicable |
| Roo Code | — | — | Not supported: the extension shut down on 15 May 2026 |

## Stores

| Store | Status |
| --- | --- |
| Claude plugin directory | Submitted |
| OpenAI plugin directory (ChatGPT, Codex) | Package ready |
| Cursor Marketplace | Publisher application in review (`.cursor-plugin/plugin.json`); not listed on 18 Nov. Grok Bot installs from this marketplace too |
| Muse (Meta) | Not listed yet |
| Official MCP Registry | Listed as `io.github.venomlabs-dev/venom` |
| Gemini CLI extension gallery | Package ready (root `gemini-extension.json`) |

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
