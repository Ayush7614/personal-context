import { readFileSync, existsSync } from "node:fs";
import { resolve, isAbsolute, dirname } from "node:path";
import { parse as parseYaml } from "yaml";
import type { PersonalConfig } from "./types.js";

const CONFIG_FILENAMES = ["personal.yaml", "personal.yml"];

export interface LoadedConfig {
  config: PersonalConfig;
  /** Directory the config was loaded from, used to resolve relative source paths. */
  baseDir: string;
  path: string;
}

/** Find a personal.yaml by walking up from `startDir` to the filesystem root. */
export function findConfigPath(startDir: string = process.cwd()): string | null {
  let dir = resolve(startDir);
  // eslint-disable-next-line no-constant-condition
  while (true) {
    for (const name of CONFIG_FILENAMES) {
      const candidate = resolve(dir, name);
      if (existsSync(candidate)) return candidate;
    }
    const parent = dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

export function loadConfig(explicitPath?: string): LoadedConfig {
  const path = explicitPath
    ? resolve(explicitPath)
    : findConfigPath();

  if (!path || !existsSync(path)) {
    throw new Error(
      "No personal.yaml found. Run `personal-context init` to create one.",
    );
  }

  const raw = readFileSync(path, "utf8");
  const config = (parseYaml(raw) ?? {}) as PersonalConfig;

  if (!config.name) {
    throw new Error(`Config at ${path} is missing the required "name" field.`);
  }

  return { config, baseDir: dirname(path), path };
}

/** Resolve a possibly-relative source path against the config's directory. */
export function resolveSourcePath(baseDir: string, p?: string): string | undefined {
  if (!p) return undefined;
  return isAbsolute(p) ? p : resolve(baseDir, p);
}

/** Read GITHUB_TOKEN from the environment (optional, raises GitHub rate limits). */
export function getGithubToken(): string | undefined {
  return (
    process.env.GITHUB_TOKEN ||
    process.env.GH_TOKEN ||
    process.env.PERSONAL_CONTEXT_GITHUB_TOKEN ||
    undefined
  );
}
