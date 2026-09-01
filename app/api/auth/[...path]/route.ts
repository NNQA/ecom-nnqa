import { auth } from "@/shared/lib/auth/server-auth"

export const { GET, POST } = auth.handler()
