import { loadConfig, resolveSourcePath, getGithubToken } from "./config.js";
import { getGithubStats } from "./sources/github.js";
import { getBlogs } from "./sources/blogs.js";
import { getLinkedinExperience } from "./sources/linkedin.js";
import { getResume, type ResumeData } from "./sources/resume.js";
import type { Profile } from "./types.js";

export interface BuildOptions {
  configPath?: string;
  blogLimit?: number;
  useCache?: boolean;
  /** Skip network sources (GitHub, blogs) for fast offline assembly. */
  offline?: boolean;
}

function dedupe(values: (string | undefined)[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const v of values) {
    if (!v) continue;
    const key = v.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(v);
  }
  return out;
}

/** Assemble the unified Profile from config + every configured source. */
export async function buildProfile(opts: BuildOptions = {}): Promise<Profile> {
  const { config, baseDir } = loadConfig(opts.configPath);
  const sources = config.sources ?? {};
  const offline = opts.offline ?? false;

  const githubUsername = sources.github?.username;
  const feeds = sources.blogs?.feeds ?? [];
  const linkedinPath = resolveSourcePath(baseDir, sources.linkedin?.exportPath);
  const resumePath = resolveSourcePath(baseDir, sources.resume?.path);

  const [github, blogs, resume] = await Promise.all([
    !offline && githubUsername
      ? getGithubStats(githubUsername, {
          token: getGithubToken(),
          pinned: sources.github?.pinned,
          useCache: opts.useCache,
        }).catch(() => undefined)
      : Promise.resolve(undefined),
    !offline && feeds.length > 0
      ? getBlogs(feeds, { limit: opts.blogLimit, useCache: opts.useCache }).catch(() => [])
      : Promise.resolve([]),
    getResume(resumePath).catch((): ResumeData => ({})),
  ]);

  const linkedinExperience = getLinkedinExperience(linkedinPath);

  const experience = [...(config.experience ?? []), ...linkedinExperience];

  const skills = dedupe([...(config.skills ?? []), ...(resume.skills ?? [])]);

  return {
    name: config.name,
    headline: config.headline,
    bio: config.bio ?? resume.summary,
    generatedAt: new Date().toISOString(),
    contact: config.contact ?? {},
    currentRole: config.currentRole ?? experience[0],
    experience,
    skills,
    learning: config.learning ?? [],
    projects: config.projects ?? [],
    openSource: config.openSource ?? [],
    blogs,
    github,
  } satisfies Profile;
}
