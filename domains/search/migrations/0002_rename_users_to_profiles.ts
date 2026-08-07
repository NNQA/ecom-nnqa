import type { Sql } from "postgres";

export async function migrateRefactorProfiles(sql: Sql): Promise<void> {
    console.log("asd")
    await sql.begin(async (sql) => {
        await sql`
          ALTER TABLE users
          RENAME TO profiles
        `;
        await sql`
          ALTER TABLE user_roles
          RENAME TO profile_roles
        `;
        await sql`
          ALTER TABLE profile_roles
          RENAME COLUMN user_id TO profile_id
        `;
        await sql`
          ALTER INDEX IF EXISTS users_pkey
          RENAME TO profiles_pkey
        `;
        await sql`
          ALTER INDEX IF EXISTS user_roles_role_id_idx
          RENAME TO profile_roles_role_id_idx
        `;
        await sql`
          ALTER TABLE profiles
          DROP COLUMN IF EXISTS email
        `;

        await sql`
          ALTER TABLE profiles
          RENAME COLUMN name TO display_name
        `;

        await sql`
          ALTER TABLE profiles
          ADD COLUMN IF NOT EXISTS avatar_url TEXT
        `;

        await sql`
          ALTER TABLE profiles
          ADD COLUMN IF NOT EXISTS phone TEXT
        `;

        await sql`
          ALTER TABLE profiles
          ADD COLUMN IF NOT EXISTS bio TEXT
        `;

        await sql`
          ALTER TABLE profile_roles
          DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey
        `;

        await sql`
          ALTER TABLE profile_roles
          ADD CONSTRAINT profile_roles_profile_id_fkey
          FOREIGN KEY (profile_id)
          REFERENCES profiles(id)
          ON DELETE CASCADE
        `;
    });
}

