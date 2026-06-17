import BottomNav from "@/components/BottomNav";
import PostCard from "@/components/PostCard";
export default function HomePage() {
    const posts = [
        {
            id: 1,
            user: "Premrog Official",
            text: "Welcome to Premrog 🚀",
        },
        {
            id: 2,
            user: "Creator One",
            text: "My first reel uploaded today 🔥",
        },
    ];

    return (
        <div className="bg-black text-white min-h-screen pb-20">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-black border-b border-gray-800 p-4 flex justify-between">
                <h1 className="text-2xl font-bold text-pink-500">
                    PREMROG
                </h1>

                <div className="flex gap-4 text-xl">
                    <span>🔍</span>
                    <span>💬</span>
                    <span>🔔</span>
                </div>
            </div>

            {/* Stories */}
            <div className="flex gap-4 overflow-x-auto p-4">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"></div>
                        <span className="text-xs mt-1">
                            Story
                        </span>
                    </div>
                ))}
            </div>

            {/* Feed */}
            <div className="space-y-4 p-4">
                <PostCard
                    user="Premrog Official"
                    caption="Welcome To Premrog 🚀"
                />

                <PostCard
                    user="Creator One"
                    caption="My First Reel 🔥"
                />

                <PostCard
                    user="Creator Two"
                    caption="Premrog Growing Fast ❤️"
                />



            </div>     




            <BottomNav />
        </div>
    );
}