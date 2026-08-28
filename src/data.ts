// Caytori — mock data + pure-JS analytics (no LLM, plain statistics)

export type Role =
  | "platform_admin"
  | "company_admin"
  | "it_head"
  | "it_employee"
  | "normal_employee"

export type Status = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED"
export type Priority = "Low" | "Medium" | "High" | "Critical"
export type Category =
  | "Hardware"
  | "Software"
  | "Network"
  | "Account & Access"
  | "Email"
  | "Printer"
  | "Security"
  | "Other"

export const ROLES: { id: Role; label: string; blurb: string }[] = [
  {
    id: "platform_admin",
    label: "Caytori Admin",
    blurb: "Manages Caytori platform & tenant companies",
  },
  {
    id: "company_admin",
    label: "Company Admin",
    blurb: "Runs the company organization & departments",
  },
  {
    id: "it_head",
    label: "IT Help Desk Lead",
    blurb: "Reviews, prioritizes & assigns tickets to IT technicians",
  },
  {
    id: "it_employee",
    label: "IT Technician",
    blurb: "Investigates, communicates & resolves assigned IT issues",
  },
  {
    id: "normal_employee",
    label: "Employee",
    blurb: "Reports IT issues/requests & confirms resolutions",
  },
]

export const CATEGORIES: Category[] = [
  "Hardware",
  "Software",
  "Network",
  "Account & Access",
  "Email",
  "Printer",
  "Security",
  "Other",
]

export const PRIORITIES: Priority[] = ["Low", "Medium", "High", "Critical"]
export const DEPARTMENTS = [
  "Finance",
  "Human Resources",
  "Marketing",
  "Operations",
  "Sales",
  "IT",
]

export type EscalationTier = "L1" | "L2" | "L3" | "LEAD"

export interface ITTierConfig {
  id: EscalationTier
  level: number
  label: string
  title: string
  description: string
  token: string
}

export const IT_HIERARCHY_TIERS: ITTierConfig[] = [
  {
    id: "L1",
    level: 1,
    label: "Tier 1",
    title: "Tier 1 — Help Desk & General Triage",
    description: "First line of support. Basic troubleshooting, account resets, and initial triage.",
    token: "var(--primary)",
  },
  {
    id: "L2",
    level: 2,
    label: "Tier 2",
    title: "Tier 2 — Senior Tech & Infrastructure",
    description: "Advanced troubleshooting, network hardware, server configs, and application diagnostics.",
    token: "var(--accent)",
  },
  {
    id: "L3",
    level: 3,
    label: "Tier 3",
    title: "Tier 3 — Systems Architect & Security Specialist",
    description: "Specialized infrastructure, database anomalies, cyber security, and root-cause engineering.",
    token: "var(--warning)",
  },
  {
    id: "LEAD",
    level: 4,
    label: "IT Lead",
    title: "Tier 4 — IT Help Desk Lead & Management",
    description: "Executive IT decision-making, vendor management, and high-impact incident escalation.",
    token: "var(--danger)",
  },
]

export interface Person {
  id: string
  name: string
  role: Role
  department: string
  email: string
  isHead?: boolean
  tier?: EscalationTier
  specialty?: string
}

export const CURRENT_USER: Record<Role, Person> = {
  platform_admin: {
    id: "u0",
    name: "Alex Reyes",
    role: "platform_admin",
    department: "Caytori",
    email: "alex@caytori.com",
  },
  company_admin: {
    id: "u1",
    name: "Priya Nair",
    role: "company_admin",
    department: "Operations",
    email: "priya@abccorp.com",
    isHead: true,
  },
  it_head: {
    id: "u2",
    name: "John Doe",
    role: "it_head",
    department: "IT",
    email: "john@abccorp.com",
    isHead: true,
    tier: "LEAD",
    specialty: "IT Help Desk Management & Security Lead",
  },
  it_employee: {
    id: "u3",
    name: "Mark Villanueva",
    role: "it_employee",
    department: "IT",
    email: "mark@abccorp.com",
    tier: "L1",
    specialty: "Help Desk Triage & User Support",
  },
  normal_employee: {
    id: "u5",
    name: "Maria Santos",
    role: "normal_employee",
    department: "Finance",
    email: "maria@abccorp.com",
  },
}

