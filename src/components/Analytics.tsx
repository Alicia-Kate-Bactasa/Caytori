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
import { Building2, Users, Ticket as TicketIcon, ShieldCheck } from "lucide-react"
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
  type Role,
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

function PlatformAnalytics({ tickets }: { tickets: Ticket[] }) {
  const platformKPIs = [
    { label: "Tenant Companies", value: "12", sub: "11 Active · Free Tier", icon: Building2, token: "var(--primary)" },
    { label: "Total Platform Users", value: "587", sub: "Aggregated accounts", icon: Users, token: "var(--accent)" },
    { label: "System Tickets Logged", value: "3,180", sub: "Platform-wide volume", icon: TicketIcon, token: "var(--warning)" },
    { label: "Platform SLA Uptime", value: "99.98%", sub: "18ms avg API latency", icon: ShieldCheck, token: "var(--primary)" },
  ]

  const trafficData = [
    { hour: "08:00", requests: 420 },
    { hour: "10:00", requests: 1280 },
    { hour: "12:00", requests: 940 },
    { hour: "14:00", requests: 1420 },
    { hour: "16:00", requests: 1100 },
    { hour: "18:00", requests: 510 },
  ]

  const systemStatusData = [
    { name: "Open", value: 570, color: "var(--warning)" },
    { name: "In Progress", value: 1018, color: "var(--primary)" },
    { name: "Resolved", value: 795, color: "var(--accent)" },
    { name: "Closed", value: 797, color: "var(--muted-foreground)" },
  ]

  return (
    <div className="space-y-6">
      {/* Platform Executive Summary Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {platformKPIs.map((kpi) => (
          <Card key={kpi.label} className="p-5 neu-hover">
            <div className="flex items-center justify-between">
              <span className="text-xs font-600 text-muted-foreground">{kpi.label}</span>
              <span
                className="grid h-9 w-9 place-items-center rounded-xl neu-inset"
                style={{ color: kpi.token }}
              >
                <kpi.icon size={18} />
              </span>
            </div>
            <div className="mt-3 font-display text-3xl font-800">{kpi.value}</div>
            <div className="mt-1 text-[11px] text-muted-foreground font-500">{kpi.sub}</div>
          </Card>
        ))}
      </div>

      {/* Non-Sensitive Platform Traffic & System Pipeline */}
      <div className="grid gap-6 lg:grid-cols-2 [&>*]:min-w-0">
        <Panel
          title="Platform API Throughput & Traffic Load"
          subtitle="Aggregated system-wide hourly request volume (non-sensitive telemetry)"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trafficData} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="hour" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip {...tip()} />
              <Bar dataKey="requests" fill="var(--primary)" radius={[6, 6, 0, 0]} maxBarSize={38} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel
          title="Aggregated System Ticket Lifecycle"
          subtitle="Platform-wide status throughput without tenant-identifying details"
        >
          <div className="flex h-full flex-col justify-between items-center gap-4 sm:flex-row">
            <div className="relative h-44 w-full sm:w-1/2 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={systemStatusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={44}
                    outerRadius={68}
                    paddingAngle={4}
                    stroke="none"
                  >
                    {systemStatusData.map((d) => (
                      <Cell key={d.name} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip {...tip()} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-xl font-700">3,180</span>
                <span className="text-[10px] text-muted-foreground font-600 uppercase tracking-wider">Volume</span>
              </div>
            </div>
            <div className="flex w-full sm:w-1/2 flex-col justify-center gap-2">
              {systemStatusData.map((d) => (
                <div
                  key={d.name}
                  className="neu-flat flex items-center justify-between rounded-xl px-3 py-2 text-xs"
                >
                  <span className="flex items-center gap-2 font-500">
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                    {d.name}
                  </span>
                  <span className="font-mono font-600">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      {/* Platform Architecture & Data Isolation Controls */}
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-display text-base font-600">Platform Security & Privacy Safeguards</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Caytori multi-tenant architecture enforces strict data isolation and privacy protection
            </p>
          </div>
          <span className="neu-inset rounded-full px-3 py-1 text-xs font-mono font-600 text-primary">
            Privacy Fencing Active
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 pt-2">
          {[
            { title: "Tenant Data Fencing", desc: "Strict database isolation per company ID", status: "Enforced" },
            { title: "Platform Access Tier", desc: "Free open multi-tenant platform mode", status: "Active Mode" },
            { title: "Automated Backups", desc: "System snapshots taken every 6 hours", status: "Operational" },
            { title: "TLS / SSL Encryption", desc: "All data encrypted in transit & at rest", status: "Active (256-bit)" },
          ].map((item) => (
            <div key={item.title} className="neu-flat rounded-2xl p-4">
              <div className="font-display font-600 text-xs text-foreground">{item.title}</div>
              <div className="mt-1 text-[11px] text-muted-foreground">{item.desc}</div>
              <div className="mt-3 font-mono text-[11px] font-700 text-primary">{item.status}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default function Analytics({
  tickets,
  role,
}: {
  tickets: Ticket[]
  role?: Role
}) {
  if (role === "platform_admin") {
    return <PlatformAnalytics tickets={tickets} />
  }
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
