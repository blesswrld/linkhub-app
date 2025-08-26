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

    useSecureCookies: process.env.NODE_ENV === "production",

    events: {
        async createUser({ user }) {
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
            // Этот коллбэк по-прежнему нужен, чтобы добавлять наш ID в сессию.
            if (session.user) {
                session.user.id = user.id;
            }
            return session;
        },
    },
});
