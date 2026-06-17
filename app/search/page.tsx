export default function SearchPage() {
    return (
        <div className="min-h-screen bg-black text-white p-4">
            <input
                placeholder="Search users..."
                className="w-full p-3 rounded bg-gray-900"
            />

            <div className="mt-6 space-y-3">
                <div className="bg-gray-900 p-3 rounded">
                    Premrog Official
                </div>

                <div className="bg-gray-900 p-3 rounded">
                    Creator One
                </div>

                <div className="bg-gray-900 p-3 rounded">
                    Creator Two
                </div>
            </div>
        </div>
    );
}