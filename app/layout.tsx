import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "./ThemeRegistry";
import AuthProvider from "./AuthProvider"; // <-- Импортируем

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "LinkHub",
    description: "Your one link for everything.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body id="__next" className={inter.className}>
                <AuthProvider>
                    {/* <-- Оборачиваем */}
                    <ThemeRegistry>{children}</ThemeRegistry>
                </AuthProvider>
            </body>
        </html>
    );
}
