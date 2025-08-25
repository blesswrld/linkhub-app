export interface LinkData {
    id: string;
    title: string;
    url: string;
    clickCount?: number | null;
    thumbnailUrl?: string | null;
    order?: number | null;
    createdAt?: Date;
}

export interface Profile {
    id: string;
    username: string;
    description: string | null;
    avatar: string | null;
    theme: string;
    links: LinkData[];
}
