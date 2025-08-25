import dotenv from "dotenv";

// Принудительно загружаем переменные из .env файла
dotenv.config();

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Добавляем этот блок для настройки изображений
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "i.pravatar.cc",
                port: "",
                pathname: "/**",
            },
            // ДОБАВЛЯЕМ ДОМЕН GITHUB
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
                port: "",
                pathname: "/**",
            },
        ],
    },
};

export default nextConfig;
