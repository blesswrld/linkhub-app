"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import {
    Button,
    Avatar,
    Box,
    Typography,
    CircularProgress,
} from "@mui/material";

export default function AuthButton() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <CircularProgress size={24} color="inherit" />;
    }

    if (session) {
        return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar
                    src={session.user?.image ?? ""}
                    sx={{ width: 32, height: 32 }}
                />
                <Typography sx={{ display: { xs: "none", sm: "block" } }}>
                    {session.user?.name}
                </Typography>
                <Button color="inherit" onClick={() => signOut()}>
                    Sign Out
                </Button>
            </Box>
        );
    }

    return (
        <Button color="inherit" onClick={() => signIn("github")}>
            Sign in with GitHub
        </Button>
    );
}
