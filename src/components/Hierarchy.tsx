import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  ShieldCheck,
  UserPlus,
  Users,
  Building2,
  AlertTriangle,
  ChevronRight,
  UserCheck,
  UserX,
  Edit3,
  Sliders,
  Sparkles,
  ArrowRight,
  Check,
  X,
  Plus,
  Clock,
  Briefcase,
  Layers,
} from "lucide-react"
import {
  Card,
  Avatar,
  Button,
  Modal,
  Field,
  Toast,
} from "./primitives"

function Pill({ text }: { text: string }) {
  return (
    <span className="neu-inset rounded-full px-2.5 py-0.5 font-mono text-[11px] font-700 text-primary">
      {text}
    </span>
  )
}
import {
  DEPARTMENTS,
  STAFF,
  IT_HIERARCHY_TIERS,
  type EscalationTier,
  type Role,
} from "../data"

interface AdminUser {
  id: string
  name: string
  email: string
  title: string
  role: "Head of IT" | "Co-Admin" | "IT Security Lead" | "IT Dispatcher"
  department: string
  assignedAt: string
  isPrimary?: boolean
}

const INITIAL_ADMINS: AdminUser[] = [
  {
    id: "adm-1",
    name: "John Doe",
    email: "john.doe@abccorp.com",
    title: "Head of IT & Platform Administrator",
    role: "Head of IT",
    department: "IT",
    assignedAt: "2025-01-15",
    isPrimary: true,
  },
  {
    id: "adm-2",
    name: "Elena Vance",
    email: "elena.vance@abccorp.com",
    title: "VP of Finance & Co-Admin",
    role: "Co-Admin",
    department: "Finance",
    assignedAt: "2025-03-01",
  },
  {
    id: "adm-3",
    name: "Mark Villanueva",
    email: "mark.v@abccorp.com",
    title: "Senior IT Infrastructure Lead",
    role: "IT Security Lead",
    department: "IT",
    assignedAt: "2025-04-10",
  },
]

interface TierConfig {
  id: EscalationTier
  name: string
  level: number
  slaMinutes: number
  description: string
  specialists: string[]
  color: string
}

const INITIAL_TIERS: TierConfig[] = [
  {
    id: "L1",
    name: "Tier 1 — Help Desk & Triage",
    level: 1,
    slaMinutes: 15,
    description: "First line of support. Basic troubleshooting, password resets, and issue logging.",
    specialists: ["Mark Villanueva", "Leo Tan"],
    color: "var(--primary)",
  },
  {
    id: "L2",
    name: "Tier 2 — Senior Tech & Infrastructure",
    level: 2,
    slaMinutes: 45,
    description: "Advanced troubleshooting, network infrastructure, hardware diagnostics, and software configs.",
    specialists: ["Elena Vance", "John Doe"],
    color: "var(--accent)",
  },
  {
    id: "L3",
    name: "Tier 3 — Systems Architect & Security",
    level: 3,
    slaMinutes: 120,
    description: "Specialized infrastructure, database anomalies, cyber security incidents, and root-cause engineering.",
    specialists: ["John Doe", "Sam Ortega"],
    color: "var(--warning)",
  },
  {
    id: "LEAD",
    name: "IT Lead — Head of IT Executive Escalation",
    level: 4,
    slaMinutes: 30,
    description: "Executive incident command, company-wide service outages, and final policy decisions.",
    specialists: ["John Doe (Head of IT)"],
    color: "var(--danger)",
  },
]

interface DeptHead {
  department: string
  headName: string
  email: string
  membersCount: number
}

const INITIAL_DEPT_HEADS: DeptHead[] = [
  { department: "Finance", headName: "Elena Vance", email: "elena.vance@abccorp.com", membersCount: 9 },
  { department: "Human Resources", headName: "Sam Ortega", email: "sam.ortega@abccorp.com", membersCount: 4 },
  { department: "Marketing", headName: "Grace Lim", email: "grace.lim@abccorp.com", membersCount: 7 },
  { department: "Operations", headName: "Priya Nair", email: "priya.nair@abccorp.com", membersCount: 9 },
  { department: "Sales", headName: "Diego Flores", email: "diego.flores@abccorp.com", membersCount: 15 },
  { department: "IT", headName: "John Doe", email: "john.doe@abccorp.com", membersCount: 9 },
]

