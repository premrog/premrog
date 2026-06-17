import BottomNav from "@/components/BottomNav";

export default function ProfilePage() {
    return (
        <div className="bg-black text-white min-h-screen pb-20">
            <div className="h-40 bg-gradient-to-r from-pink-600 to-purple-600"></div>

            <div className="px-4">
                <img
                    src="https://i.pravatar.cc/150?img=5"
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-black -mt-12"
                />

                <h1 className="text-2xl font-bold mt-3">
                    Premrog User
                </h1>

                <p className="text-gray-400">
                    Social Creator
                </p>

                <div className="flex gap-8 mt-5">
                    <div>
                        <h2 className="font-bold">100</h2>
                        <p>Posts</p>
                    </div>

                    <div>
                        <h2 className="font-bold">500</h2>
                        <p>Followers</p>
                    </div>

                    <div>
                        <h2 className="font-bold">300</h2>
                        <p>Following</p>
                    </div>
                </div>

                <button className="bg-pink-600 w-full mt-5 p-3 rounded-lg">
                    Edit Profile
                </button>
            </div>

            <BottomNav />
        </div>
    );
}