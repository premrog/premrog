import UserCard from "@/components/UserCard";

export default function ExplorePage() {
    return (
        <div className="bg-black text-white min-h-screen p-4">

            <h1 className="text-3xl font-bold text-pink-500">
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