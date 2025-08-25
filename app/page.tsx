"use client";

import Button from "@mui/material/Button";
import Link from "next/link";

export default function HomePage() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-center p-4">
            <h1 className="text-5xl font-bold text-gray-800 dark:text-gray-100">
                Welcome to{" "}
                <span className="text-blue-600 dark:text-blue-400">
                    LinkHub
                </span>
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Your one link for everything. Share all your profiles in one
                place.
            </p>
            <div className="mt-8 flex gap-4">
                {/* Эта кнопка теперь точно ведет на /p/elonmusk */}
                <Button
                    component={Link}
                    href="/p/elonmusk"
                    variant="contained"
                    size="large"
                >
                    View Demo Profile
                </Button>
                <Button
                    component={Link}
                    href="/admin"
                    variant="outlined"
                    size="large"
                >
                    Go to Admin Panel
                </Button>
            </div>
        </main>
    );
}
