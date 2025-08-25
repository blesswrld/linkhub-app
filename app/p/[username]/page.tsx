import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPublicProfile } from "@/lib/actions";
import LinkButton from "@/components/ui/LinkButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Profile } from "@/types";

interface UserPageProps {
    params: { username: string };
    searchParams: { [key: string]: string | string[] | undefined };
}

// Создаем объект с демо-данными
const demoProfile: Profile = {
    id: "demo-user",
    username: "elonmusk",
    avatar: "https://i.pravatar.cc/150?u=elonmusk",
    description: "CEO of SpaceX & Tesla. This is a demo profile.",
    theme: "dark-pro",
    links: [
        { id: "1", title: "SpaceX", url: "https://www.spacex.com/" },
        { id: "2", title: "Tesla", url: "https://www.tesla.com/" },
        { id: "3", title: "X (Twitter)", url: "https://twitter.com/elonmusk" },
    ],
};

export default async function UserPage({ params }: UserPageProps) {
    const { username } = params;
    let profile: Profile | null = null;

    if (username === "elonmusk") {
        profile = demoProfile;
    } else {
        // Для всех остальных username ищем в базе данных
        profile = await getPublicProfile(username);
    }

    const session = await getServerSession(authOptions);

    if (!profile) {
        notFound();
    }

    const userId = session?.user?.id;
    const isOwner = !!userId && userId === (profile as any).userId; // `as any` чтобы TS не ругался на отсутствие userId у демо
    const themeClass = `theme-${profile.theme || "default"}`;

    return (
        <main
            className={`${themeClass} relative min-h-screen flex items-center justify-center p-4 font-sans bg-[var(--page-bg)] text-[var(--text-primary)]`}
        >
            {isOwner && (
                <Link
                    href="/admin"
                    className="absolute top-5 left-5 p-2 rounded-full bg-[var(--button-bg)] hover:bg-[var(--button-bg-hover)] transition-colors"
                    aria-label="Back to Admin Panel"
                >
                    <ArrowBackIcon className="text-[var(--button-text)]" />
                </Link>
            )}
            <div className="w-full max-w-md mx-auto">
                <div className="flex flex-col items-center space-y-6">
                    <Image
                        src={profile.avatar || "/default-avatar.png"}
                        alt={`${profile.username}'s avatar`}
                        width={128}
                        height={128}
                        className="rounded-full border-4 border-white shadow-lg"
                        priority
                    />
                    <div className="text-center">
                        <h1 className="text-2xl font-bold">
                            @{profile.username}
                        </h1>
                        <p className="mt-1 text-[var(--text-secondary)]">
                            {profile.description}
                        </p>
                    </div>
                    <div className="w-full space-y-4">
                        {profile.links.map((link) => (
                            <LinkButton key={link.id} link={link} />
                        ))}
                    </div>
                    <footer className="mt-8">
                        <p className="font-bold text-lg text-[var(--brand-text)]">
                            LinkHub
                        </p>
                    </footer>
                </div>
            </div>
        </main>
    );
}
