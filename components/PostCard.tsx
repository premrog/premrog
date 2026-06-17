interface Props {
    user: string;
    caption: string;
}

export default function PostCard({
    user,
    caption
}: Props) {
    return (
        <div className="bg-gray-900 rounded-xl overflow-hidden">

            <div className="p-4">
                <h2 className="font-bold">
                    {user}
                </h2>
            </div>

            <img
                src="https://picsum.photos/600/400"
                alt="Post"
                className="w-full h-80 object-cover"
            />

            <div className="p-4">
                <p>{caption}</p>

                <div className="flex gap-5 mt-4">
                    <button>❤️</button>
                    <button>💬</button>
                    <button>📤</button>
                    <button>🔖</button>
                </div>
            </div>

        </div>
    );
}