import pc from "picocolors";
import gradient from "gradient-string";
import { renderBanner } from "./banner.js";

const ember = gradient(["#ff8c5a", "#ff6b35", "#c44d22"]);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const SPINNER = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const BUILD_STEPS = [
  "spinning up the context engine",
  "wiring MCP tools",
  "polishing the experience",
  "charging the ember core",
];

function clearLine(): void {
  process.stdout.write("\r\x1b[2K");
}

async function progressBar(durationMs = 2400, width = 32): Promise<void> {
  const steps = 48;
  for (let i = 0; i <= steps; i++) {
    const ratio = i / steps;
    const filled = Math.round(ratio * width);
    const bar = ember("█".repeat(filled)) + pc.dim("░".repeat(width - filled));
    const pct = String(Math.round(ratio * 100)).padStart(3, " ");
    clearLine();
    process.stdout.write(`  ${bar} ${pc.bold(ember(`${pct}%`))}`);
    await sleep(durationMs / steps);
  }
  process.stdout.write("\n");
}

async function spinSteps(): Promise<void> {
  for (const step of BUILD_STEPS) {
    const frames = 14;
    for (let f = 0; f < frames; f++) {
      const s = SPINNER[f % SPINNER.length] ?? "⠋";
      clearLine();
      process.stdout.write(`  ${ember(s)} ${pc.dim(step)}${pc.dim("…")}`);
      await sleep(55);
    }
    clearLine();
    process.stdout.write(`  ${pc.green("✓")} ${pc.dim(step)}\n`);
  }
}

async function pulse(text: string, times = 4): Promise<void> {
  for (let i = 0; i < times; i++) {
    clearLine();
    process.stdout.write(`  ${i % 2 === 0 ? ember(text) : pc.dim(text)}`);
    await sleep(280);
  }
  clearLine();
  process.stdout.write(`  ${ember(text)}\n`);
}

/** Animated "work in progress" teaser — no stats, just hype. */
export async function runTeaser(name?: string, headline?: string): Promise<void> {
  console.clear();
  console.log(renderBanner(name, headline));
  console.log(`  ${pc.bold(ember("🚧  W O R K   I N   P R O G R E S S  🚧"))}\n`);
  await sleep(350);
  await spinSteps();
  console.log("");
  await progressBar();
  console.log("");
  await pulse("✦  something crazy on the way  ✦", 5);
  console.log(
    `\n  ${pc.dim("star the repo →")} ${pc.underline("https://github.com/Ayush7614/personal-context")}\n`,
  );
}
