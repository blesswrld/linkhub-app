import { LinkData } from "@/types";
import { FC } from "react";

const LinkButton: FC<{ link: LinkData }> = ({ link }) => (
    <a
        // Ссылка теперь ведет на наш трекер
        href={`/api/track/${link.id}`}
        target="_blank"
        rel="noopener noreferrer"
        // Прямой приказ Tailwind использовать наши переменные. Hover тоже работает.
        className="block w-full text-center font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-105 bg-[var(--button-bg)] text-[var(--button-text)] hover:bg-[var(--button-bg-hover)]"
    >
        {link.title}
    </a>
);

export default LinkButton;
