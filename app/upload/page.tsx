"use client";
export default function UploadPage() {
    return (
        <div className="min-h-screen bg-black text-white p-4">
            <h1 className="text-2xl font-bold text-pink-500">
                Upload Content
            </h1>

            <div className="space-y-4 mt-6">
                <button className="w-full p-4 bg-pink-600 rounded">
                    Upload Photo
                </button>

                <button className="w-full p-4 bg-purple-600 rounded">
                    Upload Story
                </button>

                <button className="w-full p-4 bg-blue-600 rounded">
                    Upload Reel
                </button>

                <button className="w-full p-4 bg-green-600 rounded">
                    Upload Video
                </button>

                <button className="w-full p-4 bg-red-600 rounded">
                    Upload Movie
                </button>
            </div>
        </div>
    );
}