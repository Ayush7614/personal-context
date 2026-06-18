# personal-context

Turn your digital footprint into an AI-readable profile.

```bash
npx personal-context init
npx personal-context all
npx personal-context build
npx personal-context summary
```

## Quick start

1. Run `personal-context init` to scaffold `personal.yaml`
2. Add your GitHub token: `export GITHUB_TOKEN=ghp_...`
3. Run `personal-context all` to aggregate GitHub, blogs, and more

## Commands

| Command | Description |
|---------|-------------|
| `init` | Scaffold `personal.yaml` |
| `github` | GitHub stats and repos |
| `blogs` | Recent blog posts (RSS) |
| `linkedin` | LinkedIn export data |
| `opensource` | Open-source contributions |
| `all` | Full profile output |
| `build` | Write `context.md`, `profile.json`, `llms.txt` |
| `summary` | One-paragraph AI summary |
| `teaser` | Animated WIP splash |

## Docs

- **Documentation:** https://ayush7614.github.io/personal-context/
- **GitHub:** https://github.com/Ayush7614/personal-context

## License

MIT
