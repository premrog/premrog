import UserCard from "@/components/UserCard";

export default function ExplorePage() {
    return (
        <div className="bg-[#FFF5F7] text-[#000000] min-h-screen p-4 font-sans">

            <h1 className="text-3xl font-black text-pink-600">
                Explore
            </h1>

            <div className="space-y-4 mt-5">

                <UserCard name="Premrog Official" />
                <UserCard name="Creator One" />
                <UserCard name="Creator Two" />
                <UserCard name="Creator Three" />

            </div>

        </div>
    );
}