import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const authCookies = [
        "authjs.callback-url",
        "authjs.csrf-token",
        "authjs.pkce.code_verifier",
        "__Secure-authjs.callback-url",
        "__Host-authjs.csrf-token",
        "__Secure-authjs.pkce.code_verifier",
    ];

    const res = NextResponse.redirect(new URL("/admin", req.url));

    // Принудительно удаляем все служебные куки
    authCookies.forEach((name) => {
        res.cookies.set(name, "", { maxAge: -1, path: "/" });
    });

    // Ставим корректный callback-url для новой сессии
    res.cookies.set(
        "__Secure-authjs.callback-url",
        "https://linkhub-red.vercel.app/admin",
        {
            path: "/",
            httpOnly: true,
            sameSite: "lax",
            secure: true,
        }
    );

    console.log(
        "[middleware] очищены старые authjs-куки и установлен новый callback-url"
    );

    return res;
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};

export const runtime = "nodejs";
