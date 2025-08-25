import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Мы используем сигнатуру, которая работала, и отключаем для нее проверку типов
export async function GET(
    req: NextRequest,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { params }: { params: any }
) {
    const { linkId } = params;
    const baseUrl = req.nextUrl.origin;

    if (!linkId) {
        return NextResponse.redirect(baseUrl);
    }

    try {
        const link = await prisma.link.update({
            where: { id: linkId },
            data: {
                clickCount: {
                    increment: 1,
                },
            },
        });

        if (link && link.url) {
            // ПРОВЕРКА URL
            let finalUrl = link.url;
            if (
                !finalUrl.startsWith("http://") &&
                !finalUrl.startsWith("https://")
            ) {
                finalUrl = `https://${finalUrl}`;
            }

            // ИСПОЛЬЗУЕМ БОЛЕЕ НАДЕЖНЫЙ NextResponse ДЛЯ РЕДИРЕКТА
            return NextResponse.redirect(finalUrl);
        } else {
            // Если ссылка не найдена, уводим на главную
            return NextResponse.redirect(baseUrl);
        }
    } catch (error) {
        console.error(
            `[TRACKING_ERROR] Failed to track link ID ${linkId}:`,
            error
        );
        // В случае любой ошибки, уводим на главную
        return NextResponse.redirect(baseUrl);
    }
}
