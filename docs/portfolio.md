# Portfolio Integration

Make your portfolio both human-readable and **AI-readable** so recruiters,
founders, and AI agents can consume the same data.

The reference implementation lives in
[ayushbuilds.dev](https://github.com/Ayush7614/ayushbuilds.dev) (Next.js App
Router) and exposes:

| Endpoint | Description |
| --- | --- |
| `/context.json` | Full machine-readable profile (role, skills, projects, GitHub, blogs) |
| `/llms.txt` | The same context as plain text for LLMs |
| `/ai-profile` | A styled page with an "AI Context Ready" badge |

## How it works

A server-side builder reads your single source of truth (the site's data file)
plus **live** GitHub stats and the Medium feed, then serves it from Next.js
route handlers — no extra dependencies, revalidated hourly.

```ts
// src/app/llms.txt/route.ts
import { buildContext, toLlmsTxt } from "@/lib/context";

export const revalidate = 3600;

export async function GET() {
  const ctx = await buildContext();
  return new Response(toLlmsTxt(ctx), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
```

## Badge

Add an "AI Context Ready" badge linking to `/ai-profile` or `/context.json` so
visitors (and crawlers) can discover the machine-readable profile.

## Static alternative

If you don't run a server, generate the files and commit them to your site's
`public/` folder:

```bash
personal-context build --out path/to/site/public
```

This writes `context.json` (rename from `profile.json` if you prefer) and
`llms.txt` that are then served as static assets.
