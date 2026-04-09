'use client';

import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import ProgressButtonLoading from '../ui/progress-button';
import * as z from "zod"
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { useForm } from '@tanstack/react-form';
import { toast } from 'sonner';
import InputCustomIcon from '../ui/input-icon';
import { IconMail, IconShieldLock } from '@tabler/icons-react';


export const formLoignSchema = z.object(
    {
        email: z.email({
            error: (issue) => {
                if (issue.input === undefined) {
                    return { message: "Email address is required" };
                }
                if (issue.input === "") {
                    return { message: "Email address is required" };
                }
                return { message: "Invalid email address" };
            },
        }),
        password: z.string().min(6, {
            error:
                (issue) => issue.code === "too_small" && issue.minimum === 6 ? { message: ("Password must be at least 6 characters") } : { message: ("Invalid password") }
        }),
    }
)
type FormLoginValues = z.infer<typeof formLoignSchema>

export function AuthForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm({
        defaultValues: {
            email: '',
            password: '',
        } as FormLoginValues,
        validators: {
            onSubmit: formLoignSchema,
        },
        onSubmit: async (values) => {
            console.log("asdd")
            toast.success("Form submitted successfully")

        }
    });
    return (
        <div className="flex flex-col gap-6 animate-slide-up">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    Discover everything you need, all in one place
                </p>
            </div>

            <form
                id='form-login'
                onSubmit={(e) => {
                    e.preventDefault()
                    form.handleSubmit(e)
                }}
                className="flex flex-col gap-4">
                <FieldGroup className="space-y-2">
                    <form.Field
                        name="email"
                        children={(field) => {
                            const isInvalid =
                                field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field>
                                    <FieldLabel htmlFor="email" className="text-sm font-medium text-foreground">
                                        Email Address
                                    </FieldLabel>
                                    <InputCustomIcon
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        type="email"
                                        placeholder="name@example.com"
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        className="h-11 bg-muted text-foreground placeholder:text-muted-foreground transition-all duration-200 border-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        aria-invalid={isInvalid}
                                        icon={
                                            <IconMail className='h-4 w-4 mt-2' />
                                        }
                                    />
                                    {isInvalid && (
                                        <FieldError errors={field.state.meta.errors} />
                                    )}
                                </Field>
                            )
                        }}
                    />
                    <form.Field
                        name="password"
                        children={(field) => {
                            const isInvalid =
                                field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field>
                                    <FieldLabel htmlFor="password" className="text-sm font-medium text-foreground">
                                        Password
                                    </FieldLabel>
                                    <InputCustomIcon
                                        type="password"
                                        placeholder="••••••••"
                                        className="h-11 bg-muted text-foreground placeholder:text-muted-foreground transition-all duration-200 border-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        aria-invalid={isInvalid}
                                        icon={
                                            <IconShieldLock className='h-4 w-4 mt-2' />
                                        }
                                    />
                                    {isInvalid && (
                                        <FieldError errors={field.state.meta.errors} />
                                    )}
                                </Field>
                            )
                        }}
                    />
                </FieldGroup>
                <ProgressButtonLoading
                    type="submit"
                    state={isLoading}
                    className="mt-2 h-11 w-full rounded-lg bg-primary font-semibold text-primary-foreground transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 disabled:scale-100 disabled:opacity-60"
                    mainText="Sign In"
                    loadingText='Logging in...'
                />
            </form>

            <div className="flex items-center gap-4">
                <Separator className="flex-1" />
                <span className="text-xs text-muted-foreground font-medium">OR</span>
                <Separator className="flex-1" />
            </div>

            <div className="flex flex-col gap-3">
                <button className="flex items-center justify-center gap-3 rounded-lg border border-border bg-background px-4 py-2.5 transition-all duration-200 hover:bg-muted hover:shadow-sm active:scale-95">
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        />
                    </svg>
                    <span className="text-sm font-medium">Continue with Google</span>
                </button>

                <button className="flex items-center justify-center gap-3 rounded-lg border border-border bg-background px-4 py-2.5 transition-all duration-200 hover:bg-muted hover:shadow-sm active:scale-95">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span className="text-sm font-medium">Continue with Facebook</span>
                </button>
            </div>

            <div className="text-center text-sm text-foreground">
                New here?{' '}
                <Link href="#" className="font-semibold text-primary transition-colors hover:underline">
                    Create an account
                </Link>
            </div>
        </div>
    );
}
