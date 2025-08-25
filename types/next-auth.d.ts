import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string; // Добавляем наше поле id
        } & DefaultSession["user"];
    }
}
