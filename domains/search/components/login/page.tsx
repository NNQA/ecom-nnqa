import AuthLayout from "@/shared/components/layouts/auth-layout";
import { AuthForm } from "@/shared/components/login/auth-login-form";
import { useDb } from "@/shared/lib/db/db.server";

export default async function LoginPage() {
    return (
        <AuthLayout>
            <AuthForm />
        </AuthLayout>
    );
}