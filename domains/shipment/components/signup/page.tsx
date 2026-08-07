"use client"
import * as z from "zod"
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import BoxAlert from '@/shared/components/box-alert';
import { useRouter } from "next/navigation";
import { SignUp } from "../../services/authentication.service";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import InputCustomIcon from "@/shared/components/ui/input-icon";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/components/ui/field";
import { IconMail, IconShieldLock, IconUserCircle } from "@tabler/icons-react";
import Link from "next/link";
import ProgressButtonLoading from "@/shared/components/ui/progress-button";
import { toast } from "sonner";


interface SignupPageProps {
    children?: React.ReactNode;
}
export const formSingup = z.object(
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
        })
            .max(20, { message: "Password must be at most 20 characters long" })
            .refine((val) => /[A-Z]/.test(val), {
                message: "Password must contain at least one uppercase letter",
            })
            .refine((val) => /[a-z]/.test(val), {
                message: "Password must contain at least one lowercase letter",
            })
            .refine((val) => /[0-9]/.test(val), {
                message: "Password must contain at least one number",
            })
            .refine((val) => /[^A-Za-z0-9]/.test(val), {
                message: "Password must contain at least one special character",
            }),
        username: z.string()
            .min(3, 'Username must be at least 3 characters')
            .max(20, 'Username must be at most 20 characters')
            .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    }
)
type FormLoginValues = z.infer<typeof formSingup>

