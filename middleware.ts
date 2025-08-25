export { auth as middleware } from "@/lib/auth"; // <-- СИНТАКСИС V5

export const config = {
    matcher: ["/admin/:path*"],
};
