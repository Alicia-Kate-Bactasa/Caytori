import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import Landing from "./components/Landing"
import Login from "./components/Login"
import AppShell from "./components/AppShell"
import { TICKETS, type Role, type Ticket } from "./data"

type View = "landing" | "login" | "app"

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">(() =>
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
  )
  const [view, setView] = useState<View>("landing")
  const [role, setRole] = useState<Role>("normal_employee")
  const [demoMode, setDemoMode] = useState(false)
  const [tickets, setTickets] = useState<Ticket[]>(TICKETS)
  const [allowSelfReg, setAllowSelfReg] = useState(true)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"))

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {view === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Landing
              onEnter={() => setView("login")}
              onEnterDemo={(r) => {
                setRole(r)
                setDemoMode(true)
                setView("app")
              }}
              theme={theme}
              toggleTheme={toggleTheme}
            />
          </motion.div>
        )}
        {view === "login" && (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Login
              onBack={() => setView("landing")}
              allowSelfReg={allowSelfReg}
              onLogin={(r) => {
                setRole(r)
                setDemoMode(false)
                setView("app")
              }}
            />
          </motion.div>
        )}
        {view === "app" && (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <AppShell
              role={role}
              theme={theme}
              toggleTheme={toggleTheme}
              tickets={tickets}
              setTickets={setTickets}
              allowSelfReg={allowSelfReg}
              onToggleSelfReg={setAllowSelfReg}
              onSignOut={() => setView("landing")}
              onSwitchRole={setRole}
              demoMode={demoMode}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
