type JiraCreateIssueInput = {
  projectKey: string;
  summary: string;
  description: string;
  labels: string[];
};

type JiraIssue = {
  id: string;
  key: string;
  self?: string;
};

export async function createJiraIssue(input: JiraCreateIssueInput): Promise<JiraIssue> {
  // burada Jira API çağrısı yapıyorsanız fetch Yanıtını da tipleyin
  const res = await fetch("https://jira.example.com/rest/api/3/issue", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${process.env.JIRA_API_TOKEN}`,
    },
    body: JSON.stringify({
      fields: {
        project: { key: input.projectKey },
        summary: input.summary,
        description: input.description,
        labels: input.labels,
        issuetype: { name: "Task" },
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Jira create failed: ${res.status} ${text}`);
  }

  const data = (await res.json()) as JiraIssue;
  return data;
}