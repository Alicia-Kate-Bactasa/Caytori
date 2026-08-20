// Caytori — mock data + pure-JS analytics (no LLM, plain statistics)

export type Role =
  | "platform_admin"
  | "company_admin"
  | "it_admin"
  | "it_staff"
  | "employee";

export type Status = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type Priority = "Low" | "Medium" | "High" | "Critical";
export type Category =
  | "Hardware"
  | "Software"
  | "Network"
  | "Account & Access"
  | "Email"
  | "Printer"
  | "Security"
  | "Other";

export const ROLES: { id: Role; label: string; blurb: string }[] = [
  { id: "platform_admin", label: "Caytori Admin", blurb: "Manages Caytori & tenant companies" },
  { id: "company_admin", label: "Company Admin", blurb: "Runs the company organization" },
  { id: "it_admin", label: "IT Admin / Manager", blurb: "Directs IT support operations" },
  { id: "it_staff", label: "IT Staff", blurb: "Resolves assigned tickets" },
  { id: "employee", label: "Employee", blurb: "Reports & tracks IT issues" },
];

export const CATEGORIES: Category[] = [
  "Hardware", "Software", "Network", "Account & Access",
  "Email", "Printer", "Security", "Other",
];

export const PRIORITIES: Priority[] = ["Low", "Medium", "High", "Critical"];
export const DEPARTMENTS = ["Finance", "Human Resources", "Marketing", "Operations", "Sales", "IT"];

export interface Person {
  id: string;
  name: string;
  role: Role;
  department: string;
  email: string;
}

export const CURRENT_USER: Record<Role, Person> = {
  platform_admin: { id: "u0", name: "Alex Reyes", role: "platform_admin", department: "Caytori", email: "alex@caytori.com" },
  company_admin: { id: "u1", name: "Priya Nair", role: "company_admin", department: "Operations", email: "priya@abccorp.com" },
  it_admin: { id: "u2", name: "John Doe", role: "it_admin", department: "IT", email: "john@abccorp.com" },
  it_staff: { id: "u3", name: "Mark Villanueva", role: "it_staff", department: "IT", email: "mark@abccorp.com" },
  employee: { id: "u5", name: "Maria Santos", role: "employee", department: "Finance", email: "maria@abccorp.com" },
};

export const STAFF: Person[] = [
  { id: "u3", name: "Mark Villanueva", role: "it_staff", department: "IT", email: "mark@abccorp.com" },
  { id: "u4", name: "Anna Cruz", role: "it_staff", department: "IT", email: "anna@abccorp.com" },
  { id: "u6", name: "Leo Tan", role: "it_staff", department: "IT", email: "leo@abccorp.com" },
];

export interface Comment {
  id: string;
  author: string;
  role: Role;
  text: string;
  at: string;
}

export interface Activity {
  id: string;
  actor: string;
  action: string;
  at: string;
}

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  reporter: string;
  department: string;
  category: Category;
  priority: Priority;
  status: Status;
  assignee: string | null;
  createdAt: string;
  updatedAt: string;
  resolutionHours: number | null; // null while unresolved
  comments: Comment[];
  activity: Activity[];
}

function mk(
  id: string, subject: string, description: string, reporter: string, department: string,
  category: Category, priority: Priority, status: Status, assignee: string | null,
  createdAt: string, resolutionHours: number | null,
): Ticket {
  return {
    id, subject, description, reporter, department, category, priority, status, assignee,
    createdAt, updatedAt: createdAt, resolutionHours,
    comments: [
      { id: id + "c1", author: reporter, role: "employee", text: "This is blocking my work — happy to help troubleshoot.", at: createdAt },
      ...(assignee
        ? [{ id: id + "c2", author: assignee, role: "it_staff" as Role, text: "Taking a look now. I'll follow up shortly.", at: createdAt }]
        : []),
    ],
    activity: [
      { id: id + "a1", actor: reporter, action: "created the ticket", at: createdAt },
      ...(assignee ? [{ id: id + "a2", actor: "John Doe", action: `assigned to ${assignee}`, at: createdAt }] : []),
      ...(status === "RESOLVED" || status === "CLOSED"
        ? [{ id: id + "a3", actor: assignee ?? "System", action: "marked as RESOLVED", at: createdAt }]
        : []),
      ...(status === "CLOSED"
        ? [{ id: id + "a4", actor: reporter, action: "confirmed resolution — CLOSED", at: createdAt }]
        : []),
    ],
  };
}