export default function SignupPage({
    children
}: SignupPageProps) {
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const form = useForm({
        defaultValues: {
            email: '',
            password: '',
        } as FormLoginValues,
        validators: {
            onSubmit: formSingup,
        },
        onSubmit: async ({ value }) => {
            await SignUp({
                email: value.email,
                password: value.password,
                username: value.username
            }).then(() => {
                toast.success("Signup successful")
                router.push("/verify")
            }
            ).catch((error) => {
                setError(error.message || "Failed to sign in. Try again");
            })
        }
    });
    return (
        <div className="flex flex-col px-6 py-8 sm:px-2 lg:px-2 lg:py-10">
            <div className="flex justify-end text-sm">
                <span className="text-muted-foreground">
                    Already have an account?{" "}
                    <Button className="font-semibold text-foreground underline hover:scale-x-110 duration-75 cursor-pointer" variant="link" onClick={() => router.push("/login")}>
                        Sign in →
                    </Button>
                </span>
            </div>

            <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center gap-6 py-10">
                <h2 className="text-2xl font-semibold tracking-tight">
                    Sign up for NNQA
                </h2>

                <div className="flex flex-col gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        className="h-11 justify-center gap-2 font-normal"
                    >
                        <GoogleIcon className="h-4 w-4" />
                        Continue with Google
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        className="h-11 justify-center gap-2 font-normal"
                    >
                        <AppleIcon className="h-4 w-4" />
                        Continue with Apple
                    </Button>
                </div>
                <div className="relative flex items-center">
                    <div className="h-px flex-1 bg-border" />
                    <span className="px-3 text-xs text-muted-foreground">or</span>
                    <div className="h-px flex-1 bg-border" />
                </div>
                <form
                    id='form-login'
                    onSubmit={(e) => {
                        e.preventDefault()
                        form.handleSubmit(e)
                    }}
                    className="flex flex-col gap-5">
                    {
                        error && <BoxAlert message={error} />
                    }
                    <FieldGroup>
                        <form.Field
                            name="email"
                            children={(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field>
                                        <FieldLabel htmlFor="email" className="text-sm font-medium text-foreground">
                                            Email Address <span className="text-destructive">*</span>
                                        </FieldLabel>
                                        <InputCustomIcon
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            type="email"
                                            placeholder="name@example.com"
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            className="h-12 bg-muted text-foreground placeholder:text-muted-foreground transition-all duration-200 border-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
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
                                        <div className='flex justify-between items-center'>
                                            <FieldLabel htmlFor="password" className="text-sm font-medium text-foreground">
                                                Password <span className="text-destructive">*</span>
                                            </FieldLabel>
                                            <FieldLabel htmlFor="password" className="text-xs font-medium">
                                                <Link
                                                    href="#"
                                                >
                                                    Forgot password?
                                                </Link>
                                            </FieldLabel>
                                        </div>
                                        <InputCustomIcon
                                            type="password"
                                            placeholder="••••••••"
                                            className="h-12 bg-muted text-foreground placeholder:text-muted-foreground transition-all duration-200 border-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
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
                                        <p className="text-xs text-muted-foreground">
                                            Password should be at least 15 characters OR at least 8 characters including a number and a lowercase letter.
                                        </p>
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                )
                            }}
                        />
                        <form.Field
                            name="username"
                            children={(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field>
                                        <div className='flex justify-between items-center'>
                                            <FieldLabel htmlFor="password" className="text-sm font-medium text-foreground">
                                                Username <span className="text-destructive">*</span>
                                            </FieldLabel>
                                        </div>
                                        <InputCustomIcon
                                            type="text"
                                            placeholder="quocanh"
                                            className="h-12 bg-muted text-foreground placeholder:text-muted-foreground transition-all duration-200 border-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            aria-invalid={isInvalid}
                                            icon={
                                                <IconUserCircle className='h-4 w-4 mt-2' />
                                            }
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Username may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen.
                                        </p>
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                )
                            }}
                        />
                    </FieldGroup>

                    <form.Subscribe
                        selector={(formState) => [formState.canSubmit, formState.isSubmitting]}>
                        {
                            ([canSubmit, isSubmitting]) => (
                                <ProgressButtonLoading
                                    type="submit"
                                    state={isSubmitting}
                                    className="mt-2 h-11 w-full rounded-lg bg-primary font-semibold text-primary-foreground transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 disabled:scale-100 disabled:opacity-60"
                                    mainText="Sign up"
                                    loadingText='Signing up...'
                                />
                            )
                        }
                    </form.Subscribe>
                </form>
            </div>
        </div>
    );
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" {...props}>
            <path
                fill="#4285F4"
                d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.47c-.28 1.5-1.13 2.77-2.4 3.62v3.01h3.88c2.27-2.09 3.54-5.17 3.54-8.66z"
            />
            <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.07 7.93-2.9l-3.88-3.01c-1.08.72-2.45 1.15-4.05 1.15-3.11 0-5.74-2.1-6.68-4.92H1.32v3.09C3.29 21.3 7.31 24 12 24z"
            />
            <path
                fill="#FBBC05"
                d="M5.32 14.32A7.19 7.19 0 0 1 4.94 12c0-.8.14-1.58.38-2.32V6.59H1.32A11.97 11.97 0 0 0 0 12c0 1.93.46 3.76 1.32 5.41l4-3.09z"
            />
            <path
                fill="#EA4335"
                d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.29 2.7 1.32 6.59l4 3.09C6.26 6.86 8.89 4.77 12 4.77z"
            />
        </svg>
    );
}

function AppleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M16.365 1.43c0 1.14-.462 2.11-1.19 2.86-.796.82-2.05 1.45-3.09 1.37-.13-1.09.45-2.24 1.16-2.94.79-.78 2.14-1.35 3.12-1.29zM20.5 17.24c-.55 1.27-.81 1.84-1.52 2.96-.99 1.56-2.38 3.5-4.11 3.51-1.53.02-1.93-1-4.01-.99-2.08.01-2.52 1.01-4.05 1-1.73-.02-3.04-1.77-4.03-3.33-2.76-4.33-3.05-9.41-1.35-12.11 1.21-1.93 3.12-3.06 4.92-3.06 1.83 0 2.99 1 4.5 1 1.47 0 2.37-1 4.5-1 1.6 0 3.29.87 4.5 2.38-3.96 2.17-3.32 7.83.65 9.65z" />
        </svg>
    );
}