export const STAFF: Person[] = [
  {
    id: "u3",
    name: "Mark Villanueva",
    role: "it_employee",
    department: "IT",
    email: "mark@abccorp.com",
    tier: "L1",
    specialty: "Help Desk Triage & T1 Support",
  },
  {
    id: "u4",
    name: "Anna Cruz",
    role: "it_employee",
    department: "IT",
    email: "anna@abccorp.com",
    tier: "L2",
    specialty: "Network & Systems Engineer",
  },
  {
    id: "u6",
    name: "Leo Tan",
    role: "it_employee",
    department: "IT",
    email: "leo@abccorp.com",
    tier: "L3",
    specialty: "Cybersecurity & Database Specialist",
  },
]

export interface WorkflowStep {
  step: number
  title: string
  description: string
  shortLabel: string
}

export const IT_WORKFLOW_STEPS: WorkflowStep[] = [
  {
    step: 1,
    title: "Employee Reports Issue/Request",
    shortLabel: "Reported",
    description: "Employee identifies an IT issue or service request and initiates submission.",
  },
  {
    step: 2,
    title: "Ticket Created & Categorized",
    shortLabel: "Created & Categorized",
    description: "Ticket is logged in Caytori with appropriate category and initial description.",
  },
  {
    step: 3,
    title: "IT Help Desk Reviews & Prioritizes",
    shortLabel: "Help Desk Review",
    description: "IT Help Desk Lead reviews details and assigns appropriate priority level.",
  },
  {
    step: 4,
    title: "Assigned to IT Team / Technician",
    shortLabel: "Technician Assigned",
    description: "Ticket is dispatched to a dedicated IT Technician.",
  },
  {
    step: 5,
    title: "Technician Investigates & Communicates",
    shortLabel: "Investigation & Comm",
    description: "Technician actively troubleshoots and communicates with employee.",
  },
  {
    step: 6,
    title: "Issue Resolved or Escalated",
    shortLabel: "Resolved / Escalated",
    description: "Technician resolves the issue or escalates to senior tech/specialist if needed.",
  },
  {
    step: 7,
    title: "Employee Confirms Resolution",
    shortLabel: "Employee Confirms",
    description: "Employee verifies fix or reopens if problem persists.",
  },
  {
    step: 8,
    title: "Ticket Closed",
    shortLabel: "Closed",
    description: "Ticket lifecycle is completed and locked.",
  },
  {
    step: 9,
    title: "Recorded for Reporting & Analysis",
    shortLabel: "Recorded & Analyzed",
    description: "Ticket data feeds into IT performance metrics and analytics.",
  },
]

export interface Comment {
  id: string
  author: string
  role: Role
  text: string
  at: string
}

export interface Activity {
  id: string
  actor: string
  action: string
  at: string
}

export interface Ticket {
  id: string
  subject: string
  description: string
  reporter: string
  department: string
  category: Category
  priority: Priority
  status: Status
  assignee: string | null
  escalationTier?: EscalationTier
  escalatedBy?: string
  escalationReason?: string
  createdAt: string
  updatedAt: string
  resolutionHours: number | null // null while unresolved
  comments: Comment[]
  activity: Activity[]
}

function mk(
  id: string,
  subject: string,
  description: string,
  reporter: string,
  department: string,
  category: Category,
  priority: Priority,
  status: Status,
  assignee: string | null,
  createdAt: string,
  resolutionHours: number | null,
): Ticket {
  return {
    id,
    subject,
    description,
    reporter,
    department,
    category,
    priority,
    status,
    assignee,
    createdAt,
    updatedAt: createdAt,
    resolutionHours,
    comments: [
      {
        id: id + "c1",
        author: reporter,
        role: "normal_employee",
        text: "This is blocking my work — happy to help troubleshoot.",
        at: createdAt,
      },
      ...(assignee
        ? [
            {
              id: id + "c2",
              author: assignee,
              role: "it_employee" as Role,
              text: "Taking a look now. I'll follow up shortly.",
              at: createdAt,
            },
          ]
        : []),
    ],
    activity: [
      {
        id: id + "a1",
        actor: reporter,
        action: "created the ticket",
        at: createdAt,
      },
      ...(assignee
        ? [
            {
              id: id + "a2",
              actor: "John Doe",
              action: `assigned to ${assignee}`,
              at: createdAt,
            },
          ]
        : []),
      ...(status === "RESOLVED" || status === "CLOSED"
        ? [
            {
              id: id + "a3",
              actor: assignee ?? "System",
              action: "marked as RESOLVED",
              at: createdAt,
            },
          ]
        : []),
      ...(status === "CLOSED"
        ? [
            {
              id: id + "a4",
              actor: reporter,
              action: "confirmed resolution — CLOSED",
              at: createdAt,
            },
          ]
        : []),
    ],
  }
}

