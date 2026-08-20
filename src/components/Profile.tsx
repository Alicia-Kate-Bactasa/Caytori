import { useState } from "react";
import { motion } from "motion/react";
import { LogOut } from "lucide-react";
import { Avatar, Button, Field, Section, SettingRow, Toggle, Toast } from "./primitives";
import { CURRENT_USER, ROLES, type Role } from "../data";

export default function Profile({ role, onSignOut }: { role: Role; onSignOut: () => void }) {
  const me = CURRENT_USER[role];
  const [toast, setToast] = useState("");
  const [mentions, setMentions] = useState(true);
  const [assigned, setAssigned] = useState(true);

  function save() {
    setToast("Profile updated.");
    setTimeout(() => setToast(""), 3000);
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="max-w-3xl">
      <h1 className="font-display text-2xl font-700 tracking-tight">Profile & account</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage your personal information and preferences.</p>

      <div className="mt-6 space-y-5">
        <Section title="Your details">
          <div className="flex items-center gap-4">
            <Avatar name={me.name} size={64} />
            <div>
              <div className="font-display text-lg font-600">{me.name}</div>
              <div className="text-sm text-muted-foreground">{ROLES.find((r) => r.id === role)!.label} · {me.department}</div>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name"><input defaultValue={me.name} className="w-full bg-transparent text-sm outline-none" /></Field>
            <Field label="Email"><input defaultValue={me.email} className="w-full bg-transparent text-sm outline-none" /></Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Department"><input defaultValue={me.department} disabled className="w-full bg-transparent text-sm text-muted-foreground outline-none" /></Field>
            <Field label="System role"><input defaultValue={ROLES.find((r) => r.id === role)!.label} disabled className="w-full bg-transparent text-sm text-muted-foreground outline-none" /></Field>
          </div>
        </Section>

        <Section title="Change password">
          <Field label="Current password"><input type="password" placeholder="••••••••" className="w-full bg-transparent text-sm outline-none" /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="New password"><input type="password" placeholder="••••••••" className="w-full bg-transparent text-sm outline-none" /></Field>
            <Field label="Confirm new password"><input type="password" placeholder="••••••••" className="w-full bg-transparent text-sm outline-none" /></Field>
          </div>
        </Section>

        <Section title="My notifications">
          <SettingRow label="Tickets assigned to me" hint="Get notified when a ticket lands in your queue.">
            <Toggle on={assigned} onChange={setAssigned} />
          </SettingRow>
          <SettingRow label="Comments & mentions" hint="When someone replies on a ticket you follow.">
            <Toggle on={mentions} onChange={setMentions} />
          </SettingRow>
        </Section>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button variant="surface" onClick={onSignOut}><LogOut size={15} /> Sign out</Button>
          <Button onClick={save}>Save changes</Button>
        </div>
      </div>

      <Toast text={toast} />
    </motion.div>
  );
}
