import { cached } from "../cache.js";
import type { GithubStats, GithubRepoSummary } from "../types.js";

const GRAPHQL_ENDPOINT = "https://api.github.com/graphql";
const REST_BASE = "https://api.github.com";

interface FetchOpts {
  token?: string;
  pinned?: string[];
  useCache?: boolean;
}

const CONTRIB_QUERY = `
query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar { totalContributions }
      totalPullRequestContributions
      pullRequestContributionsByRepository(maxRepositories: 10) {
        repository { nameWithOwner }
        contributions { totalCount }
      }
    }
  }
}`;

function authHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "personal-context",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function fetchContributions(
  username: string,
  token: string,
): Promise<{ total?: number; prs?: number; latest: string[] }> {
  try {
    const res = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { ...authHeaders(token), "Content-Type": "application/json" },
      body: JSON.stringify({ query: CONTRIB_QUERY, variables: { login: username } }),
    });
    if (!res.ok) return { latest: [] };
    const json = (await res.json()) as any;
    const cc = json?.data?.user?.contributionsCollection;
    if (!cc) return { latest: [] };
    const latest: string[] = (cc.pullRequestContributionsByRepository ?? [])
      .map((r: any) => r?.repository?.nameWithOwner)
      .filter(Boolean);
    return {
      total: cc.contributionCalendar?.totalContributions,
      prs: cc.totalPullRequestContributions,
      latest,
    };
  } catch {
    return { latest: [] };
  }
}

async function fetchProfileAndRepos(
  username: string,
  token?: string,
  pinned: string[] = [],
): Promise<{
  publicRepos?: number;
  followers?: number;
  totalStars: number;
  topRepos: GithubRepoSummary[];
}> {
  const headers = authHeaders(token);

  let publicRepos: number | undefined;
  let followers: number | undefined;
  try {
    const userRes = await fetch(`${REST_BASE}/users/${username}`, { headers });
    if (userRes.ok) {
      const u = (await userRes.json()) as any;
      publicRepos = u.public_repos;
      followers = u.followers;
    }
  } catch {
    // ignore
  }

  let repos: any[] = [];
  try {
    const reposRes = await fetch(
      `${REST_BASE}/users/${username}/repos?per_page=100&sort=updated`,
      { headers },
    );
    if (reposRes.ok) repos = (await reposRes.json()) as any[];
  } catch {
    // ignore
  }

  const totalStars = repos.reduce(
    (sum, r) => sum + (r.stargazers_count ?? 0),
    0,
  );

  const toSummary = (r: any): GithubRepoSummary => ({
    name: r.name,
    fullName: r.full_name,
    url: r.html_url,
    description: r.description ?? undefined,
    stars: r.stargazers_count ?? 0,
    language: r.language ?? undefined,
  });

  const pinnedSet = new Set(pinned.map((p) => p.toLowerCase()));
  const pinnedRepos = repos
    .filter((r) => pinnedSet.has(r.name?.toLowerCase()) || pinnedSet.has(r.full_name?.toLowerCase()))
    .map(toSummary);

  const byStars = repos
    .filter((r) => !r.fork)
    .sort((a, b) => (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0))
    .map(toSummary);

  const seen = new Set<string>();
  const topRepos: GithubRepoSummary[] = [];
  for (const r of [...pinnedRepos, ...byStars]) {
    if (seen.has(r.fullName)) continue;
    seen.add(r.fullName);
    topRepos.push(r);
    if (topRepos.length >= 8) break;
  }

  return { publicRepos, followers, totalStars, topRepos };
}

export async function getGithubStats(
  username: string,
  opts: FetchOpts = {},
): Promise<GithubStats> {
  const { token, pinned = [], useCache = true } = opts;

  return cached(
    `github-${username}-${token ? "auth" : "anon"}`,
    async () => {
      const [contrib, profile] = await Promise.all([
        token
          ? fetchContributions(username, token)
          : Promise.resolve({ total: undefined, prs: undefined, latest: [] as string[] }),
        fetchProfileAndRepos(username, token, pinned),
      ]);

      const latestContributions =
        contrib.latest.length > 0
          ? contrib.latest
          : profile.topRepos.map((r) => r.fullName);

      return {
        username,
        profileUrl: `https://github.com/${username}`,
        contributionsLastYear: contrib.total,
        pullRequestsOpened: contrib.prs,
        publicRepos: profile.publicRepos,
        followers: profile.followers,
        totalStars: profile.totalStars,
        topRepos: profile.topRepos,
        latestContributions,
      } satisfies GithubStats;
    },
    { enabled: useCache },
  );
}
