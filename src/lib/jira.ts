// --- EK: email -> accountId çöz (Atlassian Cloud)
export async function jiraAccountIdByEmail(email: string): Promise<string | null> {
  const base = process.env.JIRA_BASE_URL!;
  const headers = authHeader();
  const url = new URL(`${base}/rest/api/3/user/search`);
  url.searchParams.set("query", email);
  url.searchParams.set("maxResults", "1");
  const res = await fetch(url.toString(), { headers, cache: "no-store" });
  if (!res.ok) return null;
  const arr = (await res.json()) as any[];
  return arr?.[0]?.accountId ?? null;
}

// --- EK: issue create
export async function jiraCreateIssue(opts: {
  projectKey: string;
  summary: string;
  description?: string;
  issueType?: string;   // "Task", "Bug", "Story"...
  priorityName?: string; // "Highest", "High", "Medium", "Low", "Lowest"
  assigneeEmail?: string;
  labels?: string[];
}) {
  const base = process.env.JIRA_BASE_URL!;
  const headers = { ...authHeader(), "Content-Type": "application/json" };

  // Atlassian Cloud: assignee için accountId gerekli
  let assignee: any = undefined;
  if (opts.assigneeEmail) {
    const id = await jiraAccountIdByEmail(opts.assigneeEmail);
    if (id) assignee = { accountId: id };
  }

  // Jira Cloud rich-text: basit plain text doc
  const descDoc =
    opts.description
      ? {
          type: "doc",
          version: 1,
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: opts.description }],
            },
          ],
        }
      : undefined;

  const payload: any = {
    fields: {
      project: { key: opts.projectKey },
      summary: opts.summary,
      issuetype: { name: opts.issueType ?? "Task" },
      ...(descDoc ? { description: descDoc } : {}),
      ...(opts.priorityName ? { priority: { name: opts.priorityName } } : {}),
      ...(assignee ? { assignee } : {}),
      ...(opts.labels?.length ? { labels: opts.labels } : {}),
    },
  };

  const res = await fetch(`${base}/rest/api/3/issue`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Jira create failed ${res.status}: ${txt}`);
  }
  return res.json(); // { id, key, self }
}
