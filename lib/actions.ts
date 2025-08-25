"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "./auth";
import { prisma } from "./prisma";
import { LinkData } from "@/types";

// --- Функция для получения данных текущего пользователя ---

export async function getDashboardData() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        throw new Error("Not authenticated");
    }

    const userProfile = await prisma.profile.findUnique({
        where: {
            userId: session.user.id,
        },
        include: {
            links: {
                orderBy: {
                    // будем сортировать по ID, что эквивалентно дате создания
                    id: "asc",
                },
            },
        },
    });

    if (!userProfile) {
        // Эта ситуация может возникнуть на мгновение после первого входа,
        // пока профиль создается. Можно вернуть null или кинуть ошибку.
        throw new Error("Profile not found for the current user.");
    }

    return userProfile;
}

// --- CRUD операции для ссылок ---

// Helper-функция для проверки прав доступа
async function getProfileForCurrentUser() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error("Not authenticated");

    const profile = await prisma.profile.findUnique({
        where: { userId: session.user.id },
    });
    if (!profile) throw new Error("Profile not found");

    return profile;
}

// Добавление новой ссылки
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

    // Дополнительная проверка, что ссылка принадлежит этому профилю
    const link = await prisma.link.findFirst({
        where: { id: linkData.id, profileId: profile.id },
    });

    if (!link) {
        throw new Error(
            "Link not found or you do not have permission to edit it."
        );
    }
    // Обновляем все возможные поля
    await prisma.link.update({
        where: { id: linkData.id },
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

    // Проверяем, что ссылка, которую пытаются удалить, принадлежит текущему пользователю
    const link = await prisma.link.findFirst({
        where: {
            id: linkId,
            profileId: profile.id,
        },
    });

    if (!link) {
        throw new Error(
            "Link not found or you do not have permission to delete it."
        );
    }

    await prisma.link.delete({
        where: { id: linkId },
    });

    revalidatePath("/admin");
    revalidatePath(`/p/${profile.username}`);
}

// Публичная функция для получения данных профиля по username
export async function getPublicProfile(username: string) {
    const profile = await prisma.profile.findUnique({
        where: { username },
        include: {
            links: true,
        },
    });

    return profile;
}

export async function updateProfile(formData: {
    username: string;
    description: string;
    theme: string; // <-- Добавляем поле
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
    revalidatePath(`/p/${profile.username}`); // старый путь
    revalidatePath(`/p/${formData.username}`); // новый путь
}
