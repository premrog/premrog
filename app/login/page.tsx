export default function LoginPage() {
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="w-full max-w-sm p-6">
                <h1 className="text-4xl font-bold text-pink-500 mb-8 text-center">
                    PREMROG
                </h1>

                <input
                    placeholder="Email or Mobile"
                    className="w-full p-3 rounded bg-gray-900 mb-4"
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-3 rounded bg-gray-900 mb-4"
                />

                <button className="w-full bg-pink-600 p-3 rounded">
                    Login
                </button>
            </div>
        </div>
    );
}