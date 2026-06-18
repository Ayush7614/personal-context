# MCP Server

`personal-context` ships an [MCP](https://modelcontextprotocol.io) server so any
AI agent (Cursor, Claude Code, Codex, etc.) can query your context live.

## Tools

| Tool | Returns |
| --- | --- |
| `get_profile` | The full profile object |
| `get_summary` | One-paragraph AI brief |
| `get_recent_blogs` `{ limit }` | Recent posts across feeds |
| `get_github_stats` | Contributions, PRs, repos, top repos |
| `get_projects` | Projects you build/ship |
| `get_open_source` | Open-source contributions |
| `get_contact_info` | Email, website, socials |
| `get_learning_history` | What you're learning + skills |

## Setup

=== "Cursor"

    Add to `~/.cursor/mcp.json`:

    ```json
    {
      "mcpServers": {
        "personal-context": {
          "command": "npx",
          "args": ["-y", "personal-context-mcp"],
          "env": {
            "PERSONAL_CONTEXT_CONFIG": "/absolute/path/to/personal.yaml",
            "GITHUB_TOKEN": "optional-token"
          }
        }
      }
    }
    ```

=== "Claude Desktop"

    Add to `claude_desktop_config.json`:

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

=== "From source"

    Point the command at the built server:

    ```json
    {
      "mcpServers": {
        "personal-context": {
          "command": "node",
          "args": ["/absolute/path/to/personal-context/packages/mcp/dist/index.js"],
          "env": {
            "PERSONAL_CONTEXT_CONFIG": "/absolute/path/to/personal.yaml"
          }
        }
      }
    }
    ```

!!! tip "PERSONAL_CONTEXT_CONFIG"
    Set this so the server can find your `personal.yaml` regardless of the
    directory the client launches it from.

## Try it

Once connected, ask your agent:

> Tell me about this person and their recent work.

The agent will call `get_profile` and `get_recent_blogs` and answer with your
live context.
