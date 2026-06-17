export default function HomePage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <div className="sticky top-0 bg-black p-4 border-b border-gray-800">
                <h1 className="text-2xl font-bold text-pink-500">
                    PREMROG
                </h1>
            </div>

            <div className="flex gap-4 overflow-x-auto p-4">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item}>
                        <div className="w-16 h-16 rounded-full bg-pink-500"></div>
                        <p className="text-xs mt-1">Story</p>
                    </div>
                ))}
            </div>

            <div className="p-4">
                <div className="bg-gray-900 rounded-xl p-4">
                    <h2 className="font-bold">Premrog Official</h2>

                    <div className="h-72 bg-gray-700 rounded mt-3"></div>

                    <div className="flex gap-5 mt-4">
                        <button>❤️ Like</button>
                        <button>💬 Comment</button>
                        <button>📤 Share</button>
                    </div>
                </div>
            </div>
        </div>
    );
}