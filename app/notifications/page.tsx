export default function NotificationsPage() {
    return (
        <div className="min-h-screen bg-black text-white p-4">
            <h1 className="text-2xl font-bold text-pink-500">
                Notifications
            </h1>

            <div className="mt-5 space-y-3">
                <div className="bg-gray-900 p-3 rounded">
                    Rahul liked your post ❤️
                </div>

                <div className="bg-gray-900 p-3 rounded">
                    Priya started following you 👤
                </div>

                <div className="bg-gray-900 p-3 rounded">
                    New comment on your reel 💬
                </div>
            </div>
        </div>
    );
}