import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  buildProfile,
  loadConfig,
  getGithubStats,
  getBlogs,
  getGithubToken,
  renderSummary,
  type Profile,
} from "@personal-context/core";

/**
 * Resolve the personal.yaml path. Honour PERSONAL_CONTEXT_CONFIG so the server
 * can be pointed at a config regardless of the working directory an MCP client
 * launches it from.
 */
const CONFIG_PATH = process.env.PERSONAL_CONTEXT_CONFIG || undefined;

function json(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

function text(value: string) {
  return { content: [{ type: "text" as const, text: value }] };
}

async function profile(): Promise<Profile> {
  return buildProfile({ configPath: CONFIG_PATH });
}

const server = new McpServer({
  name: "personal-context",
  version: "0.1.0",
});

server.registerTool(
  "get_profile",
  {
    title: "Get full profile",
    description:
      "Return the complete personal profile: name, role, contact, skills, learning, projects, open source, recent blogs, and GitHub stats.",
    inputSchema: {},
  },
  async () => json(await profile()),
);

server.registerTool(
  "get_summary",
  {
    title: "Get AI brief",
    description: "Return a one-paragraph natural-language brief about the person.",
    inputSchema: {},
  },
  async () => text(renderSummary(await profile())),
);

server.registerTool(
  "get_recent_blogs",
  {
    title: "Get recent blogs",
    description: "Return recent blog posts aggregated from all configured RSS feeds.",
    inputSchema: {
      limit: z
        .number()
        .int()
        .min(1)
        .max(50)
        .optional()
        .describe("Maximum number of posts to return (default 10)."),
    },
  },
  async ({ limit }) => {
    const { config } = loadConfig(CONFIG_PATH);
    const feeds = config.sources?.blogs?.feeds ?? [];
    const blogs = await getBlogs(feeds, { limit: limit ?? 10 });
    return json(blogs);
  },
);

server.registerTool(
  "get_github_stats",
  {
    title: "Get GitHub stats",
    description:
      "Return GitHub stats: contributions, pull requests, repository count, total stars, and top repositories.",
    inputSchema: {},
  },
  async () => {
    const { config } = loadConfig(CONFIG_PATH);
    const username = config.sources?.github?.username;
    if (!username) {
      return text("No GitHub username configured in personal.yaml (sources.github.username).");
    }
    const stats = await getGithubStats(username, {
      token: getGithubToken(),
      pinned: config.sources?.github?.pinned,
    });
    return json(stats);
  },
);

server.registerTool(
  "get_projects",
  {
    title: "Get projects",
    description: "Return the list of projects the person has built or ships.",
    inputSchema: {},
  },
  async () => json((await profile()).projects),
);

server.registerTool(
  "get_open_source",
  {
    title: "Get open-source contributions",
    description: "Return the person's open-source contributions and roles.",
    inputSchema: {},
  },
  async () => json((await profile()).openSource),
);

server.registerTool(
  "get_contact_info",
  {
    title: "Get contact info",
    description: "Return contact details: email, website, GitHub, LinkedIn, and socials.",
    inputSchema: {},
  },
  async () => {
    const p = await profile();
    return json({ name: p.name, headline: p.headline, contact: p.contact });
  },
);

server.registerTool(
  "get_learning_history",
  {
    title: "Get learning + skills",
    description: "Return what the person is currently learning along with their skills.",
    inputSchema: {},
  },
  async () => {
    const p = await profile();
    return json({ learning: p.learning, skills: p.skills });
  },
);

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // Logs must go to stderr; stdout is reserved for the JSON-RPC stream.
  console.error("personal-context MCP server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error starting personal-context MCP server:", err);
  process.exit(1);
});
