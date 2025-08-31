import { NextResponse } from "next/server";

// Mock summary; gerçek Jira entegrasyonu aşağıdaki notlarda
export async function GET() {
  const payload = {
    openIssues: 41,
    inProgress: 11,
    doneThisWeek: 23,
    myIssues: 6,
    recentActivity: [
      { id: "a1", when: "12 mins ago", text: "Jira: TASK-392 moved to In Progress by Ulas Tascioglu", tag: "Jira" },
      { id: "a2", when: "55 mins ago", text: "Jira: BUG-104 closed by Ulas Tascioglu", tag: "Jira" },
      { id: "a3", when: "2 hours ago", text: "Jira: STORY-210 created (Reporting)", tag: "Jira" },
    ],
  };
  return NextResponse.json(payload);
}
