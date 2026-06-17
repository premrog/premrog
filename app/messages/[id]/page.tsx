export default function ChatPage() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <div className="p-4 border-b border-gray-800">
                Rahul
            </div>

            <div className="flex-1 p-4">
                <div className="bg-gray-800 p-2 rounded w-fit">
                    Hello
                </div>
            </div>

            <div className="p-4 flex gap-2">
                <input
                    className="flex-1 bg-gray-900 p-3 rounded"
                    placeholder="Message..."
                />

                <button className="bg-pink-600 px-5 rounded">
                    Send
                </button>
            </div>
        </div>
    );
}