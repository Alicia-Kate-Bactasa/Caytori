import { useState } from "react"
import { motion } from "motion/react"
import {
  ArrowLeft,
  Building2,
  Ticket,
  Users,
  Power,
  ChevronRight,
} from "lucide-react"
import {
  Card,
  Avatar,
  Button,
  Modal,
  Field,
  Toast,
  StatusBadge,
} from "./primitives"
import { DEPARTMENTS, STAFF, TICKETS } from "../data"

type Kind = "employees" | "it_team" | "departments" | "companies"

interface Row {
  name: string
  dept?: string
  email?: string
  head?: string
  status: string
  users?: number
  tickets?: number
}

const INITIAL: Record<Kind, Row[]> = {
  employees: [
    {
      name: "Maria Santos",
      dept: "Finance",
      email: "maria@abccorp.com",
      status: "Active",
    },
    {
      name: "Diego Flores",
      dept: "Sales",
      email: "diego@abccorp.com",
      status: "Active",
    },
    {
      name: "Grace Lim",
      dept: "Marketing",
      email: "grace@abccorp.com",
      status: "Active",
    },
    {
      name: "Priya Nair",
      dept: "Operations",
      email: "priya@abccorp.com",
      status: "Active",
    },
    {
      name: "Sam Ortega",
      dept: "Human Resources",
      email: "sam@abccorp.com",
      status: "Invited",
    },
  ],
  it_team: STAFF.map((s) => ({
    name: s.name,
    dept: `IT Support ${s.tier ?? "Tier 1"} · ${s.specialty ?? "General Triage"}`,
    email: s.email,
    status: "Active",
  })),
  companies: [
    {
      name: "ABC Corporation",
      users: 142,
      tickets: 318,
      status: "Active",
      email: "admin@abccorp.com",
    },
    {
      name: "XYZ Corporation",
      users: 88,
      tickets: 204,
      status: "Active",
      email: "admin@xyz.com",
    },
    {
      name: "DEF Industries",
      users: 61,
      tickets: 97,
      status: "Active",
      email: "admin@def.com",
    },
    {
      name: "Northwind Ltd",
      users: 34,
      tickets: 52,
      status: "Suspended",
      email: "admin@northwind.com",
    },
  ],
  departments: [
    { name: "Finance", head: "Elena Vance", status: "Active" },
    { name: "Human Resources", head: "Sam Ortega", status: "Active" },
    { name: "Marketing", head: "Grace Lim", status: "Active" },
    { name: "Operations", head: "Priya Nair", status: "Active" },
    { name: "Sales", head: "Diego Flores", status: "Active" },
    { name: "IT", head: "John Doe (IT Admin / Head of IT)", status: "Active" },
  ],
}

const ACTIONS: Record<Kind, string> = {
  employees: "Invite employee",
  it_team: "Invite IT staff",
  departments: "New department",
  companies: "Register company",
}

function Pill({ text }: { text: string }) {
  const token =
    text === "Active"
      ? "var(--accent)"
      : text === "Invited"
        ? "var(--warning)"
        : "var(--danger)"
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-500"
      style={{
        background: `color-mix(in srgb, ${token} 15%, transparent)`,
        color: token,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: token }}
      />
      {text}
    </span>
  )
}

