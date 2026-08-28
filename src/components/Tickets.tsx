import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  Search,
  Plus,
  ArrowLeft,
  Send,
  X,
  CheckCircle2,
  RotateCcw,
  PlayCircle,
  UserCheck,
  Clock,
  AlertTriangle,
  Inbox,
  Ticket as TicketIcon,
} from "lucide-react"
import { Modal, Button, Card, Avatar, StatusBadge, PriorityBadge } from "./primitives"
import {
  CATEGORIES,
  PRIORITIES,
  STAFF,
  CURRENT_USER,
  IT_HIERARCHY_TIERS,
  type Ticket,
  type Role,
  type Status,
  type Priority,
  type Category,
  type EscalationTier,
  type Person,
} from "../data"

const STATUS_FILTERS: (Status | "ALL")[] = [
  "ALL",
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
]
const now = () => new Date().toISOString()
const fmt = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

export default function Tickets({
  tickets,
  role,
  title,
  onChange,
}: {
  tickets: Ticket[]
  role: Role
  title: string
  onChange: (t: Ticket[]) => void
}) {
  const [selected, setSelected] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<Status | "ALL">("ALL")
  const [creating, setCreating] = useState(false)
  const [queueTab, setQueueTab] = useState<"all" | "unassigned">("all")
  const [escalating, setEscalating] = useState(false)

  const isITManager =
    role === "it_head" || role === "company_admin" || role === "platform_admin"

  const unassignedCount = useMemo(
    () => tickets.filter((t) => !t.assignee).length,
    [tickets],
  )

  const filtered = useMemo(
    () =>
      tickets.filter((t) => {
        const q = query.toLowerCase()
        const matchesQ =
          !q ||
          t.subject.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q)
        const matchesS = status === "ALL" || t.status === status
        const matchesQueue = queueTab === "all" || !t.assignee
        return matchesQ && matchesS && matchesQueue
      }),
    [tickets, query, status, queueTab],
  )

  const active = tickets.find((t) => t.id === selected) ?? null
  const me = CURRENT_USER[role]

  function update(
    id: string,
    patch: Partial<Ticket>,
    activity?: string,
    actor = me.name,
  ) {
    onChange(
      tickets.map((t) =>
        t.id === id
          ? {
              ...t,
              ...patch,
              updatedAt: now(),
              activity: activity
                ? [
                    ...t.activity,
                    {
                      id: crypto.randomUUID(),
                      actor,
                      action: activity,
                      at: now(),
                    },
                  ]
                : t.activity,
            }
          : t,
      ),
    )
  }

  function addComment(id: string, text: string) {
    onChange(
      tickets.map((t) =>
        t.id === id
          ? {
              ...t,
              updatedAt: now(),
              comments: [
                ...t.comments,
                {
                  id: crypto.randomUUID(),
                  author: me.name,
                  role,
                  text,
                  at: now(),
                },
              ],
            }
          : t,
      ),
    )
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-700 tracking-tight">
            {title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {filtered.length} of {tickets.length} tickets
          </p>
        </div>
        {role === "normal_employee" && (
          <Button onClick={() => setCreating(true)}>
            <Plus size={16} /> New ticket
          </Button>
        )}
      </div>

      {/* Sliding Panel Switcher for All Tickets vs Unassigned Queue */}
      {isITManager && (
        <div className="neu-inset relative mt-5 flex rounded-full p-1.5 select-none overflow-hidden max-w-md">
          <div className="absolute inset-1.5 pointer-events-none">
            <motion.div
              className="neu h-full w-1/2 rounded-full"
              initial={false}
              animate={{
                x: queueTab === "all" ? "0%" : "100%",
              }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          <button
            type="button"
            onClick={() => setQueueTab("all")}
            className={`relative z-10 flex-1 py-2.5 text-xs font-600 transition-colors duration-300 cursor-pointer ${
              queueTab === "all" ? "text-foreground font-700" : "text-muted-foreground"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <TicketIcon size={14} />
              All Tickets ({tickets.length})
            </span>
          </button>

          <button
            type="button"
            onClick={() => setQueueTab("unassigned")}
            className={`relative z-10 flex-1 py-2.5 text-xs font-600 transition-colors duration-300 cursor-pointer ${
              queueTab === "unassigned" ? "text-foreground font-700" : "text-muted-foreground"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <Inbox size={14} />
              Unassigned Queue
              {unassignedCount > 0 && (
                <span
                  className="rounded-full px-2 py-0.5 font-mono text-[10px] font-700"
                  style={{
                    background: "color-mix(in srgb, var(--warning) 20%, transparent)",
                    color: "var(--warning)",
                  }}
                >
                  {unassignedCount}
                </span>
              )}
            </span>
          </button>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="neu-inset flex flex-1 items-center gap-2.5 rounded-full px-4 py-2.5 min-w-[220px]">
          <Search size={16} className="text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search subject or ticket ID…"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`rounded-full px-3.5 py-2 text-xs font-500 transition-all duration-300 ${
                status === s
                  ? "neu-inset text-primary"
                  : "neu-sm neu-press text-muted-foreground"
              }`}
            >
              {s === "ALL"
                ? "All"
                : s
                    .replace("_", " ")
                    .toLowerCase()
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {filtered.length === 0 && (
          <Card className="p-12 text-center text-sm text-muted-foreground">
            No tickets match your filters.
          </Card>
        )}
        {filtered.map((t, i) => (
          <motion.button
            key={t.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.03 }}
            onClick={() => setSelected(t.id)}
            className="block w-full text-left cursor-pointer"
          >
            <Card className="neu-hover flex flex-wrap items-center gap-x-6 gap-y-3 p-5">
              <span className="font-mono text-sm font-600 text-primary">
                {t.id}
              </span>
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

      <TicketModal
        ticket={active}
        role={role}
        onClose={() => setSelected(null)}
        onUpdate={update}
        onComment={addComment}
        onOpenEscalate={() => setEscalating(true)}
      />

      {active && (
        <EscalateModal
          open={escalating}
          ticket={active}
          onClose={() => setEscalating(false)}
          onEscalate={(targetTier, assigneeName, reason, priority) => {
            const tierObj = IT_HIERARCHY_TIERS.find((t) => t.id === targetTier)
            update(
              active.id,
              {
                escalationTier: targetTier,
                escalatedBy: me.name,
                escalationReason: reason,
                assignee: assigneeName,
                priority,
                status: "IN_PROGRESS",
              },
              `escalated ticket to ${tierObj?.label ?? targetTier} (${assigneeName})`,
            )
            addComment(
              active.id,
              `[ESCALATION HANDOVER — ${tierObj?.label ?? targetTier}]\nEscalated to ${assigneeName}.\nTechnical Handover Notes: ${reason}`,
            )
          }}
        />
      )}

      <AnimatePresence>
        {creating && (
          <CreateTicket
            reporter={me.name}
            department={me.department}
            onClose={() => setCreating(false)}
            onCreate={(t) => {
              onChange([t, ...tickets])
              setCreating(false)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export function EscalateModal({
  open,
  ticket,
  onClose,
  onEscalate,
}: {
  open: boolean
  ticket: Ticket
  onClose: () => void
  onEscalate: (
    targetTier: EscalationTier,
    assigneeName: string,
    reason: string,
    priority: Priority,
  ) => void
}) {
  const currentTierLevel =
    IT_HIERARCHY_TIERS.find((t) => t.id === (ticket.escalationTier ?? "L1"))?.level ?? 1

  const defaultNextTier =
    IT_HIERARCHY_TIERS.find((t) => t.level === Math.min(currentTierLevel + 1, 4))?.id ?? "L2"

  const [selectedTier, setSelectedTier] = useState<EscalationTier>(defaultNextTier)

  const eligibleTechs = useMemo(() => {
    const all = [...STAFF, CURRENT_USER.it_head]
    return all.filter((s) => (s.tier ?? "L1") === selectedTier)
  }, [selectedTier])

  const [targetAssignee, setTargetAssignee] = useState<string>(
    eligibleTechs[0]?.name ?? CURRENT_USER.it_head.name,
  )
  const [reason, setReason] = useState("")
  const [priority, setPriority] = useState<Priority>(
    ticket.priority === "Low"
      ? "Medium"
      : ticket.priority === "Medium"
      ? "High"
      : "Critical",
  )

  useEffect(() => {
    if (eligibleTechs.length > 0) {
      setTargetAssignee(eligibleTechs[0].name)
    } else {
      setTargetAssignee(CURRENT_USER.it_head.name)
    }
  }, [selectedTier, eligibleTechs])

  if (!open) return null

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Escalate IT Support Issue"
      subtitle={`Hand over ticket ${ticket.id} to a higher IT Support Tier`}
    >
      <div className="space-y-4 pt-2">
        {/* Tier Visual Pathway */}
        <div className="rounded-2xl p-4 neu-inset">
          <span className="text-xs font-600 text-muted-foreground uppercase tracking-wider font-mono">
            IT Support Escalation Pathway
          </span>
          <div className="mt-3 grid grid-cols-4 gap-2 text-center">
            {IT_HIERARCHY_TIERS.map((t) => {
              const isCurrent = (ticket.escalationTier ?? "L1") === t.id
              const isSelected = selectedTier === t.id
              return (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setSelectedTier(t.id)}
                  className={`rounded-xl p-2 text-xs transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "neu-flat text-foreground font-700 ring-2 ring-primary"
                      : isCurrent
                      ? "neu-inset text-primary font-600"
                      : "neu-sm text-muted-foreground"
                  }`}
                >
                  <div className="font-mono text-[10px] font-700">{t.label}</div>
                  <div className="truncate text-[11px] font-500 mt-0.5">
                    {t.title.split(" — ")[1] ?? t.label}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Selected Tier Description */}
        {(() => {
          const tierInfo = IT_HIERARCHY_TIERS.find((t) => t.id === selectedTier)
          return (
            <div className="text-xs text-muted-foreground neu-flat rounded-xl p-3">
              <span className="font-600 text-foreground">{tierInfo?.title}:</span>{" "}
              {tierInfo?.description}
            </div>
          )
        })()}

        {/* Target Specialist Assignment */}
        <div>
          <label className="block text-xs font-600 text-muted-foreground mb-1.5">
            Assign Designated Specialist ({selectedTier})
          </label>
          <select
            value={targetAssignee}
            onChange={(e) => setTargetAssignee(e.target.value)}
            className="w-full neu-inset rounded-2xl bg-transparent px-4 py-3 text-sm outline-none font-500"
          >
            {eligibleTechs.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name} ({s.specialty ?? s.role})
              </option>
            ))}
          </select>
        </div>

        {/* Adjust Priority */}
        <div>
          <label className="block text-xs font-600 text-muted-foreground mb-1.5">
            Escalated Priority Level
          </label>
          <div className="flex gap-2">
            {PRIORITIES.map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => setPriority(p)}
                className={`flex-1 py-2 rounded-xl text-xs font-600 transition-all cursor-pointer ${
                  priority === p
                    ? "neu-inset text-primary font-700"
                    : "neu-sm text-muted-foreground"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Escalation Handover Note */}
        <div>
          <label className="block text-xs font-600 text-muted-foreground mb-1.5">
            Escalation Handover Reason & Technical Notes *
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Describe technical troubleshooting performed, findings, and why this requires higher-tier intervention..."
            className="w-full neu-inset rounded-2xl bg-transparent p-3 text-sm outline-none h-24 resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={!reason.trim()}
            onClick={() => {
              onEscalate(selectedTier, targetAssignee, reason.trim(), priority)
              onClose()
            }}
          >
            Confirm Escalation & Handoff
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export function TicketModal({
  ticket,
  role,
  onClose,
  onUpdate,
  onComment,
  onOpenEscalate,
}: {
  ticket: Ticket | null
  role: Role
  onClose: () => void
  onUpdate: (
    id: string,
    patch: Partial<Ticket>,
    activity?: string,
    actor?: string,
  ) => void
  onComment: (id: string, text: string) => void
  onOpenEscalate?: () => void
}) {
  if (!ticket) return null
  return (
    <Modal
      open={!!ticket}
      onClose={onClose}
      title={ticket.subject}
      subtitle={`${ticket.id} · ${ticket.reporter} (${ticket.department}) · ${ticket.category}`}
      width="max-w-5xl"
    >
      <TicketDetail
        ticket={ticket}
        role={role}
        onBack={onClose}
        onUpdate={onUpdate}
        onComment={onComment}
        onOpenEscalate={onOpenEscalate}
      />
    </Modal>
  )
}

function TicketDetail({
  ticket,
  role,
  onBack,
  onUpdate,
  onComment,
  onOpenEscalate,
}: {
  ticket: Ticket
  role: Role
  onBack: () => void
  onUpdate: (
    id: string,
    patch: Partial<Ticket>,
    activity?: string,
    actor?: string,
  ) => void
  onComment: (id: string, text: string) => void
  onOpenEscalate?: () => void
}) {
  const [draft, setDraft] = useState("")
  const [assignee, setAssignee] = useState(ticket.assignee ?? STAFF[0].name)
  const me = CURRENT_USER[role]
  const isITHead = role === "it_head" || role === "company_admin"
  const isITEmployee = role === "it_employee" || isITHead
  const isReporter = me.name === ticket.reporter || role === "normal_employee"

  const actions: React.ReactNode[] = []
  if (isITHead && ticket.status === "OPEN") {
    actions.push(
      <div key="assign" className="flex items-center gap-2">
        <select
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          className="neu-inset rounded-full bg-transparent px-3.5 py-2 text-sm outline-none"
        >
          {STAFF.map((s) => (
            <option key={s.id} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
        <Button
          size="sm"
          onClick={() =>
            onUpdate(
              ticket.id,
              { assignee, status: "IN_PROGRESS" },
              `reviewed ticket, prioritized as ${ticket.priority}, and assigned to ${assignee}`,
            )
          }
        >
          <UserCheck size={15} /> Assign & Review
        </Button>
      </div>,
    )
  }
  if (
    isITHead &&
    ticket.status !== "OPEN" &&
    ticket.status !== "CLOSED"
  ) {
    actions.push(
      <div key="reassign" className="flex items-center gap-2">
        <select
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          className="neu-inset rounded-full bg-transparent px-3.5 py-2 text-sm outline-none"
        >
          {STAFF.map((s) => (
            <option key={s.id} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
        <Button
          size="sm"
          variant="surface"
          onClick={() =>
            onUpdate(ticket.id, { assignee }, `reassigned to ${assignee}`)
          }
        >
          Reassign
        </Button>
      </div>,
    )
  }
  if (isITEmployee && ticket.status === "IN_PROGRESS") {
    actions.push(
      <Button
        key="resolve"
        size="sm"
        onClick={() =>
          onUpdate(
            ticket.id,
            { status: "RESOLVED", resolutionHours: 2.0 },
            "investigated & marked as RESOLVED",
          )
        }
      >
        <CheckCircle2 size={15} /> Mark resolved
      </Button>,
      <Button
        key="escalate"
        size="sm"
        variant="surface"
        onClick={onOpenEscalate}
      >
        <AlertTriangle size={15} /> Escalate issue
      </Button>,
    )
  }
  if (isITEmployee && ticket.status === "OPEN") {
    actions.push(
      <Button
        key="start"
        size="sm"
        onClick={() =>
          onUpdate(
            ticket.id,
            { status: "IN_PROGRESS", assignee: me.name },
            "started work & investigation",
          )
        }
      >
        <PlayCircle size={15} /> Start work
      </Button>,
    )
  }
  if (isReporter && ticket.status === "RESOLVED") {
    actions.push(
      <Button
        key="confirm"
        size="sm"
        onClick={() =>
          onUpdate(
            ticket.id,
            { status: "CLOSED" },
            "confirmed resolution — CLOSED & recorded for performance analysis",
          )
        }
      >
        <CheckCircle2 size={15} /> Confirm fix
      </Button>,
      <Button
        key="reopen"
        size="sm"
        variant="surface"
        onClick={() =>
          onUpdate(ticket.id, { status: "IN_PROGRESS" }, "reopened — issue persists")
        }
      >
        <RotateCcw size={15} /> Not fixed
      </Button>,
    )
  }

  const [showAllActivity, setShowAllActivity] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
      >
        <ArrowLeft size={16} /> Back to tickets
      </button>

      {/* Main Ticket Card Header */}
      <Card className="p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-mono text-sm font-700 text-primary">
            {ticket.id}
          </span>
          <div className="flex items-center gap-2">
            <PriorityBadge priority={ticket.priority} />
            <StatusBadge status={ticket.status} />
          </div>
        </div>

        <div>
          <h1 className="font-display text-2xl font-700 text-foreground">
            {ticket.subject}
          </h1>
          <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 neu-inset rounded-full px-3 py-1 text-foreground font-500">
              <Avatar name={ticket.reporter} size={20} />
              <span>{ticket.reporter}</span>
              <span className="text-muted-foreground">({ticket.department})</span>
            </div>
            <span className="neu-flat rounded-full px-3 py-1 font-mono text-foreground font-600">
              Category: {ticket.category}
            </span>
            <span className="flex items-center gap-1 font-mono">
              <Clock size={13} /> {fmt(ticket.createdAt)}
            </span>
          </div>
        </div>

        <div className="neu-inset rounded-2xl p-4 text-sm leading-relaxed text-foreground">
          {ticket.description}
        </div>

        {ticket.escalationTier && (
          <div className="neu-flat rounded-2xl p-3.5 flex items-start gap-3 border-l-4 border-[var(--warning)]">
            <AlertTriangle size={18} className="text-warning shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-700 text-foreground font-display">Escalated Support Level:</span>
                <span className="neu-inset rounded-full px-2.5 py-0.5 font-mono text-[11px] font-700 text-warning">
                  {IT_HIERARCHY_TIERS.find((t) => t.id === ticket.escalationTier)?.title ?? ticket.escalationTier}
                </span>
              </div>
              {ticket.escalationReason && (
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed italic">
                  "{ticket.escalationReason}" — Handover by {ticket.escalatedBy ?? "IT Staff"}
                </p>
              )}
            </div>
          </div>
        )}

        {actions.length > 0 && (
          <div
            className="flex flex-wrap items-center gap-2.5 border-t pt-4"
            style={{ borderColor: "var(--border)" }}
          >
            {actions}
          </div>
        )}
      </Card>

      {/* 2-Column Section: Conversation & Metadata Grid */}
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr] items-start">
        {/* Left Column: Conversation */}
        <Card className="p-6">
          <h3 className="font-display text-base font-600 flex items-center justify-between">
            <span>Conversation</span>
            <span className="text-xs font-mono text-muted-foreground neu-inset rounded-full px-2.5 py-0.5">
              {ticket.comments.length} updates
            </span>
          </h3>

          <div className="mt-4 space-y-4">
            {ticket.comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <Avatar name={c.author} size={32} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-600 text-foreground">{c.author}</span>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {fmt(c.at)}
                    </span>
                  </div>
                  <div className="neu-inset mt-1.5 rounded-2xl px-4 py-3 text-sm leading-relaxed text-foreground">
                    {c.text}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {ticket.status !== "CLOSED" && (
            <form
              className="mt-5 flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                if (draft.trim()) {
                  onComment(ticket.id, draft.trim())
                  setDraft("")
                }
              }}
            >
              <div className="neu-inset flex flex-1 items-center gap-2.5 rounded-full px-4 py-2.5">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Write a response or note…"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
              <Button type="submit" size="sm">
                <Send size={15} />
              </Button>
            </form>
          )}
        </Card>

        {/* Right Column: Quick Details & Collapsible Activity Timeline */}
        <div className="space-y-6">
          {/* Quick Details Chips */}
          <Card className="p-6">
            <h3 className="font-display text-base font-600 mb-4">Ticket Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="neu-inset rounded-2xl p-3">
                <span className="text-[11px] text-muted-foreground block font-500">Assignee</span>
                <span className="text-xs font-700 text-foreground font-display mt-0.5 block truncate">
                  {ticket.assignee ?? "Unassigned"}
                </span>
              </div>
              <div className="neu-inset rounded-2xl p-3">
                <span className="text-[11px] text-muted-foreground block font-500">Category</span>
                <span className="text-xs font-700 text-foreground font-display mt-0.5 block truncate">
                  {ticket.category}
                </span>
              </div>
              <div className="neu-inset rounded-2xl p-3">
                <span className="text-[11px] text-muted-foreground block font-500">Created</span>
                <span className="text-xs font-600 text-foreground font-mono mt-0.5 block truncate">
                  {fmt(ticket.createdAt)}
                </span>
              </div>
              <div className="neu-inset rounded-2xl p-3">
                <span className="text-[11px] text-muted-foreground block font-500">Fix Time SLA</span>
                <span className="text-xs font-600 text-foreground font-mono mt-0.5 block truncate">
                  {ticket.resolutionHours != null ? `${ticket.resolutionHours} hrs` : "In SLA"}
                </span>
              </div>
            </div>
          </Card>

          {/* Activity Timeline (Clean & Truncated) */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-base font-600">Activity History</h3>
              {ticket.activity.length > 3 && (
                <button
                  type="button"
                  onClick={() => setShowAllActivity(!showAllActivity)}
                  className="text-xs text-primary font-600 hover:underline cursor-pointer"
                >
                  {showAllActivity ? "Show Less" : `View All (${ticket.activity.length})`}
                </button>
              )}
            </div>

            <ol className="space-y-3">
              {(showAllActivity ? ticket.activity : ticket.activity.slice(-3)).map((a) => (
                <li key={a.id} className="relative flex gap-3 text-xs">
                  <span
                    className="mt-1 h-2 w-2 shrink-0 rounded-full"
                    style={{ background: "var(--primary)" }}
                  />
                  <div>
                    <span className="font-600 text-foreground">{a.actor}</span>{" "}
                    <span className="text-muted-foreground">{a.action}</span>
                    <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                      {fmt(a.at)}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}

function CreateTicket({
  reporter,
  department,
  onClose,
  onCreate,
}: {
  reporter: string
  department: string
  onClose: () => void
  onCreate: (t: Ticket) => void
}) {
  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<Category>("Hardware")
  const [priority, setPriority] = useState<Priority>("Medium")
  const [error, setError] = useState("")

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (subject.trim().length < 5)
      return setError("Please add a clear subject (at least 5 characters).")
    if (description.trim().length < 10)
      return setError("Please describe the issue in a little more detail.")
    const id =
      "CT-" +
      String(Math.floor(100000 + Math.random() * 899999)).padStart(6, "0")
    onCreate({
      id,
      subject: subject.trim(),
      description: description.trim(),
      reporter,
      department,
      category,
      priority,
      status: "OPEN",
      assignee: null,
      createdAt: now(),
      updatedAt: now(),
      resolutionHours: null,
      comments: [],
      activity: [
        {
          id: crypto.randomUUID(),
          actor: reporter,
          action: "created the ticket",
          at: now(),
        },
      ],
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 grid place-items-center p-4"
      style={{
        background: "color-mix(in srgb, var(--foreground) 35%, transparent)",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg"
      >
        <Card className="p-7">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-700">
              Report an IT issue
            </h2>
            <button
              onClick={onClose}
              className="neu-sm neu-press grid h-9 w-9 place-items-center rounded-full text-muted-foreground"
            >
              <X size={16} />
            </button>
          </div>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <Field label="Subject">
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Unable to access company network"
                className="w-full bg-transparent text-sm outline-none"
              />
            </Field>
            <Field label="Description">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe what's happening and since when…"
                className="w-full resize-none bg-transparent text-sm outline-none"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Department">
                <div className="py-0.5 text-sm font-600 text-foreground">
                  {department}{" "}
                  <span className="text-[11px] font-normal text-muted-foreground">
                    (Your dept)
                  </span>
                </div>
              </Field>
              <Field label="Category">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full bg-transparent text-sm outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Priority">
              <div className="flex gap-1.5">
                {PRIORITIES.map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`flex-1 rounded-lg py-1.5 text-xs font-500 transition-all ${
                      priority === p
                        ? "neu-inset text-primary"
                        : "neu-flat text-muted-foreground"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </Field>
            {error && (
              <p className="text-sm" style={{ color: "var(--danger)" }}>
                {error}
              </p>
            )}
            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="surface" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Submit ticket</Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-500 text-muted-foreground">
        {label}
      </span>
      <div className="neu-inset rounded-xl px-3.5 py-2.5">{children}</div>
    </label>
  )
}
