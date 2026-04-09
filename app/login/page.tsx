import AuthLayout from "@/components/layouts/auth-layout";
import { AuthForm } from "@/components/login/auth-login-form";
import { useDb } from "@/lib/db/db";

export default async function Page() {
    const db = useDb();
    return (
        <AuthLayout>
            <AuthForm />
        </AuthLayout>
    );
}