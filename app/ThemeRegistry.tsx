"use client";

import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { createTheme, ThemeProvider, Theme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { PaletteMode } from "@mui/material";

// Создаем контекст для переключения темы
const ColorModeContext = createContext({ toggleColorMode: () => {} });

// Хук для легкого доступа к функции переключения
export const useColorMode = () => useContext(ColorModeContext);

export default function ThemeRegistry({
    children,
}: {
    children: React.ReactNode;
}) {
    // Состояние для хранения текущего режима ('light' или 'dark')
    const [mode, setMode] = useState<PaletteMode>("light");

    // При первой загрузке проверяем localStorage
    useEffect(() => {
        try {
            const savedMode = localStorage.getItem(
                "color-mode"
            ) as PaletteMode | null;
            const prefersDark =
                window.matchMedia &&
                window.matchMedia("(prefers-color-scheme: dark)").matches;
            if (savedMode) {
                setMode(savedMode);
            } else if (prefersDark) {
                setMode("dark");
            }
        } catch (e) {
            // localStorage может быть недоступен (например, в приватном режиме Safari)
            console.error("Could not access localStorage for color mode.", e);
        }
    }, []);

    // Функция для переключения темы
    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => {
                    const newMode = prevMode === "light" ? "dark" : "light";
                    // Сохраняем выбор в localStorage
                    try {
                        localStorage.setItem("color-mode", newMode);
                        // Добавляем/убираем класс .dark на <html> для Tailwind
                        document.documentElement.classList.toggle(
                            "dark",
                            newMode === "dark"
                        );
                    } catch (e) {
                        console.error(
                            "Could not save color mode to localStorage.",
                            e
                        );
                    }
                    return newMode;
                });
            },
        }),
        []
    );

    // Создаем тему MUI, которая зависит от нашего состояния `mode`
    const theme: Theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                },
                // Применяем наши шрифты к компонентам MUI
                typography: {
                    fontFamily: "var(--font-geist-sans)",
                    h1: { fontFamily: "var(--font-geist-sans)" },
                    // ... можно настроить для всех заголовков
                    button: { fontFamily: "var(--font-geist-mono)" },
                },
            }),
        [mode]
    );

    // Применяем класс .dark к <html> при изменении `mode`
    useEffect(() => {
        document.documentElement.classList.toggle("dark", mode === "dark");
        document.body.setAttribute("id", "__next"); // Убедимся, что id на месте
    }, [mode]);

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}
