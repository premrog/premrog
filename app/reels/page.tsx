import BottomNav from "@/components/BottomNav";

export default function ReelsPage() {
    return (
        <div className="bg-black text-white min-h-screen">
            <div className="h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">
                        Premrog Reels
                    </h1>

                    <div className="w-72 h-96 bg-gray-800 rounded-xl mt-5 flex items-center justify-center">
                        Reel Video
                    </div>
                </div>
            </div>

            <BottomNav />
        </div>
    );
}