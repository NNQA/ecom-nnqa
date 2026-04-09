import { auth } from "@/lib/auth/server-auth";

export const { GET, POST } = auth.handler();