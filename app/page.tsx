import Link from "next/link";

export default function Page() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <Link
                href="/login"
                className="bg-pink-600 text-white px-6 py-3 rounded-xl"
            >
                Open Premrog
            </Link>
        </div>
    );
}