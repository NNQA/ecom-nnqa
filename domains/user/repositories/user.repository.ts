import "server-only"

import { useDb } from "@/shared/lib/db/db.server"

export type UpsertAuthUserInput = {
  id: string
  email?: string | null
  name?: string | null
}

export async function upsertAuthUser(input: UpsertAuthUserInput): Promise<void> {
  const sql = useDb()
  await sql`
    INSERT INTO users (id, email, name)
    VALUES (${input.id}, ${input.email ?? null}, ${input.name ?? null})
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        name = EXCLUDED.name,
        updated_at = NOW()
  `
}