import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { tmpdir } from "node:os";

interface CacheEntry<T> {
  expiresAt: number;
  value: T;
}

const DEFAULT_TTL_MS = 1000 * 60 * 60; // 1 hour

function cacheDir(): string {
  const dir = resolve(tmpdir(), "personal-context-cache");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  return dir;
}

function cacheFile(key: string): string {
  const safe = key.replace(/[^a-z0-9_-]/gi, "_");
  return resolve(cacheDir(), `${safe}.json`);
}

/**
 * Return cached value for `key` if present and unexpired, otherwise run
 * `producer`, cache its result, and return it. Cache failures are non-fatal.
 */
export async function cached<T>(
  key: string,
  producer: () => Promise<T>,
  opts: { ttlMs?: number; enabled?: boolean } = {},
): Promise<T> {
  const enabled = opts.enabled ?? true;
  const ttlMs = opts.ttlMs ?? DEFAULT_TTL_MS;

  if (enabled) {
    try {
      const file = cacheFile(key);
      if (existsSync(file)) {
        const entry = JSON.parse(readFileSync(file, "utf8")) as CacheEntry<T>;
        if (entry.expiresAt > Date.now()) return entry.value;
      }
    } catch {
      // ignore corrupt cache
    }
  }

  const value = await producer();

  if (enabled) {
    try {
      const entry: CacheEntry<T> = { expiresAt: Date.now() + ttlMs, value };
      writeFileSync(cacheFile(key), JSON.stringify(entry), "utf8");
    } catch {
      // ignore write failures
    }
  }

  return value;
}
