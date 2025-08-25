"use client";

import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import Link from "next/link";
import { getDashboardData } from "@/lib/actions";

export default function ViewPublicPageButton() {
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        // Получаем данные профиля на клиенте, чтобы узнать username
        getDashboardData()
            .then((profile) => {
                if (profile) {
                    setUsername(profile.username);
                }
            })
            .catch(console.error);
    }, []);

    if (!username) {
        // Пока username загружается, можно ничего не показывать или показывать неактивную кнопку
        return (
            <Button color="inherit" disabled>
                View Public Page
            </Button>
        );
    }

    return (
        <Button
            color="inherit"
            component={Link}
            href={`/p/${username}`}
            target="_blank"
        >
            View Public Page
        </Button>
    );
}
