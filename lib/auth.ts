import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),

    providers: [
        GitHub({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
    ],

    secret: process.env.AUTH_SECRET,
    session: { strategy: "database" },

    // Используем безопасные куки только на проде
    useSecureCookies: process.env.NODE_ENV === "production",

    events: {
        async createUser({ user }) {
            try {
                // Защита от null
                const base = (user.name || user.email?.split("@")[0] || "user")
                    .toLowerCase()
                    .replace(/[^a-z0-9]/g, "");
                const username = base + Date.now().toString().slice(-4);

                await prisma.profile.create({
                    data: {
                        userId: user.id,
                        username,
                        avatar: user.image || null,
                        description: "Welcome to my LinkHub page!",
                    },
                });
            } catch (error) {
                console.error(
                    "[NextAuth][createUser] ошибка при создании профиля:",
                    error
                );
                // не падаем полностью, чтобы auth продолжил работу
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
});
