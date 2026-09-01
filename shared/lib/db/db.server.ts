import "server-only"

import { remember } from "@epic-web/remember"
import { createDb } from "./db"

const db = remember("db", createDb)

export function getDb() {
  return db
}
