// src/app/api/jira/create/route.ts
import { NextResponse } from "next/server";
import { jiraCreateIssue } from "@/lib/jira";

type CreateBody = {
  summary: string;
  description?: string;
  issueType?: "Task" | "Bug" | "Story";
  priority?: "Highest" | "High" | "Medium" | "Low" | "Lowest";
  labels?: string[];
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateBody;

    if (!body.summary || body.summary.trim().length === 0) {
      return NextResponse.json({ ok: false, error: "Summary is required" }, { status: 400 });
    }

    const projectKey =
      process.env.JIRA_PROJECT_KEY && process.env.JIRA_PROJECT_KEY.trim().length > 0
        ? process.env.JIRA_PROJECT_KEY.trim()
        : "OPEX";

    const issue = await jiraCreateIssue({
      projectKey,
      summary: body.summary,
      description: body.description ?? "",
      issueType: body.issueType ?? "Task",
      priority: body.priority ?? "Medium",
      labels: body.labels ?? [],
    });

    return NextResponse.json({ ok: true, key: issue.key, id: issue.id });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}