import postgres from "postgres"
import { remember } from "@epic-web/remember"
import "dotenv/config"

export function createDb() {
  if (process.env.DATABASE_URL == null) {
    throw new Error("DATABASE_URL is not defined")
  }
  const db = postgres(process.env.DATABASE_URL, {
    ssl: "require",
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false,
  })
  return db
}
const db = remember("db", () => {
  return createDb()
})

export function getDb() {
  return db
}
