# CLI Reference

All commands read your `personal.yaml`. Every read command supports `--json` for
piping into other tools.

```
personal-context <command> [options]
```

## Commands

| Command | Description |
| --- | --- |
| `init` | Create a starter `personal.yaml` |
| `teaser` (`wip`) | Animated "something crazy on the way" splash |
| `banner` | Print the ASCII banner |
| `all` | Full profile overview (the single-command output) |
| `github` | GitHub stats + latest contributions |
| `blogs` | Recent posts across all RSS feeds |
| `linkedin` | Role + experience timeline |
| `opensource` (`oss`) | Open-source contributions |
| `build` | Write `context.md`, `profile.json`, `llms.txt` |
| `summary` | One-paragraph AI brief |

## `init`

Scaffold a starter config in the current directory.

```bash
personal-context init        # create personal.yaml
personal-context init --force # overwrite an existing one
```

## `all`

The single-command overview: name, role, contact, recent blogs, GitHub,
learning, skills, open source, and projects.

```bash
personal-context all
personal-context all --json          # machine-readable
personal-context all --limit 12      # include more blogs
personal-context all --no-banner     # hide the ASCII banner
```

## `github`

```bash
personal-context github
personal-context github --json
```

Shows contributions, PRs opened, public repos, total stars, and top
repositories. Contribution/PR counts require `GITHUB_TOKEN`.

## `blogs`

```bash
personal-context blogs
personal-context blogs --limit 5
personal-context blogs --json
```

Aggregates and sorts recent posts from every feed in
`sources.blogs.feeds`.

## `linkedin`

```bash
personal-context linkedin
```

Renders your current role and experience timeline from `personal.yaml` (and a
LinkedIn export if configured).

## `opensource`

```bash
personal-context opensource   # alias: oss
```

## `build`

Write AI-readable artifacts to an output folder.

```bash
personal-context build              # writes ./out
personal-context build --out public # custom folder
```

Produces:

- `context.md` — human-readable Markdown
- `profile.json` — the full structured profile
- `llms.txt` — compact text for LLMs

## `summary`

```bash
personal-context summary
```

Prints a one-paragraph natural-language brief about you.

## `teaser`

```bash
personal-context teaser   # alias: wip
```

Plays the animated ember splash — banner, build spinner, progress bar, and a
"something crazy on the way" pulse.
