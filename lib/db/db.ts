import "server-only"
import postgres from "postgres";
import { remember } from "@epic-web/remember";


export function createDb() {
    if (process.env.DATABASE_URL == null) {
        throw new Error("DATABASE_URL is not defined");
    }
    const db = postgres(process.env.DATABASE_URL);
    console.log(process.env.DATABASE_URL)
    return db;
}
const db = remember("db", () => {
    return createDb();
});

export function useDb() {
    return db;
}

