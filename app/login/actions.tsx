'use server';
import { auth } from '@/lib/auth/server-auth';
export async function signUpWithEmail(
    _prevState: { error: string } | null,
    formData: FormData
) {
    const email = formData.get('email') as string;
    if (!email) {
        return { error: "Email address must be provided." }
    }
    const { error } = await auth.signUp.email({
        email,
        name: "",
        password: formData.get('password') as string,
    });
    console.log(error)
    if (error) {
        return { error: error.message || 'Failed to create account' };
    }
}

