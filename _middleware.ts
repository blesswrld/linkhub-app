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

    let shouldRedirect = false;

    // Проверяем каждый cookie
    authCookies.forEach((name) => {
        const value = req.cookies.get(name)?.value;
        if (value && !value.startsWith("https://linkhub-red.vercel.app")) {
            shouldRedirect = true;
        }
    });

    if (shouldRedirect) {
        const res = NextResponse.redirect(new URL("/admin", req.url));

        // Удаляем все служебные authjs cookies
        authCookies.forEach((name) => {
            res.cookies.set(name, "", { maxAge: -1, path: "/" });
        });

        console.warn(
            "[middleware] очищены старые authjs-куки и выполнен редирект на /admin"
        );
        return res;
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};

export const runtime = "nodejs";
