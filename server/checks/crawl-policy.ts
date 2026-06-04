import type { FetchUrlResult } from "../services/fetch-url";
import type { DiagnosisFinding, FindingSeverity, FindingStatus } from "../types";

type RobotsRule = {
  userAgents: string[];
  directive: "allow" | "disallow";
  path: string;
};

type RobotsPolicy = {
  rules: RobotsRule[];
  sitemapUrls: string[];
};

type RobotsDecision = {
  allowed: boolean;
  matchedRule: Pick<RobotsRule, "directive" | "path"> | null;
};

export function buildCrawlPolicyFindings(targetUrl: string, robots: FetchUrlResult): DiagnosisFinding[] {
  const exists = robots.statusCode >= 200 && robots.statusCode < 400;

  if (!exists) {
    return [
      finding(
        "crawl.robots_exists",
        targetUrl,
        "FAIL",
        "critical",
        { robotsUrl: robots.targetUrl, statusCode: robots.statusCode },
        "Serve a fetchable robots.txt file from the site origin."
      ),
      finding(
        "crawl.robots_googlebot_allowed",
        targetUrl,
        "UNAVAILABLE",
        "critical",
        { robotsUrl: robots.targetUrl, statusCode: robots.statusCode },
        "Make robots.txt fetchable before evaluating Googlebot access.",
        "robots.txt was not fetchable, so Googlebot policy could not be evaluated."
      ),
      finding(
        "crawl.robots_sitemap_declared",
        targetUrl,
        "UNAVAILABLE",
        "medium",
        { robotsUrl: robots.targetUrl, statusCode: robots.statusCode },
        "Make robots.txt fetchable before checking sitemap declarations.",
        "robots.txt was not fetchable, so sitemap declarations could not be evaluated."
      )
    ];
  }

  const policy = parseRobotsTxt(robots.bodyText);
  const decision = decideGooglebotAccess(targetUrl, policy);

  return [
    finding(
      "crawl.robots_exists",
      targetUrl,
      "PASS",
      "critical",
      { robotsUrl: robots.finalUrl, statusCode: robots.statusCode },
      "No action required."
    ),
    finding(
      "crawl.robots_googlebot_allowed",
      targetUrl,
      decision.allowed ? "PASS" : "FAIL",
      "critical",
      {
        googlebotAllowed: decision.allowed,
        matchedRule: decision.matchedRule
      },
      decision.allowed ? "No action required." : "Remove or narrow the robots.txt rule blocking Googlebot."
    ),
    finding(
      "crawl.robots_sitemap_declared",
      targetUrl,
      policy.sitemapUrls.length > 0 ? "PASS" : "WARN",
      "medium",
      { sitemapUrls: policy.sitemapUrls },
      policy.sitemapUrls.length > 0
        ? "No action required."
        : "Declare the canonical XML sitemap in robots.txt with a Sitemap directive."
    )
  ];
}

export function robotsUrlForTarget(targetUrl: string) {
  const url = new URL(targetUrl);
  return `${url.origin}/robots.txt`;
}

export function buildUnavailableCrawlPolicyFindings(targetUrl: string, robotsUrl: string, reason: string): DiagnosisFinding[] {
  return [
    finding(
      "crawl.robots_exists",
      targetUrl,
      "UNAVAILABLE",
      "critical",
      { robotsUrl, reason },
      "Retry robots.txt fetch and confirm the file is reachable.",
      "robots.txt could not be fetched during this diagnosis run."
    ),
    finding(
      "crawl.robots_googlebot_allowed",
      targetUrl,
      "UNAVAILABLE",
      "critical",
      { robotsUrl, reason },
      "Make robots.txt fetchable before evaluating Googlebot access.",
      "robots.txt could not be fetched, so Googlebot policy could not be evaluated."
    ),
    finding(
      "crawl.robots_sitemap_declared",
      targetUrl,
      "UNAVAILABLE",
      "medium",
      { robotsUrl, reason },
      "Make robots.txt fetchable before checking sitemap declarations.",
      "robots.txt could not be fetched, so sitemap declarations could not be evaluated."
    )
  ];
}

function finding(
  checkId: string,
  target: string,
  status: FindingStatus,
  severity: FindingSeverity,
  evidence: Record<string, unknown>,
  recommendation: string,
  limitation: string | null = null
): DiagnosisFinding {
  return {
    checkId,
    category: "crawl",
    source: "local-crawler",
    status,
    severity,
    target,
    evidence,
    recommendation,
    limitation
  };
}

function parseRobotsTxt(bodyText: string): RobotsPolicy {
  const rules: RobotsRule[] = [];
  const sitemapUrls: string[] = [];
  let currentAgents: string[] = [];

  for (const rawLine of bodyText.split(/\r?\n/)) {
    const line = rawLine.split("#", 1)[0].trim();

    if (!line) {
      currentAgents = [];
      continue;
    }

    const separatorIndex = line.indexOf(":");

    if (separatorIndex === -1) {
      continue;
    }

    const field = line.slice(0, separatorIndex).trim().toLowerCase();
    const value = line.slice(separatorIndex + 1).trim();

    if (field === "user-agent") {
      currentAgents.push(value.toLowerCase());
      continue;
    }

    if (field === "sitemap" && value) {
      sitemapUrls.push(value);
      continue;
    }

    if ((field === "allow" || field === "disallow") && currentAgents.length > 0) {
      rules.push({
        userAgents: [...currentAgents],
        directive: field,
        path: value
      });
    }
  }

  return { rules, sitemapUrls };
}

function decideGooglebotAccess(targetUrl: string, policy: RobotsPolicy): RobotsDecision {
  const targetPath = pathForRobots(new URL(targetUrl));
  const candidateRules = mostSpecificAgentRules(policy.rules);
  const matchingRules = candidateRules.filter((rule) => rule.path && targetPath.startsWith(rule.path));

  if (matchingRules.length === 0) {
    return { allowed: true, matchedRule: null };
  }

  matchingRules.sort((a, b) => b.path.length - a.path.length);
  const winner = matchingRules[0];

  return {
    allowed: winner.directive === "allow",
    matchedRule: {
      directive: winner.directive,
      path: winner.path
    }
  };
}

function mostSpecificAgentRules(rules: RobotsRule[]) {
  const googlebotRules = rules.filter((rule) => rule.userAgents.includes("googlebot"));

  if (googlebotRules.length > 0) {
    return googlebotRules;
  }

  return rules.filter((rule) => rule.userAgents.includes("*"));
}

function pathForRobots(url: URL) {
  return `${url.pathname}${url.search}`;
}
