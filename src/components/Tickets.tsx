import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search, Plus, ArrowLeft, Send, X, CheckCircle2, RotateCcw,
  PlayCircle, UserCheck, Clock,
} from "lucide-react";
import { Button, Card, Avatar, StatusBadge, PriorityBadge } from "./primitives";
import {
  CATEGORIES, PRIORITIES, DEPARTMENTS, STAFF, CURRENT_USER,
  type Ticket, type Role, type Status, type Priority, type Category,
} from "../data";

const STATUS_FILTERS: (Status | "ALL")[] = ["ALL", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];
const now = () => new Date().toISOString();
const fmt = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

export default function Tickets({
  tickets, role, title, onChange,
}: {
  tickets: Ticket[];
  role: Role;
  title: string;
  onChange: (t: Ticket[]) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Status | "ALL">("ALL");
  const [creating, setCreating] = useState(false);

  const filtered = useMemo(
    () =>
      tickets.filter((t) => {
        const q = query.toLowerCase();
        const matchesQ = !q || t.subject.toLowerCase().includes(q) || t.id.toLowerCase().includes(q);
        const matchesS = status === "ALL" || t.status === status;
        return matchesQ && matchesS;
      }),
    [tickets, query, status],
  );

  const active = tickets.find((t) => t.id === selected) ?? null;
  const me = CURRENT_USER[role];

  function update(id: string, patch: Partial<Ticket>, activity?: string, actor = me.name) {
    onChange(
      tickets.map((t) =>
        t.id === id
          ? {
              ...t, ...patch, updatedAt: now(),
              activity: activity ? [...t.activity, { id: crypto.randomUUID(), actor, action: activity, at: now() }] : t.activity,
            }
          : t,
      ),
    );
  }

  function addComment(id: string, text: string) {
    onChange(
      tickets.map((t) =>
        t.id === id
          ? { ...t, updatedAt: now(), comments: [...t.comments, { id: crypto.randomUUID(), author: me.name, role, text, at: now() }] }
          : t,
      ),
    );
  }

  if (active) {
    return (
      <TicketDetail
        ticket={active} role={role}
        onBack={() => setSelected(null)}
        onUpdate={update} onComment={addComment}
      />
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-700 tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{filtered.length} of {tickets.length} tickets</p>
        </div>
        {role === "employee" && (
          <Button onClick={() => setCreating(true)}><Plus size={16} /> New ticket</Button>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="neu-inset flex flex-1 items-center gap-2.5 rounded-full px-4 py-2.5 min-w-[220px]">
          <Search size={16} className="text-muted-foreground" />
          <input
            value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search subject or ticket ID…"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s} onClick={() => setStatus(s)}
              className={`rounded-full px-3.5 py-2 text-xs font-500 transition-all duration-300 ${status === s ? "neu-inset text-primary" : "neu-sm neu-press text-muted-foreground"}`}
            >
              {s === "ALL" ? "All" : s.replace("_", " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {filtered.length === 0 && (
          <Card className="p-12 text-center text-sm text-muted-foreground">No tickets match your filters.</Card>
        )}
        {filtered.map((t, i) => (
          <motion.button
            key={t.id}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.03 }}
            onClick={() => setSelected(t.id)}
            className="block w-full text-left"
          >
            <Card className="neu-hover flex flex-wrap items-center gap-x-6 gap-y-3 p-5">
              <span className="font-mono text-sm font-600 text-primary">{t.id}</span>
              <div className="min-w-[180px] flex-1">
                <div className="font-display font-600">{t.subject}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {t.reporter} · {t.department} · {t.category}
                </div>
              </div>
              <PriorityBadge priority={t.priority} />
              <StatusBadge status={t.status} />
              <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
                <Clock size={13} /> {fmt(t.createdAt)}
              </div>
            </Card>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {creating && (
          <CreateTicket
            reporter={me.name} department={me.department}
            onClose={() => setCreating(false)}
            onCreate={(t) => { onChange([t, ...tickets]); setCreating(false); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function TicketDetail({
  ticket, role, onBack, onUpdate, onComment,
}: {
  ticket: Ticket;
  role: Role;
  onBack: () => void;
  onUpdate: (id: string, patch: Partial<Ticket>, activity?: string, actor?: string) => void;
  onComment: (id: string, text: string) => void;
}) {
  const [draft, setDraft] = useState("");
  const [assignee, setAssignee] = useState(ticket.assignee ?? STAFF[0].name);

  const actions: React.ReactNode[] = [];
  if (role === "it_admin" && ticket.status === "OPEN") {
    actions.push(
      <div key="assign" className="flex items-center gap-2">
        <select
          value={assignee} onChange={(e) => setAssignee(e.target.value)}
          className="neu-inset rounded-full bg-transparent px-3.5 py-2 text-sm outline-none"
        >
          {STAFF.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
        </select>
        <Button size="sm" onClick={() => onUpdate(ticket.id, { assignee, status: "IN_PROGRESS" }, `assigned to ${assignee}`)}>
          <UserCheck size={15} /> Assign
        </Button>
      </div>,
    );
  }
  if (role === "it_admin" && ticket.status !== "OPEN" && ticket.status !== "CLOSED") {
    actions.push(
      <div key="reassign" className="flex items-center gap-2">
        <select
          value={assignee} onChange={(e) => setAssignee(e.target.value)}
          className="neu-inset rounded-full bg-transparent px-3.5 py-2 text-sm outline-none"
        >
          {STAFF.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
        </select>
        <Button size="sm" variant="surface" onClick={() => onUpdate(ticket.id, { assignee }, `reassigned to ${assignee}`)}>
          Reassign
        </Button>
      </div>,
    );
  }
  if (role === "it_staff" && ticket.status === "IN_PROGRESS") {
    actions.push(
      <Button key="resolve" size="sm" onClick={() => onUpdate(ticket.id, { status: "RESOLVED", resolutionHours: 2.0 }, "marked as RESOLVED")}>
        <CheckCircle2 size={15} /> Mark resolved
      </Button>,
    );
  }
  if (role === "it_staff" && ticket.status === "OPEN") {
    actions.push(
      <Button key="start" size="sm" onClick={() => onUpdate(ticket.id, { status: "IN_PROGRESS", assignee: CURRENT_USER.it_staff.name }, "started work")}>
        <PlayCircle size={15} /> Start work
      </Button>,
    );
  }
  if (role === "employee" && ticket.status === "RESOLVED") {
    actions.push(
      <Button key="confirm" size="sm" onClick={() => onUpdate(ticket.id, { status: "CLOSED" }, "confirmed resolution — CLOSED")}>
        <CheckCircle2 size={15} /> Confirm fix
      </Button>,
      <Button key="reopen" size="sm" variant="surface" onClick={() => onUpdate(ticket.id, { status: "IN_PROGRESS" }, "reopened — not fixed")}>
        <RotateCcw size={15} /> Not fixed
      </Button>,
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft size={16} /> Back to tickets
      </button>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="font-mono text-sm font-600 text-primary">{ticket.id}</span>
              <div className="flex items-center gap-2"><PriorityBadge priority={ticket.priority} /><StatusBadge status={ticket.status} /></div>
            </div>
            <h1 className="mt-3 font-display text-xl font-700">{ticket.subject}</h1>
            <p className="mt-3 leading-relaxed text-muted-foreground">{ticket.description}</p>
            {actions.length > 0 && (
              <div className="mt-5 flex flex-wrap items-center gap-2.5 border-t pt-5" style={{ borderColor: "var(--border)" }}>
                {actions}
              </div>
            )}
          </Card>

          {/* Comments */}
          <Card className="p-6">
            <h3 className="font-display text-base font-600">Conversation</h3>
            <div className="mt-4 space-y-4">
              {ticket.comments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <Avatar name={c.author} size={34} />
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-600">{c.author}</span>
                      <span className="text-xs text-muted-foreground">{fmt(c.at)}</span>
                    </div>
                    <div className="neu-inset mt-1.5 rounded-2xl px-4 py-2.5 text-sm leading-relaxed">{c.text}</div>
                  </div>
                </div>
              ))}
            </div>
            {ticket.status !== "CLOSED" && (
              <form
                className="mt-5 flex items-center gap-2"
                onSubmit={(e) => { e.preventDefault(); if (draft.trim()) { onComment(ticket.id, draft.trim()); setDraft(""); } }}
              >
                <div className="neu-inset flex flex-1 items-center gap-2.5 rounded-full px-4 py-2.5">
                  <input
                    value={draft} onChange={(e) => setDraft(e.target.value)}
                    placeholder="Write a comment…" className="w-full bg-transparent text-sm outline-none"
                  />
                </div>
                <Button type="submit" size="sm"><Send size={15} /></Button>
              </form>
            )}
          </Card>
        </div>

        {/* Meta + activity */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-display text-base font-600">Details</h3>
            <dl className="mt-4 space-y-3 text-sm">
              {[
                ["Reporter", ticket.reporter],
                ["Department", ticket.department],
                ["Category", ticket.category],
                ["Assignee", ticket.assignee ?? "Unassigned"],
                ["Created", fmt(ticket.createdAt)],
                ["Updated", fmt(ticket.updatedAt)],
                ["Resolution", ticket.resolutionHours != null ? `${ticket.resolutionHours} hrs` : "—"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="text-right font-500">{v}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card className="p-6">
            <h3 className="font-display text-base font-600">Activity</h3>
            <ol className="mt-4 space-y-4">
              {ticket.activity.map((a) => (
                <li key={a.id} className="relative flex gap-3 pl-1">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: "var(--primary)" }} />
                  <div className="text-sm">
                    <span className="font-500">{a.actor}</span>{" "}
                    <span className="text-muted-foreground">{a.action}</span>
                    <div className="text-xs text-muted-foreground">{fmt(a.at)}</div>
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

function CreateTicket({
  reporter, department, onClose, onCreate,
}: {
  reporter: string;
  department: string;
  onClose: () => void;
  onCreate: (t: Ticket) => void;
}) {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("Hardware");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [dept, setDept] = useState(department);
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (subject.trim().length < 5) return setError("Please add a clear subject (at least 5 characters).");
    if (description.trim().length < 10) return setError("Please describe the issue in a little more detail.");
    const id = "CT-" + String(Math.floor(100000 + Math.random() * 899999)).padStart(6, "0");
    onCreate({
      id, subject: subject.trim(), description: description.trim(), reporter, department: dept,
      category, priority, status: "OPEN", assignee: null,
      createdAt: now(), updatedAt: now(), resolutionHours: null,
      comments: [], activity: [{ id: crypto.randomUUID(), actor: reporter, action: "created the ticket", at: now() }],
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 grid place-items-center p-4"
      style={{ background: "color-mix(in srgb, var(--foreground) 35%, transparent)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg"
      >
        <Card className="p-7">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-700">Report an IT issue</h2>
            <button onClick={onClose} className="neu-sm neu-press grid h-9 w-9 place-items-center rounded-full text-muted-foreground"><X size={16} /></button>
          </div>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <Field label="Subject">
              <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Unable to access company network" className="w-full bg-transparent text-sm outline-none" />
            </Field>
            <Field label="Description">
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Describe what's happening and since when…" className="w-full resize-none bg-transparent text-sm outline-none" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Department">
                <select value={dept} onChange={(e) => setDept(e.target.value)} className="w-full bg-transparent text-sm outline-none">
                  {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </Field>
              <Field label="Category">
                <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className="w-full bg-transparent text-sm outline-none">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Priority">
              <div className="flex gap-1.5">
                {PRIORITIES.map((p) => (
                  <button
                    type="button" key={p} onClick={() => setPriority(p)}
                    className={`flex-1 rounded-lg py-1.5 text-xs font-500 transition-all ${priority === p ? "neu-inset text-primary" : "neu-flat text-muted-foreground"}`}
                  >{p}</button>
                ))}
              </div>
            </Field>
            {error && <p className="text-sm" style={{ color: "var(--danger)" }}>{error}</p>}
            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="surface" onClick={onClose}>Cancel</Button>
              <Button type="submit">Submit ticket</Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-500 text-muted-foreground">{label}</span>
      <div className="neu-inset rounded-xl px-3.5 py-2.5">{children}</div>
    </label>
  );
}
