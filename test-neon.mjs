import { neon } from "@neondatabase/serverless"
import * as dotenv from "dotenv"
import { readFileSync } from "fs"

const envConfig = dotenv.parse(readFileSync(".env.local"))
const sql = neon(envConfig.DATABASE_URL)

async function testConnection() {
  console.log("Connecting to Neon PostgreSQL...")
  const result = await sql`SELECT 1 as connected, version(), current_database(), current_user, NOW() as current_time;`
  console.log("Neon connection successful!")
  console.log("Query Result:", result[0])
}

testConnection().catch((err) => {
  console.error("Neon connection failed:", err)
  process.exit(1)
})
