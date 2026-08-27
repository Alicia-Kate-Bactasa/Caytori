import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import {
  Ticket,
  Users,
  ShieldCheck,
  BarChart3,
  Workflow,
  Building2,
  ArrowRight,
  Sun,
  Moon,
  KeyRound,
  Server,
  Wrench,
  User,
  ChevronDown,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Button, Card, Avatar, Logo } from "./primitives"
import { FAQS, type Role } from "../data"

export const DEMO_KEY = "ishieSoGwapa"

const DEMO_ROLES: { id: Role; label: string; scope: string; icon: LucideIcon }[] =
  [
    {
      id: "platform_admin",
      label: "Caytori Admin",
      scope: "Whole platform",
      icon: ShieldCheck,
    },
    {
      id: "company_admin",
      label: "Company Admin",
      scope: "One company",
      icon: Building2,
    },
    {
      id: "it_head",
      label: "DEPT IT (Dept Head)",
      scope: "Head of IT",
      icon: Server,
    },
    {
      id: "normal_head",
      label: "NORMAL DEPT (Dept Head)",
      scope: "Finance Head",
      icon: Users,
    },
    {
      id: "it_employee",
      label: "IT Employee",
      scope: "IT Staff",
      icon: Wrench,
    },
    {
      id: "normal_employee",
      label: "Normal Employee",
      scope: "Finance Employee",
      icon: User,
    },
  ]

const features = [
  {
    icon: Ticket,
    title: "Structured ticketing",
    body: "Every IT concern becomes one traceable ticket — no more scattered chats, emails, or verbal requests.",
  },
  {
    icon: Workflow,
    title: "Clear lifecycle",
    body: "Open → In Progress → Resolved → Closed. Employees confirm the fix, so nothing closes prematurely.",
  },
  {
    icon: Users,
    title: "Role-based access",
    body: "Five roles, from Caytori Admin to Employee, each seeing exactly what they should — nothing more.",
  },
  {
    icon: Building2,
    title: "Multi-company isolation",
    body: "Each company is a tenant. Data is fenced by company ID and enforced on every request.",
  },
  {
    icon: BarChart3,
    title: "Performance metrics",
    body: "Track ticket volumes, resolution speeds, and status breakdowns across all departments in real time.",
  },
  {
    icon: ShieldCheck,
    title: "Full history retained",
    body: "Comments, attachments, and activity logs stay with every ticket, even after closure.",
  },
]

const lifecycle = [
  { step: "Open", desc: "Employee submits an issue" },
  { step: "In Progress", desc: "IT Staff picks it up" },
  { step: "Resolved", desc: "Fix applied & noted" },
  { step: "Closed", desc: "Employee confirms" },
]

