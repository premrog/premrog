export default function MessagesPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <div className="p-4 border-b border-gray-800">
                <h1 className="text-2xl font-bold">
                    Messages
                </h1>
            </div>

            <div className="space-y-2 p-4">
                <div className="bg-gray-900 p-4 rounded">
                    Rahul
                </div>

                <div className="bg-gray-900 p-4 rounded">
                    Priya
                </div>

                <div className="bg-gray-900 p-4 rounded">
                    Amit
                </div>
            </div>
        </div>
    );
}