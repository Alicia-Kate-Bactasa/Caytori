// Caytori Business Process Validation Engine & Boundary Shield

import { DEPARTMENTS, STAFF } from "../data"

export interface ValidationResult {
  valid: boolean
  error?: string
}

// Known registered emails in company
const REGISTERED_EMAILS = new Set([
  "john.doe@abccorp.com",
  "elena.vance@abccorp.com",
  "sam.ortega@abccorp.com",
  "grace.lim@abccorp.com",
  "priya.nair@abccorp.com",
  "diego.flores@abccorp.com",
  "mark.v@abccorp.com",
  "anna.cruz@abccorp.com",
  "leo.tan@abccorp.com",
  "maria.santos@abccorp.com",
  "alex@caytori.com",
])

/**
 * Validates Email Syntax & Tenant Boundary
 */
export function validateEmail(email: string, companyDomain = "abccorp.com"): ValidationResult {
  const trimmed = email.trim().toLowerCase()

  if (!trimmed) {
    return { valid: false, error: "Email address is required." }
  }

  // RFC 5322 Email Regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: "Please enter a valid email address (e.g., name@domain.com)." }
  }

  // Domain match check for tenant isolation
  if (companyDomain && !trimmed.endsWith(`@${companyDomain}`)) {
    return {
      valid: false,
      error: `Email must belong to company domain (@${companyDomain}).`,
    }
  }

  return { valid: true }
}

/**
 * Checks if a user ALREADY exists in the company directory
 */
export function validateUserDoesNotExist(email: string): ValidationResult {
  const emailCheck = validateEmail(email)
  if (!emailCheck.valid) return emailCheck

  const trimmed = email.trim().toLowerCase()
  if (REGISTERED_EMAILS.has(trimmed)) {
    return {
      valid: false,
      error: "User with this email is already registered in the company directory.",
    }
  }

  return { valid: true }
}

/**
 * Checks if a user EXISTS in the system (for login/reset forms)
 */
export function validateUserExists(email: string): ValidationResult {
  const emailCheck = validateEmail(email)
  if (!emailCheck.valid) return emailCheck

  const trimmed = email.trim().toLowerCase()
  if (!REGISTERED_EMAILS.has(trimmed)) {
    return {
      valid: false,
      error: "No account found matching this email address.",
    }
  }

  return { valid: true }
}

/**
 * Validates Full Name inputs
 */
export function validateFullName(name: string): ValidationResult {
  const trimmed = name.trim()

  if (!trimmed) {
    return { valid: false, error: "Full name is required." }
  }

  if (trimmed.length < 3) {
    return { valid: false, error: "Full name must be at least 3 characters long." }
  }

  if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) {
    return { valid: false, error: "Full name can only contain letters, spaces, hyphens, and apostrophes." }
  }

  return { valid: true }
}

/**
 * Validates SLA targets in minutes
 */
export function validateSlaMinutes(minutes: number): ValidationResult {
  if (isNaN(minutes) || minutes === null || minutes === undefined) {
    return { valid: false, error: "SLA target is required." }
  }

  if (minutes < 1 || minutes > 1440) {
    return { valid: false, error: "SLA target must be between 1 minute and 1440 minutes (24 hours)." }
  }

  return { valid: true }
}

/**
 * Validates Ticket Escalation Handoff Reason
 */
export function validateEscalationReason(reason: string): ValidationResult {
  const trimmed = reason.trim()

  if (!trimmed) {
    return { valid: false, error: "Escalation reason and technical notes are required." }
  }

  if (trimmed.length < 10) {
    return { valid: false, error: "Please provide a detailed reason for escalation (at least 10 characters)." }
  }

  return { valid: true }
}
