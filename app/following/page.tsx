export default function FollowingPage() {
    const users = [
        "Premrog Official",
        "Creator One",
        "Creator Two",
        "Creator Three",
    ];

    return (
        <div className="min-h-screen bg-black text-white p-4">
            <h1 className="text-3xl font-bold text-pink-500">
                Following
            </h1>

            <div className="space-y-3 mt-5">
                {users.map((user) => (
                    <div
                        key={user}
                        className="bg-gray-900 p-4 rounded-lg flex justify-between"
                    >
                        <span>{user}</span>

                        <button className="bg-pink-600 px-4 py-1 rounded">
                            Following
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}