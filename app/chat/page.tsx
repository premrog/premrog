import BottomNav from "@/components/BottomNav";

export default function ChatPage() {
    const chats = [
        "Creator 1",
        "Creator 2",
        "Creator 3",
        "Premrog Support",
    ];

    return (
        <div className="bg-black text-white min-h-screen pb-20">
            <div className="p-4 text-2xl font-bold">
                Chats
            </div>

            {chats.map((chat) => (
                <div
                    key={chat}
                    className="p-4 border-b border-gray-800"
                >
                    {chat}
                </div>
            ))}

            <BottomNav />
        </div>
    );
}
