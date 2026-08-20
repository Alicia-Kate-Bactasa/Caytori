import { motion, AnimatePresence } from "motion/react"
import { X } from "lucide-react"
import type { ReactNode } from "react"
import type { Status, Priority } from "../data"
import { statusMeta, priorityMeta } from "../data"
import logoUrl from "../imports/Caytori_Final_Logo.png"

export function Logo({
  size = 48,
  showName = true,
}: {
  size?: number
  showName?: boolean
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="grid shrink-0 place-items-center overflow-hidden"
        style={{ width: size, height: size }}
      >
        <img
          src={logoUrl}
          alt="Caytori"
          className="scale-[1.6] object-contain"
          style={{ width: size, height: size }}
        />
      </div>
      {showName && (
        <span className="font-display text-xl font-700 tracking-tight">
          Caytori
        </span>
      )}
    </div>
  )
}

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = "max-w-lg",
}: {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  width?: string
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center overflow-y-auto p-4"
          style={{
            background:
              "color-mix(in srgb, var(--foreground) 35%, transparent)",
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full ${width} my-auto`}
          >
            <div className="rounded-[var(--radius)] neu p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl font-700">{title}</h2>
                  {subtitle && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {subtitle}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="neu-sm neu-press grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted-foreground"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="mt-6">{children}</div>
              {footer && (
                <div className="mt-6 flex justify-end gap-2">{footer}</div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-500 text-muted-foreground">
        {label}
      </span>
      <div className="neu-inset rounded-xl px-3.5 py-2.5">{children}</div>
    </label>
  )
}

export function Toggle({
  on,
  onChange,
}: {
  on: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className="neu-inset relative h-7 w-12 shrink-0 rounded-full transition-colors"
      style={{ background: on ? "var(--primary)" : undefined }}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className="absolute top-1 h-5 w-5 rounded-full bg-card shadow"
        style={{ left: on ? "calc(100% - 1.5rem)" : "0.25rem" }}
      />
    </button>
  )
}

export function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <Card className="p-6">
      <h3 className="font-display text-base font-600">{title}</h3>
      {description && (
        <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
      )}
      <div className="mt-5 space-y-4">{children}</div>
    </Card>
  )
}

export function SettingRow({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="text-sm font-500">{label}</div>
        {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
      </div>
      {children}
    </div>
  )
}

export function Toast({ text }: { text: string }) {
  return (
    <AnimatePresence>
      {text && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2"
        >
          <div className="neu flex items-center gap-2.5 rounded-full px-5 py-3 text-sm font-500">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: "var(--accent)" }}
            />
            {text}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
  size = "md",
}: {
  children: ReactNode
  onClick?: () => void
  variant?: "primary" | "ghost" | "surface" | "danger"
  className?: string
  type?: "button" | "submit"
  size?: "sm" | "md" | "lg" | "xl"
}) {
  const pad =
    size === "sm"
      ? "px-4 py-2 text-sm font-600"
      : size === "md"
        ? "px-6 py-3 text-base font-600"
        : size === "lg"
          ? "px-8 py-3.5 text-lg font-600"
          : "px-10 py-4 text-xl font-700"
  const styles: Record<string, string> = {
    primary: "text-primary-foreground",
    danger: "text-white",
    surface: "neu-sm neu-press text-foreground",
    ghost: "text-muted-foreground hover:text-foreground",
  }
  const bg =
    variant === "primary"
      ? { background: "var(--primary)" }
      : variant === "danger"
        ? { background: "var(--danger)" }
        : undefined
  return (
    <motion.button
      type={type}
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      style={bg}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium cursor-pointer transition-all duration-300 ${pad} ${styles[variant]} ${
        variant === "primary" || variant === "danger"
          ? "shadow-lg hover:brightness-110"
          : ""
      } ${className}`}
    >
      {children}
    </motion.button>
  )
}

export function StatusBadge({ status }: { status: Status }) {
  const m = statusMeta[status]
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{
        background: `color-mix(in srgb, ${m.token} 15%, transparent)`,
        color: m.token,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: m.token }}
      />
      {m.label}
    </span>
  )
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const token = priorityMeta[priority].token
  return (
    <span
      className="inline-flex items-center rounded-md px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide"
      style={{
        background: `color-mix(in srgb, ${token} 14%, transparent)`,
        color: token,
      }}
    >
      {priority}
    </span>
  )
}

export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
  return (
    <div
      className="neu-flat grid shrink-0 place-items-center rounded-full font-display font-semibold text-primary"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </div>
  )
}

export function Card({
  children,
  className = "",
  inset = false,
}: {
  children: ReactNode
  className?: string
  inset?: boolean
}) {
  return (
    <div
      className={`rounded-[var(--radius)] ${
        inset ? "neu-inset" : "neu"
      } ${className}`}
    >
      {children}
    </div>
  )
}
