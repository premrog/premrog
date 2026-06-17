export default function VideoCallPage() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
            <div className="w-80 h-96 bg-gray-900 rounded-xl"></div>

            <div className="flex gap-5 mt-5">
                <button className="bg-red-600 px-6 py-3 rounded">
                    End
                </button>

                <button className="bg-green-600 px-6 py-3 rounded">
                    Camera
                </button>
            </div>
        </div>
    );
}