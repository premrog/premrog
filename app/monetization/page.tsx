export default function MonetizationPage() {
    return (
        <div className="bg-black text-white min-h-screen p-4">

            <h1 className="text-3xl font-bold text-pink-500">
                Monetization
            </h1>

            <div className="bg-gray-900 rounded-xl p-5 mt-5">

                <p>Status</p>

                <h2 className="text-2xl mt-2">
                    Not Applied
                </h2>

            </div>

            <button className="bg-pink-600 w-full mt-5 p-4 rounded-xl">
                Apply Monetization
            </button>

        </div>
    );
}