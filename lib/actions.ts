"use server";

import { revalidatePath } from "next/cache";
import { auth } from "./auth"; // <-- ПРАВИЛЬНЫЙ ИМПОРТ ДЛЯ V5
import { prisma } from "./prisma";
import { LinkData } from "@/types";

// Helper-функция, которая теперь использует auth() из V5
async function getProfileForCurrentUser() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Not authenticated");

    const profile = await prisma.profile.findUnique({
        where: { userId: session.user.id },
    });
    if (!profile) throw new Error("Profile not found");

    return profile;
}

// Эта функция теперь не падает, а СОЗДАЕТ профиль, если его нет.
export async function getDashboardData() {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Not authenticated");
    }

    const userId = session.user.id;
    let profile = await prisma.profile.findUnique({
        where: { userId },
        include: {
            links: { orderBy: { order: "asc" } },
        },
    });

    if (!profile) {
        const user = session.user;
        const usernameBase = (
            user.name ||
            user.email?.split("@")[0] ||
            `user${userId.slice(0, 4)}`
        )
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "");
        const username = usernameBase + Date.now().toString().slice(-4);

        profile = await prisma.profile.create({
            data: {
                userId: userId,
                username: username,
                avatar: user.image,
                description: "Welcome to my LinkHub page!",
                theme: "default",
                links: { create: [] },
            },
            include: { links: true },
        });
    }

    return profile;
}

// --- ФУНКЦИИ, КОТОРЫЕ ИСПОЛЬЗУЮТСЯ В ПРИЛОЖЕНИИ ---
export async function addLink(formData: { title: string; url: string }) {
    const profile = await getProfileForCurrentUser();

    // 1. Узнаем, сколько ссылок уже есть, чтобы определить следующий `order`
    const linkCount = await prisma.link.count({
        where: { profileId: profile.id },
    });

    // 2. Создаем ссылку, передавая новый `order`
    await prisma.link.create({
        data: {
            title: formData.title,
            url: formData.url,
            profileId: profile.id,
            order: linkCount, // Первая ссылка получит order=0, вторая order=1 и т.д.
        },
    });

    revalidatePath("/admin");
    revalidatePath(`/p/${profile.username}`);
}

// Обновление существующей ссылки
export async function updateLink(linkData: LinkData) {
    const profile = await getProfileForCurrentUser();

    await prisma.link.updateMany({
        where: { id: linkData.id, profileId: profile.id },
        data: {
            title: linkData.title,
            url: linkData.url,
            thumbnailUrl: linkData.thumbnailUrl,
        },
    });
    revalidatePath("/admin");
    revalidatePath(`/p/${profile.username}`);
}

// Удаление ссылки
export async function deleteLink(linkId: string) {
    const profile = await getProfileForCurrentUser();

    await prisma.link.deleteMany({
        where: { id: linkId, profileId: profile.id },
    });

    revalidatePath("/admin");
    revalidatePath(`/p/${profile.username}`);
}

export async function updateProfile(formData: {
    username: string;
    description: string;
    theme: string;
}) {
    const profile = await getProfileForCurrentUser();

    // Проверяем, не пытается ли пользователь занять уже существующий username
    if (formData.username !== profile.username) {
        const existingProfile = await prisma.profile.findUnique({
            where: { username: formData.username },
        });
        if (existingProfile) {
            throw new Error("Username is already taken.");
        }
    }

    await prisma.profile.update({
        where: { id: profile.id },
        data: {
            username: formData.username,
            description: formData.description,
            theme: formData.theme, // <-- Сохраняем тему в базу
        },
    });

    // Обновляем пути для нового и старого username
    revalidatePath("/admin");
    revalidatePath(`/p/${profile.username}`);
    revalidatePath(`/p/${formData.username}`);
}

export async function getPublicProfile(username: string) {
    const profile = await prisma.profile.findUnique({
        where: { username },
        include: {
            links: {
                orderBy: { order: "asc" }, // Сортируем по полю order
            },
        },
    });
    return profile;
}
