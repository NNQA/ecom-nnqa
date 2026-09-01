import "server-only"

import { getDb as getDb } from "@/shared/lib/db/db.server"

export type AuthUserRecord = {
  id: string
  email: string
  name: string
}

export async function findAuthUserById(
  userId: string
): Promise<AuthUserRecord | null> {
  const sql = getDb()
  const [user] = await sql<AuthUserRecord[]>`
    SELECT id, email, name
    FROM neon_auth."user"
    WHERE id = ${userId}
  `

  return user ?? null
}
