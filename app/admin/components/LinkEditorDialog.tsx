"use client";

import { useEffect, useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Box,
} from "@mui/material";
import { LinkData } from "@/types";

interface LinkEditorDialogProps {
    open: boolean;
    onClose: () => void;
    // id теперь опциональный string
    onSave: (link: Omit<LinkData, "id"> & { id?: string }) => void;
    linkToEdit?: LinkData | null;
}

const emptyFormState = { title: "", url: "" };

export default function LinkEditorDialog({
    open,
    onClose,
    onSave,
    linkToEdit,
}: LinkEditorDialogProps) {
    const [formData, setFormData] = useState(emptyFormState);
    const isEditing = !!linkToEdit;

    useEffect(() => {
        if (open) {
            setFormData(
                linkToEdit
                    ? { title: linkToEdit.title, url: linkToEdit.url }
                    : emptyFormState
            );
        }
    }, [open, linkToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        // dataToSave теперь всегда будет иметь правильный тип
        const dataToSave = isEditing
            ? { ...formData, id: linkToEdit.id }
            : formData;
        onSave(dataToSave);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                {isEditing ? "Edit Link" : "Add New Link"}
            </DialogTitle>
            <DialogContent>
                <Box
                    component="form"
                    noValidate
                    autoComplete="off"
                    sx={{ mt: 1 }}
                >
                    <TextField
                        autoFocus
                        margin="dense"
                        name="title"
                        label="Title"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={formData.title}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="url"
                        label="URL"
                        type="url"
                        fullWidth
                        variant="outlined"
                        value={formData.url}
                        onChange={handleChange}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} variant="contained">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}
