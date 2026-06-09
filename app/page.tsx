import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f0f14] text-white">
      {/* Hero */}
      <header className="text-center py-20 px-4">
        <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent">
          🎤 Vox Pro
        </h1>
        <p className="text-lg text-gray-400 mt-3 max-w-lg mx-auto">
          18 天聲音蛻變之旅，讓唱歌像說話一樣輕鬆
        </p>
        <p className="text-sm text-gray-500 mt-2">
          專業聲樂訓練 × AI 語音分析
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-3 bg-purple-600 text-white rounded-full font-bold hover:bg-purple-500 transition-colors"
          >
            免費試用頭 3 日
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 border border-[#2a2a3a] text-gray-300 rounded-full font-bold hover:bg-[#1a1a24] transition-colors"
          >
            登入
          </Link>
        </div>
      </header>

      {/* Features */}
      <section className="max-w-3xl mx-auto px-4 pb-20 space-y-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-xl p-6 text-center">
            <div className="text-3xl mb-3">📅</div>
            <h3 className="font-bold mb-2">18 天系統課程</h3>
            <p className="text-sm text-gray-400">
              5 個階段、11 個練習，從氣息到混聲，循序漸進
            </p>
          </div>
          <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-xl p-6 text-center">
            <div className="text-3xl mb-3">⏱️</div>
            <h3 className="font-bold mb-2">每日 20 分鐘</h3>
            <p className="text-sm text-gray-400">
              內置計時器＋語音指導，隨時隨地練習
            </p>
          </div>
          <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-xl p-6 text-center">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-bold mb-2">進度追蹤</h3>
            <p className="text-sm text-gray-400">
              雲端同步進度，連續打卡保持動力
            </p>
          </div>
        </div>

        {/* Pricing */}
        <div className="text-center pt-12">
          <h2 className="text-2xl font-bold mb-8">簡單定價</h2>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            {/* Free tier */}
            <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-xl p-8 flex-1 max-w-sm mx-auto">
              <h3 className="text-lg font-bold mb-2">免費試用</h3>
              <p className="text-4xl font-black mb-4">$0</p>
              <ul className="text-sm text-gray-400 space-y-2 mb-6 text-left">
                <li>✅ Day 1–3 完整課程</li>
                <li>✅ 計時器 + 鋼琴音階</li>
                <li>✅ 雲端進度同步</li>
                <li>❌ Day 4+ 進階內容</li>
                <li>❌ AI 語音分析</li>
              </ul>
              <Link
                href="/login"
                className="block w-full py-3 border border-[#2a2a3a] text-gray-300 rounded-lg font-bold hover:bg-[#24243a] transition-colors text-center"
              >
                開始免費試用
              </Link>
            </div>

            {/* Pro tier */}
            <div className="bg-[#1a1a24] border border-purple-600 rounded-xl p-8 flex-1 max-w-sm mx-auto relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                最受歡迎
              </div>
              <h3 className="text-lg font-bold mb-2">Pro 版</h3>
              <p className="text-4xl font-black mb-1">
                $9.99<span className="text-lg font-normal text-gray-400">/月</span>
              </p>
              <p className="text-xs text-gray-500 mb-4">或一次性 $49.99 永久解鎖</p>
              <ul className="text-sm text-gray-400 space-y-2 mb-6 text-left">
                <li>✅ 全部 18 天課程</li>
                <li>✅ 計時器 + 鋼琴音階</li>
                <li>✅ 雲端進度同步</li>
                <li>✅ 進階大師課</li>
                <li>✅ AI 語音分析 (即將推出)</li>
              </ul>
              <Link
                href="/login"
                className="block w-full py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-500 transition-colors text-center"
              >
                升級 Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-sm text-gray-600">
        © 2026 Vox Pro. Built with ❤️ for singers.
      </footer>
    </div>
  );
}
