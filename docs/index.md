# personal-context

> Turn your digital footprint into an **AI-readable profile**.
> GitHub + Blogs + Resume + Notes &rarr; one context source for every AI agent.

<p align="center">
  <img src="demo.gif" alt="personal-context CLI demo" width="760" />
</p>

!!! note "Work in progress"
    Something crazy on the way. &#10022; Star the
    [repo](https://github.com/Ayush7614/personal-context) to follow along.

## Why?

Current AI tools forget who you are. You keep re-explaining your work, skills,
projects, blogs, and open-source contributions. `personal-context` aggregates all
of it from your real sources and outputs it as a single profile you can print,
share, or feed to any AI tool (Cursor, Claude Code, Codex, Gemini CLI).

## What you get

<div class="grid cards" markdown>

-   :material-console: __A CLI__

    ---

    One command for your GitHub, blogs, open source, experience, and more.

    [:octicons-arrow-right-24: CLI reference](cli.md)

-   :material-robot: __An MCP server__

    ---

    Let any AI agent query your context live with `get_profile`, `get_recent_blogs`, and more.

    [:octicons-arrow-right-24: MCP setup](mcp.md)

-   :material-web: __Portfolio endpoints__

    ---

    Serve `/context.json` and `/llms.txt` from your site so agents know you.

    [:octicons-arrow-right-24: Portfolio integration](portfolio.md)

-   :material-cog: __One config__

    ---

    Everything is driven by a single `personal.yaml` — generic for anyone.

    [:octicons-arrow-right-24: Configuration](configuration.md)

</div>

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

## Data sources

| Information | Source |
| --- | --- |
| GitHub contributions, PRs, repos | GitHub REST + GraphQL API |
| Latest blogs | RSS feeds (Medium, Hashnode, Dev.to) |
| Experience timeline | `personal.yaml` + LinkedIn export (JSON) |
| Resume skills / summary | Resume JSON or PDF |
| Contact, skills, projects | `personal.yaml` |

## Architecture

A pnpm monorepo with a shared `core` so the CLI, the MCP server, and your
portfolio all consume the same profile data.

```
personal-context/
├── packages/
│   ├── core/   # sources + aggregation + renderers
│   ├── cli/    # the `personal-context` command
│   └── mcp/    # the `personal-context-mcp` MCP server
└── personal.yaml
```