export const TICKETS: Ticket[] = [
  mk(
    "CT-000124",
    "Unable to access company network",
    "The computer cannot connect to the company network since 9:00 AM.",
    "Maria Santos",
    "Finance",
    "Network",
    "High",
    "IN_PROGRESS",
    "Mark Villanueva",
    "2026-08-20T09:04:00",
    null,
  ),
  mk(
    "CT-000123",
    "Outlook not sending emails",
    "Emails stay stuck in the outbox all morning.",
    "Maria Santos",
    "Finance",
    "Email",
    "Medium",
    "OPEN",
    null,
    "2026-08-20T08:10:00",
    null,
  ),
  mk(
    "CT-000122",
    "Laptop won't power on",
    "Nothing happens when I press the power button.",
    "Diego Flores",
    "Sales",
    "Hardware",
    "High",
    "OPEN",
    null,
    "2026-08-19T16:40:00",
    null,
  ),
  mk(
    "CT-000121",
    "VPN keeps disconnecting",
    "The VPN drops every few minutes while working remotely.",
    "Grace Lim",
    "Marketing",
    "Network",
    "Medium",
    "IN_PROGRESS",
    "Anna Cruz",
    "2026-08-19T11:20:00",
    null,
  ),
  mk(
    "CT-000120",
    "Suspicious login alert",
    "Received an alert about a login from an unknown device.",
    "Priya Nair",
    "Operations",
    "Security",
    "Critical",
    "IN_PROGRESS",
    "Mark Villanueva",
    "2026-08-19T09:00:00",
    null,
  ),
  mk(
    "CT-000119",
    "Printer on 3rd floor jammed",
    "Paper keeps jamming on the shared printer.",
    "Grace Lim",
    "Marketing",
    "Printer",
    "Low",
    "RESOLVED",
    "Leo Tan",
    "2026-08-18T14:00:00",
    2.5,
  ),
  mk(
    "CT-000118",
    "Cannot reset my password",
    "The reset link says my account is not found.",
    "Diego Flores",
    "Sales",
    "Account & Access",
    "High",
    "CLOSED",
    "Anna Cruz",
    "2026-08-18T10:15:00",
    1.2,
  ),
  mk(
    "CT-000117",
    "Excel crashes on large files",
    "The app freezes and closes when opening the budget file.",
    "Maria Santos",
    "Finance",
    "Software",
    "Medium",
    "CLOSED",
    "Mark Villanueva",
    "2026-08-17T13:30:00",
    4.0,
  ),
  mk(
    "CT-000116",
    "New monitor request",
    "Requesting a second monitor for design work.",
    "Grace Lim",
    "Marketing",
    "Hardware",
    "Low",
    "CLOSED",
    "Leo Tan",
    "2026-08-16T09:45:00",
    6.5,
  ),
  mk(
    "CT-000115",
    "Shared drive access missing",
    "I lost access to the Finance shared folder.",
    "Maria Santos",
    "Finance",
    "Account & Access",
    "Medium",
    "RESOLVED",
    "Anna Cruz",
    "2026-08-16T08:20:00",
    3.1,
  ),
  mk(
    "CT-000114",
    "Wi-Fi slow in Operations",
    "Connection is very slow in the Operations wing.",
    "Priya Nair",
    "Operations",
    "Network",
    "Medium",
    "CLOSED",
    "Mark Villanueva",
    "2026-08-15T15:10:00",
    5.4,
  ),
  mk(
    "CT-000113",
    "Software license expired",
    "The accounting software says the license expired.",
    "Diego Flores",
    "Finance",
    "Software",
    "High",
    "CLOSED",
    "Leo Tan",
    "2026-08-14T10:00:00",
    2.2,
  ),
]

