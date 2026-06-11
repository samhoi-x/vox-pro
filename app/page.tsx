import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f0f14] text-white">
      {/* Hero */}
      <header className="text-center py-16 md:py-24 px-4">
        <p className="text-sm text-purple-400 font-medium tracking-widest uppercase mb-4">
          18 天系統性聲樂基礎
        </p>
        <h1 className="text-4xl md:text-6xl font-black leading-tight max-w-2xl mx-auto">
          由<span className="bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent">零基礎</span>到
          <span className="bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent">站穩根基</span>
        </h1>
        <p className="text-lg text-gray-400 mt-4 max-w-lg mx-auto">
          每日 20 分鐘，18 天掌握呼吸、音準、共鳴、混聲 — 為進階歌唱技巧打好穩固基礎
        </p>
        <p className="text-sm text-gray-600 mt-2">
          適合：零基礎想學唱歌 · 自學多年想回頭補底 · 想有系統地打好基本功
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-3 bg-purple-600 text-white rounded-full font-bold hover:bg-purple-500 transition-colors"
          >
            免費試用 3 日 · 全部內容任睇
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 border border-[#2a2a3a] text-gray-300 rounded-full font-bold hover:bg-[#1a1a24] transition-colors"
          >
            登入
          </Link>
        </div>
      </header>

      {/* Trust / 導師背景 */}
      <section className="max-w-3xl mx-auto px-4 pb-16">
        <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-2xl p-8 flex flex-col md:flex-row gap-6 items-center">
          {/* 相 placeholder — 你之後換做真嘅相 */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-amber-500 flex items-center justify-center text-4xl shrink-0">
            🎤
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">
              呢套方法，我自己行過
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              我同你一樣，曾經係零基礎嘅唱歌愛好者。市面上嘅教學碎片化，搵老師一堂 $20+ 美金又未必系統性。<br />
              我用自己嘅身體去試、去調整，整理出呢套 18 天路徑 — 唔係理論，係親身驗證過、行之有效嘅方法。<br />
              目標得一個：令你可以跳過我走過嘅冤枉路，用最短時間打下最穩固嘅基礎。
            </p>
            <p className="text-xs text-purple-400 mt-3 font-medium">
              — SAM.AI，Vox Pro 創辦人
            </p>
          </div>
        </div>
      </section>

      {/* 價格對比 */}
      <section className="max-w-3xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-center mb-2">
          一堂 vs 一套系統
        </h2>
        <p className="text-sm text-gray-500 text-center mb-8">
          搵專業老師嘅真實成本，同 Vox Pro 嘅對比
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#2a2a3a] text-gray-400">
                <th className="text-left py-3 px-4"></th>
                <th className="text-center py-3 px-4">傳統聲樂堂</th>
                <th className="text-center py-3 px-4 text-purple-400">Vox Pro</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              <tr className="border-b border-[#1a1a24]">
                <td className="py-3 px-4">覆蓋範圍</td>
                <td className="text-center py-3 px-4">1–2 個 topic / 堂</td>
                <td className="text-center py-3 px-4 text-purple-300">呼吸 + 音準 + 共鳴 + 混聲</td>
              </tr>
              <tr className="border-b border-[#1a1a24]">
                <td className="py-3 px-4">堂數 / 內容</td>
                <td className="text-center py-3 px-4">覆蓋同等內容約需 5–10 堂</td>
                <td className="text-center py-3 px-4 text-purple-300">18 天系統性訓練</td>
              </tr>
              <tr className="border-b border-[#1a1a24]">
                <td className="py-3 px-4">成本</td>
                <td className="text-center py-3 px-4 text-amber-400">$100–200+ USD</td>
                <td className="text-center py-3 px-4 text-purple-300 font-bold text-lg">
                  $9.99 USD
                </td>
              </tr>
              <tr className="border-b border-[#1a1a24]">
                <td className="py-3 px-4">進度</td>
                <td className="text-center py-3 px-4">靠老師安排，每星期 1–2 堂</td>
                <td className="text-center py-3 px-4 text-purple-300">日日有嘢練，按自己節奏</td>
              </tr>
              <tr>
                <td className="py-3 px-4">驗證</td>
                <td className="text-center py-3 px-4">靠老師資歷</td>
                <td className="text-center py-3 px-4 text-purple-300">創辦人親身驗證 ✅</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 18 天後你會得到 */}
      <section className="max-w-3xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-center mb-8">
          18 天後，你會做到
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { icon: "🫁", title: "正確呼吸支援", desc: "用丹田而唔係喉嚨發聲，唱得持久唔攰" },
            { icon: "🎯", title: "穩定音準控制", desc: "音階練習幫你建立準確嘅音感基礎" },
            { icon: "🔊", title: "胸腔 + 頭腔共鳴", desc: "搵到你唔同音域嘅共鳴點，把聲更有力" },
            { icon: "🎵", title: "基本混聲技巧", desc: "胸聲同頭聲之間嘅過渡，為高音舖路" },
            { icon: "📈", title: "可量化進步", desc: "追蹤你每日進度，見到自己一步步成長" },
            { icon: "🚀", title: "進階學習嘅穩固根基", desc: "無論你想學 belting、假音定係 riff，都要由呢度開始" },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-[#1a1a24] border border-[#2a2a3a] rounded-xl p-5 flex gap-4 items-start"
            >
              <span className="text-2xl shrink-0">{item.icon}</span>
              <div>
                <h3 className="font-bold mb-1">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 課程結構 */}
      <section className="max-w-3xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-center mb-8">
          5 個階段，循序漸進
        </h2>
        <div className="space-y-3">
          {[
            { day: "Day 1–4", phase: "氣息基礎", desc: "建立正確呼吸習慣，搵到丹田支撐", color: "from-emerald-500 to-teal-500" },
            { day: "Day 5–8", phase: "胸腔共鳴", desc: "開發胸腔聲音，增加厚度同力量", color: "from-blue-500 to-indigo-500" },
            { day: "Day 9–12", phase: "頭腔共鳴", desc: "連接頭腔共鳴，打開高音區域", color: "from-purple-500 to-pink-500" },
            { day: "Day 13–15", phase: "高低音轉換", desc: "胸聲頭聲順滑過渡，消除換聲區斷層", color: "from-amber-500 to-orange-500" },
            { day: "Day 16–18", phase: "混聲整合", desc: "胸聲頭聲融合，為進階技巧打好根基", color: "from-rose-500 to-red-500" },
          ].map((stage) => (
            <div
              key={stage.day}
              className="bg-[#1a1a24] border border-[#2a2a3a] rounded-xl p-5 flex flex-col md:flex-row md:items-center gap-3"
            >
              <span className={`bg-gradient-to-r ${stage.color} text-white text-xs font-bold px-3 py-1 rounded-full w-fit shrink-0`}>
                {stage.day}
              </span>
              <div>
                <h3 className="font-bold">{stage.phase}</h3>
                <p className="text-sm text-gray-400">{stage.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing — 兩種方案 */}
      <section className="max-w-3xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-center mb-2">
          簡單定價，兩種方案
        </h2>
        <p className="text-sm text-gray-500 text-center mb-8">
          月費隨時取消 · 永久買斷送 PDF
        </p>
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          {/* Free tier */}
          <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-xl p-8 flex-1 max-w-sm mx-auto">
            <h3 className="text-lg font-bold mb-2">免費試用</h3>
            <p className="text-4xl font-black mb-4">$0</p>
            <ul className="text-sm text-gray-400 space-y-2 mb-6">
              <li>✅ 3 日內自由體驗全部 18 日課程</li>
              <li>✅ 語音指導 + 示範影片</li>
              <li>✅ 計時器 + 鋼琴音階</li>
              <li>✅ 雲端進度同步</li>
              <li>❌ 試用期後需解鎖</li>
            </ul>
            <Link
              href="/login"
              className="block w-full py-3 border border-[#2a2a3a] text-gray-300 rounded-lg font-bold hover:bg-[#24243a] transition-colors text-center"
            >
              開始免費試用
            </Link>
          </div>

          {/* Monthly subscription */}
          <div className="bg-[#1a1a24] border border-purple-600/30 rounded-xl p-8 flex-1 max-w-sm mx-auto">
            <h3 className="text-lg font-bold mb-2">每月訂閱</h3>
            <p className="text-4xl font-black mb-1">
              $9.99
            </p>
            <p className="text-xs text-gray-500 mb-4">/月 · 隨時取消 · 無合約</p>
            <ul className="text-sm text-gray-400 space-y-2 mb-6">
              <li>✅ 全部 18 天完整課程</li>
              <li>✅ 5 個階段系統訓練</li>
              <li>✅ 語音指導 + 示範影片</li>
              <li>✅ 雲端進度同步</li>
              <li>✅ 訂閱期內無限使用</li>
            </ul>
            <Link
              href="/login"
              className="block w-full py-3 bg-[var(--accent-glow)] text-white rounded-lg font-bold hover:brightness-110 transition-colors text-center"
            >
              以 $9.99/月 解鎖
            </Link>
          </div>

          {/* Lifetime purchase */}
          <div className="bg-[#1a1a24] border border-purple-600 rounded-xl p-8 flex-1 max-w-sm mx-auto relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full">
              最抵 👍
            </div>
            <h3 className="text-lg font-bold mb-2">永久買斷</h3>
            <p className="text-4xl font-black mb-1">
              $19.99
            </p>
            <p className="text-xs text-gray-500 mb-4">一次性付款 · 終身使用 · 送 PDF</p>
            <ul className="text-sm text-gray-400 space-y-2 mb-6">
              <li>✅ 全部 18 天完整課程</li>
              <li>✅ 5 個階段系統訓練</li>
              <li>✅ 語音指導 + 示範影片</li>
              <li>✅ 雲端進度同步</li>
              <li>✅ 終身訪問權限</li>
              <li>🎁 送 18 天練習電子版 PDF</li>
            </ul>
            <Link
              href="/login"
              className="block w-full py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-500 transition-colors text-center"
            >
              以 $19.99 永久解鎖
            </Link>
            <p className="text-xs text-gray-600 text-center mt-3">
              相等於一堂傳統聲樂堂嘅價錢
            </p>
          </div>
        </div>
      </section>

      {/* 最後 CTA */}
      <section className="text-center pb-20 px-4">
        <h2 className="text-2xl font-bold mb-4">
          與其花 $100+ 上幾堂零散嘅課
        </h2>
        <p className="text-gray-400 mb-8">
          不如用 $9.99/月 或 $19.99 永久買斷，18 天內系統性地打好歌唱基礎
        </p>
        <Link
          href="/login"
          className="inline-block px-10 py-4 bg-purple-600 text-white rounded-full font-bold text-lg hover:bg-purple-500 transition-colors"
        >
          免費試用 3 日 · 全部內容任睇
        </Link>
        <p className="text-xs text-gray-600 mt-3">
          無需信用卡 · 3 日內自由體驗全部 18 日課程 · 試完先決定
        </p>
      </section>

      {/* Footer */}
      <footer className="py-8 text-sm text-gray-600 border-t border-[#1a1a24]">
        <div className="max-w-3xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© 2026 Vox Pro</span>
          <nav className="flex gap-6">
            <Link
              href="/blog"
              className="hover:text-purple-400 transition-colors"
            >
              教學文章
            </Link>
            <Link
              href="/privacy"
              className="hover:text-purple-400 transition-colors"
            >
              私隱政策
            </Link>
            <Link
              href="/terms"
              className="hover:text-purple-400 transition-colors"
            >
              服務條款
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
