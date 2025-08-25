"use client";

import { useState, useEffect, useTransition } from "react";
import {
    Box,
    Button,
    Typography,
    CircularProgress,
    Alert,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useSession } from "next-auth/react";
import { LinkData, Profile } from "@/types";
import {
    getDashboardData,
    addLink,
    updateLink,
    deleteLink,
} from "@/lib/actions";

// Импортируем все наши компоненты
import LinkList from "./components/LinkList";
import DeleteLinkDialog from "./components/DeleteLinkDialog";
import LinkEditorDialog from "./components/LinkEditorDialog";
import ProfileEditor from "./components/ProfileEditor"; // <-- НАШ КОМПОНЕНТ

export default function AdminPage() {
    const { data: session, status } = useSession();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    // Состояния для диалогов
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [linkToDelete, setLinkToDelete] = useState<LinkData | null>(null);
    const [isEditorDialogOpen, setIsEditorDialogOpen] = useState(false);
    const [linkToEdit, setLinkToEdit] = useState<LinkData | null>(null);

    const refreshData = () => {
        setIsLoading(true);
        getDashboardData()
            .then((data) => {
                setProfile(data);
                setError(null);
            })
            .catch(() => {
                setProfile(null);
                setError("Failed to refresh data.");
            })
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        if (status === "authenticated") refreshData();
        if (status === "unauthenticated") {
            setProfile(null);
            setIsLoading(false);
        }
    }, [status]);

    // id теперь опциональный string
    const handleSaveLink = (
        linkData: Omit<LinkData, "id"> & { id?: string }
    ) => {
        startTransition(async () => {
            try {
                if (linkData.id) {
                    await updateLink({ ...linkData, id: linkData.id });
                } else {
                    await addLink({ title: linkData.title, url: linkData.url });
                }
                refreshData();
                setIsEditorDialogOpen(false);
            } catch {
                setError("Failed to save link.");
            }
        });
    };

    const confirmDeleteLink = () => {
        if (!linkToDelete) return;
        startTransition(async () => {
            try {
                await deleteLink(linkToDelete.id);
                refreshData();
                setIsDeleteDialogOpen(false);
            } catch {
                setError("Failed to delete link.");
            }
        });
    };

    // Функции управления UI
    const handleOpenDeleteDialog = (link: LinkData) => {
        setIsDeleteDialogOpen(true);
        setLinkToDelete(link);
    };
    const handleCloseDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
        setLinkToDelete(null);
    };
    const handleOpenEditorForAdd = () => {
        setIsEditorDialogOpen(true);
        setLinkToEdit(null);
    };
    const handleOpenEditorForEdit = (link: LinkData) => {
        setIsEditorDialogOpen(true);
        setLinkToEdit(link);
    };
    const handleCloseEditor = () => setIsEditorDialogOpen(false);

    if (status === "loading")
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    if (!session)
        return (
            <Alert severity="info">
                Please sign in to manage your LinkHub profile.
            </Alert>
        );
    if (error) return <Alert severity="error">{error}</Alert>;
    if (isLoading || !profile)
        return (
            <Box textAlign="center" mt={4}>
                <CircularProgress />
                <Typography mt={2}>Loading profile...</Typography>
            </Box>
        );

    return (
        <Box sx={{ opacity: isPending ? 0.7 : 1 }}>
            {/* ДОБАВЛЯЕМ РЕДАКТОР ПРОФИЛЯ */}
            <ProfileEditor profile={profile} onProfileUpdate={refreshData} />

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                }}
            >
                <Typography variant="h4" component="h1">
                    {" "}
                    Manage Links{" "}
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={handleOpenEditorForAdd}
                >
                    {" "}
                    Add New Link{" "}
                </Button>
            </Box>

            <LinkList
                links={profile.links}
                onEdit={handleOpenEditorForEdit}
                onDelete={handleOpenDeleteDialog}
            />
            <DeleteLinkDialog
                open={isDeleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                onConfirm={confirmDeleteLink}
                linkToDelete={linkToDelete}
            />
            <LinkEditorDialog
                open={isEditorDialogOpen}
                onClose={handleCloseEditor}
                onSave={handleSaveLink}
                linkToEdit={linkToEdit}
            />
        </Box>
    );
}