export const TICKETS: Ticket[] = [
  mk("CT-000124", "Unable to access company network", "The computer cannot connect to the company network since 9:00 AM.", "Maria Santos", "Finance", "Network", "High", "IN_PROGRESS", "Mark Villanueva", "2026-08-20T09:04:00", null),
  mk("CT-000123", "Outlook not sending emails", "Emails stay stuck in the outbox all morning.", "Maria Santos", "Finance", "Email", "Medium", "OPEN", null, "2026-08-20T08:10:00", null),
  mk("CT-000122", "Laptop won't power on", "Nothing happens when I press the power button.", "Diego Flores", "Sales", "Hardware", "High", "OPEN", null, "2026-08-19T16:40:00", null),
  mk("CT-000121", "VPN keeps disconnecting", "The VPN drops every few minutes while working remotely.", "Grace Lim", "Marketing", "Network", "Medium", "IN_PROGRESS", "Anna Cruz", "2026-08-19T11:20:00", null),
  mk("CT-000120", "Suspicious login alert", "Received an alert about a login from an unknown device.", "Priya Nair", "Operations", "Security", "Critical", "IN_PROGRESS", "Mark Villanueva", "2026-08-19T09:00:00", null),
  mk("CT-000119", "Printer on 3rd floor jammed", "Paper keeps jamming on the shared printer.", "Grace Lim", "Marketing", "Printer", "Low", "RESOLVED", "Leo Tan", "2026-08-18T14:00:00", 2.5),
  mk("CT-000118", "Cannot reset my password", "The reset link says my account is not found.", "Diego Flores", "Sales", "Account & Access", "High", "CLOSED", "Anna Cruz", "2026-08-18T10:15:00", 1.2),
  mk("CT-000117", "Excel crashes on large files", "The app freezes and closes when opening the budget file.", "Maria Santos", "Finance", "Software", "Medium", "CLOSED", "Mark Villanueva", "2026-08-17T13:30:00", 4.0),
  mk("CT-000116", "New monitor request", "Requesting a second monitor for design work.", "Grace Lim", "Marketing", "Hardware", "Low", "CLOSED", "Leo Tan", "2026-08-16T09:45:00", 6.5),
  mk("CT-000115", "Shared drive access missing", "I lost access to the Finance shared folder.", "Maria Santos", "Finance", "Account & Access", "Medium", "RESOLVED", "Anna Cruz", "2026-08-16T08:20:00", 3.1),
  mk("CT-000114", "Wi-Fi slow in Operations", "Connection is very slow in the Operations wing.", "Priya Nair", "Operations", "Network", "Medium", "CLOSED", "Mark Villanueva", "2026-08-15T15:10:00", 5.4),
  mk("CT-000113", "Software license expired", "The accounting software says the license expired.", "Diego Flores", "Finance", "Software", "High", "CLOSED", "Leo Tan", "2026-08-14T10:00:00", 2.2),
];

// ---------- Analytics (plain statistics) ----------
export const statusMeta: Record<Status, { label: string; token: string }> = {
  OPEN: { label: "Open", token: "var(--warning)" },
  IN_PROGRESS: { label: "In Progress", token: "var(--primary)" },
  RESOLVED: { label: "Resolved", token: "var(--accent)" },
  CLOSED: { label: "Closed", token: "var(--muted-foreground)" },
};

export const priorityMeta: Record<Priority, { token: string }> = {
  Low: { token: "var(--muted-foreground)" },
  Medium: { token: "var(--primary)" },
  High: { token: "var(--warning)" },
  Critical: { token: "var(--danger)" },
};

export function countBy<T extends string>(items: string[], keys: T[]) {
  const base = Object.fromEntries(keys.map((k) => [k, 0])) as Record<T, number>;
  for (const it of items) if (it in base) base[it as T]++;
  return base;
}

export function ticketsFor(role: Role, tickets = TICKETS): Ticket[] {
  const me = CURRENT_USER[role];
  if (role === "employee") return tickets.filter((t) => t.reporter === me.name);
  if (role === "it_staff") return tickets.filter((t) => t.assignee === me.name);
  return tickets; // admins see all company tickets
}

export function avgResolution(tickets: Ticket[]): number {
  const done = tickets.filter((t) => t.resolutionHours != null);
  if (!done.length) return 0;
  return done.reduce((s, t) => s + (t.resolutionHours ?? 0), 0) / done.length;
}

export const FAQS: { q: string; a: string }[] = [
  { q: "How do employees join a company?", a: "Employees never self-select a company. A Company Admin sends a secure email invitation; the employee sets a password and is automatically linked to the correct company and department." },
  { q: "What does the ticket lifecycle look like?", a: "Every ticket flows through four clear stages: Open → In Progress → Resolved → Closed. IT Staff mark a ticket Resolved, and the employee confirms the fix to Close it. If it isn't fixed, it returns to In Progress." },
  { q: "Is my company's data isolated from others?", a: "Yes. Caytori is multi-tenant. Every record carries a company ID, and access control ensures users only ever see data belonging to their own company." },
  { q: "Who can see and assign tickets?", a: "Employees see only their own tickets. IT Staff work on tickets assigned to them. IT Admins view all company tickets and handle assignment and reassignment." },
  { q: "Does the analytics dashboard use AI?", a: "No. All dashboards are built on simple, transparent statistics — counts, distributions, and averages over your real ticket data. No black-box models are involved." },
  { q: "Can a company run with just one IT person?", a: "Absolutely. Caytori doesn't force a fixed IT structure. A company can operate with a single IT Staff member or scale up to a full IT department." },
];
