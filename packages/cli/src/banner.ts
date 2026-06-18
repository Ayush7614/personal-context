import figlet from "figlet";
import gradient from "gradient-string";
import boxen from "boxen";

// Ember palette to match the personal-context / ayushbuilds.dev aesthetic.
const ember = gradient(["#ff8c5a", "#ff6b35", "#c44d22"]);

/**
 * Render a branded ASCII banner. For a *personal* context tool the brand is the
 * person's own name (from personal.yaml), so everyone gets their own logo.
 */
export function renderBanner(name?: string, subtitle?: string): string {
  const brand = (name?.trim().split(/\s+/)[0] || "context").toUpperCase();

  let art: string;
  try {
    art = figlet.textSync(brand, { font: "ANSI Shadow" });
  } catch {
    art = brand;
  }

  const coloredArt = ember.multiline(art.replace(/\s+$/g, ""));
  const tagline = subtitle?.trim() || "your AI-readable profile";
  const content = `${coloredArt}\n\n${ember("personal-context")}  ${tagline}`;

  return boxen(content, {
    padding: { top: 1, bottom: 1, left: 3, right: 3 },
    margin: { top: 1, bottom: 1, left: 0, right: 0 },
    borderStyle: "round",
    borderColor: "#ff6b35",
    textAlignment: "center",
  });
}
