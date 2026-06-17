export default function SettingsPage() {
    return (
        <div className="min-h-screen bg-black text-white p-4">
            <h1 className="text-3xl font-bold text-pink-500">
                Settings
            </h1>

            <div className="space-y-3 mt-5">
                <div className="bg-gray-900 p-4 rounded">
                    Account
                </div>

                <div className="bg-gray-900 p-4 rounded">
                    Privacy
                </div>

                <div className="bg-gray-900 p-4 rounded">
                    Notifications
                </div>

                <div className="bg-gray-900 p-4 rounded">
                    Security
                </div>
            </div>
        </div>
    );
}