# Contributing

Thanks for your interest in improving `personal-context`!

## Setup

```bash
pnpm install
pnpm build
node packages/cli/dist/index.js all
```

## Commit messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/)
so that versions and changelogs are generated automatically by
[release-please](https://github.com/googleapis/release-please).

Use these prefixes:

- `feat:` a new feature (minor bump)
- `fix:` a bug fix (patch bump)
- `docs:` documentation only
- `refactor:` code change that neither fixes a bug nor adds a feature
- `perf:` performance improvement
- `chore:` tooling / maintenance

Example:

```
feat(cli): add `summary` command for a one-paragraph AI brief
```

## Releases

Merging Conventional Commits into `main` makes release-please open a release PR
that bumps the version and updates `CHANGELOG.md`. Merging that PR tags the
release and publishes the GitHub Release.
