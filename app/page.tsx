import Link from "next/link";

export default function Page() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FFF5F7]">
            <Link
                href="/login"
                className="bg-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-pink-500 shadow-md shadow-pink-200 transition"
            >
                Open Premrog
            </Link>
        </div>
    );
}