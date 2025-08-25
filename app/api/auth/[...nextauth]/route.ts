import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // <-- Импортируем нашу чистую конфигурацию

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
