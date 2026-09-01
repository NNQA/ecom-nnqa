export const ROLES = ["customer", "vendor", "admin"] as const

export type Role = (typeof ROLES)[number]

export const PERMISSIONS = {} as const

// export type Permission = typeof PERMISSIONS[number];

// export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
//     customer: ['read'],
//     vendor: ['read', 'write'],
//     admin: ['read', 'write', 'delete'],
// };
