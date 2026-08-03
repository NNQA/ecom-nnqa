"use client"
import * as z from "zod"
import { useForm } from '@tanstack/react-form';
import { toast } from 'sonner';
import { IconMail } from '@tabler/icons-react';
import { useState } from 'react';
import BoxAlert from '@/shared/components/box-alert';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/components/ui/field';
import InputCustomIcon from '@/shared/components/ui/input-icon';
import ProgressButtonLoading from '@/shared/components/ui/progress-button';
import { useRouter } from "next/navigation";
import { checkEmailAvailability, setEmailVerificationToken } from "../../services/authentication.service";


interface SignupPageProps {
    children?: React.ReactNode;
}
export const formEmailSingup = z.object(
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
    }
)
type FormLoginValues = z.infer<typeof formEmailSingup>

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
            onSubmit: formEmailSingup,
        },
        onSubmit: async ({ value }) => {
            await checkEmailAvailability(value.email).catch((error) => {
                setError(error.message || "Failed to sign in. Try again");
            })
            await setEmailVerificationToken(value.email)
            toast.success("Email registration successful.")
            router.push("/signup/password")
        }
    });
    return (
        <div className="h-64 py-14">
            <form
                id='form-email-signup'
                onSubmit={(e) => {
                    e.preventDefault()
                    form.handleSubmit(e)
                }}
                className="flex flex-col gap-4">
                {
                    error && <BoxAlert message={error} />
                }
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
                </FieldGroup>
                <form.Subscribe
                    selector={(formState) => [formState.canSubmit, formState.isSubmitting]}>
                    {
                        ([canSubmit, isSubmitting]) => (
                            <ProgressButtonLoading
                                type="submit"
                                state={isSubmitting}
                                className="mt-2 h-11 w-full rounded-lg bg-primary font-semibold text-primary-foreground transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 disabled:scale-100 disabled:opacity-60"
                                mainText="Continue"
                                loadingText='Submitting...'
                            />
                        )
                    }
                </form.Subscribe>
            </form>
        </div>
    );
}