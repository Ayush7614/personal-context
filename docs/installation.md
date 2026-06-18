# Getting Started

## Requirements

- Node.js 18 or newer

## Run without installing

```bash
npx personal-context init
npx personal-context all
```

## Install globally

```bash
npm install -g personal-context
personal-context --help
```

## From source

```bash
git clone https://github.com/Ayush7614/personal-context.git
cd personal-context
pnpm install
pnpm build

# run the built CLI
node packages/cli/dist/index.js all

# or link it globally
cd packages/cli && npm link
personal-context all
```

## First run

1. Create a config in the current directory:

    ```bash
    personal-context init
    ```

2. Open `personal.yaml` and fill in your details and source handles (see
   [Configuration](configuration.md)).

3. View your profile:

    ```bash
    personal-context all
    ```

!!! tip "GitHub token (optional)"
    Set `GITHUB_TOKEN` to unlock contribution + pull-request counts and higher
    rate limits. Public repo and star data works without it.

    ```bash
    export GITHUB_TOKEN=ghp_xxx
    ```

!!! info "Config discovery"
    The CLI looks for `personal.yaml` in the current directory and walks up
    parent directories, so run it from anywhere inside your project.
