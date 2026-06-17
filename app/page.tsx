export default function Home() {
  const stories = ["A", "B", "C", "D", "E", "F"];

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black border-b border-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-500">PREMROG</h1>
        <div className="flex gap-4">
          <span>🔔</span>
          <span>💬</span>
        </div>
      </header>

      {/* Stories */}
      <section className="p-4 overflow-x-auto">
        <div className="flex gap-4">
          {stories.map((item, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center">
                {item}
              </div>
              <p className="text-xs mt-1">Story</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feed */}
      <section className="space-y-6 p-4">
        {[1, 2, 3].map((post) => (
          <div
            key={post}
            className="border border-gray-800 rounded-xl overflow-hidden"
          >
            <div className="p-3 flex justify-between">
              <div>
                <h3 className="font-bold">Creator {post}</h3>
                <p className="text-xs text-gray-400">
                  Monetized Creator
                </p>
              </div>

              <button className="bg-blue-600 px-3 rounded">
                Follow
              </button>
            </div>

            <div className="h-72 bg-gray-800 flex items-center justify-center">
              Photo / Reel Preview
            </div>

            <div className="p-3">
              <div className="flex gap-4 text-xl">
                <span>❤️</span>
                <span>💬</span>
                <span>📤</span>
                <span>🔖</span>
              </div>

              <p className="mt-2 text-sm">
                Premrog Creator Content Preview
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* Wallet */}
      <section className="p-4">
        <div className="bg-gray-900 rounded-xl p-4">
          <h2 className="text-xl font-bold">Wallet</h2>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="bg-black p-3 rounded">
              <p>Coins</p>
              <h3 className="text-2xl">100</h3>
            </div>

            <div className="bg-black p-3 rounded">
              <p>Cash Wallet</p>
              <h3 className="text-2xl">₹0</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Creator Dashboard Preview */}
      <section className="p-4">
        <div className="bg-gray-900 rounded-xl p-4">
          <h2 className="text-xl font-bold">
            Creator Dashboard
          </h2>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-black p-3 rounded">
              Revenue ₹0
            </div>

            <div className="bg-black p-3 rounded">
              Followers 0
            </div>

            <div className="bg-black p-3 rounded">
              Views 0
            </div>

            <div className="bg-black p-3 rounded">
              Monetization Pending
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800">
        <div className="grid grid-cols-5 text-center py-3">
          <div>🏠</div>
          <div>🎬</div>
          <div>➕</div>
          <div>💬</div>
          <div>👤</div>
        </div>
      </nav>

      <div className="h-20" />
    </main>
  );
}