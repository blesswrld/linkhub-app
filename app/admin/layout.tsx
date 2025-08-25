"use client"; // <-- Делаем layout клиентским, чтобы использовать хук

import {
    AppBar,
    Box,
    Container,
    IconButton,
    Toolbar,
    Typography,
    useTheme,
} from "@mui/material";
import React from "react";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useColorMode } from "@/app/ThemeRegistry";
import AuthButton from "./components/AuthButton";
import ViewPublicPageButton from "./components/ViewPublicPageButton"; // <-- Импортируем кнопку

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const theme = useTheme();
    const colorMode = useColorMode();

    return (
        <Box>
            <AppBar position="static">
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        LinkHub Admin
                    </Typography>

                    <AuthButton />

                    {/* ЗАМЕНЯЕМ СТАРУЮ КНОПК */}
                    <ViewPublicPageButton />

                    <IconButton
                        sx={{ ml: 1 }}
                        onClick={colorMode.toggleColorMode}
                        color="inherit"
                    >
                        {theme.palette.mode === "dark" ? (
                            <Brightness7Icon />
                        ) : (
                            <Brightness4Icon />
                        )}
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                {children}
            </Container>
        </Box>
    );
}
