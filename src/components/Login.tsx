import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, Lock, Mail, User, Building2, ChevronDown } from "lucide-react";
import { Button, Logo } from "./primitives";
import type { Role } from "../data";

type Mode = "signin" | "signup";

export default function Login({
  onBack, onLogin,
}: {
  onBack: () => void;
  onLogin: (role: Role) => void;
}) {
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [help, setHelp] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === "signup" && name.trim().length < 2) return setError("Please enter your full name.");
    if (mode === "signup" && company.trim().length < 2) return setError("Please enter your company name.");
    if (!email.includes("@")) return setError("Please enter a valid email address.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (mode === "signup" && password !== confirm) return setError("Passwords do not match.");
    setError("");
    // Registering a company makes you its Company Admin; returning users resolve their own role server-side.
    onLogin(mode === "signup" ? "company_admin" : "employee");
  }

  const isUp = mode === "signup";

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

        <h1 className="mt-8 font-display text-3xl font-700 tracking-tight">
          {isUp ? "Register your company" : "Welcome back"}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {isUp
            ? "We'll set you up as your company's Admin, and you can invite your IT team and employees once you're inside."
            : "Good to see you again — pop in your details below and we'll get you back to your tickets."}
        </p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <AnimatePresence initial={false} mode="popLayout">
            {isUp && (
              <motion.div
                key="up-fields"
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <LabeledInput icon={User} label="Full name" value={name} onChange={setName} placeholder="Maria Santos" />
                <LabeledInput icon={Building2} label="Company name" value={company} onChange={setCompany} placeholder="Acme Corp" />
              </motion.div>
            )}
          </AnimatePresence>

          <LabeledInput icon={Mail} label="Work email" value={email} onChange={setEmail} placeholder="you@company.com" type="email" />
          <LabeledInput icon={Lock} label="Password" value={password} onChange={setPassword} placeholder="••••••••" type="password" />

          <AnimatePresence initial={false} mode="popLayout">
            {isUp && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <LabeledInput icon={Lock} label="Confirm password" value={confirm} onChange={setConfirm} placeholder="••••••••" type="password" />
              </motion.div>
            )}
          </AnimatePresence>

          {!isUp && (
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" defaultChecked className="accent-[var(--primary)]" /> Remember me
              </label>
              <button type="button" className="text-primary transition-opacity hover:opacity-80">Forgot password?</button>
            </div>
          )}

          {error && <p className="text-sm" style={{ color: "var(--danger)" }}>{error}</p>}

          <Button type="submit" className="w-full">
            {isUp ? "Create company workspace" : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isUp ? "Already have an account? " : "Starting a new company? "}
          <button
            type="button"
            onClick={() => { setMode(isUp ? "signin" : "signup"); setError(""); }}
            className="font-600 text-primary transition-opacity hover:opacity-80"
          >
            {isUp ? "Sign in" : "Register your company"}
          </button>
        </p>
        {!isUp && (
          <div className="mx-auto mt-3 w-full max-w-xs">
            <button
              type="button"
              onClick={() => setHelp((v) => !v)}
              className="mx-auto flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
            >
              Not sure which one to use?
              <ChevronDown size={13} className="transition-transform duration-300" style={{ transform: help ? "rotate(180deg)" : "none" }} />
            </button>
            <motion.div
              initial={false}
              animate={{ height: help ? "auto" : 0, opacity: help ? 1 : 0 }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <p className="pt-2 text-center text-[11px] leading-relaxed text-muted-foreground">
                If your team already uses Caytori, your admin will send you an invite — just sign in here once you're all set. Only setting things up for a brand-new company? Registering is for you.
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

function LabeledInput({
  icon: Icon, label, value, onChange, placeholder, type = "text",
}: {
  icon: typeof Mail; label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-500 text-muted-foreground">{label}</span>
      <div className="neu-inset flex items-center gap-2.5 rounded-xl px-3.5 py-3">
        <Icon size={16} className="text-muted-foreground" />
        <input
          type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>
    </label>
  );
}
