# personal-context-mcp

MCP server that exposes your personal context to any AI agent (Cursor, Claude, etc.).

## Quick start

```bash
npx personal-context-mcp
```

Point it at your config:

```bash
export PERSONAL_CONTEXT_CONFIG=/path/to/personal.yaml
npx personal-context-mcp
```

## Tools

| Tool | Description |
|------|-------------|
| `get_profile` | Full aggregated profile |
| `get_summary` | One-paragraph summary |
| `get_recent_blogs` | Latest blog posts |
| `get_github_stats` | GitHub contributions & repos |
| `get_projects` | Featured projects |
| `get_open_source` | Open-source contributions |
| `get_contact_info` | Contact details |
| `get_learning_history` | Current learning topics |

## Cursor setup

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "personal-context": {
      "command": "npx",
      "args": ["-y", "personal-context-mcp"],
      "env": {
        "PERSONAL_CONTEXT_CONFIG": "/absolute/path/to/personal.yaml"
      }
    }
  }
}
```

## Docs

- **Documentation:** https://ayush7614.github.io/personal-context/mcp/
- **GitHub:** https://github.com/Ayush7614/personal-context

## License

MIT
