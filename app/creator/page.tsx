export default function CreatorPage() {
    return (
        <div className="bg-black text-white min-h-screen p-4">
            <h1 className="text-3xl font-bold text-pink-500">
                Creator Dashboard
            </h1>

            <div className="grid grid-cols-2 gap-4 mt-6">

                <div className="bg-gray-900 p-4 rounded-xl">
                    <p>Followers</p>
                    <h2 className="text-3xl">0</h2>
                </div>

                <div className="bg-gray-900 p-4 rounded-xl">
                    <p>Views</p>
                    <h2 className="text-3xl">0</h2>
                </div>

                <div className="bg-gray-900 p-4 rounded-xl">
                    <p>Revenue</p>
                    <h2 className="text-3xl">₹0</h2>
                </div>

                <div className="bg-gray-900 p-4 rounded-xl">
                    <p>Withdrawable</p>
                    <h2 className="text-3xl">₹0</h2>
                </div>

            </div>

            <button className="bg-pink-600 w-full mt-6 p-4 rounded-xl">
                Apply Monetization
            </button>
        </div>
    );
}