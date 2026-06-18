# personal-context

> Turn your digital footprint into an AI-readable profile.
> **GitHub + Blogs + Resume + Notes -> one context source for every AI agent.**

<p align="center">
  <img src="docs/demo.gif" alt="personal-context CLI demo" width="760" />
</p>

> [!NOTE]
> Work in progress — something crazy on the way. ✦

Current AI tools forget who you are. You keep re-explaining your work, skills,
projects, blogs, and open-source contributions. `personal-context` aggregates
all of it from your real sources and outputs it as a single profile you can
print, share, or feed to any AI tool (Cursor, Claude Code, Codex, Gemini CLI).

```
$ npx personal-context all

Ayush Kumar
DevRel · AI Agents · Open Source · AI Security

Current Role:
  Lead Developer Relations Engineer @ NodeShift AI Cloud

Contact:
  Email: ayushknj3@gmail.com
  GitHub: https://github.com/Ayush7614

Recent Blogs:
  - AI Agents Masterclass — Full Visual Guide
  - Harness Engineering — Full Visual Guide
  ...

GitHub:
  Contributions: 1250
  Repositories: 35
  ...
```

## Quick start

```bash
# 1. Scaffold a config in the current folder
npx personal-context init

# 2. Edit personal.yaml with your details + source handles

# 3. See your full profile
npx personal-context all

# 4. Generate AI-readable files (context.md, profile.json, llms.txt)
npx personal-context build
```

## Commands

| Command | Description |
| --- | --- |
| `init` | Create a starter `personal.yaml` |
| `teaser` (`wip`) | Animated "something crazy on the way" splash |
| `all` | Full profile overview (the single-command output) |
| `github` | GitHub stats + latest contributions |
| `blogs [--limit N]` | Recent posts across all RSS feeds |
| `linkedin` | Role + experience timeline |
| `opensource` (`oss`) | Open-source contributions |
| `build [--out dir]` | Write `context.md`, `profile.json`, `llms.txt` |
| `summary` | One-paragraph AI brief |

Every read command supports `--json` for piping into other tools.

## Configuration

Everything is driven by a single `personal.yaml` (see [`personal.yaml`](./personal.yaml)
for a full reference). Static facts (name, role, skills, projects) live in the
file; live data is pulled from the sources you configure:

| Information | Source |
| --- | --- |
| GitHub contributions, PRs, repos | GitHub REST + GraphQL API |
| Latest blogs | RSS feeds (Medium, Hashnode, Dev.to) |
| Experience timeline | `personal.yaml` + LinkedIn export (JSON) |
| Resume skills / summary | Resume JSON or PDF |

Set `GITHUB_TOKEN` (see [`.env.example`](./.env.example)) to unlock contribution
counts and higher rate limits.

## MCP server

`personal-context` also ships an [MCP](https://modelcontextprotocol.io) server so
any AI agent (Cursor, Claude Code, Codex, etc.) can query your context live.

Add it to your MCP client config (e.g. Cursor's `~/.cursor/mcp.json`):

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

Then your agent can call:

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

`PERSONAL_CONTEXT_CONFIG` points the server at your `personal.yaml` regardless of
the directory the client launches it from.

## Architecture

A pnpm monorepo with a shared core so the CLI, the MCP server, and your
portfolio all consume the same profile data.

```
personal-context/
├── packages/
│   ├── core/   # sources + aggregation + renderers (Profile, context.md, llms.txt)
│   ├── cli/    # the `personal-context` command
│   └── mcp/    # the `personal-context-mcp` MCP server
└── personal.yaml
```

## Roadmap

- **v1** — Core + CLI (GitHub, blogs, LinkedIn, resume, generated profiles) ✅
- **v2** — MCP server (`get_profile`, `get_recent_blogs`, `get_github_stats`, ...) ✅ + portfolio `context.json` / `llms.txt` endpoints (in progress)
- **v3** — "Ask My Portfolio" chat + auto-learning timeline
- **v4** — AI personal brief + scheduled refresh

## License

MIT © Ayush Kumar
