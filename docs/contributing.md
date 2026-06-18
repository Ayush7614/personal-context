# Contributing

Contributions, bug reports, and ideas are welcome!

## Setup

```bash
git clone https://github.com/Ayush7614/personal-context.git
cd personal-context
pnpm install
pnpm build

node packages/cli/dist/index.js all
```

## Project layout

```
packages/
  core/   # data sources, aggregation, renderers
  cli/    # the personal-context command
  mcp/    # the personal-context-mcp MCP server
docs/     # this documentation site (MkDocs)
```

## Useful scripts

```bash
pnpm build       # build all packages
pnpm typecheck   # typecheck all packages
pnpm dev         # watch-build the CLI
```

## Commit messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/)
so versions and changelogs are generated automatically. Use prefixes like
`feat:`, `fix:`, `docs:`, `refactor:`, `perf:`, and `chore:`.

```
feat(cli): add `summary` command for a one-paragraph AI brief
```

## Docs

The site is built with [MkDocs Material](https://squidfunk.github.io/mkdocs-material/).

```bash
python3 -m venv .venv
.venv/bin/pip install mkdocs-material
.venv/bin/mkdocs serve   # preview at http://localhost:8000
```

See [Releases & Versioning](releases.md) for how changes ship.
