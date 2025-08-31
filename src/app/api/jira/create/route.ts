import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { jiraCreateIssue } from "@/lib/jira";

function projectKeyForTeam(team: string) {
  switch (team) {
    case "Reporting":        return process.env.JIRA_PROJECT_REPORTING || "SCRUM";
    case "UAM":              return process.env.JIRA_PROJECT_UAM || "UAM";
    case "Audit and Change": return process.env.JIRA_PROJECT_AUDIT_CHANGE || "AUDIT";
    default:                 return process.env.JIRA_PROJECT_REPORTING || "SCRUM";
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const { summary, description, issueType, priority, assigneeEmail, labels } = await req.json();

    if (!summary || typeof summary !== "string") {
      return NextResponse.json({ error: "summary_required" }, { status: 400 });
    }

    const team = (session.user as any)?.team ?? "Reporting";
    const projectKey = projectKeyForTeam(team);

    const created = await jiraCreateIssue({
      projectKey,
      summary,
      description,
      issueType,
      priorityName: priority,
      assigneeEmail,
      labels,
    });

    return NextResponse.json({ ok: true, ...created });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "unknown" }, { status: 200 });
  }
}
