export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="text-center py-20 px-6">
        <h1 className="text-6xl font-bold mb-4">PREMROG</h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Global Social Media, Creator Economy & Advertising Platform
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button className="bg-blue-600 px-6 py-3 rounded-lg">
            Get Started
          </button>

          <button className="border border-white px-6 py-3 rounded-lg">
            Learn More
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-8">
        <h2 className="text-4xl font-bold text-center mb-10">
          Core Features
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="border p-6 rounded-xl">
            <h3 className="text-2xl font-bold mb-3">Photos</h3>
            <p>Upload, Share & Monetize Photos.</p>
          </div>

          <div className="border p-6 rounded-xl">
            <h3 className="text-2xl font-bold mb-3">Stories</h3>
            <p>24 Hour Stories with Monetization.</p>
          </div>

          <div className="border p-6 rounded-xl">
            <h3 className="text-2xl font-bold mb-3">Reels</h3>
            <p>Short Videos & Creator Revenue.</p>
          </div>

          <div className="border p-6 rounded-xl">
            <h3 className="text-2xl font-bold mb-3">Videos</h3>
            <p>Long Form Content & Ad Revenue.</p>
          </div>

          <div className="border p-6 rounded-xl">
            <h3 className="text-2xl font-bold mb-3">Movies</h3>
            <p>Premium Movie Upload & Distribution.</p>
          </div>

          <div className="border p-6 rounded-xl">
            <h3 className="text-2xl font-bold mb-3">Chat & Calls</h3>
            <p>P2P Chat, Audio Calls & Video Calls.</p>
          </div>
        </div>
      </section>

      {/* Monetization */}
      <section className="py-16 px-8 bg-gray-900">
        <h2 className="text-4xl font-bold text-center mb-10">
          Creator Monetization
        </h2>

        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg">
            Approved Creators can earn revenue through Ads.
          </p>

          <div className="mt-6 text-2xl font-bold">
            75% Creator Revenue
          </div>

          <div className="text-xl mt-2">
            25% Premrog Revenue
          </div>
        </div>
      </section>

      {/* Wallet */}
      <section className="py-16 px-8">
        <h2 className="text-4xl font-bold text-center mb-10">
          Wallet System
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="border p-6 rounded-xl">
            <h3 className="text-2xl font-bold mb-3">
              India Wallet
            </h3>
            <p>₹1 = 10 Coins</p>
            <p>Minimum Recharge ₹10</p>
          </div>

          <div className="border p-6 rounded-xl">
            <h3 className="text-2xl font-bold mb-3">
              International Wallet
            </h3>
            <p>$1 = 500 Coins</p>
            <p>Minimum Recharge $1</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-10 text-center">
        <h3 className="text-2xl font-bold">Premrog</h3>

        <p className="mt-3 text-gray-400">
          support.premrog@gmail.com
        </p>

        <p className="mt-2 text-gray-500">
          © 2025 Premrog. All Rights Reserved.
        </p>
      </footer>
    </main>
  );
}