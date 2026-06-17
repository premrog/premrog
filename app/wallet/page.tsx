export default function WalletPage() {
    return (
        <div className="bg-black text-white min-h-screen p-4">
            <h1 className="text-3xl font-bold text-yellow-500">
                Wallet
            </h1>

            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-5 mt-5 text-black">
                <h2 className="font-bold">
                    Coin Balance
                </h2>

                <p className="text-4xl font-bold">
                    100
                </p>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-700 rounded-xl p-5 mt-5">
                <h2>Cash Wallet</h2>
                <p className="text-4xl">
                    ₹500
                </p>
            </div>

            <button className="bg-pink-600 w-full mt-5 p-4 rounded-lg">
                Recharge Wallet
            </button>
        </div>
    );
}