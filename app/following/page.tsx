export default function FollowingPage() {
    const users = [
        "Premrog Official",
        "Creator One",
        "Creator Two",
        "Creator Three",
    ];

    return (
        <div className="min-h-screen bg-[#FFF5F7] text-[#000000] p-4 font-sans">
            <h1 className="text-3xl font-black text-pink-600">
                Following
            </h1>

            <div className="space-y-3 mt-5">
                {users.map((user) => (
                    <div
                        key={user}
                        className="bg-white border border-pink-200 p-4 rounded-2xl flex justify-between items-center"
                    >
                        <span className="font-bold">{user}</span>

                        <button className="bg-pink-600 hover:bg-pink-500 text-white font-bold px-4 py-1.5 rounded-xl text-xs transition">
                            Following
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}