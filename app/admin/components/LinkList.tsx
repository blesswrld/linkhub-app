import {
    IconButton,
    List,
    ListItem,
    ListItemText,
    Stack,
    Tooltip,
    Box, // Добавляем Box для контейнера
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import { LinkData } from "@/types";

interface LinkListProps {
    links: LinkData[];
    onEdit: (link: LinkData) => void;
    onDelete: (link: LinkData) => void;
}

export default function LinkList({ links, onEdit, onDelete }: LinkListProps) {
    if (links.length === 0) {
        return (
            <ListItem
                sx={{
                    justifyContent: "center",
                    color: "text.secondary",
                    my: 4,
                }}
            >
                You haven&apos;t added any links yet.
            </ListItem>
        );
    }

    return (
        <List>
            {links.map((link) => (
                <ListItem
                    key={link.id}
                    divider
                    sx={{
                        "&:hover": { bgcolor: "action.hover" },
                        // Используем flexbox для выравнивания
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    {/* Текст ссылки (занимает основное пространство) */}
                    <ListItemText primary={link.title} secondary={link.url} />

                    {/* --- БЛОК ДЛЯ ПРАВОЙ ЧАСТИ --- */}
                    {/* Контейнер для счетчика и кнопок */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        {/* Счетчик кликов */}
                        <Tooltip title="Total clicks" placement="top">
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={0.5}
                                sx={{ color: "text.secondary" }}
                            >
                                <AdsClickIcon fontSize="small" />
                                <span style={{ fontSize: "0.875rem" }}>
                                    {link.clickCount || 0}
                                </span>
                            </Stack>
                        </Tooltip>

                        {/* Кнопки управления */}
                        <Box>
                            <IconButton
                                edge="end"
                                aria-label="edit"
                                onClick={() => onEdit(link)}
                            >
                                <EditIcon />
                            </IconButton>
                            <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={() => onDelete(link)}
                                sx={{ ml: 1 }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </ListItem>
            ))}
        </List>
    );
}
