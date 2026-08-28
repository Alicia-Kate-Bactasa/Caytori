import { useState } from "react"
import { motion } from "motion/react"
import type { LucideIcon } from "lucide-react"
import {
  Inbox,
  PlayCircle,
  CheckCircle2,
  AlertTriangle,
  Ticket as TicketIcon,
  Building2,
  Users,
  Clock,
} from "lucide-react"
import { Card, StatusBadge, PriorityBadge, Avatar } from "./primitives"
import {
  type Role,
  type Ticket,
  CURRENT_USER,
  STAFF,
  avgResolution,
} from "../data"
import { TicketModal } from "./Tickets"

const now = () => new Date().toISOString()

function StatCard({
  label,
  value,
  token,
  delay,
}: {
  label: string
  value: string | number
  token: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="neu-hover p-5">
        <div className="flex items-center justify-between gap-2">
          <h3
            className="font-display text-base font-600 tracking-tight"
            style={{ color: token }}
          >
            {label}
          </h3>
          <span
            className="h-2.5 w-2.5 rounded-full shrink-0"
            style={{ background: token }}
          />
        </div>
        <div className="mt-3 font-display text-3xl font-700">{value}</div>
      </Card>
    </motion.div>
  )
}

export default function Dashboard({
  role,
  tickets,
  onChange,
}: {
  role: Role
  tickets: Ticket[]
  onChange?: (t: Ticket[]) => void
}) {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const activeTicket = tickets.find((t) => t.id === selectedTicketId) ?? null

  const me = CURRENT_USER[role]

  function update(
    id: string,
    patch: Partial<Ticket>,
    activity?: string,
    actor = me.name,
  ) {
    if (!onChange) return
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
    if (!onChange) return
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

  const n = (s: Ticket["status"]) =>
    tickets.filter((t) => t.status === s).length
  const crit = tickets.filter(
    (t) => t.priority === "Critical" && t.status !== "CLOSED",
  ).length
  const unassigned = tickets.filter(
    (t) => !t.assignee && t.status === "OPEN",
  ).length

  let cards: { icon: LucideIcon; label: string; value: number; token: string }[] =
    []
  if (role === "platform_admin") {
    cards = [
      {
        icon: Building2,
        label: "Registered companies",
        value: 12,
        token: "var(--primary)",
      },
      {
        icon: CheckCircle2,
        label: "Active companies",
        value: 11,
        token: "var(--accent)",
      },
      {
        icon: Users,
        label: "Total users",
        value: 486,
        token: "var(--warning)",
      },
      {
        icon: TicketIcon,
        label: "Total tickets",
        value: 3128,
        token: "var(--muted-foreground)",
      },
    ]
  } else if (role === "it_head") {
    cards = [
      {
        icon: Inbox,
        label: "Unassigned",
        value: unassigned,
        token: "var(--warning)",
      },
      {
        icon: PlayCircle,
        label: "In progress",
        value: n("IN_PROGRESS"),
        token: "var(--primary)",
      },
      {
        icon: AlertTriangle,
        label: "Critical open",
        value: crit,
        token: "var(--danger)",
      },
      {
        icon: TicketIcon,
        label: "All tickets",
        value: tickets.length,
        token: "var(--muted-foreground)",
      },
    ]
  } else if (role === "it_employee") {
    cards = [
      {
        icon: TicketIcon,
        label: "Assigned to me",
        value: tickets.length,
        token: "var(--primary)",
      },
      {
        icon: PlayCircle,
        label: "In progress",
        value: n("IN_PROGRESS"),
        token: "var(--warning)",
      },
      {
        icon: CheckCircle2,
        label: "Resolved",
        value: n("RESOLVED"),
        token: "var(--accent)",
      },
      {
        icon: AlertTriangle,
        label: "High / critical",
        value: tickets.filter(
          (t) =>
            ["High", "Critical"].includes(t.priority) && t.status !== "CLOSED",
        ).length,
        token: "var(--danger)",
      },
    ]
  } else {
    cards = [
      { icon: Inbox, label: "Open", value: n("OPEN"), token: "var(--warning)" },
      {
        icon: PlayCircle,
        label: "In progress",
        value: n("IN_PROGRESS"),
        token: "var(--primary)",
      },
      {
        icon: CheckCircle2,
        label: "Resolved",
        value: n("RESOLVED"),
        token: "var(--accent)",
      },
      {
        icon: TicketIcon,
        label: "Closed",
        value: n("CLOSED"),
        token: "var(--muted-foreground)",
      },
    ]
  }

  const recent = [...tickets]
    .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
    .slice(0, 5)
  const avg = avgResolution(tickets)

  const isEmployeeView = role === "normal_employee"
  const isITHead = role === "it_head" || role === "company_admin"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-700 tracking-tight">
          Good day, {me.name.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isEmployeeView
            ? "Here's the status of your reported tickets today"
            : "Here's the state of IT support today"}{" "}
          ·{" "}
          {new Date().toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => (
          <StatCard key={c.label} {...c} delay={i * 0.06} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card className="p-6">
          <h3 className="font-display text-base font-600">
            {isEmployeeView ? "Your recent tickets" : "Recent activity"}
          </h3>
          <div className="mt-4 space-y-2">
            {recent.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTicketId(t.id)}
                className="flex w-full flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl px-2 py-2.5 text-left transition-colors hover:bg-[color-mix(in_srgb,var(--primary)_6%,transparent)] cursor-pointer"
              >
                <span className="font-mono text-xs font-600 text-primary">
                  {t.id}
                </span>
                <span className="min-w-[140px] flex-1 truncate text-sm font-500">
                  {t.subject}
                </span>
                <PriorityBadge priority={t.priority} />
                <StatusBadge status={t.status} />
              </button>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock size={16} />
              <span className="text-sm">
                {isEmployeeView ? "Avg. fix time for your issues" : "Avg. resolution time"}
              </span>
            </div>
            <div
              className="mt-2 font-display text-3xl font-700"
              style={{ color: "var(--primary)" }}
            >
              {avg.toFixed(1)}
              <span className="ml-1 text-base text-muted-foreground">hrs</span>
            </div>
          </Card>

          {isITHead && (
            <Card className="p-6">
              <h3 className="font-display text-base font-600">
                IT Staff workload
              </h3>
              <div className="mt-4 space-y-3">
                {STAFF.map((s) => {
                  const load = tickets.filter(
                    (t) => t.assignee === s.name && t.status !== "CLOSED",
                  ).length
                  const pct = Math.min(100, load * 25)
                  return (
                    <div key={s.id} className="flex items-center gap-3">
                      <Avatar name={s.name} size={30} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-500">{s.name}</span>
                          <span className="text-muted-foreground">
                            {load} active
                          </span>
                        </div>
                        <div className="neu-inset mt-1.5 h-2 overflow-hidden rounded-full">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                            className="h-full rounded-full"
                            style={{ background: "var(--primary)" }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          )}
        </div>
      </div>

      <TicketModal
        ticket={activeTicket}
        role={role}
        onClose={() => setSelectedTicketId(null)}
        onUpdate={update}
        onComment={addComment}
      />
    </div>
  )
}
