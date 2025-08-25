import type { AuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import GitHubProvider from "next-auth/providers/github";

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        }),
    ],
    session: { strategy: "database" },
    secret: process.env.NEXTAUTH_SECRET,
    cookies: {
        state: {
            name: "next-auth.state",
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
            },
        },
        callbackUrl: {
            name: `next-auth.callback-url`,
            options: {
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
            },
        },
    },
    events: {
        async createUser({ user }) {
            // Этот ивент срабатывает ПОСЛЕ успешного создания User в signIn
            if (user.email) {
                const usernameBase = (user.name || user.email.split("@")[0])
                    .toLowerCase()
                    .replace(/[^a-z0-9]/g, "");
                const username = usernameBase + Date.now().toString().slice(-4);
                await prisma.profile.create({
                    data: {
                        userId: user.id,
                        username: username,
                        avatar: user.image,
                        description: "Welcome to my LinkHub page!",
                    },
                });
            }
        },
    },
    callbacks: {
        async session({ session, user }) {
            if (session.user) {
                session.user.id = user.id;
            }
            return session;
        },
    },
    // --- ДОБАВЛЯЕМ ЭТУ СЕКЦИЮ ДЛЯ ОТЛАДКИ ---
    pages: {
        error: "/api/auth/error", // Убедимся, что он использует стандартную страницу
    },
};
