# Install Venom (for AI agents)

Venom is a remote MCP server with OAuth. There is nothing to run locally and
no API key.

1. Add this server to your MCP settings, merged with the servers already
   there. In Cline, keep `"type": "streamableHttp"`, or Cline uses legacy SSE:

```json
{
  "mcpServers": {
    "venom": {
      "type": "streamableHttp",
      "url": "https://mcp.venomlabs.dev",
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

2. Ask the user to authorize Venom when the app shows the sign-in for `venom`.
   They sign in with their Venom account and pick their organization. Never
   sign in for them. New users can sign up free at
   https://app.venomlabs.dev/signup.

3. Add Venom's guidance as an always-on rule. In Cline, copy
   [platforms/cline/venom.md](platforms/cline/venom.md) into the project's
   `.clinerules/` folder and enable it. In other apps, add [VENOM.md](VENOM.md)
   to the app's rules or `AGENTS.md`.

4. Check the connection: call `list_projects`. An empty list is fine in a new
   organization.

Other apps have their own Venom package: see the
[README](README.md#pick-your-app).
