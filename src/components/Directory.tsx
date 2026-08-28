import { useMemo, useState } from "react"
import { motion } from "motion/react"
import {
  ArrowLeft,
  Building2,
  Ticket,
  Users,
  Power,
  ChevronRight,
  UserPlus,
  Copy,
  Check,
  Link as LinkIcon,
  UserX,
  UserCheck,
  Archive,
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
    {
      name: "Carlos Rivera",
      dept: "Finance",
      email: "carlos@abccorp.com",
      status: "Inactive",
    },
    {
      name: "Rachel Green",
      dept: "Marketing",
      email: "rachel@abccorp.com",
      status: "Inactive",
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
  const [showInactiveModal, setShowInactiveModal] = useState(false)

  const [allEmployees, setAllEmployees] = useState<Row[]>(INITIAL.employees)
  const inactiveEmployees = useMemo(
    () => allEmployees.filter((e) => e.status === "Inactive"),
    [allEmployees],
  )

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

  if (detail && kind === "departments") {
    return (
      <DepartmentDetailModal
        department={detail}
        allEmployees={allEmployees}
        onUpdateEmployees={setAllEmployees}
        onClose={() => setDetail(null)}
        onToggleStatus={() => toggleStatus(detail)}
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
        <div className="flex items-center gap-2">
          {kind === "departments" && (
            <Button
              variant="surface"
              onClick={() => setShowInactiveModal(true)}
              className="relative"
            >
              <Archive size={15} /> Inactive Accounts
              {inactiveEmployees.length > 0 && (
                <span className="ml-1.5 neu-inset rounded-full px-2 py-0.5 font-mono text-[10px] font-700 text-warning">
                  {inactiveEmployees.length}
                </span>
              )}
            </Button>
          )}
          <Button onClick={() => setCreating(true)}>{ACTIONS[kind]}</Button>
        </div>
      </div>

      {kind === "departments" ? (
        /* Departments Gallery Card Grid */
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((r) => {
            const openTicketsCount = TICKETS.filter(
              (t) => t.department === r.name && t.status !== "CLOSED",
            ).length
            const memberCount =
              r.name === "Finance"
                ? 9
                : r.name === "Human Resources"
                ? 4
                : r.name === "Marketing"
                ? 7
                : r.name === "Operations"
                ? 9
                : r.name === "Sales"
                ? 15
                : 9

            return (
              <Card key={r.name} className="neu-hover p-6 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-2xl neu-inset font-display font-700 text-primary text-base">
                        {r.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-display font-700 text-base text-foreground">{r.name}</h3>
                        <div className="mt-0.5 text-xs text-muted-foreground">Department</div>
                      </div>
                    </div>
                    <Pill text={r.status} />
                  </div>

                  <div className="mt-5 space-y-2.5">
                    <div className="text-xs text-muted-foreground">
                      <span className="font-600 text-foreground block mb-1">Department Head:</span>
                      {r.head ? (
                        <div className="flex items-center gap-2 text-foreground font-500 neu-flat rounded-xl p-2">
                          <Avatar name={r.head.split("(")[0].trim()} size={24} />
                          <span className="truncate">{r.head}</span>
                        </div>
                      ) : (
                        <span className="italic">Unassigned</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <span className="neu-inset flex-1 rounded-xl px-3 py-2 text-center text-xs font-600 font-mono">
                        <Users size={13} className="inline mr-1 text-primary" /> {memberCount} Members
                      </span>
                      <span className="neu-inset flex-1 rounded-xl px-3 py-2 text-center text-xs font-600 font-mono">
                        <Ticket size={13} className="inline mr-1 text-warning" /> {openTicketsCount} Open Tickets
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-[var(--border)]">
                  <Button size="sm" variant="surface" className="flex-1" onClick={() => setDetail(r)}>
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setConfirm(r)}
                    className="text-xs text-muted-foreground hover:text-danger"
                  >
                    {r.status === "Active" ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        /* Table View for Companies, Employees, IT Team */
        <Card className="mt-6 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                {(kind === "companies"
                  ? ["Company", "Users", "Tickets", "Status", ""]
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
      )}

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

      {/* Inactive Member Accounts Archive Modal */}
      <Modal
        open={showInactiveModal}
        onClose={() => setShowInactiveModal(false)}
        title="Inactive Member Accounts Archive"
        subtitle="Deactivated employee accounts archived across all departments."
        width="max-w-2xl"
      >
        <div className="space-y-4 pt-2">
          <div className="space-y-2 max-h-80 overflow-y-auto neu-inset rounded-2xl p-3">
            {inactiveEmployees.length > 0 ? (
              inactiveEmployees.map((m) => (
                <div
                  key={m.name}
                  className="flex items-center justify-between p-3 rounded-xl neu-flat text-xs"
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={m.name} size={32} />
                    <div>
                      <div className="font-600 text-foreground font-display text-sm">
                        {m.name}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {m.email} · {m.dept} Department
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Pill text="Inactive" />
                    <Button
                      size="sm"
                      variant="surface"
                      onClick={() => {
                        setAllEmployees(
                          allEmployees.map((x) =>
                            x.name === m.name ? { ...x, status: "Active" } : x,
                          ),
                        )
                        flash(`${m.name}'s account has been reactivated.`)
                      }}
                    >
                      <UserCheck size={14} className="text-accent" /> Reactivate
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-muted-foreground italic">
                No deactivated employee accounts currently archived.
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2 border-t border-[var(--border)]">
            <Button size="sm" onClick={() => setShowInactiveModal(false)}>
              Close Archive
            </Button>
          </div>
        </div>
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

function DepartmentDetailModal({
  department,
  allEmployees,
  onUpdateEmployees,
  onClose,
  onToggleStatus,
}: {
  department: Row
  allEmployees: Row[]
  onUpdateEmployees: (rows: Row[]) => void
  onClose: () => void
  onToggleStatus: () => void
}) {
  const [ticketTab, setTicketTab] = useState<"ACTIVE" | "RESOLVED" | "CLOSED" | "ALL">("ACTIVE")
  const [inviting, setInviting] = useState(false)
  const [showDeptInactiveDrawer, setShowDeptInactiveDrawer] = useState(false)
  const [inviteName, setInviteName] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")
  const [copiedLink, setCopiedLink] = useState(false)
  const [modalToast, setModalToast] = useState("")

  const deptMembers = useMemo(() => {
    return allEmployees
      .filter((e) => e.dept === department.name)
      .concat(
        department.name === "IT"
          ? STAFF.map((s) => ({
              name: s.name,
              dept: "IT",
              email: s.email,
              status: "Active",
            })).filter((s) => !allEmployees.some((e) => e.name === s.name))
          : [],
      )
  }, [allEmployees, department.name])

  const activeDeptMembers = useMemo(
    () => deptMembers.filter((m) => m.status !== "Inactive"),
    [deptMembers],
  )
  const inactiveDeptMembers = useMemo(
    () => deptMembers.filter((m) => m.status === "Inactive"),
    [deptMembers],
  )

  const deptTickets = TICKETS.filter((t) => t.department === department.name)
  const activeTickets = deptTickets.filter((t) => t.status === "OPEN" || t.status === "IN_PROGRESS")
  const resolvedTickets = deptTickets.filter((t) => t.status === "RESOLVED")
  const closedTickets = deptTickets.filter((t) => t.status === "CLOSED")

  const displayTickets = useMemo(() => {
    if (ticketTab === "ACTIVE") return activeTickets
    if (ticketTab === "RESOLVED") return resolvedTickets
    if (ticketTab === "CLOSED") return closedTickets
    return deptTickets
  }, [deptTickets, activeTickets, resolvedTickets, closedTickets, ticketTab])

  function flashModalToast(msg: string) {
    setModalToast(msg)
    setTimeout(() => setModalToast(""), 3500)
  }

  function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    if (!inviteName.trim() || !inviteEmail.trim()) return

    const newMember: Row = {
      name: inviteName.trim(),
      dept: department.name,
      email: inviteEmail.trim(),
      status: "Invited",
    }

    onUpdateEmployees([newMember, ...allEmployees])
    setInviting(false)
    flashModalToast(`Invitation email & link generated for ${inviteEmail.trim()} in ${department.name}!`)
    setInviteName("")
    setInviteEmail("")
  }

  function setMemberStatus(memberName: string, status: string) {
    onUpdateEmployees(
      allEmployees.map((e) => (e.name === memberName ? { ...e, status } : e)),
    )
    flashModalToast(
      status === "Inactive"
        ? `${memberName}'s account was deactivated and moved to Inactive Accounts.`
        : `${memberName}'s account was reactivated successfully.`,
    )
  }

  const generatedInviteLink = `https://caytori.com/invite?dept=${encodeURIComponent(
    department.name.toLowerCase(),
  )}&token=inv-${(inviteName || "new-member").toLowerCase().replace(/\W+/g, "")}-${Math.random()
    .toString(36)
    .substring(2, 7)}`

  return (
    <Modal
      open={true}
      onClose={onClose}
      title={`${department.name} Department`}
      subtitle={`Department Head: ${department.head ?? "Unassigned"}`}
      width="max-w-3xl"
    >
      <div className="space-y-6 pt-2">
        {/* Metric Cards Banner */}
        <div className="grid grid-cols-3 gap-3">
          <div className="neu-inset rounded-2xl p-4 text-center">
            <div className="text-xs font-600 text-muted-foreground">Active Members</div>
            <div className="mt-1 font-display text-2xl font-800">{activeDeptMembers.length}</div>
          </div>
          <div className="neu-inset rounded-2xl p-4 text-center">
            <div className="text-xs font-600 text-muted-foreground font-mono">Active IT Tickets</div>
            <div className="mt-1 font-display text-2xl font-800 text-warning">{activeTickets.length}</div>
          </div>
          <div className="neu-inset rounded-2xl p-4 text-center">
            <div className="text-xs font-600 text-muted-foreground">Department Status</div>
            <div className="mt-1 font-display text-sm font-700 text-primary">{department.status}</div>
          </div>
        </div>

        {/* Department Members List with Deactivate & Invite Controls */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <h4 className="font-display text-sm font-700">
              Department Members ({activeDeptMembers.length})
            </h4>
            <div className="flex items-center gap-2">
              {inactiveDeptMembers.length > 0 && (
                <Button
                  size="sm"
                  variant="surface"
                  onClick={() => setShowDeptInactiveDrawer(true)}
                >
                  <Archive size={14} /> Inactive ({inactiveDeptMembers.length})
                </Button>
              )}
              <Button size="sm" onClick={() => setInviting(true)}>
                <UserPlus size={14} /> Invite Member
              </Button>
            </div>
          </div>

          <div className="neu-flat rounded-2xl p-3 space-y-2 max-h-48 overflow-y-auto">
            {activeDeptMembers.length > 0 ? (
              activeDeptMembers.map((m) => (
                <div key={m.name} className="flex items-center justify-between p-2.5 rounded-xl neu-inset text-xs">
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <Avatar name={m.name} size={28} />
                    <div className="min-w-0">
                      <div className="font-600 text-foreground truncate">{m.name}</div>
                      <div className="text-[11px] text-muted-foreground truncate">{m.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Pill text={m.status} />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-[11px] text-muted-foreground hover:text-danger p-1.5 h-auto"
                      onClick={() => setMemberStatus(m.name, "Inactive")}
                    >
                      <UserX size={13} className="mr-1 text-danger" /> Deactivate
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-muted-foreground p-3 text-center italic">
                No active members in this department.
              </div>
            )}
          </div>
        </div>

        {/* Categorized Department IT Tickets */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <h4 className="font-display text-sm font-700">Associated IT Tickets ({deptTickets.length})</h4>

            {/* Neumorphic Categorization Pills */}
            <div className="flex items-center gap-1 neu-inset rounded-full p-1 text-[11px]">
              {[
                { key: "ACTIVE", label: `Active (${activeTickets.length})` },
                { key: "RESOLVED", label: `Resolved (${resolvedTickets.length})` },
                { key: "CLOSED", label: `Closed (${closedTickets.length})` },
                { key: "ALL", label: `All (${deptTickets.length})` },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setTicketTab(tab.key as any)}
                  className={`rounded-full px-3 py-1 font-600 transition-all duration-200 cursor-pointer ${
                    ticketTab === tab.key
                      ? "neu-flat text-primary font-700"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pt-1">
            {displayTickets.length > 0 ? (
              displayTickets.map((t) => (
                <div
                  key={t.id}
                  className="neu-flat rounded-xl p-3 flex items-center justify-between text-xs hover:bg-[color-mix(in_srgb,var(--primary)_4%,transparent)] transition-colors"
                >
                  <div className="min-w-0 pr-2">
                    <span className="font-mono font-700 text-primary mr-2">{t.id}</span>
                    <span className="font-600 text-foreground">{t.subject}</span>
                    <div className="mt-0.5 text-[11px] text-muted-foreground">
                      Reported by {t.reporter} · Category: {t.category} · Priority: {t.priority}
                    </div>
                  </div>
                  <StatusBadge status={t.status} />
                </div>
              ))
            ) : (
              <div className="text-xs text-muted-foreground neu-inset rounded-xl p-4 text-center italic">
                No {ticketTab.toLowerCase()} tickets found for this department.
              </div>
            )}
          </div>
        </div>

        {/* Footer controls */}
        <div className="flex justify-between items-center pt-3 border-t border-[var(--border)]">
          <Button variant="surface" size="sm" onClick={onToggleStatus}>
            {department.status === "Active" ? "Deactivate Department" : "Activate Department"}
          </Button>
          <Button size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      {/* Invite Member Modal */}
      <Modal
        open={inviting}
        onClose={() => setInviting(false)}
        title={`Invite Member to ${department.name}`}
        subtitle="Send an invitation email and generate a shareable registration link for this department."
      >
        <form onSubmit={handleInvite} className="space-y-4 pt-2">
          <Field label="Employee Full Name">
            <input
              required
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              placeholder="e.g. Carlos Mendoza"
              className="w-full neu-inset rounded-xl bg-transparent px-3.5 py-2.5 text-sm outline-none"
            />
          </Field>

          <Field label="Work Email Address">
            <input
              required
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="e.g. carlos@abccorp.com"
              className="w-full neu-inset rounded-xl bg-transparent px-3.5 py-2.5 text-sm outline-none"
            />
          </Field>

          {/* Invitation Link Generator */}
          <div>
            <label className="block text-xs font-600 text-muted-foreground mb-1.5">
              Generated Shareable Invitation Link
            </label>
            <div className="neu-inset rounded-xl p-2.5 flex items-center justify-between gap-2">
              <span className="font-mono text-xs text-primary truncate">
                {generatedInviteLink}
              </span>
              <Button
                type="button"
                size="sm"
                variant="surface"
                onClick={() => {
                  navigator.clipboard?.writeText(generatedInviteLink)
                  setCopiedLink(true)
                  setTimeout(() => setCopiedLink(false), 2000)
                }}
              >
                {copiedLink ? <Check size={14} className="text-accent" /> : <Copy size={14} />}
                {copiedLink ? "Copied!" : "Copy Link"}
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" variant="ghost" onClick={() => setInviting(false)}>
              Cancel
            </Button>
            <Button type="submit">
              <UserPlus size={15} /> Send Invite & Add Member
            </Button>
          </div>
        </form>
      </Modal>

      {/* Department Inactive Accounts Drawer Modal */}
      <Modal
        open={showDeptInactiveDrawer}
        onClose={() => setShowDeptInactiveDrawer(false)}
        title={`Inactive Accounts — ${department.name}`}
        subtitle="Deactivated member accounts for this department."
      >
        <div className="space-y-4 pt-2">
          <div className="space-y-2 max-h-60 overflow-y-auto neu-inset rounded-2xl p-3">
            {inactiveDeptMembers.length > 0 ? (
              inactiveDeptMembers.map((m) => (
                <div
                  key={m.name}
                  className="flex items-center justify-between p-2.5 rounded-xl neu-flat text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <Avatar name={m.name} size={28} />
                    <div>
                      <div className="font-600 text-foreground">{m.name}</div>
                      <div className="text-[11px] text-muted-foreground">{m.email}</div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="surface"
                    onClick={() => {
                      setMemberStatus(m.name, "Active")
                    }}
                  >
                    <UserCheck size={13} className="text-accent" /> Reactivate Account
                  </Button>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-muted-foreground italic">
                No inactive member accounts found in this department.
              </div>
            )}
          </div>
          <div className="flex justify-end pt-2 border-t border-[var(--border)]">
            <Button size="sm" onClick={() => setShowDeptInactiveDrawer(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      <Toast text={modalToast} />
    </Modal>
  )
}
