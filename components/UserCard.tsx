interface Props {
    name: string;
}

export default function UserCard({ name }: Props) {
    return (
        <div className="bg-gray-900 p-4 rounded-xl flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-pink-500"></div>

            <div>
                <h2>{name}</h2>
                <p className="text-sm text-gray-400">
                    Creator
                </p>
            </div>
        </div>
    );
}