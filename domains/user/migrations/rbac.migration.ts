import type { Sql } from "postgres"

export async function migrateUserManagement(sql: Sql): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS profiles (
      user_id UUID PRIMARY KEY REFERENCES neon_auth."user"(id) ON DELETE CASCADE,
      first_name TEXT,
      last_name TEXT,
      phone TEXT,
      avatar_url TEXT,
      gender TEXT CHECK (gender IN ('male', 'female', 'other')),
      birthday DATE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS roles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      is_system BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS permissions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS role_permissions (
      role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
      permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
      PRIMARY KEY(role_id, permission_id)
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS user_roles (
      user_id UUID REFERENCES neon_auth."user"(id) ON DELETE CASCADE,
      role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
      PRIMARY KEY(user_id, role_id)
    )
  `
  await sql`
    ALTER TABLE profiles
    ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'ACTIVE'
      CHECK (status IN ('ACTIVE', 'BANNED'))
  `
  await sql`CREATE INDEX IF NOT EXISTS idx_profiles_phone ON profiles(phone)`
  await sql`CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status)`
  await sql`CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_roles(user_id)`
  await sql`CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON role_permissions(role_id)`
}