// ---------- Analytics (plain statistics) ----------
export const statusMeta: Record<Status, { label: string; token: string }> = {
  OPEN: { label: "Open", token: "var(--warning)" },
  IN_PROGRESS: { label: "In Progress", token: "var(--primary)" },
  RESOLVED: { label: "Resolved", token: "var(--accent)" },
  CLOSED: { label: "Closed", token: "var(--muted-foreground)" },
}

export const priorityMeta: Record<Priority, { token: string }> = {
  Low: { token: "var(--muted-foreground)" },
  Medium: { token: "var(--primary)" },
  High: { token: "var(--warning)" },
  Critical: { token: "var(--danger)" },
}

export function countBy<T extends string>(items: string[], keys: T[]) {
  const base = Object.fromEntries(keys.map((k) => [k, 0])) as Record<T, number>
  for (const it of items) if (it in base) base[(it as T)]++
  return base
}

export function ticketsFor(role: Role, tickets = TICKETS): Ticket[] {
  const me = CURRENT_USER[role]
  if (role === "platform_admin" || role === "company_admin" || role === "it_head")
    return tickets
  if (role === "it_employee")
    return tickets.filter((t) => t.assignee === me.name)
  // Employee sees only their own submitted tickets
  return tickets.filter((t) => t.reporter === me.name)
}

export function avgResolution(tickets: Ticket[]): number {
  const done = tickets.filter((t) => t.resolutionHours != null)
  if (!done.length) return 0
  return done.reduce((s, t) => s + (t.resolutionHours ?? 0), 0) / done.length
}

export function getWorkflowStep(ticket: Ticket): number {
  if (ticket.status === "CLOSED") return 8 // Step 8 (and recorded in Step 9)
  if (ticket.status === "RESOLVED") return 6 // Step 6 (Heading to Step 7 confirmation)
  if (ticket.status === "IN_PROGRESS") {
    const hasEscalated = ticket.activity.some((a) => a.action.toLowerCase().includes("escalat"))
    if (hasEscalated) return 6
    const hasComments = ticket.comments.some((c) => c.role === "it_employee")
    if (hasComments) return 5
    return 4 // Assigned to technician
  }
  const reviewedByHelpDesk = ticket.activity.some((a) => a.action.toLowerCase().includes("priorit") || a.action.toLowerCase().includes("review"))
  if (reviewedByHelpDesk) return 3
  return 2 // Created & categorized
}

export const FAQS: { q: string; a: string }[] = [
  {
    q: "How do employees join a company?",
    a: "Employees never self-select a company. A Company Admin sends a secure email invitation; the employee sets a password and is automatically linked to the correct company and department.",
  },
  {
    q: "What is the 9-Step IT Ticketing Business Process?",
    a: "1) Employee reports issue → 2) Ticket created & categorized → 3) Help Desk reviews & prioritizes → 4) Assigned to IT Technician → 5) Technician investigates & communicates → 6) Issue resolved or escalated → 7) Employee confirms resolution → 8) Ticket closed → 9) Recorded for IT performance analysis.",
  },
  {
    q: "Is my company's data isolated from others?",
    a: "Yes. Caytori is multi-tenant. Every record carries a company ID, and access control ensures users only ever see data belonging to their own company.",
  },
  {
    q: "Who can see and assign tickets?",
    a: "Employees see only their own tickets. IT Technicians work on tickets assigned to them. IT Help Desk Leads view all company tickets, handle prioritization, and dispatch assignments.",
  },
  {
    q: "What analytics and metrics are available?",
    a: "Caytori provides real-time visibility into ticket volumes, status breakdowns, category distributions, IT technician workload, and resolution times for performance analysis.",
  },
  {
    q: "Can a company run with just one IT person?",
    a: "Absolutely. Caytori doesn't force a fixed IT structure. A company can operate with a single IT technician or scale up to a full IT department with Help Desk leads and specialists.",
  },
]
