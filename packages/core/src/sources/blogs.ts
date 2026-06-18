import Parser from "rss-parser";
import { cached } from "../cache.js";
import type { Blog } from "../types.js";

const parser = new Parser({
  timeout: 15000,
  headers: { "User-Agent": "personal-context" },
});

function estimateReadTime(text?: string): string | undefined {
  if (!text) return undefined;
  const words = text.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  if (words === 0) return undefined;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min`;
}

function sourceLabel(feedUrl: string): string {
  try {
    const host = new URL(feedUrl).hostname.replace(/^www\./, "");
    if (host.includes("medium")) return "Medium";
    if (host.includes("hashnode")) return "Hashnode";
    if (host.includes("dev.to")) return "Dev.to";
    return host;
  } catch {
    return "Blog";
  }
}

function cleanSnippet(s?: string): string | undefined {
  if (!s) return undefined;
  const text = s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (!text) return undefined;
  return text.length > 220 ? `${text.slice(0, 217)}...` : text;
}

async function fetchFeed(feedUrl: string): Promise<Blog[]> {
  try {
    const feed = await parser.parseURL(feedUrl);
    const source = sourceLabel(feedUrl);
    return (feed.items ?? []).map((item) => {
      const content =
        (item as any)["content:encoded"] ?? item.content ?? item.contentSnippet;
      const tags = (item.categories ?? [])
        .map((c) => (typeof c === "string" ? c : (c as any)?._ ?? ""))
        .filter(Boolean);
      return {
        title: (item.title ?? "Untitled").trim(),
        link: item.link ?? "",
        date: item.isoDate ?? item.pubDate,
        source,
        readTime: estimateReadTime(content),
        snippet: cleanSnippet(item.contentSnippet ?? item.content),
        tags: tags.slice(0, 4),
      } satisfies Blog;
    });
  } catch {
    return [];
  }
}

export async function getBlogs(
  feeds: string[],
  opts: { limit?: number; useCache?: boolean } = {},
): Promise<Blog[]> {
  const { limit, useCache = true } = opts;
  if (!feeds || feeds.length === 0) return [];

  const all = await cached(
    `blogs-${feeds.join(",")}`,
    async () => {
      const results = await Promise.all(feeds.map(fetchFeed));
      const merged = results.flat();
      merged.sort((a, b) => {
        const da = a.date ? Date.parse(a.date) : 0;
        const db = b.date ? Date.parse(b.date) : 0;
        return db - da;
      });
      return merged;
    },
    { enabled: useCache, ttlMs: 1000 * 60 * 30 },
  );

  return typeof limit === "number" ? all.slice(0, limit) : all;
}
