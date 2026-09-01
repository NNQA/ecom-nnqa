import AuthLayout from "@/shared/components/layouts/auth-layout"
import { AuthForm } from "@/shared/components/login/auth-login-form"
import { getDb } from "@/shared/lib/db/db.server"

export default async function Page() {
  return (
    <AuthLayout>
      <AuthForm />
    </AuthLayout>
  )
}
