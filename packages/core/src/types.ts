export interface ContactInfo {
  email?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  bluesky?: string;
  topmate?: string;
  location?: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  start?: string;
  end?: string;
  location?: string;
  highlights?: string[];
}

export interface ProjectItem {
  name: string;
  description?: string;
  url?: string;
  tags?: string[];
  status?: string;
}

export interface OpenSourceItem {
  name: string;
  org?: string;
  role?: string;
  description?: string;
  url?: string;
}

export interface Blog {
  title: string;
  link: string;
  date?: string;
  source?: string;
  readTime?: string;
  snippet?: string;
  tags?: string[];
}

export interface GithubRepoSummary {
  name: string;
  fullName: string;
  url: string;
  description?: string;
  stars: number;
  language?: string;
}

export interface GithubStats {
  username: string;
  profileUrl: string;
  contributionsLastYear?: number;
  pullRequestsOpened?: number;
  publicRepos?: number;
  followers?: number;
  totalStars?: number;
  topRepos: GithubRepoSummary[];
  latestContributions: string[];
}

/** Static facts declared by the user in personal.yaml. */
export interface PersonalConfig {
  name: string;
  headline?: string;
  bio?: string;
  currentRole?: ExperienceItem;
  contact?: ContactInfo;
  skills?: string[];
  learning?: string[];
  projects?: ProjectItem[];
  openSource?: OpenSourceItem[];
  experience?: ExperienceItem[];
  sources?: SourcesConfig;
}

export interface SourcesConfig {
  github?: {
    username?: string;
    /** Repos to always surface as "top" even without high stars. */
    pinned?: string[];
  };
  blogs?: {
    /** RSS/Atom feed URLs (Medium, Hashnode, Dev.to, etc.). */
    feeds?: string[];
  };
  linkedin?: {
    /** Path to a manual LinkedIn data export (JSON). */
    exportPath?: string;
  };
  resume?: {
    /** Path to a resume JSON or PDF file. */
    path?: string;
  };
}

/** The unified, fully-resolved profile assembled from every source. */
export interface Profile {
  name: string;
  headline?: string;
  bio?: string;
  generatedAt: string;
  contact: ContactInfo;
  currentRole?: ExperienceItem;
  experience: ExperienceItem[];
  skills: string[];
  learning: string[];
  projects: ProjectItem[];
  openSource: OpenSourceItem[];
  blogs: Blog[];
  github?: GithubStats;
}
