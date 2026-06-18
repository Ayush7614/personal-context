import { readFileSync, existsSync } from "node:fs";
import type { ExperienceItem } from "../types.js";

/**
 * Read a manual LinkedIn data export. LinkedIn has no public profile API, so
 * users export their data (Settings -> Get a copy of your data) and point the
 * config at the resulting JSON. We support a simple shape:
 *
 * {
 *   "positions": [
 *     { "title": "...", "company": "...", "startDate": "...", "endDate": "...",
 *       "location": "...", "description": "..." }
 *   ]
 * }
 *
 * ...as well as a bare array of positions.
 */
export function getLinkedinExperience(exportPath?: string): ExperienceItem[] {
  if (!exportPath || !existsSync(exportPath)) return [];

  let data: any;
  try {
    data = JSON.parse(readFileSync(exportPath, "utf8"));
  } catch {
    return [];
  }

  const positions: any[] = Array.isArray(data)
    ? data
    : data.positions ?? data.experience ?? [];

  return positions
    .map((p): ExperienceItem | null => {
      const role = p.title ?? p.role ?? p.position;
      const company = p.company ?? p.companyName ?? p.organization;
      if (!role || !company) return null;
      const highlights =
        typeof p.description === "string"
          ? p.description
              .split(/\n|•|·/)
              .map((s: string) => s.trim())
              .filter(Boolean)
          : Array.isArray(p.highlights)
            ? p.highlights
            : undefined;
      return {
        role,
        company,
        start: p.startDate ?? p.start,
        end: p.endDate ?? p.end,
        location: p.location,
        highlights,
      };
    })
    .filter((x): x is ExperienceItem => x !== null);
}