export default function Landing({
  onEnter,
  onEnterDemo,
  theme,
  toggleTheme,
}: {
  onEnter: () => void
  onEnterDemo: (role: Role) => void
  theme: "light" | "dark"
  toggleTheme: () => void
}) {
  const [faq, setFaq] = useState<number | null>(null)
  const [demoOpen, setDemoOpen] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const [keyInput, setKeyInput] = useState("")
  const [keyError, setKeyError] = useState("")
  const demoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!demoOpen) return
    function onDoc(e: MouseEvent) {
      if (demoRef.current && !demoRef.current.contains(e.target as Node))
        setDemoOpen(false)
    }
    document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [demoOpen])

  function submitKey(e: React.FormEvent) {
    e.preventDefault()
    if (keyInput.trim() === DEMO_KEY) {
      setKeyError("")
      setUnlocked(true)
    } else {
      setKeyError("Invalid access key.")
    }
  }

  return (
    <div className="w-full">
      {/* Nav */}
      <header className="mx-auto flex max-w-[1620px] items-center justify-between px-6 py-6 sm:px-10">
        <Logo />
        <div className="flex items-center gap-2">
          <div ref={demoRef} className="relative">
            <button
              onClick={() => {
                setDemoOpen((v) => !v)
                setKeyError("")
              }}
              aria-label="Admin demo access"
              title="Admin demo access"
              className="neu-sm neu-press grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
            >
              <KeyRound size={17} />
            </button>
            <AnimatePresence>
              {demoOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="neu absolute right-0 top-full z-50 mt-2 w-72 rounded-2xl p-4"
                >
                  {!unlocked ? (
                    <form onSubmit={submitKey}>
                      <div className="flex items-center gap-2">
                        <KeyRound size={15} className="text-primary" />
                        <span className="font-display text-sm font-600">
                          Live demo access
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Enter the admin key to explore the app as any role.
                      </p>
                      <div className="neu-inset mt-3 flex items-center rounded-xl px-3 py-2.5">
                        <input
                          autoFocus
                          value={keyInput}
                          onChange={(e) => setKeyInput(e.target.value)}
                          placeholder="Access key"
                          className="w-full bg-transparent font-mono text-sm outline-none"
                        />
                      </div>
                      {keyError && (
                        <p
                          className="mt-2 text-xs"
                          style={{ color: "var(--danger)" }}
                        >
                          {keyError}
                        </p>
                      )}
                      <Button type="submit" size="sm" className="mt-3 w-full">
                        Unlock
                      </Button>
                    </form>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ background: "var(--accent)" }}
                        />
                        <span className="font-display text-sm font-600">
                          Explore as a role
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Opens that role's dashboard instantly.
                      </p>
                      <div className="mt-3 space-y-1">
                        {DEMO_ROLES.map((r) => (
                          <button
                            key={r.id}
                            onClick={() => {
                              setDemoOpen(false)
                              onEnterDemo(r.id)
                            }}
                            className="neu-press flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-[var(--muted)]"
                          >
                            <span
                              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg"
                              style={{
                                background:
                                  "color-mix(in srgb, var(--primary) 14%, transparent)",
                                color: "var(--primary)",
                              }}
                            >
                              <r.icon size={15} />
                            </span>
                            <span className="min-w-0">
                              <span className="block text-sm font-500 leading-tight">
                                {r.label}
                              </span>
                              <span className="block text-[11px] text-muted-foreground">
                                {r.scope}
                              </span>
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="neu-sm neu-press grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
          >
            {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
          </button>
          <Button
            onClick={onEnter}
            variant="surface"
            size="sm"
            className="hidden sm:inline-flex"
          >
            Sign in
          </Button>
          <Button onClick={onEnter} size="sm">
            Get started
          </Button>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="mx-auto max-w-[1380px] px-4 sm:px-6">
        {/* Hero */}
        <section className="grid items-center gap-10 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display text-5xl font-800 leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl xl:text-[76px]">
              Centralize IT support.
              <br />
              <span style={{ color: "var(--primary)" }}>Resolve</span> issues
              faster.
            </h1>
            <p className="mt-6 max-w-xl text-xl sm:text-2xl leading-relaxed text-muted-foreground font-400">
              Caytori turns scattered IT requests into one structured workflow —
              employees report, IT resolves, and every issue is tracked from
              creation to closure.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button onClick={onEnter} size="lg">
                Get started
              </Button>
              <span className="text-base text-muted-foreground">
                Already have an account?{" "}
                <button
                  onClick={onEnter}
                  className="font-600 text-primary transition-opacity hover:opacity-80"
                >
                  Sign in
                </button>
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <Card className="p-7 sm:p-9">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-base font-700 text-primary">
                    CT-000124
                  </span>
                  <span
                    className="rounded-md px-2.5 py-0.5 font-mono text-xs font-600 uppercase"
                    style={{
                      background:
                        "color-mix(in srgb, var(--warning) 15%, transparent)",
                      color: "var(--warning)",
                    }}
                  >
                    High
                  </span>
                </div>
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-600"
                  style={{
                    background:
                      "color-mix(in srgb, var(--primary) 15%, transparent)",
                    color: "var(--primary)",
                  }}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: "var(--primary)" }}
                  />{" "}
                  In Progress
                </span>
              </div>

              <h3 className="mt-4 font-display text-xl font-700 sm:text-2xl">
                Unable to access company network
              </h3>
              <p className="mt-2 text-base leading-relaxed text-muted-foreground sm:text-lg">
                The computer cannot connect to the company network since 9:00 AM.
                Restarting and reconnecting to Wi-Fi did not help.
              </p>

              {/* Tags */}
              <div className="mt-4 flex flex-wrap gap-2">
                {["Finance", "Network"].map((t) => (
                  <span
                    key={t}
                    className="neu-flat rounded-full px-3 py-1 text-xs font-500 text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Lifecycle progress */}
              <div className="mt-6 flex items-center gap-2">
                {["Open", "In Progress", "Resolved", "Closed"].map((s, i) => (
                  <div key={s} className="flex-1">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        background: i <= 1 ? "var(--primary)" : "var(--muted)",
                      }}
                    />
                    <div
                      className="mt-1.5 text-xs font-500 text-muted-foreground"
                      style={{ color: i <= 1 ? "var(--primary)" : undefined }}
                    >
                      {s}
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="my-6 h-px"
                style={{ background: "var(--border)" }}
              />

              {/* People */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name="Maria Santos" size={40} />
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Reported by
                    </div>
                    <div className="text-base font-600">Maria Santos</div>
                  </div>
                </div>
                <ArrowRight size={18} className="text-muted-foreground" />
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">
                      Assigned to
                    </div>
                    <div className="text-base font-600">Vivienne Claire</div>
                  </div>
                  <Avatar name="Mark Villanueva" size={40} />
                </div>
              </div>

              {/* Latest comment */}
              <div className="neu-inset mt-6 rounded-2xl px-5 py-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-700">Mark Villanueva</span>
                  <span className="text-xs text-muted-foreground">
                    · 12 min ago
                  </span>
                </div>
                <p className="mt-1.5 text-base text-muted-foreground">
                  On it now — checking the switch port on your floor. I'll update
                  you shortly.
                </p>
              </div>
            </Card>
          </motion.div>
        </section>

      {/* Features */}
      <section className="py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="max-w-xl font-display text-3xl font-700 tracking-tight sm:text-4xl">
            Everything IT support needs, nothing it doesn't
          </h2>
        </motion.div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.2 }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
            >
              <Card className="neu-hover h-full p-6">
                <div
                  className="neu-inset grid h-12 w-12 place-items-center rounded-2xl"
                  style={{ color: "var(--primary)" }}
                >
                  <f.icon size={20} />
                </div>
                <h3 className="mt-5 font-display text-lg font-600">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.body}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Lifecycle */}
      <section className="py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="font-display text-3xl font-700 tracking-tight sm:text-4xl">
            A ticket's journey
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Four clear stages keep everyone aligned.
          </p>
        </motion.div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {lifecycle.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.2 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Card className="relative h-full p-6">
                <span
                  className="font-mono text-4xl font-600"
                  style={{
                    color:
                      "color-mix(in srgb, var(--primary) 35%, transparent)",
                  }}
                >
                  0{i + 1}
                </span>
                <h3 className="mt-3 font-display text-lg font-600">{s.step}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="font-display text-3xl font-700 tracking-tight sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            The essentials of how Caytori keeps IT support organized and fair.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 items-start">
          <div className="flex flex-col gap-3">
            {FAQS.slice(0, Math.ceil(FAQS.length / 2)).map((f, i) => {
              const isOpen = faq === i
              return (
                <Card key={i} className="overflow-hidden">
                  <button
                    onClick={() => setFaq(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
                  >
                    <span className="font-display text-[15px] font-600 leading-snug">
                      {f.q}
                    </span>
                    <ChevronDown
                      size={18}
                      className="shrink-0 transition-transform duration-300"
                      style={{
                        transform: isOpen ? "rotate(180deg)" : "none",
                        color: isOpen
                          ? "var(--primary)"
                          : "var(--muted-foreground)",
                      }}
                    />
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-250 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-4 pt-1 text-sm leading-relaxed text-muted-foreground border-t border-[var(--border)] mt-1">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
          <div className="flex flex-col gap-3">
            {FAQS.slice(Math.ceil(FAQS.length / 2)).map((f, i) => {
              const originalIndex = i + Math.ceil(FAQS.length / 2)
              const isOpen = faq === originalIndex
              return (
                <Card key={originalIndex} className="overflow-hidden">
                  <button
                    onClick={() => setFaq(isOpen ? null : originalIndex)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
                  >
                    <span className="font-display text-[15px] font-600 leading-snug">
                      {f.q}
                    </span>
                    <ChevronDown
                      size={18}
                      className="shrink-0 transition-transform duration-300"
                      style={{
                        transform: isOpen ? "rotate(180deg)" : "none",
                        color: isOpen
                          ? "var(--primary)"
                          : "var(--muted-foreground)",
                      }}
                    />
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-250 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-4 pt-1 text-sm leading-relaxed text-muted-foreground border-t border-[var(--border)] mt-1">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA + footer */}
      <section className="py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="flex flex-col items-center gap-6 p-12 text-center">
            <h2 className="max-w-xl font-display text-3xl font-700 tracking-tight sm:text-4xl">
              Ready to keep business moving?
            </h2>
            <p className="max-w-md text-muted-foreground">
              Create your account in minutes and bring every IT request into one
              place.
            </p>
            <Button onClick={onEnter}>Get started</Button>
          </Card>
        </motion.div>
        <footer className="flex flex-col items-center justify-between gap-3 py-10 text-sm text-muted-foreground sm:flex-row">
          <span>© 2026 Caytori — Centralize IT Support.</span>
          <span className="font-mono text-xs">
            Built with care · Multi-tenant SaaS
          </span>
        </footer>
      </section>
    </div>
  </div>
)
}
