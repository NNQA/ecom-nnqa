"use server"
import { auth } from "@/shared/lib/auth/server-auth"
import { isRedirectError } from "next/dist/client/components/redirect-error" // Hoặc kiểm tra digest
import { getDb } from "@/shared/lib/db/db.server"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"

interface SignUpProps {
  email: string
  password: string
  username: string
}

const secret = new TextEncoder().encode(process.env.SIGNUP_COOKIE_SECRET!)
const COOKIE_NAME = "signup_progress"

export async function setEmailVerificationToken(email: string) {
  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime("30m")
    .sign(secret)
  ;(await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/signup",
    maxAge: 60 * 30,
  })
}

export async function getSignupEmail(): Promise<string | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload.email as string
  } catch {
    return null
  }
}

export async function clearSignupEmail() {
  ;(await cookies()).delete(COOKIE_NAME)
}

export async function checkEmailAvailability(email: string) {
  try {
    if (!email) {
      throw new Error("Email is required")
    }

    const sql = getDb()

    const [existing] =
      await sql`SELECT id, "emailVerified" FROM neon_auth.user WHERE email = ${email}`

    if (existing?.emailVerified) {
      throw new Error("This email is already in use. Please log in instead.")
    }

    if (existing && !existing.emailVerified) {
      console.log("true")
      const { error } = await auth.sendVerificationEmail({
        email,
      })

      if (error) {
        throw new Error(error.message)
      }

      redirect("/signup/verify")
    }
  } catch (error) {
    if (
      isRedirectError(error) ||
      (error instanceof Error && error.message === "NEXT_REDIRECT")
    ) {
      throw error
    }
    throw new Error(
      `Failed to check email availability: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}
export async function SignUpWithEmailAndPassword(
  email: string,
  password: string
) {
  try {
    const { error } = await auth.signUp.email({
      email,
      name: email.split("@")[0],
      password,
    })

    if (error) {
      return { error: error.message || "Failed to create account" }
    }
  } catch (error) {
    throw new Error(
      `Failed to sign up: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}

export async function SignUp({ email, password, username }: SignUpProps) {
  try {
    const { error } = await auth.signUp.email({
      email,
      name: username ? username : email.split("@")[0],
      password,
    })
    const sql = getDb()

    if (error) {
      return { error: error.message || "Failed to create account" }
    }
  } catch (error) {
    throw new Error(
      `Failed to sign up: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}
