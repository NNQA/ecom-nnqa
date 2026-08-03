import AuthLayout from "@/shared/components/layouts/auth-layout";

export function SingupLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthLayout>
            {children}
        </AuthLayout>
    );
}