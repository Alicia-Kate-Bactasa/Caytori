import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import {
  ArrowLeft,
  Lock,
  Mail,
  User,
  Building2,
  ChevronDown,
  LogIn,
  UserPlus,
} from "lucide-react"
import { Button, Logo } from "./primitives"
import type { Role } from "../data"

type Mode = "signin" | "signup"

export default function Login({
  onBack,
  onLogin,
}: {
  onBack: () => void
  onLogin: (role: Role) => void
}) {
  const [mode, setMode] = useState<Mode>("signin")
  const [name, setName] = useState("")
  const [company, setCompany] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [help, setHelp] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (mode === "signup" && name.trim().length < 2)
      return setError("Please enter your full name.")
    if (mode === "signup" && company.trim().length < 2)
      return setError("Please enter your company name.")
    if (!email.includes("@"))
      return setError("Please enter a valid email address.")
    if (password.length < 8)
      return setError("Password must be at least 8 characters.")
    if (mode === "signup" && password !== confirm)
      return setError("Passwords do not match.")
    setError("")
    // Registering a company makes you its Company Admin; returning users resolve their own role server-side.
    onLogin(mode === "signup" ? "company_admin" : "employee")
  }

  const isUp = mode === "signup"

  return (
    <div className="relative min-h-screen">
      <button
        onClick={onBack}
        aria-label="Back to home"
        className="neu-sm neu-press absolute left-6 top-6 z-10 grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={17} />
      </button>

      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
        <Logo />

        {/* Neumorphic Segmented Tab Switcher */}
        <div className="neu-inset mt-6 flex rounded-2xl p-1.5">
          <button
            type="button"
            onClick={() => {
              setMode("signin")
              setError("")
            }}
            className="relative flex-1 py-2.5 text-xs font-600 transition-colors cursor-pointer"
            style={{
              color: mode === "signin" ? "var(--foreground)" : "var(--muted-foreground)",
            }}
          >
            {mode === "signin" && (
              <motion.div
                layoutId="login-tab-pill"
                className="neu absolute inset-0 rounded-xl"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center justify-center gap-1.5">
              <LogIn size={15} />
              Sign in
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup")
              setError("")
            }}
            className="relative flex-1 py-2.5 text-xs font-600 transition-colors cursor-pointer"
            style={{
              color: mode === "signup" ? "var(--foreground)" : "var(--muted-foreground)",
            }}
          >
            {mode === "signup" && (
              <motion.div
                layoutId="login-tab-pill"
                className="neu absolute inset-0 rounded-xl"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center justify-center gap-1.5">
              <UserPlus size={15} />
              Register company
            </span>
          </button>
        </div>

        {/* Immediate Title & Description (No Fade Out) */}
        <div className="mt-6">
          <h1 className="font-display text-3xl font-700 tracking-tight">
            {isUp ? "Register your company" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {isUp
              ? "We'll set you up as your company's Admin, and you can invite your IT team and employees once you're inside."
              : "Good to see you again — pop in your details below and we'll get you back to your tickets."}
          </p>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          {/* Height Expansion for Registration Fields (No Fade Out) */}
          <AnimatePresence initial={false}>
            {isUp && (
              <motion.div
                key="up-fields"
                initial={{ height: 0, opacity: 1 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 1 }}
                transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="space-y-4 pt-1 pb-1">
                  <LabeledInput
                    icon={User}
                    label="Full name"
                    value={name}
                    onChange={setName}
                    placeholder="Maria Santos"
                  />
                  <LabeledInput
                    icon={Building2}
                    label="Company name"
                    value={company}
                    onChange={setCompany}
                    placeholder="Acme Corp"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <LabeledInput
            icon={Mail}
            label="Work email"
            value={email}
            onChange={setEmail}
            placeholder="you@company.com"
            type="email"
          />
          <LabeledInput
            icon={Lock}
            label="Password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            type="password"
          />

          {/* Height Expansion for Confirm Password Field (No Fade Out) */}
          <AnimatePresence initial={false}>
            {isUp && (
              <motion.div
                key="confirm-field"
                initial={{ height: 0, opacity: 1 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 1 }}
                transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="pt-1 pb-1">
                  <LabeledInput
                    icon={Lock}
                    label="Confirm password"
                    value={confirm}
                    onChange={setConfirm}
                    placeholder="••••••••"
                    type="password"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Remember me & Forgot password (No Fade Out) */}
          <AnimatePresence initial={false}>
            {!isUp && (
              <motion.div
                key="remember-me"
                initial={{ height: 0, opacity: 1 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 1 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="flex items-center justify-between text-xs pt-1 pb-1">
                  <label className="flex items-center gap-2 text-muted-foreground cursor-pointer select-none">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="accent-[var(--primary)]"
                    />{" "}
                    Remember me
                  </label>
                  <button
                    type="button"
                    className="text-primary transition-opacity hover:opacity-80 cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <p className="text-sm" style={{ color: "var(--danger)" }}>
              {error}
            </p>
          )}

          <Button type="submit" className="w-full">
            {isUp ? "Create company workspace" : "Sign in"}
          </Button>
        </form>

        {!isUp && (
          <div className="mx-auto mt-4 w-full max-w-xs overflow-hidden">
            <button
              type="button"
              onClick={() => setHelp((v) => !v)}
              className="mx-auto flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
            >
              Not sure which one to use?
              <ChevronDown
                size={13}
                className="transition-transform duration-300"
                style={{ transform: help ? "rotate(180deg)" : "none" }}
              />
            </button>
            <AnimatePresence initial={false}>
              {help && (
                <motion.p
                  initial={{ height: 0, opacity: 1 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 1 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="pt-2 text-center text-[11px] leading-relaxed text-muted-foreground overflow-hidden"
                >
                  If your team already uses Caytori, your admin will send you an
                  invite — just sign in here once you're all set. Only setting
                  things up for a brand-new company? Registering is for you.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}

function LabeledInput({
  icon: Icon,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  icon: typeof Mail
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  type?: string
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-500 text-muted-foreground">
        {label}
      </span>
      <div className="neu-inset flex items-center gap-2.5 rounded-xl px-3.5 py-3">
        <Icon size={16} className="text-muted-foreground" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>
    </label>
  )
}
