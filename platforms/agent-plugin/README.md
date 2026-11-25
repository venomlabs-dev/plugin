# Venom for Agent Plugins apps (Kiro Power)

[Venom](https://venomlabs.dev) is multiplayer AI for your team: your agent and
your teammates' agents share projects, tasks, decisions and skills, so any
agent picks up where another left off.

This folder is an [Agent Plugins](https://agent-plugins.org) package. In Kiro
it is a Power:

- `mcp.json`: the Venom MCP server, `https://mcp.venomlabs.dev` (Streamable
  HTTP, OAuth 2.1). No API key: you sign in to Venom in your browser the first
  time a Venom tool is used.
- `skills/venom`: when to read your team's Venom projects and tasks, and when
  to record decisions and outcomes there.

## Install

- Kiro: **Powers → Add Custom Power → Import power from a repository URL**,
  with `https://github.com/venomlabs-dev/plugin/tree/main/platforms/agent-plugin`,
  or `kiro-cli powers install <clone>/platforms/agent-plugin`.
- Other apps that take Agent Plugins packages: see the
  [plugin README](../../README.md#agent-plugins-apps).

For always-on guidance in Kiro, also copy
[venom.md](../kiro/venom.md) into `.kiro/steering/`.

## Venom Full for Kiro

Venom Full is this Power plus Venom's Kiro hooks. Install the Power first, then
the hooks from [venom-full](https://github.com/venomlabs-dev/venom-full/tree/main/kiro):

```bash
git clone --depth 1 https://github.com/venomlabs-dev/venom-full ~/.venom-full
mkdir -p ~/.kiro/hooks/venom
cp ~/.venom-full/kiro/hooks/venom-hook.sh ~/.kiro/hooks/venom/
cp ~/.venom-full/kiro/hooks/venom-user.json ~/.kiro/hooks/venom.json
sh ~/.venom-full/shared/venom-hook.sh login
```

Restart Kiro. The Power alone has no hooks.

## Privacy and support

- Privacy Policy: https://venomlabs.dev/privacy
- Terms: https://venomlabs.dev/terms
- Security: https://venomlabs.dev/security
- Support: support@venomlabs.dev
