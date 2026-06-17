"use client";
import Link from "next/link";

import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
    const router = useRouter();
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">

          <div className="w-full max-w-sm p-6">

              <h1 className="text-3xl font-bold text-pink-500 mb-8 text-center">
                  Forgot Password
              </h1>

              <input
                  placeholder="Email or Mobile"
                  className="w-full p-3 rounded bg-gray-900 mb-4"
              />

                <button
                    onClick={() => router.push("/home")}
                    className="w-full bg-pink-600 p-3 rounded-lg mt-4"
                >
                    Login
                </button>

              <Link
                  href="/login"
                  className="block text-center text-pink-500 mt-5"
              >
                  Back To Login
              </Link>

          </div>
      </div>
  );
}