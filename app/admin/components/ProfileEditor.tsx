"use client";

import { useState, useTransition } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
} from "@mui/material";
import { Profile } from "@/types";
import { updateProfile } from "@/lib/actions";

interface ProfileEditorProps {
    profile: Profile;
    onProfileUpdate: () => void;
}

// Определяем список доступных тем
const availableThemes = [
    { value: "default", label: "Default Light" },
    { value: "dark-pro", label: "Dark Pro" },
    { value: "mint", label: "Mint Green" },
    { value: "peach", label: "Peach" },
    { value: "forest", label: "Forest Green" },
    { value: "ocean", label: "Ocean Blue" },
    { value: "sunset", label: "Sunset Orange" },
    { value: "royal", label: "Royal Purple" },
    { value: "monochrome", label: "Monochrome" },
    { value: "sakura", label: "Sakura Pink" },
];

export default function ProfileEditor({
    profile,
    onProfileUpdate,
}: ProfileEditorProps) {
    const [formData, setFormData] = useState({
        username: profile.username,
        description: profile.description || "",
        theme: profile.theme || "default",
    });
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // --- РАЗДЕЛЯЕМ ОБРАБОТЧИКИ ---

    // Обработчик для текстовых полей (TextField)
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Обработчик для выпадающего списка (Select)
    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        startTransition(async () => {
            try {
                await updateProfile(formData);
                setSuccess("Profile updated successfully!");
                onProfileUpdate(); // Говорим родительской странице обновиться

                // --- ДОБАВЛЯЕМ ЭТУ СТРОЧКУ ---
                window.location.reload();
            } catch (err) {
                console.error("Failed to update profile:", err);
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unknown error occurred.");
                }
            }
        });
    };

    return (
        <Paper component="section" sx={{ p: 2, mb: 4 }}>
            <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
                {" "}
                Edit Profile{" "}
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
                <TextField
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange} // <-- Используем правильный обработчик
                    fullWidth
                    helperText={`Your public page will be at /p/${formData.username}`}
                />
                <TextField
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange} // <-- Используем правильный обработчик
                    fullWidth
                    multiline
                    rows={3}
                />
                <FormControl fullWidth>
                    <InputLabel id="theme-select-label">Theme</InputLabel>
                    <Select
                        labelId="theme-select-label"
                        id="theme-select"
                        name="theme"
                        value={formData.theme}
                        label="Theme"
                        onChange={handleSelectChange} // <-- Используем правильный обработчик
                    >
                        {availableThemes.map((theme) => (
                            <MenuItem key={theme.value} value={theme.value}>
                                {theme.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {error && <Alert severity="error">{error}</Alert>}
                {success && <Alert severity="success">{success}</Alert>}
                <Box sx={{ alignSelf: "flex-end" }}>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isPending}
                    >
                        {isPending ? "Saving..." : "Save Profile"}
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
}
