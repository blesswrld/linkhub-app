import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import { LinkData } from "@/types";

// Определяем пропсы, которые принимает наш компонент
interface DeleteLinkDialogProps {
    open: boolean;
    linkToDelete: LinkData | null;
    onClose: () => void;
    onConfirm: () => void;
}

export default function DeleteLinkDialog({
    open,
    linkToDelete,
    onClose,
    onConfirm,
}: DeleteLinkDialogProps) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete the link titled &quot;
                    {linkToDelete?.title}&quot;? This action cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onConfirm} color="error" autoFocus>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}