export default function Directory({
  kind,
  title,
}: {
  kind: Kind
  title: string
}) {
  const [rows, setRows] = useState<Row[]>(INITIAL[kind])
  const [creating, setCreating] = useState(false)
  const [confirm, setConfirm] = useState<Row | null>(null)
  const [detail, setDetail] = useState<Row | null>(null)
  const [toast, setToast] = useState("")

  function flash(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(""), 3200)
  }

  function create(e: React.FormEvent) {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const name =
      (form.elements.namedItem("name") as HTMLInputElement)?.value ||
      "New entry"
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value
    const head = (form.elements.namedItem("head") as HTMLInputElement)?.value
    const newRow: Row =
      kind === "companies"
        ? { name, email, users: 0, tickets: 0, status: "Active" }
        : kind === "departments"
          ? { name, head: head || undefined, status: "Active" }
          : {
              name,
              email,
              dept: (form.elements.namedItem("dept") as HTMLInputElement)
                ?.value,
              status: kind === "employees" ? "Invited" : "Active",
            }
    setRows([newRow, ...rows])
    setCreating(false)
    const msgs: Record<Kind, string> = {
      employees:
        "Invitation email sent — the employee can now set their password.",
      it_team: "IT staff invitation sent successfully.",
      departments: "Department created.",
      companies:
        "Company registered and the initial Company Admin was invited.",
    }
    flash(msgs[kind])
  }

  function toggleStatus(row: Row) {
    const next =
      row.status === "Suspended" || row.status === "Inactive"
        ? "Active"
        : kind === "companies"
          ? "Suspended"
          : "Inactive"
    setRows(rows.map((r) => (r.name === row.name ? { ...r, status: next } : r)))
    if (detail && detail.name === row.name)
      setDetail({ ...detail, status: next })
    setConfirm(null)
    flash(`${row.name} is now ${next.toLowerCase()}.`)
  }

  if (detail && kind === "companies") {
    return (
      <CompanyDetail
        company={detail}
        onBack={() => setDetail(null)}
        onToggle={() => setConfirm(detail)}
        toast={toast}
        confirm={confirm}
        onCloseConfirm={() => setConfirm(null)}
        onConfirm={() => toggleStatus(detail)}
      />
    )
  }

  const isPeople = kind === "employees" || kind === "it_team"

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-700 tracking-tight">
          {title}
        </h1>
        <Button onClick={() => setCreating(true)}>{ACTIONS[kind]}</Button>
      </div>

      <Card className="mt-6 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b" style={{ borderColor: "var(--border)" }}>
              {(kind === "companies"
                ? ["Company", "Users", "Tickets", "Status", ""]
                : kind === "departments"
                  ? ["Department", "Department Head", "Members", "Open tickets", "Status", ""]
                  : isPeople
                    ? [
                        "Name",
                        kind === "it_team" ? "Role" : "Department",
                        "Email",
                        "Status",
                        "",
                      ]
                    : []
              ).map((h, i) => (
                <th
                  key={i}
                  className="px-6 py-4 text-xs font-500 uppercase tracking-wide text-muted-foreground"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const clickable = kind === "companies"
              return (
                <tr
                  key={r.name}
                  onClick={clickable ? () => setDetail(r) : undefined}
                  className={`border-b transition-colors last:border-0 hover:bg-[color-mix(in_srgb,var(--primary)_5%,transparent)] ${
                    clickable ? "cursor-pointer" : ""
                  }`}
                  style={{ borderColor: "var(--border)" }}
                >
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-3">
                      <Avatar name={r.name} size={32} />
                      <span className="font-500">{r.name}</span>
                    </span>
                  </td>
                  {kind === "companies" && (
                    <td className="px-6 py-4 font-mono text-sm">{r.users}</td>
                  )}
                  {kind === "companies" && (
                    <td className="px-6 py-4 font-mono text-sm">{r.tickets}</td>
                  )}
                  {kind === "departments" && (
                    <td className="px-6 py-4 text-sm font-500 text-foreground">
                      {r.head ? (
                        <span className="flex items-center gap-2">
                          <Avatar name={r.head.split("(")[0].trim()} size={24} />
                          {r.head}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs italic">Unassigned</span>
                      )}
                    </td>
                  )}
                  {kind === "departments" && (
                    <td className="px-6 py-4 font-mono text-sm">
                      {Math.floor(Math.random() * 15) + 4}
                    </td>
                  )}
                  {kind === "departments" && (
                    <td className="px-6 py-4 font-mono text-sm">
                      {
                        TICKETS.filter(
                          (t) =>
                            t.department === r.name && t.status !== "CLOSED",
                        ).length
                      }
                    </td>
                  )}
                  {isPeople && (
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {r.dept}
                    </td>
                  )}
                  {isPeople && (
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {r.email}
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <Pill text={r.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    {clickable ? (
                      <ChevronRight
                        size={16}
                        className="ml-auto text-muted-foreground"
                      />
                    ) : (
                      <Button
                        size="sm"
                        variant="surface"
                        onClick={() => setConfirm(r)}
                      >
                        {r.status === "Active" || r.status === "Invited"
                          ? "Deactivate"
                          : "Activate"}
                      </Button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>

      {/* Create / invite modal */}
      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title={ACTIONS[kind]}
        subtitle={
          isPeople
            ? "They'll receive a secure email invitation to activate their account."
            : kind === "companies"
              ? "Register a new tenant. Its data stays isolated from every other company."
              : "Organizational unit — departments are not IT teams."
        }
        footer={
          <>
            <Button
              type="button"
              variant="surface"
              onClick={() => setCreating(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() =>
                (document.getElementById(
                  "dir-form",
                ) as HTMLFormElement)?.requestSubmit()
              }
            >
              {ACTIONS[kind]}
            </Button>
          </>
        }
      >
        <form id="dir-form" onSubmit={create} className="space-y-4">
          {isPeople && (
            <>
              <Field label="Full name">
                <input
                  name="name"
                  required
                  placeholder="e.g. Maria Santos"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </Field>
              <Field label="Email">
                <input
                  name="email"
                  required
                  type="email"
                  placeholder="name@company.com"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </Field>
              {kind === "employees" ? (
                <Field label="Department">
                  <select
                    name="dept"
                    className="w-full bg-transparent text-sm outline-none"
                  >
                    {DEPARTMENTS.filter((d) => d !== "IT").map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </Field>
              ) : (
                <Field label="IT role">
                  <select
                    name="dept"
                    className="w-full bg-transparent text-sm outline-none"
                  >
                    <option>IT Staff</option>
                    <option>Network Support</option>
                    <option>IT Admin / Manager</option>
                  </select>
                </Field>
              )}
            </>
          )}
          {kind === "departments" && (
            <>
              <Field label="Department name">
                <input
                  name="name"
                  required
                  placeholder="e.g. Customer Success"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </Field>
              <Field label="Department Head (optional)">
                <input
                  name="head"
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </Field>
            </>
          )}
          {kind === "companies" && (
            <>
              <Field label="Company name">
                <input
                  name="name"
                  required
                  placeholder="e.g. ABC Corporation"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </Field>
              <Field label="Admin email">
                <input
                  name="email"
                  required
                  type="email"
                  placeholder="admin@company.com"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </Field>
              <Field label="Contact number">
                <input
                  placeholder="+63 900 000 0000"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </Field>
            </>
          )}
        </form>
      </Modal>

      {/* Confirm deactivate/activate */}
      <Modal
        open={!!confirm && !detail}
        onClose={() => setConfirm(null)}
        title={
          confirm?.status === "Active" || confirm?.status === "Invited"
            ? "Deactivate account?"
            : "Reactivate account?"
        }
        footer={
          <>
            <Button variant="surface" onClick={() => setConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant={confirm?.status === "Active" ? "danger" : "primary"}
              onClick={() => confirm && toggleStatus(confirm)}
            >
              {confirm?.status === "Active" || confirm?.status === "Invited"
                ? "Deactivate"
                : "Activate"}
            </Button>
          </>
        }
      >
        <p className="text-sm leading-relaxed text-muted-foreground">
          {confirm?.status === "Active" || confirm?.status === "Invited" ? (
            <>
              Are you sure you want to deactivate{" "}
              <span className="font-600 text-foreground">{confirm?.name}</span>?
              They'll lose access, but all their ticket history is retained.
            </>
          ) : (
            <>
              Reactivate{" "}
              <span className="font-600 text-foreground">{confirm?.name}</span>{" "}
              and restore their access?
            </>
          )}
        </p>
      </Modal>

      <Toast text={toast} />
    </motion.div>
  )
}

function CompanyDetail({
  company,
  onBack,
  onToggle,
  toast,
  confirm,
  onCloseConfirm,
  onConfirm,
}: {
  company: Row
  onBack: () => void
  onToggle: () => void
  toast: string
  confirm: Row | null
  onCloseConfirm: () => void
  onConfirm: () => void
}) {
  const stats = [
    { icon: Users, label: "Total users", value: company.users ?? 0 },
    { icon: Ticket, label: "Total tickets", value: company.tickets ?? 0 },
    { icon: Building2, label: "Departments", value: 6 },
  ]
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={16} /> Back to companies
      </button>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar name={company.name} size={56} />
          <div>
            <h1 className="font-display text-2xl font-700 tracking-tight">
              {company.name}
            </h1>
            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <Pill text={company.status} /> · {company.email}
            </div>
          </div>
        </div>
        <Button
          variant={company.status === "Active" ? "danger" : "primary"}
          onClick={onToggle}
        >
          <Power size={15} />{" "}
          {company.status === "Active"
            ? "Deactivate company"
            : "Activate company"}
        </Button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <div className="neu-inset grid h-11 w-11 place-items-center rounded-2xl text-primary">
              <s.icon size={19} />
            </div>
            <div className="mt-4 font-display text-3xl font-700">{s.value}</div>
            <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-display text-base font-600">
            Company information
          </h3>
          <dl className="mt-4 space-y-3 text-sm">
            {[
              ["Tenant ID", company.name.toLowerCase().replace(/\W+/g, "-")],
              ["Admin email", company.email ?? "—"],
              ["Plan", "Business"],
              ["Registered", "Jan 14, 2026"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="text-right font-500">{v}</dd>
              </div>
            ))}
          </dl>
        </Card>
        <Card className="p-6">
          <h3 className="font-display text-base font-600">Recent tickets</h3>
          <div className="mt-4 space-y-2">
            {TICKETS.slice(0, 4).map((t) => (
              <div key={t.id} className="flex items-center gap-3 py-1.5">
                <span className="font-mono text-xs font-600 text-primary">
                  {t.id}
                </span>
                <span className="flex-1 truncate text-sm">{t.subject}</span>
                <StatusBadge status={t.status} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Modal
        open={!!confirm}
        onClose={onCloseConfirm}
        title={
          company.status === "Active"
            ? "Deactivate company?"
            : "Activate company?"
        }
        footer={
          <>
            <Button variant="surface" onClick={onCloseConfirm}>
              Cancel
            </Button>
            <Button
              variant={company.status === "Active" ? "danger" : "primary"}
              onClick={onConfirm}
            >
              {company.status === "Active" ? "Deactivate" : "Activate"}
            </Button>
          </>
        }
      >
        <p className="text-sm leading-relaxed text-muted-foreground">
          {company.status === "Active" ? (
            <>
              Deactivating{" "}
              <span className="font-600 text-foreground">{company.name}</span>{" "}
              suspends access for all its users. Ticket data is retained and
              restored on reactivation.
            </>
          ) : (
            <>
              Reactivate{" "}
              <span className="font-600 text-foreground">{company.name}</span>{" "}
              and restore access for all its users?
            </>
          )}
        </p>
      </Modal>

      <Toast text={toast} />
    </motion.div>
  )
}
