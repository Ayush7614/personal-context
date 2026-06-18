import { Command } from "commander";
import pc from "picocolors";
import { writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import {
  buildProfile,
  loadConfig,
  getGithubToken,
  getGithubStats,
  getBlogs,
  renderMarkdown,
  renderJson,
  renderLlmsTxt,
  renderSummary,
  type Profile,
} from "@personal-context/core";
import { renderBanner } from "./banner.js";

const program = new Command();

program
  .name("personal-context")
  .description(
    "Turn your digital footprint into an AI-readable profile (GitHub, blogs, open source, and more).",
  )
  .version("0.1.0");

function header(text: string): void {
  console.log(pc.bold(pc.cyan(text)));
}

function kv(key: string, value: string | number | undefined): void {
  if (value === undefined || value === "") return;
  console.log(`  ${pc.dim(key + ":")} ${value}`);
}

function bullet(text: string): void {
  console.log(`  ${pc.dim("-")} ${text}`);
}

function fail(message: string): never {
  console.error(pc.red(`error: ${message}`));
  process.exit(1);
}

const TEMPLATE = `# personal-context config. Edit these values, then run \`personal-context all\`.
name: Your Name
headline: One-line description of what you do
bio: >-
  A short paragraph about your background, focus, and what you are building.

currentRole:
  role: Your Role
  company: Your Company

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

openSource:
  - name: Project
    role: Contributor
    description: What you contribute

sources:
  github:
    username: yourhandle
    pinned: []
  blogs:
    feeds:
      - https://medium.com/feed/@yourhandle
  linkedin:
    exportPath: ./linkedin-export.json
  resume:
    path: ./resume.json
`;

program
  .command("init")
  .description("Create a starter personal.yaml in the current directory")
  .option("-f, --force", "overwrite an existing personal.yaml")
  .action((opts: { force?: boolean }) => {
    const target = resolve(process.cwd(), "personal.yaml");
    if (existsSync(target) && !opts.force) {
      fail("personal.yaml already exists. Use --force to overwrite.");
    }
    writeFileSync(target, TEMPLATE, "utf8");
    console.log(pc.green(`Created ${target}`));
    console.log(pc.dim("Edit it, then run `personal-context all`."));
  });

program
  .command("github")
  .description("Show your GitHub stats and latest contributions")
  .option("--json", "output raw JSON")
  .action(async (opts: { json?: boolean }) => {
    const { config } = loadConfig();
    const username = config.sources?.github?.username;
    if (!username) fail("No sources.github.username set in personal.yaml.");
    const stats = await getGithubStats(username!, {
      token: getGithubToken(),
      pinned: config.sources?.github?.pinned,
    });
    if (opts.json) return console.log(JSON.stringify(stats, null, 2));

    header("GitHub");
    kv("Profile", stats.profileUrl);
    kv("Contributions (last year)", stats.contributionsLastYear);
    kv("PRs Opened", stats.pullRequestsOpened);
    kv("Public Repos", stats.publicRepos);
    kv("Total Stars", stats.totalStars);
    if (stats.topRepos.length) {
      console.log(pc.dim("  Top Repositories:"));
      for (const r of stats.topRepos)
        bullet(`${r.fullName} ${pc.yellow(`★${r.stars}`)}${r.description ? pc.dim(` — ${r.description}`) : ""}`);
    }
    if (!getGithubToken())
      console.log(pc.dim("\n  tip: set GITHUB_TOKEN for contribution + PR counts and higher rate limits."));
  });

program
  .command("blogs")
  .description("Show your recent blog posts across all configured feeds")
  .option("-l, --limit <n>", "number of posts to show", "10")
  .option("--json", "output raw JSON")
  .action(async (opts: { limit: string; json?: boolean }) => {
    const { config } = loadConfig();
    const feeds = config.sources?.blogs?.feeds ?? [];
    if (feeds.length === 0) fail("No sources.blogs.feeds set in personal.yaml.");
    const limit = Number.parseInt(opts.limit, 10) || 10;
    const blogs = await getBlogs(feeds, { limit });
    if (opts.json) return console.log(JSON.stringify(blogs, null, 2));

    header(`Recent Blogs (${blogs.length})`);
    for (const b of blogs) {
      const date = b.date ? pc.dim(` ${b.date.slice(0, 10)}`) : "";
      const meta = [b.source, b.readTime].filter(Boolean).join(" · ");
      console.log(`  ${pc.bold(b.title)}${date}`);
      console.log(`    ${pc.dim(meta)} ${pc.blue(b.link)}`);
    }
  });

program
  .command("linkedin")
  .description("Show your role and experience timeline")
  .option("--json", "output raw JSON")
  .action(async (opts: { json?: boolean }) => {
    const profile = await buildProfile({ offline: true });
    if (opts.json)
      return console.log(
        JSON.stringify({ currentRole: profile.currentRole, experience: profile.experience }, null, 2),
      );

    header("Experience");
    if (profile.currentRole)
      kv("Current", `${profile.currentRole.role} @ ${profile.currentRole.company}`);
    if (profile.contact.linkedin) kv("LinkedIn", profile.contact.linkedin);
    console.log("");
    for (const e of profile.experience) {
      const range = [e.start, e.end].filter(Boolean).join(" – ");
      console.log(`  ${pc.bold(e.role)} ${pc.dim("@")} ${e.company}${range ? pc.dim(` (${range})`) : ""}`);
      for (const h of e.highlights ?? []) bullet(pc.dim(h));
    }
  });

program
  .command("opensource")
  .alias("oss")
  .description("Show your open-source contributions")
  .option("--json", "output raw JSON")
  .action(async (opts: { json?: boolean }) => {
    const profile = await buildProfile({ offline: true });
    if (opts.json) return console.log(JSON.stringify(profile.openSource, null, 2));

    header("Open Source");
    if (profile.openSource.length === 0) return bullet(pc.dim("none configured"));
    for (const o of profile.openSource) {
      console.log(`  ${pc.bold(o.name)}${o.role ? pc.dim(` (${o.role})`) : ""}`);
      if (o.description) console.log(`    ${pc.dim(o.description)}`);
      if (o.url) console.log(`    ${pc.blue(o.url)}`);
    }
  });

function printProfile(p: Profile): void {
  console.log(pc.bold(pc.green(p.name)));
  if (p.headline) console.log(pc.dim(p.headline));
  console.log("");

  if (p.currentRole) {
    header("Current Role");
    console.log(`  ${p.currentRole.role} @ ${p.currentRole.company}`);
    console.log("");
  }

  const c = p.contact;
  if (c.email || c.github || c.linkedin || c.website) {
    header("Contact");
    kv("Email", c.email);
    kv("Website", c.website);
    kv("GitHub", c.github);
    kv("LinkedIn", c.linkedin);
    kv("Twitter", c.twitter);
    console.log("");
  }

  if (p.blogs.length) {
    header("Recent Blogs");
    for (const b of p.blogs.slice(0, 8)) bullet(b.title);
    console.log("");
  }

  if (p.github) {
    header("GitHub");
    kv("Contributions", p.github.contributionsLastYear);
    kv("PRs Opened", p.github.pullRequestsOpened);
    kv("Repositories", p.github.publicRepos);
    if (p.github.topRepos.length) {
      console.log(pc.dim("  Latest Contributions:"));
      for (const r of p.github.topRepos.slice(0, 6)) bullet(r.fullName);
    }
    console.log("");
  }

  if (p.learning.length) {
    header("Learning");
    for (const l of p.learning) bullet(l);
    console.log("");
  }

  if (p.skills.length) {
    header("Skills");
    for (const s of p.skills.slice(0, 12)) bullet(s);
    console.log("");
  }

  if (p.openSource.length) {
    header("Open Source");
    for (const o of p.openSource) bullet(`${o.name}${o.role ? pc.dim(` (${o.role})`) : ""}`);
    console.log("");
  }

  if (p.projects.length) {
    header("Projects");
    for (const proj of p.projects) bullet(proj.name);
    console.log("");
  }
}

program
  .command("all")
  .description("Show your full profile (the single-command overview)")
  .option("--json", "output raw JSON")
  .option("-l, --limit <n>", "number of blogs to include", "8")
  .option("--no-banner", "hide the ASCII banner")
  .action(async (opts: { json?: boolean; limit: string; banner?: boolean }) => {
    const profile = await buildProfile({ blogLimit: Number.parseInt(opts.limit, 10) || 8 });
    if (opts.json) return console.log(renderJson(profile));
    if (opts.banner !== false) console.log(renderBanner(profile.name, profile.headline));
    printProfile(profile);
  });

program
  .command("build")
  .description("Write context.md, profile.json, and llms.txt to an output folder")
  .option("-o, --out <dir>", "output directory", "out")
  .action(async (opts: { out: string }) => {
    const profile = await buildProfile();
    const outDir = resolve(process.cwd(), opts.out);
    if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

    const files: Array<[string, string]> = [
      ["context.md", renderMarkdown(profile)],
      ["profile.json", renderJson(profile)],
      ["llms.txt", renderLlmsTxt(profile)],
    ];
    for (const [name, content] of files) {
      writeFileSync(resolve(outDir, name), content, "utf8");
      console.log(pc.green(`  wrote ${resolve(outDir, name)}`));
    }
  });

program
  .command("summary")
  .description("Print a one-paragraph AI brief about you")
  .action(async () => {
    const profile = await buildProfile();
    console.log(renderSummary(profile));
  });

program
  .command("banner")
  .description("Print the ASCII banner")
  .action(() => {
    try {
      const { config } = loadConfig();
      console.log(renderBanner(config.name, config.headline));
    } catch {
      console.log(renderBanner());
    }
  });

// Bare `personal-context` shows the banner, then the help text.
program.action(() => {
  try {
    const { config } = loadConfig();
    console.log(renderBanner(config.name, config.headline));
  } catch {
    console.log(renderBanner());
  }
  program.outputHelp();
});

program.parseAsync(process.argv).catch((err) => {
  fail(err instanceof Error ? err.message : String(err));
});
