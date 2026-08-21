import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"
import { Card } from "./primitives"
import {
  CATEGORIES,
  PRIORITIES,
  DEPARTMENTS,
  statusMeta,
  priorityMeta,
  avgResolution,
  type Ticket,
  type Status,
} from "../data"

const STATUSES: Status[] = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]

function tip() {
  return {
    contentStyle: {
      background: "var(--card)",
      border: "1px solid var(--border)",
      borderRadius: 12,
      fontSize: 12,
      color: "var(--foreground)",
      boxShadow: "6px 6px 16px var(--neu-dark)",
    },
    cursor: { fill: "color-mix(in srgb, var(--primary) 8%, transparent)" },
  }
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <Card className="min-w-0 p-6">
      <h3 className="font-display text-base font-600">{title}</h3>
      {subtitle && (
        <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
      )}
      <div className="mt-5 h-64 w-full min-w-0">{children}</div>
    </Card>
  )
}

export default function Analytics({ tickets }: { tickets: Ticket[] }) {
  const byCategory = CATEGORIES.map((c) => ({
    name: c,
    value: tickets.filter((t) => t.category === c).length,
  })).filter((d) => d.value > 0)

  const byStatus = STATUSES.map((s) => ({
    name: statusMeta[s].label,
    value: tickets.filter((t) => t.status === s).length,
    token: statusMeta[s].token,
  })).filter((d) => d.value > 0)

  const byPriority = PRIORITIES.map((p) => ({
    name: p,
    value: tickets.filter((t) => t.priority === p).length,
    token: priorityMeta[p].token,
  }))

  const byDept = DEPARTMENTS.map((d) => ({
    name: d,
    value: tickets.filter((t) => t.department === d).length,
  })).filter((d) => d.value > 0)

  const avg = avgResolution(tickets)

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2 [&>*]:min-w-0">
        <Panel
          title="Tickets by category"
          subtitle="Where issues concentrate across the company"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={byCategory}
              margin={{ top: 4, right: 4, left: -18, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={54}
              />
              <YAxis
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip {...tip()} />
              <Bar
                dataKey="value"
                fill="var(--primary)"
                radius={[6, 6, 0, 0]}
                maxBarSize={38}
              />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel
          title="Status distribution"
          subtitle="Live snapshot of the pipeline"
        >
          <div className="flex h-full flex-col justify-between sm:flex-row items-center gap-4">
            <div className="relative h-48 w-full sm:w-1/2 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byStatus}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={48}
                    outerRadius={70}
                    paddingAngle={4}
                    stroke="none"
                  >
                    {byStatus.map((d) => (
                      <Cell key={d.name} fill={d.token} />
                    ))}
                  </Pie>
                  <Tooltip {...tip()} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-xl font-700">{tickets.length}</span>
                <span className="text-[10px] text-muted-foreground font-600 uppercase tracking-wider">Total</span>
              </div>
            </div>
            <div className="flex w-full sm:w-1/2 flex-col justify-center gap-2">
              {byStatus.map((d) => {
                const pct = tickets.length > 0 ? Math.round((d.value / tickets.length) * 100) : 0
                return (
                  <div
                    key={d.name}
                    className="neu-flat flex items-center justify-between rounded-xl px-3 py-2 text-xs"
                  >
                    <span className="flex items-center gap-2 font-500">
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ background: d.token }}
                      />
                      {d.name}
                    </span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-600">{d.value}</span>
                      <span className="text-[10px] text-muted-foreground">({pct}%)</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 [&>*]:min-w-0">
        <Panel title="Tickets by priority" subtitle="Balance of urgency">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={byPriority}
              layout="vertical"
              margin={{ top: 0, right: 12, left: 8, bottom: 0 }}
            >
              <XAxis type="number" hide allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={64}
              />
              <Tooltip {...tip()} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={26}>
                {byPriority.map((d) => (
                  <Cell key={d.name} fill={d.token} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel
          title="Tickets by department"
          subtitle="Which teams report the most"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={byDept}
              margin={{ top: 4, right: 4, left: -18, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={54}
              />
              <YAxis
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip {...tip()} />
              <Bar
                dataKey="value"
                fill="var(--accent)"
                radius={[6, 6, 0, 0]}
                maxBarSize={38}
              />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <Card className="flex flex-wrap items-center justify-between gap-4 p-6">
        <div>
          <h3 className="font-display text-base font-600">
            Average resolution time
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Mean across all resolved & closed tickets — plain arithmetic, no
            modeling.
          </p>
        </div>
        <span
          className="font-display text-4xl font-700"
          style={{ color: "var(--primary)" }}
        >
          {avg.toFixed(1)}
          <span className="ml-1 text-lg text-muted-foreground">hrs</span>
        </span>
      </Card>
    </div>
  )
}
