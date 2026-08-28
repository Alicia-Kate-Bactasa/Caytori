import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  ShieldCheck,
  UserPlus,
  Users,
  Building2,
  AlertTriangle,
  UserCheck,
  UserX,
  Edit3,
  Sliders,
  Check,
  Plus,
  Clock,
  Lock,
  Headphones,
  Wrench,
  Crown,
} from "lucide-react"
import {
  Card,
  Avatar,
  Button,
  Modal,
  Field,
  Toast,
} from "./primitives"
import {
  DEPARTMENTS,
  STAFF,
  IT_HIERARCHY_TIERS,
  type EscalationTier,
  type Role,
} from "../data"

interface ITRoleDefinition {
  id: string
  title: string
  levelLabel: string
  badgeColor: string
  icon: typeof Crown
  description: string
  handlesWhat: string
  members: { name: string; email: string; isPrimary?: boolean }[]
}

const INITIAL_IT_ROLES: ITRoleDefinition[] = [
  {
    id: "helpdesk",
    title: "IT Help Desk Specialist",
    levelLabel: "Level 1 — Frontline Support",
    badgeColor: "var(--primary)",
    icon: Headphones,
    description: "First point of contact for employee IT requests.",
    handlesWhat: "Handles Level 1 initial triage, password resets, and account access.",
    members: [{ name: "Mark Villanueva", email: "mark@abccorp.com" }],
  },
  {
    id: "senior",
    title: "Senior IT Systems Engineer",
    levelLabel: "Level 2 & Level 3 — Senior Support",
    badgeColor: "var(--warning)",
    icon: Wrench,
    description: "Advanced technical specialist for servers, networks, and databases.",
    handlesWhat: "Handles Level 2 & Level 3 complex escalations and infrastructure alerts.",
    members: [
      { name: "Anna Cruz", email: "anna@abccorp.com" },
      { name: "Leo Tan", email: "leo@abccorp.com" },
    ],
  },
  {
    id: "head",
    title: "Head of IT",
    levelLabel: "Level 4 — Lead Executive",
    badgeColor: "var(--danger)",
    icon: Crown,
    description: "Overall IT department leader and company administrator.",
    handlesWhat: "Handles critical outages, security breaches, and Level 4 escalations.",
    members: [{ name: "John Doe", email: "john@abccorp.com", isPrimary: true }],
  },
]

interface LevelConfig {
  id: EscalationTier
  name: string
  level: number
  slaMinutes: number
  description: string
  assignedStaff: string[]
  color: string
}

const INITIAL_LEVELS: LevelConfig[] = [
  {
    id: "L1",
    name: "Level 1 — Basic Support",
    level: 1,
    slaMinutes: 15,
    description: "Password resets, account access, and general user help.",
    assignedStaff: ["Mark Villanueva"],
    color: "var(--primary)",
  },
  {
    id: "L2",
    name: "Level 2 — Advanced IT",
    level: 2,
    slaMinutes: 45,
    description: "Software glitches, hardware diagnostics, and network issues.",
    assignedStaff: ["Anna Cruz"],
    color: "var(--accent)",
  },
  {
    id: "L3",
    name: "Level 3 — IT Experts",
    level: 3,
    slaMinutes: 120,
    description: "Complex system problems, databases, and security alerts.",
    assignedStaff: ["Leo Tan"],
    color: "var(--warning)",
  },
  {
    id: "LEAD",
    name: "Level 4 — Head of IT",
    level: 4,
    slaMinutes: 30,
    description: "Urgent company outages and high-priority escalation.",
    assignedStaff: ["John Doe (Head of IT)"],
    color: "var(--danger)",
  },
]

interface DeptHead {
  department: string
  headName: string
  email: string
}

const INITIAL_DEPT_HEADS: DeptHead[] = [
  { department: "Finance", headName: "Elena Vance", email: "elena.vance@abccorp.com" },
  { department: "Human Resources", headName: "Sam Ortega", email: "sam.ortega@abccorp.com" },
  { department: "Marketing", headName: "Grace Lim", email: "grace.lim@abccorp.com" },
  { department: "Operations", headName: "Priya Nair", email: "priya.nair@abccorp.com" },
  { department: "Sales", headName: "Diego Flores", email: "diego.flores@abccorp.com" },
  { department: "IT", headName: "John Doe", email: "john.doe@abccorp.com" },
]

