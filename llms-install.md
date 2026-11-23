# Installing Venom (for AI agents such as Cline)

Venom is multiplayer AI for your team: your agent and your teammates' agents
share projects, tasks, decisions and skills, so any agent picks up where
another left off. It is one remote MCP server. There is nothing to clone,
build or run locally.

If your app can load a plugin, install Venom's plugin for it instead: see the
[README](https://github.com/venomlabs-dev/plugin#pick-your-app). Cline can't, so it needs the server (step 1)
and Venom's rule (step 3): the server gives the agent Venom's tools, and the
rule tells it when to use them.

## 1. Add the MCP server (required)

- Name: `venom`
- URL: `https://mcp.venomlabs.dev`
- Transport: Streamable HTTP
- Authentication: OAuth in the user's browser. There is no API key: don't ask
  the user for one, and leave any client ID or secret empty.

Cline VS Code extension: read the existing `cline_mcp_settings.json` first,
keep every server already in it, and add this entry under `mcpServers` (if
the file is empty or missing, create it as `{"mcpServers": {...}}` with this
entry inside). Keep `"type": "streamableHttp"`, or Cline uses legacy SSE:

```json
"venom": {
  "type": "streamableHttp",
  "url": "https://mcp.venomlabs.dev",
  "disabled": false,
  "autoApprove": []
}
```

Cline CLI: run

```bash
cline mcp add venom --transport streamable-http --yes https://mcp.venomlabs.dev
```

Other agents: add a remote MCP server with that name and URL in the agent's
MCP settings.

## 2. Sign in (the user does this)

When the server is added, or a Venom tool is first used, the agent shows a
sign-in (in Cline, an Authenticate button on the `venom` server) that opens
Venom's page in the browser. That is expected, not an error: don't retry
or reconfigure the server. Tell the user to sign in with Google or their email
and pick their organization; new users get a workspace created for them
(https://app.venomlabs.dev/signup). Never sign in for them. Until they do,
Venom's tools answer that authentication is needed.

## 3. Add Venom's rule and skill (recommended)

Without them, agents rarely use Venom. In the current project (or fetch the
URL and write `.clinerules/venom.md` with your own file tool):

```bash
mkdir -p .clinerules
curl -fsSL https://raw.githubusercontent.com/venomlabs-dev/plugin/main/platforms/cline/venom.md -o .clinerules/venom.md
```

Enable the rule if Cline lists it as off. To apply it in every project, save
it to Cline's global rules folder instead (`~/.cline/rules/venom.md`, or
`~/Documents/Cline/Rules/venom.md`). In other apps, add
[VENOM.md](https://raw.githubusercontent.com/venomlabs-dev/plugin/main/VENOM.md)
to the app's rules or `AGENTS.md`.

Cline CLI only: add the `venom` skill with

```bash
cline skill add venomlabs-dev/plugin --skill venom -y
```

## 4. Venom Full: hooks (optional, ask the user first)

Venom's Cline hooks remind the agent to find the Venom task at the start of a
task and to record outcomes after commits, pull requests, merges and deploys.
They write files to `~/Documents/Cline/Hooks`, so ask the user before
installing them. The steps are in
https://github.com/venomlabs-dev/venom-full/tree/main/cline.

## 5. Check

- Cline's MCP servers list shows `venom` (until the user signs in, it may say
  it needs authentication).
- After the sign-in, call the `list_projects` tool to show it works. An empty
  list is fine in a new organization.

Help: support@venomlabs.dev. Privacy Policy: https://venomlabs.dev/privacy
