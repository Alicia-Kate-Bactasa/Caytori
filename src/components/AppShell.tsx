import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import type { LucideIcon } from "lucide-react"
import {
  LayoutDashboard,
  Ticket as TicketIcon,
  Inbox,
  BarChart3,
  Building2,
  Users,
  UserCog,
  Network,
  HelpCircle,
  Sun,
  Moon,
  LogOut,
  ChevronDown,
  Bell,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Settings as SettingsIcon,
  UserCircle,
} from "lucide-react"
import { Avatar, Card, Logo } from "./primitives"
import Dashboard from "./Dashboard"
import Tickets from "./Tickets"
import Analytics from "./Analytics"
import Directory from "./Directory"
import Settings from "./Settings"
import Profile from "./Profile"
import {
  ROLES,
  CURRENT_USER,
  ticketsFor,
  FAQS,
  type Role,
  type Ticket,
} from "../data"

const NOTIFICATIONS = [
  {
    text: "CT-000120 (Critical) — Suspicious login alert was assigned to you.",
    time: "4 min ago",
    unread: true,
  },
  {
    text: "Maria Santos commented on CT-000124.",
    time: "22 min ago",
    unread: true,
  },
  {
    text: "CT-000118 was confirmed and closed by the reporter.",
    time: "1 hour ago",
    unread: true,
  },
  {
    text: "New ticket CT-000123 — Outlook not sending emails.",
    time: "2 hours ago",
    unread: false,
  },
  {
    text: "CT-000119 marked as resolved by Leo Tan.",
    time: "Yesterday",
    unread: false,
  },
]

interface NavItem {
  key: string
  label: string
  icon: LucideIcon
}

const NAV: Record<Role, NavItem[]> = {
  platform_admin: [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "companies", label: "Companies", icon: Building2 },
    { key: "analytics", label: "Analytics", icon: BarChart3 },
    { key: "settings", label: "Caytori Settings", icon: SettingsIcon },
    { key: "help", label: "Help & FAQ", icon: HelpCircle },
  ],
  company_admin: [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "employees", label: "Employees", icon: Users },
    { key: "it_team", label: "IT Team", icon: UserCog },
    { key: "departments", label: "Departments", icon: Network },
    { key: "settings", label: "Company Settings", icon: SettingsIcon },
    { key: "help", label: "Help & FAQ", icon: HelpCircle },
  ],
  it_admin: [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "tickets_all", label: "All Tickets", icon: TicketIcon },
    { key: "tickets_unassigned", label: "Unassigned", icon: Inbox },
    { key: "it_team", label: "IT Team", icon: UserCog },
    { key: "reports", label: "Reports", icon: BarChart3 },
    { key: "help", label: "Help & FAQ", icon: HelpCircle },
  ],
  it_staff: [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "tickets_my", label: "My Tickets", icon: TicketIcon },
    { key: "help", label: "Help & FAQ", icon: HelpCircle },
  ],
  employee: [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "tickets_my", label: "My Tickets", icon: TicketIcon },
    { key: "help", label: "Help & FAQ", icon: HelpCircle },
  ],
}

