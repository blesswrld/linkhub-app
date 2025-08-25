import Button from "@mui/material/Button";
import Link from "next/link";

export default function HomePage() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
            <h1 className="text-5xl font-bold text-gray-800">
                Welcome to <span className="text-blue-600">LinkHub</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600">
                Your one link for everything. Share all your profiles in one
                place.
            </p>
            <div className="mt-8 flex gap-4">
                <Button
                    component={Link}
                    href="/p/elonmusk"
                    variant="contained"
                    size="large"
                >
                    View Demo Profile
                </Button>
                <Button
                    component={Link}
                    href="/admin"
                    variant="outlined"
                    size="large"
                >
                    Go to Admin Panel
                </Button>
            </div>
        </main>
    );
}
