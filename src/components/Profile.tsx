import { useState } from "react"
import { motion } from "motion/react"
import { LogOut, ShieldCheck, UserCheck, KeyRound } from "lucide-react"
import {
  Avatar,
  Button,
  Card,
  Field,
  Section,
  SettingRow,
  Toggle,
  Toast,
} from "./primitives"
import { CURRENT_USER, ROLES, type Role } from "../data"

export default function Profile({
  role,
  onSignOut,
}: {
  role: Role
  onSignOut: () => void
}) {
  const me = CURRENT_USER[role]
  const [toast, setToast] = useState("")
  const [mentions, setMentions] = useState(true)
  const [assigned, setAssigned] = useState(true)

  function save() {
    setToast("Profile updated.")
    setTimeout(() => setToast(""), 3000)
  }

  const roleMeta = ROLES.find((r) => r.id === role)!

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full space-y-6"
    >
      <div>
        <h1 className="font-display text-2xl font-700 tracking-tight">
          Profile & account
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your personal information and preferences.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] items-start">
        {/* Main Details Form */}
        <div className="space-y-5">
          <Section title="Your details">
            <div className="flex items-center gap-4">
              <Avatar name={me.name} size={64} />
              <div>
                <div className="font-display text-lg font-600">{me.name}</div>
                <div className="text-sm text-muted-foreground">
                  {roleMeta.label} · {me.department}
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name">
                <input
                  defaultValue={me.name}
                  className="w-full bg-transparent text-sm outline-none"
                />
              </Field>
              <Field label="Email">
                <input
                  defaultValue={me.email}
                  className="w-full bg-transparent text-sm outline-none"
                />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Department">
                <input
                  defaultValue={me.department}
                  disabled
                  className="w-full bg-transparent text-sm text-muted-foreground outline-none"
                />
              </Field>
              <Field label="System role">
                <input
                  defaultValue={roleMeta.label}
                  disabled
                  className="w-full bg-transparent text-sm text-muted-foreground outline-none"
                />
              </Field>
            </div>
          </Section>

          <Section title="Change password">
            <Field label="Current password">
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-transparent text-sm outline-none"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="New password">
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </Field>
              <Field label="Confirm new password">
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </Field>
            </div>
          </Section>

          <Section title="My notifications">
            <SettingRow
              label="Tickets assigned to me"
              hint="Get notified when a ticket lands in your queue."
            >
              <Toggle on={assigned} onChange={setAssigned} />
            </SettingRow>
            <SettingRow
              label="Comments & mentions"
              hint="When someone replies on a ticket you follow."
            >
              <Toggle on={mentions} onChange={setMentions} />
            </SettingRow>
          </Section>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button variant="surface" onClick={onSignOut}>
              <LogOut size={15} /> Sign out
            </Button>
            <Button onClick={save}>Save changes</Button>
          </div>
        </div>

        {/* Right Sidebar Account Card */}
        <div className="space-y-5">
          <Card className="p-6 text-center space-y-4">
            <div className="mx-auto w-max">
              <Avatar name={me.name} size={72} />
            </div>
            <div>
              <h3 className="font-display font-700 text-lg">{me.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{me.email}</p>
            </div>
            <div className="neu-inset flex items-center justify-around rounded-xl p-3 text-xs">
              <div>
                <span className="block text-muted-foreground text-[10px]">ROLE</span>
                <span className="font-600 font-mono text-primary mt-0.5 block">{roleMeta.label}</span>
              </div>
              <div className="h-6 w-px bg-[var(--border)]" />
              <div>
                <span className="block text-muted-foreground text-[10px]">DEPT</span>
                <span className="font-600 font-mono mt-0.5 block">{me.department}</span>
              </div>
            </div>
          </Card>

          <Card className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-primary" />
              <h3 className="font-display font-600 text-sm">Account Security</h3>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-[var(--border)]">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <UserCheck size={13} /> Status
                </span>
                <span className="font-mono text-primary font-600">Active</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[var(--border)]">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <KeyRound size={13} /> Authentication
                </span>
                <span className="font-mono font-600">Password / SSO</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Toast text={toast} />
    </motion.div>
  )
}
