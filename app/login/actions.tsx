'use server';
import { auth } from '@/shared/lib/auth/server-auth';
interface SignInProps {
    email: string;
    password: string;
}
export async function signIn(
    { email, password }: SignInProps
) {
    const { error } = await auth.signUp.email({
        email: email,
        password: password,
        name: email.split("@")[0]
    })

    if (error) {
        throw new Error(error.message || "Failed to sign in. Try again");
    }
}

