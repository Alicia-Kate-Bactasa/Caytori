import { useState } from "react"
import { motion } from "motion/react"
import { Plus, X, ShieldCheck, CheckCircle2, Info } from "lucide-react"
import { Button, Card, Field, Section, SettingRow, Toggle, Toast } from "./primitives"
import { CATEGORIES, type Role } from "../data"

export default function Settings({
  role,
  allowSelfReg = true,
  onToggleSelfReg,
}: {
  role: Role
  allowSelfReg?: boolean
  onToggleSelfReg?: (val: boolean) => void
}) {
  const isPlatform = role === "platform_admin"
  const [toast, setToast] = useState("")
  const [cats, setCats] = useState<string[]>([...CATEGORIES])
  const [newCat, setNewCat] = useState("")

  // toggles
  const [enforce2fa, setEnforce2fa] = useState(true)
  const [allowReopen, setAllowReopen] = useState(true)
  const [autoClose, setAutoClose] = useState(true)
  const [emailNotif, setEmailNotif] = useState(true)
  const [digest, setDigest] = useState(false)

  function save() {
    setToast("Settings saved successfully.")
    setTimeout(() => setToast(""), 3000)
  }

  function addCat() {
    const c = newCat.trim()
    if (c && !cats.includes(c)) setCats([...cats, c])
    setNewCat("")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full space-y-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-700 tracking-tight">
            {isPlatform ? "Caytori Settings" : "Company Settings"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isPlatform
              ? "Global configuration for the Caytori platform."
              : "Configure how IT support works across your company."}
          </p>
        </div>
        <Button onClick={save}>Save changes</Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] items-start">
        {/* Main Settings Column */}
        <div className="space-y-5">
          {isPlatform ? (
            <>
              <Section title="Platform identity">
                <Field label="Platform name (Final / Read-only)">
                  <input
                    value="Caytori"
                    readOnly
                    disabled
                    className="w-full bg-transparent text-sm text-muted-foreground font-600 outline-none cursor-not-allowed select-none"
                  />
                </Field>
                <Field label="Support email">
                  <input
                    defaultValue="support@caytori.com"
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </Field>
              </Section>

              <Section
                title="Company registration"
                description="Control how new tenant companies join the platform."
              >
                <SettingRow
                  label="Allow self-registration"
                  hint="Companies can sign up without an invite from Caytori."
                >
                  <Toggle
                    on={allowSelfReg}
                    onChange={(val) => {
                      if (onToggleSelfReg) onToggleSelfReg(val)
                      setToast(`Self-registration is now ${val ? "enabled" : "disabled"}.`)
                      setTimeout(() => setToast(""), 3000)
                    }}
                  />
                </SettingRow>
                <SettingRow
                  label="Default trial length"
                  hint="Days before a new company requires activation."
                >
                  <div className="neu-inset rounded-xl px-3 py-1.5">
                    <input
                      defaultValue="30"
                      className="w-16 bg-transparent text-sm outline-none"
                    />
                  </div>
                </SettingRow>
              </Section>
            </>
          ) : (
            <>
              <Section title="Company profile">
                <Field label="Company name">
                  <input
                    defaultValue="ABC Corporation"
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Contact email">
                    <input
                      defaultValue="it@abccorp.com"
                      className="w-full bg-transparent text-sm outline-none"
                    />
                  </Field>
                  <Field label="Contact number">
                    <input
                      defaultValue="+63 917 555 0134"
                      className="w-full bg-transparent text-sm outline-none"
                    />
                  </Field>
                </div>
                <Field label="Address">
                  <input
                    defaultValue="128 Ayala Ave, Makati City"
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </Field>
              </Section>

              <Section
                title="Ticket categories"
                description="The categories employees can choose when reporting an issue."
              >
                <div className="flex flex-wrap gap-2">
                  {cats.map((c) => (
                    <span
                      key={c}
                      className="neu-flat inline-flex items-center gap-1.5 rounded-full py-1.5 pl-3 pr-2 text-sm"
                    >
                      {c}
                      <button
                        onClick={() => setCats(cats.filter((x) => x !== c))}
                        aria-label={`Remove ${c}`}
                        className="grid h-4 w-4 place-items-center rounded-full text-muted-foreground hover:text-foreground"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <div className="neu-inset flex-1 rounded-xl px-3.5 py-2.5">
                    <input
                      value={newCat}
                      onChange={(e) => setNewCat(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addCat())
                      }
                      placeholder="Add a category…"
                      className="w-full bg-transparent text-sm outline-none"
                    />
                  </div>
                  <Button variant="surface" onClick={addCat}>
                    <Plus size={15} /> Add
                  </Button>
                </div>
              </Section>

              <Section
                title="Ticket rules"
                description="Defaults and behavior for the ticket lifecycle."
              >
                <SettingRow
                  label="Default priority"
                  hint="Applied when an employee doesn't set one."
                >
                  <div className="neu-inset rounded-xl px-3 py-1.5">
                    <select
                      defaultValue="Medium"
                      className="bg-transparent text-sm outline-none"
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                </SettingRow>
                <SettingRow
                  label="Allow employees to reopen"
                  hint="Reopen a resolved ticket if it isn't actually fixed."
                >
                  <Toggle on={allowReopen} onChange={setAllowReopen} />
                </SettingRow>
                <SettingRow
                  label="Auto-close resolved tickets"
                  hint="Close after 7 days without a reopen."
                >
                  <Toggle on={autoClose} onChange={setAutoClose} />
                </SettingRow>
              </Section>
            </>
          )}

          <Section
            title="Notifications"
            description="How Caytori keeps people informed."
          >
            <SettingRow
              label="Email notifications"
              hint="Ticket assignments, status changes, and comments."
            >
              <Toggle on={emailNotif} onChange={setEmailNotif} />
            </SettingRow>
            <SettingRow
              label="Daily digest"
              hint="A morning summary of open and critical tickets."
            >
              <Toggle on={digest} onChange={setDigest} />
            </SettingRow>
          </Section>

          <Section
            title="Security"
            description="Access and authentication controls."
          >
            <SettingRow
              label="Enforce two-factor authentication"
              hint="Require 2FA for all IT and admin accounts."
            >
              <Toggle on={enforce2fa} onChange={setEnforce2fa} />
            </SettingRow>
            <SettingRow
              label="Session timeout"
              hint="Automatically sign users out after inactivity."
            >
              <div className="neu-inset rounded-xl px-3 py-1.5">
                <select
                  defaultValue="30 min"
                  className="bg-transparent text-sm outline-none"
                >
                  <option>15 min</option>
                  <option>30 min</option>
                  <option>1 hour</option>
                  <option>4 hours</option>
                </select>
              </div>
            </SettingRow>
          </Section>

          <div className="flex justify-end">
            <Button onClick={save}>Save changes</Button>
          </div>
        </div>

        {/* Right Info Sidebar */}
        <div className="space-y-5">
          <Card className="p-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <ShieldCheck size={18} className="text-primary" />
              <h3 className="font-display font-600 text-base">System Overview</h3>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="neu-inset flex items-center justify-between rounded-xl p-3">
                <span className="text-muted-foreground">Tenant Mode</span>
                <span className="font-mono font-600 text-primary">Multi-Tenant Isolated</span>
              </div>
              <div className="neu-inset flex items-center justify-between rounded-xl p-3">
                <span className="text-muted-foreground">Security Policy</span>
                <span className="font-mono font-600">{enforce2fa ? "2FA Enforced" : "2FA Optional"}</span>
              </div>
              <div className="neu-inset flex items-center justify-between rounded-xl p-3">
                <span className="text-muted-foreground">Active Categories</span>
                <span className="font-mono font-600">{cats.length} Categories</span>
              </div>
            </div>
          </Card>

          <Card className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Info size={16} className="text-primary" />
              <h3 className="font-display font-600 text-sm">Configuration Tips</h3>
            </div>
            <ul className="space-y-2.5 text-xs text-muted-foreground leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-primary" />
                <span>Keep ticket categories clear and structured for accurate team routing.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-primary" />
                <span>Auto-closing resolved tickets after 7 days maintains clean resolution metrics.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-primary" />
                <span>Enforcing 2FA protects sensitive internal IT requests and access logs.</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>

      <Toast text={toast} />
    </motion.div>
  )
}
