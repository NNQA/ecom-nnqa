/* eslint-disable react/no-children-prop */
"use client"

import { Separator } from "@/shared/components/ui/separator"
import Link from "next/link"
import ProgressButtonLoading from "../ui/progress-button"
import * as z from "zod"
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import InputCustomIcon from "../ui/input-icon"
import { IconMail, IconShieldLock } from "@tabler/icons-react"
import { signIn } from "@/app/login/actions"
import BoxAlert from "../box-alert"
import { useState } from "react"

export const formLoignSchema = z.object({
  email: z.email({
    error: (issue) => {
      if (issue.input === undefined) {
        return { message: "Email address is required" }
      }
      if (issue.input === "") {
        return { message: "Email address is required" }
      }
      return { message: "Invalid email address" }
    },
  }),
  password: z.string().min(6, {
    error: (issue) =>
      issue.code === "too_small" && issue.minimum === 6
        ? { message: "Password must be at least 6 characters" }
        : { message: "Invalid password" },
  }),
})
type FormLoginValues = z.infer<typeof formLoignSchema>

export function AuthForm() {
  const [error, setError] = useState<string | null>(null)
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    } as FormLoginValues,
    validators: {
      onSubmit: formLoignSchema,
    },
    onSubmit: async ({ value }) => {
      await signIn({
        email: value.email,
        password: value.password,
      })
        .then(() => {
          toast.success("Login successful")
        })
        .catch((error) => {
          setError(error.message || "Failed to sign in. Try again")
        })
    },
  })
  return (
    <div className="animate-slide-up flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Discover everything you need, all in one place
        </p>
      </div>

      <form
        id="form-login"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit(e)
        }}
        className="flex flex-col gap-4"
      >
        {error && <BoxAlert message={error} />}
        <FieldGroup className="space-y-2">
          <form.Field
            name="email"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field>
                  <FieldLabel
                    htmlFor="email"
                    className="text-sm font-medium text-foreground"
                  >
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
                    className="h-11 border-muted bg-muted text-foreground transition-all duration-200 placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                    aria-invalid={isInvalid}
                    icon={<IconMail className="mt-2 h-4 w-4" />}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
                  <div className="flex items-center justify-between">
                    <FieldLabel
                      htmlFor="password"
                      className="text-sm font-medium text-foreground"
                    >
                      Password
                    </FieldLabel>
                    <FieldLabel
                      htmlFor="password"
                      className="text-xs font-medium"
                    >
                      <Link href="#">Forgot password?</Link>
                    </FieldLabel>
                  </div>
                  <InputCustomIcon
                    type="password"
                    placeholder="••••••••"
                    className="h-11 border-muted bg-muted text-foreground transition-all duration-200 placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    icon={<IconShieldLock className="mt-2 h-4 w-4" />}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />
        </FieldGroup>
        <form.Subscribe
          selector={(formState) => [
            formState.canSubmit,
            formState.isSubmitting,
          ]}
        >
          {([canSubmit, isSubmitting]) => (
            <ProgressButtonLoading
              type="submit"
              state={isSubmitting}
              className="mt-2 h-11 w-full rounded-lg bg-primary font-semibold text-primary-foreground transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 disabled:scale-100 disabled:opacity-60"
              mainText="Sign In"
              loadingText="Logging in..."
            />
          )}
        </form.Subscribe>
      </form>

      <div className="flex items-center gap-4">
        <Separator className="flex-1" />
        <span className="text-xs font-medium text-muted-foreground">OR</span>
        <Separator className="flex-1" />
      </div>

      <div className="flex flex-col gap-3">
        <button className="flex items-center justify-center gap-3 rounded-lg border border-border bg-background px-4 py-2.5 transition-all duration-200 hover:bg-muted hover:shadow-sm active:scale-95">
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M5.2662 9.76453C6.19903 6.93863 8.85469 4.90909 12 4.90909C13.6909 4.90909 15.2182 5.50909 16.4182 6.49091L19.9091 3C17.7818 1.14545 15.0545 0 12 0C7.30909 0 3.25455 2.87273 1.27273 7.03636L5.2662 9.76453Z"
            />
            <path
              fill="#FBBC05"
              d="M1.27273 7.03636L5.2662 9.76453C4.23333 12.8939 4.23333 16.3061 5.2662 19.4355L1.27273 22.1636C.463636 20.4909 0 18.6182 0 16.6364C0 12.5091 2.05455 8.85455 5.2662 7.03636V7.03636Z"
            />
            <path
              fill="#34A853"
              d="M12 24C15.1091 24 17.9091 22.9818 19.9818 21.2364L16.0364 18.1636C14.8909 18.9273 13.5273 19.3818 12 19.3818C8.85469 19.3818 6.19903 17.3523 5.2662 14.5264L1.27273 17.2545C3.25455 21.1273 7.30909 24 12 24Z"
            />
            <path
              fill="#4285F4"
              d="M23.4909 12.2727C23.4909 11.4909 23.4182 10.7091 23.2727 9.94545H12V14.5091H18.4727C18.1818 16.0182 17.3273 17.3091 16.0364 18.1636L19.9818 21.2364C22.3091 19.1091 23.4909 15.9636 23.4909 12.2727Z"
            />
          </svg>
          <span className="text-sm font-bold text-gray-700">
            Continue with Google
          </span>
        </button>

        <button className="flex items-center justify-center gap-3 rounded-lg border border-border bg-background px-4 py-2.5 transition-all duration-200 hover:bg-muted hover:shadow-sm active:scale-95">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span className="text-sm font-bold text-gray-700">
            Continue with Facebook
          </span>
        </button>
      </div>

      <div className="text-center text-sm text-foreground">
        New here?{" "}
        <Link
          href="#"
          className="font-semibold text-primary transition-colors hover:underline"
        >
          Create an account
        </Link>
      </div>
    </div>
  )
}
