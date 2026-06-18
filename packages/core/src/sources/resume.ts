import { readFileSync, existsSync } from "node:fs";
import { extname } from "node:path";

export interface ResumeData {
  skills?: string[];
  summary?: string;
  raw?: string;
}

/**
 * Parse a resume from JSON (preferred, e.g. JSON Resume format) or PDF.
 * PDF parsing uses the optional `pdf-parse` dependency, loaded lazily so the
 * package stays lightweight when only JSON resumes are used.
 */
export async function getResume(path?: string): Promise<ResumeData> {
  if (!path || !existsSync(path)) return {};

  const ext = extname(path).toLowerCase();

  if (ext === ".json") {
    try {
      const json = JSON.parse(readFileSync(path, "utf8"));
      const skills: string[] = Array.isArray(json.skills)
        ? json.skills.map((s: any) => (typeof s === "string" ? s : s?.name)).filter(Boolean)
        : [];
      const summary = json.summary ?? json.basics?.summary;
      return { skills, summary };
    } catch {
      return {};
    }
  }

  if (ext === ".pdf") {
    try {
      // Non-literal specifier keeps this an optional runtime dependency so the
      // package builds and runs without `pdf-parse` installed.
      const specifier = "pdf-parse";
      const mod: any = await import(specifier).catch(() => null);
      if (!mod) {
        console.warn(
          "[personal-context] PDF resume detected but 'pdf-parse' is not installed. Run `npm i pdf-parse` to enable PDF parsing, or use a JSON resume.",
        );
        return {};
      }
      const pdfParse = mod.default ?? mod;
      const buffer = readFileSync(path);
      const parsed = await pdfParse(buffer);
      return { raw: parsed.text, summary: parsed.text?.slice(0, 400) };
    } catch {
      return {};
    }
  }

  return {};
}