export default function Hierarchy({ role }: { role: Role }) {
  const [tab, setTab] = useState<"admins" | "matrix" | "departments">("admins")
  const [admins, setAdmins] = useState<AdminUser[]>(INITIAL_ADMINS)
  const [tiers, setTiers] = useState<TierConfig[]>(INITIAL_TIERS)
  const [deptHeads, setDeptHeads] = useState<DeptHead[]>(INITIAL_DEPT_HEADS)

  // Modal states
  const [showAddAdmin, setShowAddAdmin] = useState(false)
  const [showEditTier, setShowEditTier] = useState<TierConfig | null>(null)
  const [showChangeHead, setShowChangeHead] = useState<DeptHead | null>(null)
  const [toast, setToast] = useState("")

  // Form states
  const [newAdminName, setNewAdminName] = useState("")
  const [newAdminEmail, setNewAdminEmail] = useState("")
  const [newAdminRole, setNewAdminRole] = useState<AdminUser["role"]>("Co-Admin")
  const [newAdminDept, setNewAdminDept] = useState("IT")

  // Edit tier form state
  const [editSla, setEditSla] = useState(15)
  const [editSpecialistInput, setEditSpecialistInput] = useState("")

  // Edit Dept head state
  const [newHeadName, setNewHeadName] = useState("")

  function flash(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(""), 3500)
  }

  function handleAddAdmin(e: React.FormEvent) {
    e.preventDefault()
    if (!newAdminName.trim() || !newAdminEmail.trim()) return

    const newAdmin: AdminUser = {
      id: `adm-${Date.now()}`,
      name: newAdminName.trim(),
      email: newAdminEmail.trim(),
      title: `${newAdminRole} — ${newAdminDept}`,
      role: newAdminRole,
      department: newAdminDept,
      assignedAt: new Date().toISOString().split("T")[0],
    }

    if (newAdminRole === "Head of IT") {
      // Reassign primary Head of IT
      const updated: AdminUser[] = admins.map((a) =>
        a.role === "Head of IT" ? { ...a, role: "Co-Admin" as const, isPrimary: false } : a,
      )
      setAdmins([{ ...newAdmin, isPrimary: true }, ...updated])
      flash(`${newAdminName} was appointed as the new Head of IT!`)
    } else {
      setAdmins([newAdmin, ...admins])
      flash(`${newAdminName} was appointed as ${newAdminRole}.`)
    }

    setShowAddAdmin(false)
    setNewAdminName("")
    setNewAdminEmail("")
  }

  function handleDemoteAdmin(id: string, name: string) {
    setAdmins(admins.filter((a) => a.id !== id))
    flash(`${name}'s admin privileges were revoked.`)
  }

  function handleSaveTierSla() {
    if (!showEditTier) return
    setTiers(
      tiers.map((t) =>
        t.id === showEditTier.id
          ? {
              ...t,
              slaMinutes: editSla,
              specialists: editSpecialistInput.trim()
                ? editSpecialistInput.split(",").map((s) => s.trim())
                : t.specialists,
            }
          : t,
      ),
    )
    flash(`Escalation settings for ${showEditTier.name} updated successfully!`)
    setShowEditTier(null)
  }

  function handleChangeHeadSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!showChangeHead || !newHeadName.trim()) return

    setDeptHeads(
      deptHeads.map((d) =>
        d.department === showChangeHead.department
          ? {
              ...d,
              headName: newHeadName.trim(),
              email: `${newHeadName.toLowerCase().replace(/\s+/g, ".")}@abccorp.com`,
            }
          : d,
      ),
    )

    flash(`${newHeadName.trim()} is now the Department Head of ${showChangeHead.department}!`)
    setShowChangeHead(null)
    setNewHeadName("")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full space-y-6"
    >
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-700 tracking-tight">
              Roles & Escalation Hierarchy
            </h1>
            <span className="neu-inset rounded-full px-3 py-1 text-xs font-mono font-700 text-primary">
              Universal Hierarchy
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure company administrators, IT team leaders, department heads, and multi-tier escalation pathways.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => setShowAddAdmin(true)}>
            <UserPlus size={15} /> Assign / Add Admin
          </Button>
        </div>
      </div>

      {/* Top Segmented Navigation Tabs */}
      <div className="flex items-center gap-1 neu-inset rounded-full p-1.5 text-xs max-w-fit">
        <button
          type="button"
          onClick={() => setTab("admins")}
          className={`rounded-full px-5 py-2 font-600 transition-all cursor-pointer ${
            tab === "admins"
              ? "neu-flat text-primary font-700 shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          👑 Company Admins & IT Leaders ({admins.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("matrix")}
          className={`rounded-full px-5 py-2 font-600 transition-all cursor-pointer ${
            tab === "matrix"
              ? "neu-flat text-primary font-700 shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          ⚡ Escalation Matrix (4 Tiers)
        </button>
        <button
          type="button"
          onClick={() => setTab("departments")}
          className={`rounded-full px-5 py-2 font-600 transition-all cursor-pointer ${
            tab === "departments"
              ? "neu-flat text-primary font-700 shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          🏢 Department Heads ({deptHeads.length})
        </button>
      </div>

      {/* TAB 1: Company Admins & IT Leaders */}
      {tab === "admins" && (
        <div className="space-y-4">
          <div className="neu-flat rounded-2xl p-5 border border-[var(--border)] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-700 text-base">Active Company Administrators</h3>
                <p className="text-xs text-muted-foreground">
                  Head of IT and designated administrators authorized to manage organization policies and user accounts.
                </p>
              </div>
              <Button size="sm" variant="surface" onClick={() => setShowAddAdmin(true)}>
                <Plus size={14} /> Add Co-Admin
              </Button>
            </div>

            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {admins.map((adm) => (
                <div key={adm.id} className="neu-inset rounded-2xl p-4 space-y-3 relative">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={adm.name} size={36} />
                      <div>
                        <div className="font-600 text-foreground font-display text-sm flex items-center gap-1.5">
                          {adm.name}
                          {adm.isPrimary && (
                            <span className="neu-flat text-[10px] font-700 font-mono px-2 py-0.5 rounded-full text-accent">
                              Primary Head
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">{adm.email}</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[11px] text-muted-foreground block">Assigned Role</span>
                      <span className="font-700 text-primary font-display">{adm.role}</span>
                    </div>
                    {!adm.isPrimary && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-[11px] text-muted-foreground hover:text-danger p-1 h-auto"
                        onClick={() => handleDemoteAdmin(adm.id, adm.name)}
                      >
                        <UserX size={13} className="mr-1 text-danger" /> Revoke Admin
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: IT Escalation Hierarchy Matrix */}
      {tab === "matrix" && (
        <div className="space-y-4">
          <div className="neu-flat rounded-2xl p-5 border border-[var(--border)] space-y-4">
            <div>
              <h3 className="font-display font-700 text-base">Universal 4-Tier IT Escalation Matrix</h3>
              <p className="text-xs text-muted-foreground">
                Automatic response pathways from Tier 1 triage to Head of IT executive escalation.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {tiers.map((t) => (
                <div key={t.id} className="neu-inset rounded-2xl p-4 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className="neu-flat rounded-full px-3 py-1 font-mono text-xs font-800"
                        style={{ color: t.color }}
                      >
                        {t.id}
                      </span>
                      <div className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
                        <Clock size={13} /> {t.slaMinutes}m SLA
                      </div>
                    </div>

                    <div>
                      <h4 className="font-display font-700 text-sm text-foreground">{t.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {t.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[var(--border)]">
                      <span className="text-[11px] font-600 text-muted-foreground block mb-1">
                        Designated Tier Specialists:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {t.specialists.map((s) => (
                          <span key={s} className="neu-flat rounded-full px-2.5 py-1 text-[11px] font-500 text-foreground">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="surface"
                    onClick={() => {
                      setShowEditTier(t)
                      setEditSla(t.slaMinutes)
                      setEditSpecialistInput(t.specialists.join(", "))
                    }}
                    className="w-full text-xs"
                  >
                    <Sliders size={13} /> Configure SLA & Specialists
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Department Heads Roster */}
      {tab === "departments" && (
        <div className="space-y-4">
          <div className="neu-flat rounded-2xl p-5 border border-[var(--border)] space-y-4">
            <div>
              <h3 className="font-display font-700 text-base">Department Leadership Roster</h3>
              <p className="text-xs text-muted-foreground">
                Assigned department heads responsible for member management and ticket approvals.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {deptHeads.map((dh) => (
                <div key={dh.department} className="neu-inset rounded-2xl p-4 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <Avatar name={dh.headName} size={36} />
                    <div>
                      <div className="font-600 text-foreground font-display text-sm">{dh.department}</div>
                      <div className="text-xs text-muted-foreground">
                        Head: <span className="font-600 text-foreground">{dh.headName}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="surface"
                    onClick={() => {
                      setShowChangeHead(dh)
                      setNewHeadName(dh.headName)
                    }}
                    className="text-xs"
                  >
                    <Edit3 size={13} /> Change Head
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add / Promote Admin Modal */}
      <Modal
        open={showAddAdmin}
        onClose={() => setShowAddAdmin(false)}
        title="Assign / Promote Company Admin"
        subtitle="Appoint a new administrator or assign the Head of IT leadership role."
      >
        <form onSubmit={handleAddAdmin} className="space-y-4 pt-2">
          <Field label="Full Name">
            <input
              required
              value={newAdminName}
              onChange={(e) => setNewAdminName(e.target.value)}
              placeholder="e.g. Maria Santos"
              className="w-full neu-inset rounded-xl bg-transparent px-3.5 py-2.5 text-sm outline-none"
            />
          </Field>

          <Field label="Work Email">
            <input
              required
              type="email"
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              placeholder="e.g. maria@abccorp.com"
              className="w-full neu-inset rounded-xl bg-transparent px-3.5 py-2.5 text-sm outline-none"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-500 text-muted-foreground mb-1">Administrative Role</label>
              <div className="neu-inset rounded-xl p-1">
                <select
                  value={newAdminRole}
                  onChange={(e) => setNewAdminRole(e.target.value as any)}
                  className="w-full bg-transparent px-2 py-2 text-xs outline-none font-600"
                >
                  <option value="Head of IT">Head of IT (Primary)</option>
                  <option value="Co-Admin">Co-Administrator</option>
                  <option value="IT Security Lead">IT Security Lead</option>
                  <option value="IT Dispatcher">IT Dispatcher</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-500 text-muted-foreground mb-1">Department</label>
              <div className="neu-inset rounded-xl p-1">
                <select
                  value={newAdminDept}
                  onChange={(e) => setNewAdminDept(e.target.value)}
                  className="w-full bg-transparent px-2 py-2 text-xs outline-none font-600"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" variant="ghost" onClick={() => setShowAddAdmin(false)}>
              Cancel
            </Button>
            <Button type="submit">
              <UserCheck size={15} /> Confirm & Appoint Admin
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Tier SLA & Specialists Modal */}
      <Modal
        open={!!showEditTier}
        onClose={() => setShowEditTier(null)}
        title={`Configure ${showEditTier?.name}`}
        subtitle="Set SLA response targets and assigned tier specialists."
      >
        <div className="space-y-4 pt-2">
          <Field label="SLA Target (Minutes)">
            <input
              type="number"
              value={editSla}
              onChange={(e) => setEditSla(Number(e.target.value))}
              className="w-full neu-inset rounded-xl bg-transparent px-3.5 py-2.5 text-sm outline-none font-mono"
            />
          </Field>

          <Field label="Designated Tier Specialists (Comma Separated)">
            <input
              value={editSpecialistInput}
              onChange={(e) => setEditSpecialistInput(e.target.value)}
              placeholder="e.g. John Doe, Mark Villanueva"
              className="w-full neu-inset rounded-xl bg-transparent px-3.5 py-2.5 text-sm outline-none"
            />
          </Field>

          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" variant="ghost" onClick={() => setShowEditTier(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTierSla}>
              <Check size={15} /> Save Tier Configurations
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reassign Department Head Modal */}
      <Modal
        open={!!showChangeHead}
        onClose={() => setShowChangeHead(null)}
        title={`Reassign Department Head — ${showChangeHead?.department}`}
        subtitle="Appoint a new department head to oversee members and ticket approvals."
      >
        <form onSubmit={handleChangeHeadSubmit} className="space-y-4 pt-2">
          <Field label="New Department Head Full Name">
            <input
              required
              value={newHeadName}
              onChange={(e) => setNewHeadName(e.target.value)}
              placeholder="e.g. Rachel Green"
              className="w-full neu-inset rounded-xl bg-transparent px-3.5 py-2.5 text-sm outline-none"
            />
          </Field>

          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" variant="ghost" onClick={() => setShowChangeHead(null)}>
              Cancel
            </Button>
            <Button type="submit">
              <UserCheck size={15} /> Reassign Head
            </Button>
          </div>
        </form>
      </Modal>

      <Toast text={toast} />
    </motion.div>
  )
}
