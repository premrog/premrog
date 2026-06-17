"use client";
import Link from "next/link";

import { useRouter } from "next/navigation";

export default function SignupPage() {
    const router = useRouter();
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="w-full max-w-sm p-6">

                <h1 className="text-4xl font-bold text-pink-500 text-center mb-8">
                    PREMROG
                </h1>

                <input
                    placeholder="Full Name"
                    className="w-full p-3 rounded bg-gray-900 mb-3"
                />

                <input
                    placeholder="Email"
                    className="w-full p-3 rounded bg-gray-900 mb-3"
                />

                <input
                    placeholder="Mobile Number"
                    className="w-full p-3 rounded bg-gray-900 mb-3"
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-3 rounded bg-gray-900 mb-4"
                />

                <button
                    onClick={() => router.push("/login")}
                    className="w-full bg-pink-600 p-3 rounded-lg mt-4"
                >
                    Create Account
                </button>

                <p className="text-center mt-5">
                    Already have account?
                </p>

                <Link
                    href="/login"
                    className="block text-center text-pink-500 mt-2"
                >
                    Login
                </Link>

            </div>
        </div>
    );
}