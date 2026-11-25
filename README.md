# Venom MCP plugin

**[Venom AI](https://venomlabs.dev)** by **Venom Labs** makes the coding agents
your team already uses multiplayer. The Venom plugin connects Claude Code,
Codex, Cursor, Gemini CLI, GitHub Copilot, OpenCode and other agents to one MCP
server, so your team's agents share tasks, decisions, skills and tools. There is no new
harness to adopt.

[Website](https://venomlabs.dev) · [How it works](https://docs.venomlabs.dev/how-it-works) · [Quickstart](https://docs.venomlabs.dev/quickstart) · [All agents](https://docs.venomlabs.dev/agents/all-agents) · [Pricing](https://venomlabs.dev/pricing)

Venom is where your team's AI agents share their work: projects, tasks,
decisions and skills, so any agent or teammate can pick up where another left
off. Agents reach it through the host-managed MCP connection at
`https://mcp.venomlabs.dev`.

**Install Venom Full.** Venom Full is the complete Venom package for your app:
the Venom MCP connection, the `venom` skill and Venom's hooks. The MCP server
alone gives an agent Venom's tools; the skill and hooks tell it when to use
them: read the project and task before acting, log what changed. Without them,
agents rarely use Venom. Venom needs Venom Full, so find your app in
[Pick your app](#pick-your-app) and follow its Venom Full steps.

This repository holds the `venom` plugin (the server and the skill, with no
hooks) and the marketplace that lists `venom-full`. The `venom` plugin alone is
the build that Anthropic's and OpenAI's plugin directories list; it is not the
setup we recommend. Some apps take a config file instead of a plugin: their
steps add the MCP server and Venom's rules file (see [Other apps](#other-apps)).
Connections remain authenticated and organization-scoped; the app manages OAuth
and tool approval. Installing Venom Full does not disable those controls.

## What this plugin does

Venom connects Claude to your team's Venom workspace through one remote MCP
server, `https://mcp.venomlabs.dev`, which you sign in to with your Venom
account. The `venom` plugin ships a `venom` skill that tells Claude when to read and
update Venom projects and tasks. It registers no hooks and runs no
code on your machine; Venom Full adds hooks that call the Venom server. Claude sends data to Venom only through the Venom tools it calls, and
only to your organization's workspace.

## Pick your app

| App | Install Venom Full | Section |
| --- | --- | --- |
| Claude Code | `venom-full` plugin from this marketplace (installs `venom` too) | [Claude](#claude-chat-cowork-and-claude-code) |
| Claude chat, Cowork | `venom-full` and `venom` from this marketplace on your Claude account | [Claude](#claude-chat-cowork-and-claude-code) |
| Codex | `venom` and `venom-full` plugins, lifecycle hooks on, hooks trusted in `/hooks` | [Codex](#codex) |
| Cursor | Venom Full: the Venom plugin (MCP, rule and skill) plus Venom's hooks for Cursor | [Cursor](#cursor) |
| Gemini CLI | Venom Full: the Venom extension plus Venom's hooks extension | [Gemini CLI](#gemini-cli) |
| GitHub Copilot CLI and VS Code | Venom Full for Copilot: one plugin with the server, skill and hooks | [GitHub Copilot](#github-copilot-cli-and-vs-code) |
| OpenCode | Venom Full for OpenCode: the plugin from venom-full | [OpenCode](#opencode) |
| Amp | Venom Full for Amp: MCP, skill and the plugin from venom-full | [Amp](#amp) |
| Devin CLI, Devin Desktop and Devin cloud sessions | Venom Full: one plugin install with MCP, rule, skill and Venom's hooks for Devin | [Devin](#devin-cli-desktop-and-cloud) |
| Augment (Auggie) | Venom Full for Auggie: one plugin from venom-full with the server, skill, rule and hooks | [Apps that read Claude plugins](#apps-that-read-claude-plugins) |
| Factory Droid | Venom Full: the `venom` plugin plus `venom-hooks` from venom-full | [Apps that read Claude plugins](#apps-that-read-claude-plugins) |
| Antigravity CLI, Grok Build, Qwen Code, JetBrains Junie, Mistral Vibe, Pi, OpenClaw, Muse Code | Venom Full: this repository as a plugin plus the app's folder from venom-full | [Apps that read Claude plugins](#apps-that-read-claude-plugins) |
| Goose | The Venom plugin (the skill) plus the Venom extension link (the server). Goose has no Venom Full package: its hooks can't add text the model sees | [Apps that read Claude plugins](#apps-that-read-claude-plugins) |
| OpenHands (Agent Canvas, OpenHands Cloud, SDK) | Venom Full for OpenHands: one plugin from venom-full with the skill and hooks; the server goes in OpenHands' MCP settings | [OpenHands](#openhands) |
| Kiro | Venom Full: the Venom Power plus Venom's Kiro hooks | [Kiro](#kiro), [Agent Plugins](#agent-plugins-apps) |
| Cline, Crush, Hermes, Kilo Code, Kimi Code | Venom Full: MCP config, rules file or skill, plus the app's hooks from venom-full | [Other apps](#other-apps) |
| Windsurf (classic Cascade), Zed, Warp, JetBrains AI Assistant, Continue, Trae and other MCP-only apps | MCP config and a rules file or skill. No Venom Full package exists for these apps | [Other apps](#other-apps) |

Venom Full steps for each app are below. The hooks come from one clone of
[venom-full](https://github.com/venomlabs-dev/venom-full) at `~/.venom-full`.

T3 Code runs Claude Code, Codex, OpenCode and Cursor with their own
configuration, so install Venom for those and T3 Code uses it.

## Claude (chat, Cowork and Claude Code)

Install Venom Full. In Claude Code:

```bash
claude plugin marketplace add venomlabs-dev/plugin
claude plugin install venom-full@venom --scope user
```

Or in a session: `/plugin marketplace add venomlabs-dev/plugin`, then
`/plugin install venom-full@venom`. Venom Full installs `venom` (the server and
the skill) as a dependency. Authorize Venom when prompted: run `/mcp`, choose
`venom` and authenticate.

In Claude chat and Cowork, on your Claude account open **Customize → Plugins →
Add → Add marketplace** and enter `venomlabs-dev/plugin`. Add `venom-full` and
`venom`, then connect Venom on the **Connectors** tab. Cowork runs plugin
hooks; chat ignores hooks, so there the skill and the server's instructions do
the work. We haven't tried these steps in the Claude app yet.

The `venom` skill loads when a request concerns work, the server's instructions
reach Claude Code and Cowork at session start, and Venom's hooks bring guidance
after compaction, at subagent start, on each prompt and after commits and
merges. Each Venom tool response also reminds Claude to keep the task current
until the hooks are active.

## Codex

Install Venom Full: both plugins, then lifecycle hooks.

```bash
codex plugin marketplace add venomlabs-dev/plugin
codex plugin add venom@venom
codex plugin add venom-full@venom
```

Turn on lifecycle hooks, start a new task, trust the Venom hooks once in
`/hooks`, and authorize Venom (`codex mcp login venom`). The `venom` plugin
ships the same skill as Claude. Venom Full adds the hooks, which call the Venom
server's guidance after compaction, when a subagent starts, on each prompt and
after commits and pull requests. OpenAI's plugin directory lists only `venom`,
because it does not accept plugins with lifecycle hooks; that is why Venom Full
comes from this marketplace.

The `venom` plugin's server entry (`platforms/codex/mcp.json`) approves Venom's
own write tools (`create_task`, `append_task_log` and the others listed there)
one by one, so they run without an approval prompt in a Venom Full install too.
Without it, with
`approval_policy = "never"` in a sandboxed session (the default for
`codex exec`), Codex refuses each unapproved MCP write with "MCP tool call
requires approval, but approval policy is never"; with `danger-full-access` it
approves such calls itself. Venom's organization admin tools
(`update_organization_profile`, `invite_members`, `apply_directory_batch`) and
tools from other servers that Venom proxies (named `<namespace>__<tool>`) keep
Codex's normal approval. In a sandboxed `never` session they are refused until
you approve them yourself, per tool, in `config.toml`:

```toml
[plugins."venom@venom".mcp_servers.venom.tools.sentry__create_issue]
approval_mode = "approve"
```

Don't set `default_tools_approval_mode = "approve"` for the whole server: it
would also approve every proxied tool without asking.

Maintainers: the tool list in `platforms/codex/mcp.json` must track Venom's own
tools that lack `readOnlyHint` (`services/mcp` in the Venom monorepo). A new
Venom tool prompts, or is refused in a sandboxed `never` session, until it is
added. Checked on Codex 0.155.

## Venom Full

`venom-full` is the complete Venom package: the server, the skill and the
hooks. It is the recommended install for every app, and the steps for each app
are in [Pick your app](#pick-your-app). Anthropic's and OpenAI's plugin
directories don't accept hooks from us, so they list only the `venom` plugin;
install Venom Full from this marketplace instead. Its files live in
[venomlabs-dev/venom-full](https://github.com/venomlabs-dev/venom-full); the
marketplace fetches them for you, and the same repository holds the hooks
packages for the other apps.

In Claude Code and Codex it ships only hooks and uses the `venom` plugin's
connection, so there's one sign-in and one set of Venom tools. Claude Code
installs `venom` with it; Codex needs both plugins (see [Claude](#claude-chat-cowork-and-claude-code)
and [Codex](#codex)).

The hooks are `mcp_tool` hooks that call the Venom server's `get_guidance`
tool after compaction, before compaction (Claude Code), when a subagent starts,
on each prompt, and after `git commit`, `git push`, `gh pr create` and
`gh pr merge`. No local program runs. While the hooks are active, the server
stops adding reminder lines to Venom tool responses.

## Cursor

Venom Full for Cursor is the Venom plugin (the MCP server, an always-applied
rule and the `venom` skill) plus Venom's hooks. Install the plugin locally
(the Cursor Marketplace listing isn't live yet):

```bash
git clone https://github.com/venomlabs-dev/plugin ~/.cursor/plugins/local/venom
```

On Windows, run it in PowerShell with `"$HOME\.cursor\plugins\local\venom"` as
the folder.

Then add Venom's hooks for Cursor: projects and mentions at the start of each
session, and a reminder to log after merges and deploys.

```bash
git clone --depth 1 https://github.com/venomlabs-dev/venom-full ~/.venom-full
cp -R ~/.venom-full/cursor ~/.cursor/plugins/local/venom-hooks
```

Run **Developer: Reload Window**, then open **Cursor Settings → MCP** and connect
`venom`. Once Venom is connected, sign the hooks in with
`sh ~/.venom-full/shared/venom-hook.sh login`: open the link it prints and
approve it. Don't stop at the MCP server: the rule and skill
tell Cursor's agent when to use Venom, and the hooks keep it doing so.

## Gemini CLI

Venom Full for Gemini is the Venom extension plus Venom's hooks extension.

```bash
gemini extensions install https://github.com/venomlabs-dev/plugin --ref main
```

`--ref main` installs from the repository: without it, Gemini installs the
latest GitHub release, which is still an old 0.3.x build. Restart Gemini and
authorize Venom (`/mcp auth venom`). The extension adds the
Venom MCP server, loads [VENOM.md](VENOM.md) as a context file in every
session, and adds the `venom` skill. Update with `gemini extensions update venom`.

Then add Venom's hooks extension, the second half of Venom Full:

```bash
git clone --depth 1 https://github.com/venomlabs-dev/venom-full ~/.venom-full
gemini extensions install ~/.venom-full/gemini
sh ~/.venom-full/shared/venom-hook.sh login
```

The last line signs the hooks in: open the link it prints and approve it.

If you installed an earlier version from the `platforms/gemini` folder, remove
it first with `gemini extensions uninstall venom`.

## GitHub Copilot (CLI and VS Code)

Venom Full for Copilot is one plugin: the Venom MCP server, the `venom` skill
and Venom's hooks, which bring your Venom projects and mentions at session
start and remind Copilot to log after merges and deploys.

```bash
copilot plugin marketplace add venomlabs-dev/plugin
copilot plugin install venom-full@venom
```

Run `/mcp` in Copilot to authenticate `venom`. Then sign the hooks in once per
machine, so each session starts with your projects and mentions:

```bash
git clone --depth 1 https://github.com/venomlabs-dev/venom-full ~/.venom-full
sh ~/.venom-full/shared/venom-hook.sh login
```

The plugin's files live in
[venom-full/copilot](https://github.com/venomlabs-dev/venom-full/tree/main/copilot);
this repository's Copilot marketplace (`.github/plugin/marketplace.json`)
points at them; if you added this marketplace before 0.9.7, run
`copilot plugin marketplace update venom` first. Don't install `venom@venom`
alongside `venom-full`: `venom-full` already has the server and the skill. If you
installed Venom's hooks as `venom-hooks` before 0.9.7, run
`copilot plugin uninstall venom-hooks` first so they don't run twice.

VS Code agent mode loads plugins installed by Copilot CLI. Without Copilot
CLI, run **Chat: Install Plugin from Source** with a local clone's
`venom-full/copilot` folder, or add the MCP server and Venom's rules: run
`code --add-mcp '{"name":"venom","type":"http","url":"https://mcp.venomlabs.dev"}'`,
or merge [mcp.json](platforms/vscode/mcp.json) into `.vscode/mcp.json`, and
append [copilot-instructions.md](platforms/copilot/copilot-instructions.md) to
`.github/copilot-instructions.md`.

## OpenCode

Venom Full for OpenCode is one plugin. It adds the MCP server and the `venom` skill, and
guides the agent at compaction, in subagents and after commits and pull
requests. It lives in [venom-full](https://github.com/venomlabs-dev/venom-full#opencode):

```bash
opencode plugin add github:venomlabs-dev/venom-full   # OpenCode 2.x
opencode plugin -g github:venomlabs-dev/venom-full    # OpenCode 1.x
opencode mcp auth venom
```

## Amp

Venom Full for Amp is the server, the skill and the Venom plugin for Amp:

```bash
amp mcp add venom https://mcp.venomlabs.dev
amp skill add venomlabs-dev/plugin --global
amp plugins add https://raw.githubusercontent.com/venomlabs-dev/venom-full/main/amp/venom.ts
```

The [Amp plugin](https://github.com/venomlabs-dev/venom-full#amp) calls the
Venom server's guidance on each prompt, after milestones and at the end of a
turn, as Venom Full does in Claude Code. If `amp plugins add` doesn't take the
URL, save `venom.ts` in `~/.config/amp/plugins/`. If the plugin doesn't load,
append [VENOM.md](VENOM.md) to your `AGENTS.md`. These commands follow Amp's docs and
haven't been run in Amp yet.

## Devin (CLI, Desktop and cloud)

Venom Full for Devin is one install:

```bash
devin plugins install venomlabs-dev/plugin
```

One install brings everything Devin can take: the Venom MCP server, the
`venom` skill, an always-on Venom rule, and Venom's hooks for Devin, which
Devin installs with it from
[venom-full](https://github.com/venomlabs-dev/venom-full/tree/main/devin).
Devin also saves the plugin to your Devin account for your cloud sessions,
and Devin's docs say Devin Desktop's agent (Devin Local) shares the CLI's
plugins; we haven't tried either yet. Add `--local` to install it on this
machine only. If the install ends with "installed locally but not synced",
Venom works on this machine, but Devin didn't save it to your account. Update
with `devin plugins update`.

Sign in to Venom with `devin mcp login venom`, or when Devin asks on first use.
Then sign the hooks in once per machine, so each session starts with your
Venom projects and unread mentions:

```bash
git clone --depth 1 https://github.com/venomlabs-dev/venom-full ~/.venom-full
sh ~/.venom-full/shared/venom-hook.sh login
```

Installing plugins needs a Devin sign-in (`devin auth login`). Windsurf's
classic Cascade agent doesn't load plugins; see [Other apps](#other-apps).

Tested live on 23 November 2026 in Devin CLI 3000.14, signed in to Devin and
Venom: one install brought the server, the skill, the rule and the hooks;
Venom's tools worked; and the session-start note (projects and mentions) and
the commit note reached the model. Not run in Devin Desktop. Cloud sessions
weren't checked, because Devin didn't sync the plugin to our test account.

## Apps that read Claude plugins

These apps install this repository as their own plugin format, which gives
them the server and the skill. Venom Full adds the app's hooks package from
[venom-full](https://github.com/venomlabs-dev/venom-full#other-agents). Each row
below is the Venom Full steps for that app: the install, then the hooks from one
clone (`git clone --depth 1 https://github.com/venomlabs-dev/venom-full ~/.venom-full`), then `sh ~/.venom-full/shared/venom-hook.sh login` (open the link it prints and approve it).
"Checked" means installed on macOS in a clean config on 18 Nov 2026 (Qwen Code
on 16 Nov) and the app's own listing showed Venom's server and skill; "Partly"
says what wasn't confirmed. Sign-in needs a person, so it wasn't part of the
check. If one doesn't work, use the app's row in [Other apps](#other-apps).

| App | Venom Full steps | Checked |
| --- | --- | --- |
| Antigravity CLI | Venom Full: `git clone https://github.com/venomlabs-dev/plugin ~/.venom-plugin`, `agy plugin install ~/.venom-plugin`, then the hooks: `agy plugin install ~/.venom-full/antigravity`; sign in to Venom with `/plugin` | Yes, 1.5.11: skill, rule and server |
| Grok Build | Venom Full: `grok plugin install venomlabs-dev/plugin --trust`, then the hooks: `grok plugin install ~/.venom-full/grok --trust`; sign in with `/mcps`, select `venom`, press `i`. Grok Build also picks up Venom from Claude Code | Yes, 1.0.89 |
| Qwen Code | Venom Full: `qwen extensions install venomlabs-dev/plugin`, then pick `venom`, then the hooks: `qwen extensions install ~/.venom-full/qwen` | Yes, 0.27.4 |
| Factory Droid | Venom Full: `droid plugin marketplace add venomlabs-dev/plugin`, `droid plugin install venom@plugin --scope user`, `droid plugin marketplace add venomlabs-dev/venom-full`, `droid plugin install venom-hooks@venom-full --scope user`. If `/mcp` doesn't list `venom` afterwards, add it with `droid mcp add venom https://mcp.venomlabs.dev --type http` | Partly, 1.14.0: Droid rejected the plugin's server, so `droid mcp add` was needed. 0.9.6 fixes that the way Factory's docs describe (Droid reads `.mcp.json` when `mcp.json` declares the Agent Plugins schema); not re-run, because Droid's CLI uses the macOS keychain |
| JetBrains Junie | Venom Full: `/extensions marketplace add venomlabs-dev/plugin`, `/extensions install venom`, then the hooks: `/extensions marketplace add ~/.venom-full/junie`, `/extensions install venom-hooks` | No: Junie CLI 26.9.7 didn't start on the test machine |
| Mistral Vibe | Venom Full: `git clone https://github.com/venomlabs-dev/plugin ~/.vibe/plugins/venom`, plus the [Vibe hooks](https://github.com/venomlabs-dev/venom-full/tree/main/vibe): `mkdir -p ~/.vibe/plugins && cp -R ~/.venom-full/vibe ~/.vibe/plugins/venom-hooks`. Then, in a new chat, `/mcp status` and `/mcp login` with the server whose name ends in `_venom`: Vibe names the plugin's server `plugin_<id>_venom` and doesn't start its sign-in by itself. Don't add a server named `venom`, which would be a second Venom server | Yes, Vibe app 3.1.3: skill, server and hooks in a real chat. The sign-in was done with `vibe mcp add <that name> --url https://mcp.venomlabs.dev/ --transport streamable-http` (Vibe CLI 3.1.4); `/mcp login` is Vibe's own command for the same step, not tried yet |
| Pi | Venom Full: `pi install git:github.com/venomlabs-dev/plugin`, `pi mcp add venom --url https://mcp.venomlabs.dev`, then the hooks: `pi install ~/.venom-full/pi` | Yes, 1.5.2 |
| OpenClaw | Venom Full: `openclaw plugins install ~/.venom-full/openclaw --accept-capabilities` (venom-full's OpenClaw plugin ships the server and skill too). Or the repository alone: `git clone https://github.com/venomlabs-dev/plugin ~/.venom-plugin`, then `openclaw plugins install ~/.venom-plugin --accept-capabilities` | Yes, 2026.11.5: skill and server from the plugin |
| Muse Code | Venom Full: `git clone https://github.com/venomlabs-dev/plugin ~/.venom-plugin`, `muse plugins install ~/.venom-plugin/platforms/agent-plugin`, `muse mcp add venom --url https://mcp.venomlabs.dev --user`, then the hooks: `muse plugins install ~/.venom-full/muse` and `muse plugins approve venom-hooks` | Yes, 1.4.23: skill and server listed |
| Augment (Auggie) | Venom Full in one plugin, from venom-full: `auggie plugin marketplace add venomlabs-dev/venom-full`, then enable `venom-full` in `/plugins` and sign in from `/mcp`. Its [README](https://github.com/venomlabs-dev/venom-full/tree/main/auggie) adds the session-start notes (an extension) | Partly, 1.2.2: one plugin brings the server and the skill (listed); not run with a model, which needs an Augment account |
| Goose | Two steps. The skill: `goose plugin install https://github.com/venomlabs-dev/plugin`. The server: open `goose://extension?url=https%3A%2F%2Fmcp.venomlabs.dev&type=streamable_http&id=venom&name=Venom&description=Your%20team%27s%20projects%2C%20tasks%20and%20decisions`, which adds Venom to Goose as a native extension (Streamable HTTP, OAuth); in the CLI, `goose configure` → Add Extension → Remote Extension (Streamable HTTP), name `venom`, URL `https://mcp.venomlabs.dev`. Goose opens Venom's sign-in when the next session starts | Yes, 1.60.2 in [venom-full's CI](https://github.com/venomlabs-dev/venom-full/blob/main/test/live/goose.sh) on Linux with a stand-in model: the install imports the `venom` skill and its description reaches the model; with the extension entry the link writes (its URL pointed at a stand-in for Venom's sign-in), Goose registers and prints the sign-in link. Not run: Goose Desktop opening the link, a real sign-in. A Goose plugin can carry only local (stdio) servers, so the install can't bring the server, and Goose hooks can't add text the model sees, so there's no Venom Full for Goose |

Droid names this marketplace `plugin`, after the repository, so the plugin is
`venom@plugin` there. Grok Build skips the marketplace's `venom` entry, so
install the repository directly as above. Muse Code and OpenClaw don't install
the repository root from GitHub; use the commands above.

Install Venom Full in each of these apps: the server and skill from this
repository, then the app's hooks from venom-full. Each folder's README has the
details.

## Kiro

Venom Full for Kiro is the Venom Power plus Venom's Kiro hooks.
[platforms/agent-plugin](platforms/agent-plugin) is the Power: the Venom MCP
server and the `venom` skill, in Kiro's current Power format (`plugin.json`,
`mcp.json`, `skills/`). Kiro CLI 3.4.0 installs it with `kiro-cli powers install`
(18 Nov); checking it further needs a Kiro login. In Kiro, open **Powers → Add Custom Power →
Import power from a folder** and pick that folder from a clone of this
repository. For always-on guidance, copy [venom.md](platforms/kiro/venom.md)
into `.kiro/steering/`; custom agents must include it as a resource. If the Power doesn't
import, merge [mcp.json](platforms/kiro/mcp.json) into `.kiro/settings/mcp.json`.

Then add the hooks, which bring Venom's guidance at session start, around
compaction and after merges and deploys:

```bash
git clone --depth 1 https://github.com/venomlabs-dev/venom-full ~/.venom-full
mkdir -p ~/.kiro/hooks/venom
cp ~/.venom-full/kiro/hooks/venom-hook.sh ~/.kiro/hooks/venom/
cp ~/.venom-full/kiro/hooks/venom-user.json ~/.kiro/hooks/venom.json
sh ~/.venom-full/shared/venom-hook.sh login
```

Restart the Kiro session. The
[Kiro folder](https://github.com/venomlabs-dev/venom-full/tree/main/kiro) has
the per-project form.

## Agent Plugins apps

[platforms/agent-plugin](platforms/agent-plugin) is Venom as an
[Agent Plugins](https://agent-plugins.org) 1.0 package (`plugin.json`,
`mcp.json`, `skills/`), for apps that load that format (VS Code, GitHub
Copilot, Kiro and others; not OpenHands, see [OpenHands](#openhands)). Install that folder with the app's own
plugin command to get the Venom MCP server and the `venom` skill, then add the
app's always-on rules and Venom Full hooks from its own section when it has one. It isn't
at the repository root because Codex would then read it instead of
`.codex-plugin/plugin.json`.

## OpenHands

Venom Full for OpenHands (Agent Canvas, OpenHands Cloud and SDK scripts) is
one plugin in venom-full's [openhands](https://github.com/venomlabs-dev/venom-full/tree/main/openhands)
folder: the `venom` skill, plus hooks that bring Venom's guidance (and, signed
in, your projects and mentions) before the first prompt and ask once to log
after a merge, release or deploy. It has no server: per OpenHands' source, a
plugin's server gets no OAuth sign-in and replaces a signed-in server of the
same name. So don't use `platforms/agent-plugin` in OpenHands.

1. In Agent Canvas, open Settings, then MCP, choose **Add custom server**,
   **SHTTP**, URL `https://mcp.venomlabs.dev`, name `venom`, Authentication
   **OAuth**, and approve the sign-in.
2. In Plugins, install from source `github:venomlabs-dev/venom-full`, path
   `openhands`. On a local backend you can instead copy that folder to
   `~/.openhands/plugins/venom-full`.

Checked in [venom-full's CI](https://github.com/venomlabs-dev/venom-full/blob/main/openhands/test/live/run.sh)
on Linux with the OpenHands SDK 1.63.1 and a stand-in model: the plugin loads
into a conversation, the skill, the session-start note and the stop question
reach the model, and the agent server's MCP OAuth route returns Venom's
sign-in link (stand-in server). Not run: the Agent Canvas screens, OpenHands
Cloud, a real sign-in.

The pip `openhands` CLI (1.16, May 2026) has no plugins. Its docs add the
server with `openhands mcp add venom --transport http --auth oauth
https://mcp.venomlabs.dev` (not run); then append [VENOM.md](VENOM.md) to the
repository's `AGENTS.md`.

## Other apps

These apps can't load a Venom plugin, or their plugin didn't install, so add
both the MCP entry and the instructions file: the instructions are what tell the agent to use Venom.
Where venom-full has a package for the app (marked below), add it too: that
makes it Venom Full. Windsurf, Zed, Warp, JetBrains AI Assistant, Continue and
Trae have no Venom Full package, so the MCP entry and instructions are the
whole setup there.
Merge MCP entries into existing configuration; never overwrite other servers.
Add the instruction file alongside existing rules. Where an app reads
`AGENTS.md`, append [VENOM.md](VENOM.md) to it.

| App | MCP configuration | Instructions |
| --- | --- | --- |
| Cline CLI | `cline mcp add venom --transport streamable-http --yes https://mcp.venomlabs.dev` (checked, 3.0.74) | Copy [venom.md](platforms/cline/venom.md) into `.clinerules/`, and `cline skill add venomlabs-dev/plugin --skill venom -y`. Venom Full: then `sh ~/.venom-full/cline/install.sh` (steps in [venom-full/cline](https://github.com/venomlabs-dev/venom-full/tree/main/cline)) |
| Cline (VS Code extension) | Merge [mcp.json](platforms/cline/mcp.json) through Cline's MCP settings | Copy [venom.md](platforms/cline/venom.md) into `.clinerules/` and enable it |
| Hermes Agent | Add `venom` with `url: https://mcp.venomlabs.dev` and `auth: oauth` under `mcp_servers` in `~/.hermes/config.yaml` (checked, 0.23.2) | `hermes skills install https://raw.githubusercontent.com/venomlabs-dev/plugin/main/skills/venom/SKILL.md`. Hermes refuses this repository as a plugin. Venom Full: then `hermes plugins install ~/.venom-full/hermes --enable` |
| Kilo Code | Merge [kilo.json](platforms/kilo/kilo.json) into `kilo.jsonc` | Copy [VENOM.md](VENOM.md) next to it (listed in `instructions`). Venom Full: then `kilo plugin github:venomlabs-dev/venom-full` |
| Windsurf (classic Cascade agent) | Merge [mcp_config.json](platforms/windsurf/mcp_config.json) into `~/.codeium/windsurf/mcp_config.json` | Copy [venom.md](platforms/windsurf/venom.md) into `.windsurf/rules/` |
| Devin CLI / Desktop Local (if Venom Full's plugin doesn't install) | Merge [mcp_config.json](platforms/devin/mcp_config.json) into `.devin/mcp_config.json`, then `devin mcp login venom` | Append [VENOM.md](VENOM.md) to `AGENTS.md` |
| Zed | Merge [settings.json](platforms/zed/settings.json) into Zed's `settings.json` | Append [VENOM.md](VENOM.md) to `AGENTS.md` |
| JetBrains Junie (if the plugin doesn't install) | Merge [mcp.json](platforms/junie/mcp.json) into `~/.junie/mcp/mcp.json`, then `/mcp` and Authorize | Append [VENOM.md](VENOM.md) to `.junie/AGENTS.md` |
| JetBrains AI Assistant | Paste [mcp.json](platforms/junie/mcp.json) in **Settings → Tools → AI Assistant → MCP** | Add [VENOM.md](VENOM.md) to the project's rules |
| Qwen Code (if the plugin doesn't install) | Merge [settings.json](platforms/qwen/settings.json) into `~/.qwen/settings.json` | Append [VENOM.md](VENOM.md) to `QWEN.md` |
| Factory Droid (if the plugin doesn't install) | `droid mcp add venom https://mcp.venomlabs.dev --type http`, or merge [mcp.json](platforms/factory/mcp.json) | Append [VENOM.md](VENOM.md) to `AGENTS.md` |
| Amp (if the plugin doesn't install) | Merge [settings.json](platforms/amp/settings.json) into `~/.config/amp/settings.json` | Append [VENOM.md](VENOM.md) to `AGENTS.md` |
| Crush | Merge [crush.json](platforms/crush/crush.json) into `crush.json` | Append [VENOM.md](VENOM.md) to `AGENTS.md`. Venom Full: then `sh ~/.venom-full/crush/install.sh --apply` |
| Warp | Add a remote MCP server named `venom` at `https://mcp.venomlabs.dev` in **Settings → MCP Servers** | Append [VENOM.md](VENOM.md) to `AGENTS.md`, and copy [skills/venom](skills/venom) into `.agents/skills/` so Warp loads the skill |
| Goose | Click `goose://extension?url=https%3A%2F%2Fmcp.venomlabs.dev&type=streamable_http&id=venom&name=Venom&description=Your%20team%27s%20projects%2C%20tasks%20and%20decisions`, or `goose configure` → Add Extension → Remote Extension (Streamable HTTP), name `venom` | `goose plugin install https://github.com/venomlabs-dev/plugin`, or copy [skills/venom](skills/venom) into `~/.agents/skills/` |
| Continue | Add the `mcpServers` entry (below) to your Continue `config.yaml` | Copy [VENOM.md](VENOM.md) into `.continue/rules/` |
| Kimi Code | Venom Full: `/plugins install ~/.venom-full/kimi`. It replaces the `venom` plugin in Kimi (server, skill and hooks): don't install both. Without it, add a remote MCP server (Streamable HTTP) named `venom` at `https://mcp.venomlabs.dev`, with OAuth | Append [VENOM.md](VENOM.md) to `AGENTS.md` if you skip the plugin |
| Trae and any other MCP client | Add a remote MCP server (Streamable HTTP) named `venom` at `https://mcp.venomlabs.dev`, with OAuth and no API key | Add [VENOM.md](VENOM.md) to the app's rules file |

Continue's `mcpServers` entry, in the `config.yaml` the CLI loads (Continue CLI
1.5.47 didn't read a separate `.continue/mcpServers/venom.yaml`):

```yaml
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
run `/mcp`; in Mistral Vibe, run `/mcp status`, then `/mcp login` with the
server whose name ends in `_venom`. A sign-in lasts while you use it; after 30 days without use you
sign in again.

## Upgrading to 0.9.12

- Codex: the plugin approves Venom's own write tools, so they work with
  `approval_policy = "never"` in a sandboxed session instead of failing with "MCP tool call requires
  approval". Tools from servers proxied through Venom keep Codex's normal
  approval. Other apps are unchanged. See [Codex](#codex).

## Upgrading to 0.9.11

- OpenAI plugin directory only: the review test cases now match the reviewer's
  demo organization (Northwind Demo), and the release notes name this version.
  Nothing changes for installed plugins.

## Upgrading to 0.9.10

- The skill's sign-in steps cover Goose (the Venom extension link) and
  OpenHands (Settings, then MCP). Its Venom Full steps cover OpenHands, which
  gets its own plugin in venom-full 0.15.0.
- Goose and OpenHands were tested live in venom-full's CI against a stand-in
  model; see [Apps that read Claude plugins](#apps-that-read-claude-plugins)
  and [OpenHands](#openhands).

## Upgrading to 0.9.9

- Devin's plugin pins Venom's Devin hooks to an exact venom-full commit
  instead of its main branch, as Devin's marketplace asks: the commit Devin
  reviews is the code it installs. Hooks changes for Devin now arrive with a
  plugin release; run `devin plugins update`.

## Upgrading to 0.9.8

- Devin's plugin was tested live in Devin CLI, signed in. Its manifest now has
  the `displayName` and `shortDescription` that Devin's marketplace cards show.

## Upgrading to 0.9.7

- GitHub Copilot gets Venom Full in one plugin: `copilot plugin install
  venom-full@venom` brings the server, the skill and the hooks. This
  repository's `.github/plugin/marketplace.json` is Copilot's marketplace and
  points `venom-full` at venom-full's `copilot` folder. If you had
  `venom-hooks`, uninstall it.
- The skill's Copilot install line uses that marketplace.

## Upgrading to 0.9.6

- Devin gets a real plugin: `devin plugins install venomlabs-dev/plugin` brings
  the server, skill, always-on rule and Venom's hooks for Devin in one step, in
  Devin CLI, Devin Desktop and Devin cloud sessions.
- Factory Droid gets its server from the plugin: the root `mcp.json` now
  declares the Agent Plugins schema, so Droid reads `.mcp.json` instead of
  rejecting `mcp.json`. Cursor's plugin reads its server from
  `platforms/cursor/mcp.json`, with the same contents as before.
- The rule in `rules/` carries `trigger: always_on`, so Devin loads it in
  every session.

## Upgrading to 0.9.5

Venom Full is the setup that works fully, so the `venom` skill and rules now
ask for it by name: "Want me to install Venom Full?" Each app gets its own
install steps, including Copilot and Gemini CLI, from one clone of
venom-full at `~/.venom-full`. Nothing installs without your yes.

## Upgrading to 0.9.4

In Mistral Vibe, the `venom` skill now gives the right sign-in step (`/mcp
status`, then `/mcp login` with the server whose name ends in `_venom`) and
the commands for Venom's Vibe hooks when the full plugin isn't running.

## Upgrading to 0.9.3

When a Venom reply says the full plugin isn't running (no Venom hooks on that
connection), the `venom` skill and rules have your agent offer, once, to
install it, with the commands for Claude Code, Codex and Cursor. Nothing
installs without your yes.

## Upgrading to 0.9.2

Venom's icon is the official mark everywhere: the black V on cream, the same
as venomlabs.dev and the venomlabs-dev GitHub organization. Nothing else
changes.

## Upgrading to 0.9.1

The Cursor rule is `rules/venom.md`, and `platforms/agent-plugin` is the Agent
Plugins package for Kiro and GitHub Copilot.

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

The marketplace now also lists `venom-full`: see
[Venom Full](#venom-full). The `venom` plugin is unchanged.

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

## Privacy and support

- Privacy Policy: https://venomlabs.dev/privacy
- Terms: https://venomlabs.dev/terms
- Security: https://venomlabs.dev/security
- Support: support@venomlabs.dev

## Development

The repository holds only Markdown, JSON and images, as the directory requires
for organizations that aren't Verified. Edit [VENOM.md](VENOM.md), then update
the copies in `rules/` and `platforms/` to match; edit
[skills/venom/SKILL.md](skills/venom/SKILL.md), then update its copy in
`platforms/agent-plugin/skills/venom/SKILL.md`. The checks for this repository
live in the Venom monorepo.
