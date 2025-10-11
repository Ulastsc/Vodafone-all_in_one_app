// src/lib/jira.ts
type JiraCreateIssueInput = {
  projectKey: string;
  summary: string;
  description?: string;
  issueType?: "Task" | "Bug" | "Story";
  priority?: "Highest" | "High" | "Medium" | "Low" | "Lowest";
  labels?: string[];
};

type JiraIssue = {
  id: string;
  key: string;
  self?: string;
};

function baseUrl() {
  const u = process.env.JIRA_BASE_URL;
  if (!u) throw new Error("JIRA_BASE_URL is not set");
  return u.replace(/\/+$/, "");
}

function authHeader() {
  const user = process.env.JIRA_USER_EMAIL;
  const token = process.env.JIRA_API_TOKEN;
  if (!user || !token) throw new Error("JIRA_USER_EMAIL / JIRA_API_TOKEN missing");
  const basic = Buffer.from(`${user}:${token}`).toString("base64");
  return `Basic ${basic}`;
}

/** JIRA Issue create (named export: jiraCreateIssue) */
export async function jiraCreateIssue(input: JiraCreateIssueInput): Promise<JiraIssue> {
  const body = {
    fields: {
      project: { key: input.projectKey },
      summary: input.summary,
      description: input.description ?? "",
      issuetype: { name: input.issueType ?? "Task" },
      priority: input.priority ? { name: input.priority } : undefined,
      labels: input.labels ?? [],
    },
  };

  const res = await fetch(`${baseUrl()}/rest/api/3/issue`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader(),
      Accept: "application/json",
    },
    body: JSON.stringify(body),
    // Next.js App Router: bu çağrılar server-side yapılır
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Jira create failed (${res.status}): ${text}`);
  }

  const data = (await res.json()) as JiraIssue;
  return data;
}