# Configuration

Everything is driven by a single `personal.yaml`. Static facts (name, role,
skills, projects) live in the file; live data is pulled from the sources you
configure.

## Full reference

```yaml
name: Your Name                      # required
headline: One-line description
bio: >-
  A short paragraph about your background and focus.

currentRole:
  role: Your Role
  company: Your Company
  start: Jan 2024
  end: Present

contact:
  email: you@example.com
  website: https://yoursite.com
  github: https://github.com/yourhandle
  linkedin: https://linkedin.com/in/yourhandle
  twitter: https://x.com/yourhandle

skills:
  - Skill One
  - Skill Two

learning:
  - Topic you are learning

projects:
  - name: Project Name
    description: What it does
    url: https://github.com/yourhandle/project
    tags: [Next.js, TypeScript]

openSource:
  - name: Project
    role: Contributor
    description: What you contribute
    url: https://github.com/org/project

experience:
  - role: Past Role
    company: Past Company
    start: 2022
    end: 2023
    highlights:
      - Something you shipped.

sources:
  github:
    username: yourhandle
    pinned: [your-flagship-repo]      # always surface these repos
  blogs:
    feeds:
      - https://medium.com/feed/@yourhandle
      - https://yourname.hashnode.dev/rss.xml
  linkedin:
    exportPath: ./linkedin-export.json
  resume:
    path: ./resume.json
```

## Sources

### GitHub

```yaml
sources:
  github:
    username: yourhandle
    pinned: [flagship-repo]
```

Public repos and stars work anonymously. Set `GITHUB_TOKEN` to add contribution
and pull-request counts.

### Blogs

```yaml
sources:
  blogs:
    feeds:
      - https://medium.com/feed/@yourhandle
```

Any RSS/Atom feed works — Medium, Hashnode, Dev.to, or a self-hosted blog.

### LinkedIn

LinkedIn has no public profile API, so export your data
(Settings &rarr; Get a copy of your data) and point the config at the JSON:

```yaml
sources:
  linkedin:
    exportPath: ./linkedin-export.json
```

Supported shape:

```json
{
  "positions": [
    { "title": "Engineer", "company": "Acme", "startDate": "2023", "description": "..." }
  ]
}
```

### Resume

```yaml
sources:
  resume:
    path: ./resume.json   # or ./resume.pdf
```

JSON (e.g. [JSON Resume](https://jsonresume.org/)) is parsed natively. PDF
parsing uses the optional `pdf-parse` package, loaded only if installed.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `GITHUB_TOKEN` | Raises GitHub rate limits; unlocks contributions + PR counts |
| `PERSONAL_CONTEXT_CONFIG` | Absolute path to `personal.yaml` (used by the MCP server) |