export default function AppShell({
  role,
  theme,
  toggleTheme,
  tickets,
  setTickets,
  onSignOut,
  onSwitchRole,
  demoMode = false,
}: {
  role: Role
  theme: "light" | "dark"
  toggleTheme: () => void
  tickets: Ticket[]
  setTickets: (t: Ticket[]) => void
  onSignOut: () => void
  onSwitchRole: (r: Role) => void
  demoMode?: boolean
}) {
  const nav = NAV[role]
  const [page, setPage] = useState(nav[0].key)
  const [menu, setMenu] = useState(false)
  const [notif, setNotif] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const me = CURRENT_USER[role]
  const scoped = ticketsFor(role, tickets)

  function render() {
    switch (page) {
      case "dashboard":
        return <Dashboard role={role} tickets={scoped} />
      case "tickets_all":
        return (
          <Tickets
            tickets={scoped}
            role={role}
            title="All Tickets"
            onChange={setTickets}
          />
        )
      case "tickets_my":
        return (
          <Tickets
            tickets={scoped}
            role={role}
            title="My Tickets"
            onChange={setTickets}
          />
        )
      case "tickets_unassigned":
        return (
          <Tickets
            tickets={scoped.filter((t) => !t.assignee)}
            role={role}
            title="Unassigned Tickets"
            onChange={setTickets}
          />
        )
      case "analytics":
      case "reports":
        return (
          <div>
            <h1 className="mb-6 font-display text-2xl font-700 tracking-tight">
              Reports & Analytics
            </h1>
            <Analytics tickets={scoped} />
          </div>
        )
      case "companies":
        return <Directory kind="companies" title="Companies" />
      case "employees":
        return <Directory kind="employees" title="Employees" />
      case "it_team":
        return <Directory kind="it_team" title="IT Team" />
      case "departments":
        return <Directory kind="departments" title="Departments" />
      case "settings":
        return <Settings role={role} />
      case "profile":
        return <Profile role={role} onSignOut={onSignOut} />
      case "help":
        return <Help />
      default:
        return null
    }
  }

  function go(key: string) {
    setPage(key)
    setDrawer(false)
  }

  const NavList = ({ mini }: { mini: boolean }) => (
    <nav className="mt-6 flex-1 space-y-1.5">
      {nav.map((item) => {
        const on = page === item.key
        return (
          <button
            key={item.key}
            onClick={() => go(item.key)}
            title={mini ? item.label : undefined}
            className={`flex w-full items-center gap-3 rounded-2xl py-3 text-sm font-500 transition-all duration-300 ${
              mini ? "justify-center px-0" : "px-4"
            } ${
              on
                ? "neu-inset text-primary"
                : "neu-press text-muted-foreground hover:text-foreground"
            }`}
          >
            <item.icon size={18} className="shrink-0" />
            {!mini && item.label}
          </button>
        )
      })}
    </nav>
  )

  const Brand = ({ mini }: { mini: boolean }) => (
    <div className={mini ? "flex justify-center" : "px-2"}>
      <Logo showName={!mini} />
    </div>
  )

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside
        className={`sticky top-0 hidden h-screen shrink-0 flex-col p-4 transition-[width] duration-300 ease-in-out lg:flex ${
          collapsed ? "w-[86px]" : "w-[262px]"
        }`}
      >
        <div className="flex items-center justify-between">
          <Brand mini={collapsed} />
        </div>
        <NavList mini={collapsed} />
        <button
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`neu-sm neu-press grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition-colors hover:text-foreground ${
            collapsed ? "self-center" : "self-end"
          }`}
        >
          {collapsed ? (
            <PanelLeftOpen size={18} />
          ) : (
            <PanelLeftClose size={18} />
          )}
        </button>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawer(false)}
              className="fixed inset-0 z-40 lg:hidden"
              style={{
                background:
                  "color-mix(in srgb, var(--foreground) 35%, transparent)",
              }}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed left-0 top-0 z-50 flex h-screen w-[262px] flex-col p-4 lg:hidden"
              style={{ background: "var(--background)" }}
            >
              <div className="flex items-center justify-between">
                <Brand mini={false} />
                <button
                  onClick={() => setDrawer(false)}
                  className="neu-sm neu-press grid h-9 w-9 place-items-center rounded-full text-muted-foreground"
                >
                  <X size={16} />
                </button>
              </div>
              <NavList mini={false} />
              <Card className="p-4">
                <div className="text-xs text-muted-foreground">Viewing as</div>
                <div className="mt-1 font-display text-sm font-600">
                  {ROLES.find((r) => r.id === role)!.label}
                </div>
              </Card>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header
          className="sticky top-0 z-30 flex items-center justify-between gap-3 px-4 py-4 backdrop-blur-md sm:px-5"
          style={{
            background:
              "color-mix(in srgb, var(--background) 82%, transparent)",
          }}
        >
          <button
            onClick={() => setDrawer(true)}
            className="neu-sm neu-press grid h-10 w-10 place-items-center rounded-full text-muted-foreground lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
          <div className="hidden lg:block" />

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => {
                  setNotif(!notif)
                  setMenu(false)
                }}
                className="neu-sm neu-press relative grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Notifications"
              >
                <Bell size={17} />
                <span
                  className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full"
                  style={{ background: "var(--danger)" }}
                />
              </button>
              <AnimatePresence>
                {notif && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setNotif(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 z-20 mt-2 w-[300px]"
                    >
                      <Card className="p-3">
                        <div className="flex items-center justify-between px-2 py-1.5">
                          <span className="text-sm font-600">
                            Notifications
                          </span>
                          <span
                            className="rounded-full px-2 py-0.5 text-[11px] font-500"
                            style={{
                              background:
                                "color-mix(in srgb, var(--danger) 15%, transparent)",
                              color: "var(--danger)",
                            }}
                          >
                            3 new
                          </span>
                        </div>
                        <div
                          className="my-2 h-px"
                          style={{ background: "var(--border)" }}
                        />
                        <div className="max-h-72 space-y-1 overflow-y-auto">
                          {NOTIFICATIONS.map((nt, i) => (
                            <div
                              key={i}
                              className="flex gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-[color-mix(in_srgb,var(--primary)_6%,transparent)]"
                            >
                              <span
                                className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                                style={{
                                  background: nt.unread
                                    ? "var(--primary)"
                                    : "transparent",
                                  border: nt.unread
                                    ? "none"
                                    : "1px solid var(--border)",
                                }}
                              />
                              <div>
                                <p className="text-sm leading-snug">
                                  {nt.text}
                                </p>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                  {nt.time}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </motion.div>
                  </>
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

            <div className="relative">
              <button
                onClick={() => setMenu(!menu)}
                className="neu-sm neu-press flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3"
              >
                <Avatar name={me.name} size={30} />
                <span className="hidden text-sm font-500 sm:block">
                  {me.name.split(" ")[0]}
                </span>
                <ChevronDown size={15} className="text-muted-foreground" />
              </button>
              <AnimatePresence>
                {menu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setMenu(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 z-20 mt-2 w-60"
                    >
                      <Card className="p-3">
                        <div className="flex items-center gap-3 px-2 py-1.5">
                          <Avatar name={me.name} size={38} />
                          <div className="min-w-0">
                            <div className="truncate text-sm font-600">
                              {me.name}
                            </div>
                            <div className="truncate text-xs text-muted-foreground">
                              {me.email}
                            </div>
                          </div>
                        </div>
                        <div
                          className="my-2 h-px"
                          style={{ background: "var(--border)" }}
                        />
                        <button
                          onClick={() => {
                            go("profile")
                            setMenu(false)
                          }}
                          className="flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <UserCircle size={16} /> Profile & account
                        </button>
                        {(role === "platform_admin" ||
                          role === "company_admin") && (
                          <button
                            onClick={() => {
                              go("settings")
                              setMenu(false)
                            }}
                            className="flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
                          >
                            <SettingsIcon size={16} />{" "}
                            {role === "platform_admin"
                              ? "Caytori settings"
                              : "Company settings"}
                          </button>
                        )}
                        {demoMode && (
                          <>
                            <div
                              className="my-2 h-px"
                              style={{ background: "var(--border)" }}
                            />
                            <div className="px-2 pb-1 text-[11px] font-500 uppercase tracking-wide text-muted-foreground">
                              Switch role · demo
                            </div>
                            {ROLES.map((r) => (
                              <button
                                key={r.id}
                                onClick={() => {
                                  onSwitchRole(r.id)
                                  setMenu(false)
                                  setPage("dashboard")
                                }}
                                className={`flex w-full items-center justify-between rounded-xl px-2 py-2 text-left text-sm transition-colors hover:text-foreground ${
                                  r.id === role
                                    ? "text-primary"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {r.label}
                                {r.id === role && (
                                  <span
                                    className="h-1.5 w-1.5 rounded-full"
                                    style={{ background: "var(--primary)" }}
                                  />
                                )}
                              </button>
                            ))}
                          </>
                        )}
                        <div
                          className="my-2 h-px"
                          style={{ background: "var(--border)" }}
                        />
                        <button
                          onClick={onSignOut}
                          className="flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <LogOut size={16} /> Sign out
                        </button>
                      </Card>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1 px-5 pb-16 pt-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {render()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

function Help() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-700 tracking-tight">
        Help & FAQ
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Answers to the most common questions about Caytori.
      </p>
      <div className="mt-6 space-y-3">
        {FAQS.map((f, i) => (
          <Card key={i} className="overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="font-display font-600">{f.q}</span>
              <ChevronDown
                size={18}
                className="shrink-0 text-muted-foreground transition-transform duration-300"
                style={{ transform: open === i ? "rotate(180deg)" : "none" }}
              />
            </button>
            <motion.div
              initial={false}
              animate={{
                height: open === i ? "auto" : 0,
                opacity: open === i ? 1 : 0,
              }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </p>
            </motion.div>
          </Card>
        ))}
      </div>
    </div>
  )
}
