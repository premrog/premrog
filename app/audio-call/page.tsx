export default function AudioCallPage() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
            <div className="w-40 h-40 rounded-full bg-pink-600"></div>

            <h1 className="text-3xl mt-5">
                Calling...
            </h1>

            <button className="bg-red-600 px-8 py-3 rounded mt-5">
                End Call
            </button>
        </div>
    );
}