'use server';
import { auth } from '@/shared/lib/auth/server-auth';
interface SignInProps {
    email: string;
    password: string;
}
export async function signIn(
    { email, password }: SignInProps
) {
    const { error } = await auth.signIn.email({
        email: email,
        password: password,
    })

    if (error) {
        throw new Error(error.message || "Failed to sign in. Try again");
    }
}

