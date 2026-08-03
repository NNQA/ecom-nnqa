import postgres from "postgres";

export function createDb() {
    return postgres(process.env.DATABASE_URL!, {
        ssl: "require",
        max: 1,
        idle_timeout: 20,
        connect_timeout: 10,
        prepare: false,
    });
}