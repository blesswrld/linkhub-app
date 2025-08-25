import { Profile } from "@/types"; // Меняем UserProfile на Profile
import Image from "next/image";
import { FC } from "react";

interface UserProfileHeaderProps {
    //  Используем Profile и Pick
    user: Pick<Profile, "avatar" | "username" | "description">;
}

const UserProfileHeader: FC<UserProfileHeaderProps> = ({ user }) => {
    return (
        <>
            <Image
                src={user.avatar || "/default-avatar.png"} // Добавляем запасной аватар
                alt={`${user.username}'s avatar`}
                width={128}
                height={128}
                className="rounded-full border-4 border-white shadow-lg"
                priority
            />
            <div className="text-center">
                <h1 className="text-2xl font-bold">@{user.username}</h1>
                <p className="mt-1 text-secondary">{user.description}</p>
            </div>
        </>
    );
};

export default UserProfileHeader;