export default function Hierarchy({ role }: { role: Role }) {
  const [tab, setTab] = useState<"roles" | "levels" | "departments">("roles")
  const [itRoles, setItRoles] = useState<ITRoleDefinition[]>(INITIAL_IT_ROLES)
  const [levels, setLevels] = useState<LevelConfig[]>(INITIAL_LEVELS)
  const [deptHeads, setDeptHeads] = useState<DeptHead[]>(INITIAL_DEPT_HEADS)

  // Modal states
  const [showAssignMember, setShowAssignMember] = useState<ITRoleDefinition | null>(null)
  const [showEditLevel, setShowEditLevel] = useState<LevelConfig | null>(null)
  const [showChangeHead, setShowChangeHead] = useState<DeptHead | null>(null)
  const [toast, setToast] = useState("")

  // Form states
  const [memberName, setMemberName] = useState("")
  const [memberEmail, setMemberEmail] = useState("")

  // Edit level state
  const [editSla, setEditSla] = useState(15)
  const [editStaffInput, setEditStaffInput] = useState("")

  // Edit Head state
  const [newHeadName, setNewHeadName] = useState("")

  function flash(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(""), 3500)
  }

  function handleAssignMemberSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!showAssignMember || !memberName.trim() || !memberEmail.trim()) return

    setItRoles(
      itRoles.map((r) =>
        r.id === showAssignMember.id
          ? {
              ...r,
              members: [...r.members, { name: memberName.trim(), email: memberEmail.trim() }],
            }
          : r,
      ),
    )

    flash(`${memberName.trim()} assigned as ${showAssignMember.title}!`)
    setShowAssignMember(null)
    setMemberName("")
    setMemberEmail("")
  }

  function handleSaveLevel() {
    if (!showEditLevel) return
    setLevels(
      levels.map((l) =>
        l.id === showEditLevel.id
          ? {
              ...l,
              slaMinutes: editSla,
              assignedStaff: editStaffInput.trim()
                ? editStaffInput.split(",").map((s) => s.trim())
                : l.assignedStaff,
            }
          : l,
      ),
    )
    flash(`Settings for ${showEditLevel.name} updated!`)
    setShowEditLevel(null)
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

    flash(`${newHeadName.trim()} is now Head of ${showChangeHead.department}!`)
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
      {/* Header & Multi-Tenant Isolation Banner */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-700 tracking-tight">
              IT Roles & Support Escalations
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Clear IT role designations and automated support escalation pathways.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="neu-flat rounded-full px-3.5 py-1.5 text-xs font-mono font-600 text-primary flex items-center gap-1.5">
              <Lock size={13} className="text-accent" /> Company Isolated: ABC Corporation
            </span>
          </div>
        </div>
      </div>

      {/* Top Navigation Tabs */}
      <div className="flex items-center gap-1 neu-inset rounded-full p-1.5 text-xs max-w-fit">
        <button
          type="button"
          onClick={() => setTab("roles")}
          className={`rounded-full px-5 py-2 font-600 transition-all cursor-pointer ${
            tab === "roles"
              ? "neu-flat text-primary font-700 shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          IT Roles & Designations
        </button>
        <button
          type="button"
          onClick={() => setTab("levels")}
          className={`rounded-full px-5 py-2 font-600 transition-all cursor-pointer ${
            tab === "levels"
              ? "neu-flat text-primary font-700 shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Support Escalation Pathways (Levels 1–4)
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
          Department Heads
        </button>
      </div>

      {/* TAB 1: IT Roles & Responsibilities */}
      {tab === "roles" && (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {itRoles.map((roleDef) => {
              const IconComp = roleDef.icon
              return (
                <div key={roleDef.id} className="neu-flat rounded-2xl p-5 border border-[var(--border)] space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="neu-inset rounded-xl p-2.5">
                        <IconComp size={20} className="text-primary" />
                      </div>
                      <span
                        className="neu-inset rounded-full px-2.5 py-0.5 font-mono text-[10px] font-700"
                        style={{ color: roleDef.badgeColor }}
                      >
                        {roleDef.levelLabel}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display font-700 text-base text-foreground">{roleDef.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {roleDef.description}
                      </p>
                    </div>

                    <div className="neu-inset rounded-xl p-3 text-xs leading-relaxed text-foreground">
                      <span className="font-600 text-primary block mb-0.5">What they handle:</span>
                      {roleDef.handlesWhat}
                    </div>

                    <div className="pt-2 border-t border-[var(--border)] space-y-2">
                      <span className="text-[11px] font-600 text-muted-foreground block">
                        Assigned Staff Members ({roleDef.members.length}):
                      </span>
                      <div className="space-y-1.5">
                        {roleDef.members.map((m) => (
                          <div key={m.name} className="flex items-center justify-between neu-inset rounded-xl p-2 text-xs">
                            <div className="flex items-center gap-2">
                              <Avatar name={m.name} size={24} />
                              <div>
                                <span className="font-600 text-foreground">{m.name}</span>
                                <span className="text-[10px] text-muted-foreground block">{m.email}</span>
                              </div>
                            </div>
                            {m.isPrimary && (
                              <span className="text-[10px] font-700 text-accent font-mono">
                                Primary Admin
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="surface"
                    onClick={() => setShowAssignMember(roleDef)}
                    className="w-full text-xs mt-3"
                  >
                    <UserPlus size={14} /> Add Member to {roleDef.title}
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Support Escalation Pathways */}
      {tab === "levels" && (
        <div className="space-y-4">
          <div className="neu-flat rounded-2xl p-5 border border-[var(--border)] space-y-4">
            <div>
              <h3 className="font-display font-700 text-base">Support Escalation Pathway (Levels 1–4)</h3>
              <p className="text-xs text-muted-foreground">
                When a ticket cannot be resolved at a lower level, it is escalated to the next specialist level.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {levels.map((lvl) => (
                <div key={lvl.id} className="neu-inset rounded-2xl p-4 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className="neu-flat rounded-full px-3 py-1 font-mono text-xs font-800"
                        style={{ color: lvl.color }}
                      >
                        {lvl.id}
                      </span>
                      <div className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
                        <Clock size={13} /> {lvl.slaMinutes}m SLA
                      </div>
                    </div>

                    <div>
                      <h4 className="font-display font-700 text-sm text-foreground">{lvl.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {lvl.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[var(--border)]">
                      <span className="text-[11px] font-600 text-muted-foreground block mb-1">
                        Assigned Specialists:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {lvl.assignedStaff.map((s) => (
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
                      setShowEditLevel(lvl)
                      setEditSla(lvl.slaMinutes)
                      setEditStaffInput(lvl.assignedStaff.join(", "))
                    }}
                    className="w-full text-xs"
                  >
                    <Sliders size={13} /> Edit Level & SLA
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Department Heads */}
      {tab === "departments" && (
        <div className="space-y-4">
          <div className="neu-flat rounded-2xl p-5 border border-[var(--border)] space-y-4">
            <div>
              <h3 className="font-display font-700 text-base">Department Heads</h3>
              <p className="text-xs text-muted-foreground">
                Assigned leaders for each company department in ABC Corporation.
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

      {/* Assign Member to Role Modal */}
      <Modal
        open={!!showAssignMember}
        onClose={() => setShowAssignMember(null)}
        title={`Assign Member to ${showAssignMember?.title}`}
        subtitle={`Add an IT staff member to ${showAssignMember?.title}`}
      >
        <form onSubmit={handleAssignMemberSubmit} className="space-y-4 pt-2">
          <Field label="Staff Member Full Name">
            <input
              required
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              placeholder="e.g. Carlos Rivera"
              className="w-full neu-inset rounded-xl bg-transparent px-3.5 py-2.5 text-sm outline-none"
            />
          </Field>

          <Field label="Work Email Address">
            <input
              required
              type="email"
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
              placeholder="e.g. carlos@abccorp.com"
              className="w-full neu-inset rounded-xl bg-transparent px-3.5 py-2.5 text-sm outline-none"
            />
          </Field>

          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" variant="ghost" onClick={() => setShowAssignMember(null)}>
              Cancel
            </Button>
            <Button type="submit">
              <UserCheck size={15} /> Confirm Assignment
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Level Modal */}
      <Modal
        open={!!showEditLevel}
        onClose={() => setShowEditLevel(null)}
        title={`Configure ${showEditLevel?.name}`}
        subtitle="Set SLA response time target and assigned specialists."
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

          <Field label="Assigned Specialists (Comma Separated)">
            <input
              value={editStaffInput}
              onChange={(e) => setEditStaffInput(e.target.value)}
              placeholder="e.g. Mark Villanueva, Leo Tan"
              className="w-full neu-inset rounded-xl bg-transparent px-3.5 py-2.5 text-sm outline-none"
            />
          </Field>

          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" variant="ghost" onClick={() => setShowEditLevel(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveLevel}>
              <Check size={15} /> Save Level Settings
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reassign Department Head Modal */}
      <Modal
        open={!!showChangeHead}
        onClose={() => setShowChangeHead(null)}
        title={`Reassign Head of ${showChangeHead?.department}`}
        subtitle="Appoint a new department head."
      >
        <form onSubmit={handleChangeHeadSubmit} className="space-y-4 pt-2">
          <Field label="New Head Full Name">
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
              <UserCheck size={15} /> Confirm Head Reassignment
            </Button>
          </div>
        </form>
      </Modal>

      <Toast text={toast} />
    </motion.div>
  )
}
