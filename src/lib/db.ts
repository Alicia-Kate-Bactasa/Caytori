import { neon } from "@neondatabase/serverless"

const databaseUrl =
  (typeof process !== "undefined" && process.env?.DATABASE_URL) ||
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_DATABASE_URL) ||
  ""

export const getDb = () => {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL or VITE_DATABASE_URL is not set.")
  }
  return neon(databaseUrl)
}

export const sql = databaseUrl ? neon(databaseUrl) : null
