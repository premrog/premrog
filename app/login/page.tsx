import Link from "next/link";

export default function ForgotPasswordPage() {
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

              <button className="w-full bg-pink-600 p-3 rounded">
                  Send Reset Link
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