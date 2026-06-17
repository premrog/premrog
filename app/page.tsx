export default function Home() {
  const stories = [
    "Premrog",
    "Creator1",
    "Creator2",
    "Creator3",
    "Creator4",
    "Creator5",
  ];

  const posts = [
    {
      user: "Premrog Official",
      type: "Reel",
      text: "Welcome to Premrog Social Platform",
    },
    {
      user: "Creator1",
      type: "Photo",
      text: "My first upload on Premrog",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">

      {/* Header */}
      <header className="sticky top-0 bg-black border-b border-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-pink-500">
          PREMROG
        </h1>

        <div className="flex gap-4">
          <button>🔍</button>
          <button>💬</button>
        </div>
      </header>

      {/* Stories */}
      <section className="flex overflow-x-auto gap-4 p-4 border-b border-gray-800">
        {stories.map((story, index) => (
          <div
            key={index}
            className="flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-full bg-pink-500"></div>
            <p className="text-xs mt-1">{story}</p>
          </div>
        ))}
      </section>

      {/* Wallet */}
      <section className="p-4">
        <div className="bg-gray-900 rounded-xl p-4">
          <h2 className="font-bold">
            Wallet Balance
          </h2>

          <p className="text-yellow-400">
            Coins: 100
          </p>

          <p className="text-green-400">
            Cash Wallet: ₹500
          </p>
        </div>
      </section>

      {/* Feed */}
      <section className="space-y-6 p-4">
        {posts.map((post, index) => (
          <div
            key={index}
            className="bg-gray-900 rounded-xl overflow-hidden"
          >
            <div className="p-3 font-bold">
              {post.user}
            </div>

            <div className="h-72 bg-gray-700 flex items-center justify-center">
              {post.type}
            </div>

            <div className="p-3">
              <p>{post.text}</p>

              <div className="flex gap-6 mt-3">
                <button>❤️ Like</button>
                <button>💬 Comment</button>
                <button>📤 Share</button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Creator Dashboard */}
      <section className="p-4">
        <button className="w-full bg-pink-600 p-3 rounded-xl font-bold">
          Creator Dashboard
        </button>
      </section>

      {/* Monetization */}
      <section className="p-4">
        <button className="w-full bg-green-600 p-3 rounded-xl font-bold">
          Apply Monetization
        </button>
      </section>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800">
        <div className="flex justify-around p-4">
          <button>🏠</button>
          <button>🎬</button>
          <button>➕</button>
          <button>💬</button>
          <button>👤</button>
        </div>
      </nav>

    </main>
  );
}