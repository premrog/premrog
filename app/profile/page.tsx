import BottomNav from "@/components/BottomNav";
export default function ProfilePage() {
    return (
        <div className="bg-black text-white min-h-screen pb-20">
            <div className="p-6 text-center">
                <div className="w-24 h-24 bg-pink-500 rounded-full mx-auto"></div>

                <h1 className="mt-4 text-2xl font-bold">
                    Premrog User
                </h1>

                <div className="flex justify-center gap-8 mt-4">
                    <div>
                        <p className="font-bold">0</p>
                        <p>Posts</p>
                    </div>

                    <div>
                        <p className="font-bold">0</p>
                        <p>Followers</p>
                    </div>

                    <div>
                        <p className="font-bold">0</p>
                        <p>Following</p>
                    </div>
                </div>
            </div>

            <BottomNav />
        </div>
    );
}