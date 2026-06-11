import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0f0f14] text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        {/* Header */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-purple-400 transition-colors mb-8"
        >
          ← 返回首頁
        </Link>
        <h1 className="text-3xl font-black mb-2">服務條款</h1>
        <p className="text-sm text-gray-500 mb-10">最後更新日期：2026 年 6 月</p>

        <div className="prose prose-invert max-w-none space-y-8 text-gray-300 leading-relaxed">
          {/* 1. 接受條款 */}
          <section>
            <h2 className="text-xl font-bold text-white mt-6 mb-4">1. 接受條款</h2>
            <p>
              使用 Vox Pro（下稱「本平台」或「我們」）即表示你同意遵守本服務條款。
              如果你唔同意任何條款，請停止使用本平台。
            </p>
          </section>

          {/* 2. 服務說明 */}
          <section>
            <h2 className="text-xl font-bold text-white mt-10 mb-4">2. 服務說明</h2>
            <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-xl p-6">
              <p className="text-sm mb-4">
                Vox Pro 係一個線上練聲平台，提供 18 天系統性聲樂基礎訓練，包括：
              </p>
              <ul className="space-y-1 text-sm">
                <li>🎵 每日練習指導同語音示範</li>
                <li>🎥 示範影片</li>
                <li>🎹 互動鋼琴音階練習工具</li>
                <li>⏱️ 練習計時器</li>
                <li>📊 個人進度追蹤</li>
              </ul>
              <p className="text-sm mt-4">
                本平台提供嘅內容僅供教育同練習用途，唔構成專業醫療或聲樂治療建議。
                如果你有聲帶健康問題，請諮詢專業醫生或聲樂治療師。
              </p>
            </div>
          </section>

          {/* 3. 帳戶 */}
          <section>
            <h2 className="text-xl font-bold text-white mt-10 mb-4">3. 帳戶責任</h2>
            <p>
              你負責維護帳戶嘅機密性（包括密碼），以及你帳戶下發生嘅所有活動。
              如果你發現任何未經授權使用你帳戶嘅情況，請立即通知我哋。
            </p>
            <p className="mt-2">
              註冊時你必須提供準確、完整嘅資料，並喺資料變更時及時更新。
            </p>
          </section>

          {/* 4. 訂閱與付款 */}
          <section>
            <h2 className="text-xl font-bold text-white mt-10 mb-4">4. 訂閱與付款</h2>
            <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-xl p-6 space-y-4">
              <div>
                <h3 className="font-bold text-purple-400 mb-2">方案選擇</h3>
                <p className="text-sm">
                  本平台提供以下方案：
                </p>
                <ul className="space-y-1 text-sm mt-2">
                  <li><strong>免費試用</strong> — 3 個日曆日內，完整體驗全部 18 天課程內容，無需提供信用卡</li>
                  <li><strong>每月訂閱（Pro）</strong> — USD $9.99/月，自動續訂，可隨時取消</li>
                  <li><strong>永久買斷（Lifetime）</strong> — USD $19.99 一次性付款，終身使用，附送練習 PDF</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-purple-400 mb-2">付款處理</h3>
                <p className="text-sm">
                  所有付款由 Creem 安全處理。本平台唔會直接儲存你嘅信用卡或其他付款詳情。
                  你嘅付款資料受 Creem 嘅服務條款同私隱政策約束。
                </p>
              </div>
              <div>
                <h3 className="font-bold text-purple-400 mb-2">自動續訂</h3>
                <p className="text-sm">
                  每月訂閱會自動續訂，直至你取消。你可以隨時透過本平台嘅「管理訂閱」功能或 Creem 客戶門戶取消續訂。
                  取消後，你仍可喺當前計費週期內繼續使用 Pro 功能，已繳付嘅費用唔會按比例退還。
                </p>
              </div>
              <div>
                <h3 className="font-bold text-purple-400 mb-2">價格變更</h3>
                <p className="text-sm">
                  我哋保留修改價格嘅權利。價格變更前會提前通知現有訂閱者。
                  現有訂閱者嘅價格變更會喺下一個計費週期生效。
                </p>
              </div>
            </div>
          </section>

          {/* 5. 退款政策 */}
          <section>
            <h2 className="text-xl font-bold text-white mt-10 mb-4">5. 退款政策</h2>
            <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-xl p-6">
              <ul className="space-y-3 text-sm">
                <li>
                  <strong className="text-purple-400">每月訂閱</strong>
                  <br />
                  已繳付嘅訂閱費用不設退款。你可以隨時取消續訂以避免下一期扣款。
                </li>
                <li>
                  <strong className="text-purple-400">永久買斷</strong>
                  <br />
                  購買後 7 日內可申請退款。退款請求請電郵至 iatsam@gmail.com，註明購買電郵同原因。
                  退款處理通常需要 5–10 個工作日。
                </li>
                <li>
                  <strong className="text-purple-400">例外情況</strong>
                  <br />
                  如因技術問題導致重複扣款或未獲得相應服務，請聯絡我哋處理。
                </li>
              </ul>
            </div>
          </section>

          {/* 6. 使用規範 */}
          <section>
            <h2 className="text-xl font-bold text-white mt-10 mb-4">6. 使用規範</h2>
            <p>使用本平台時，你同意唔會：</p>
            <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-xl p-6 mt-4">
              <ul className="space-y-2 text-sm">
                <li>❌ 以任何方式複製、轉售或重新分發本平台嘅內容</li>
                <li>❌ 逆向工程、破解或繞過本平台嘅安全措施同付費牆</li>
                <li>❌ 使用自動化工具（機器人、爬蟲等）存取本平台</li>
                <li>❌ 冒充他人身份或提供虛假資料</li>
                <li>❌ 干擾或破壞本平台嘅正常運作</li>
                <li>❌ 將本平台用於任何非法目的</li>
              </ul>
            </div>
            <p className="mt-4">
              違反以上規範可能導致帳戶被暫停或終止，已繳付嘅費用不獲退還。
            </p>
          </section>

          {/* 7. 知識產權 */}
          <section>
            <h2 className="text-xl font-bold text-white mt-10 mb-4">7. 知識產權</h2>
            <p>
              本平台上嘅所有內容，包括但不限於文字、音頻、影片、圖像、課程結構、標誌同軟件代碼，
              均屬 Vox Pro 或其授權方嘅知識產權，受版權法同其他知識產權法律保護。
            </p>
            <p className="mt-2">
              我哋授予你有限、非獨佔、不可轉讓嘅權限，僅供個人、非商業用途使用本平台內容。
              你唔可以複製、修改、分發、出售或利用本平台內容創作衍生作品。
            </p>
          </section>

          {/* 8. 第三方服務 */}
          <section>
            <h2 className="text-xl font-bold text-white mt-10 mb-4">8. 第三方服務</h2>
            <p>
              本平台包含第三方服務同連結（包括但不限於 YouTube 影片、Creem 付款、Supabase 基礎設施）。
              我哋對第三方服務嘅內容、私隱做法或可用性不承擔責任。
              使用第三方服務受其各自嘅服務條款約束。
            </p>
          </section>

          {/* 9. 免責聲明 */}
          <section>
            <h2 className="text-xl font-bold text-white mt-10 mb-4">9. 免責聲明</h2>
            <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-xl p-6">
              <p className="text-sm">
                本平台按「現狀」提供，不作任何明示或暗示嘅保證。我哋唔保證：
              </p>
              <ul className="space-y-1 text-sm mt-3">
                <li>• 平台完全無中斷或無錯誤</li>
                <li>• 練習結果能達到特定效果</li>
                <li>• 內容適合所有人士</li>
              </ul>
              <p className="text-sm mt-4">
                聲樂訓練涉及身體使用，每個人生理條件唔同，結果因人而異。
                如練習期間感到不適，請立即停止並諮詢專業人士。
              </p>
            </div>
          </section>

          {/* 10. 責任限制 */}
          <section>
            <h2 className="text-xl font-bold text-white mt-10 mb-4">10. 責任限制</h2>
            <p>
              喺法律允許嘅最大範圍內，Vox Pro 及其創辦人對因使用或無法使用本平台而產生嘅任何直接、間接、附帶、特殊或後果性損害不承擔責任，
              包括但不限於數據丟失、收入損失或身體不適。
            </p>
            <p className="mt-2">
              我哋嘅總責任上限，喺任何情況下唔超過你過去 12 個月內向本平台支付嘅總金額。
            </p>
          </section>

          {/* 11. 終止 */}
          <section>
            <h2 className="text-xl font-bold text-white mt-10 mb-4">11. 帳戶終止</h2>
            <p>
              我哋保留隨時因任何原因（包括違反本條款）暫停或終止你帳戶嘅權利，恕不退還已繳付費用。
              你可以隨時透過電郵 iatsam@gmail.com 要求刪除帳戶。
            </p>
          </section>

          {/* 12. 條款變更 */}
          <section>
            <h2 className="text-xl font-bold text-white mt-10 mb-4">12. 條款變更</h2>
            <p>
              我哋可能會不時修改本服務條款。重大變更時，我哋會透過平台公告或電郵通知你。
              繼續使用本平台即表示接受修訂後嘅條款。
            </p>
          </section>

          {/* 13. 管轄法律 */}
          <section>
            <h2 className="text-xl font-bold text-white mt-10 mb-4">13. 管轄法律</h2>
            <p>
              本條款受香港特別行政區法律管轄，並按其解釋。因本條款引起嘅爭議，
              雙方應先嘗試友好協商解決。
            </p>
          </section>

          {/* 14. 聯絡 */}
          <section>
            <h2 className="text-xl font-bold text-white mt-10 mb-4">14. 聯絡我哋</h2>
            <p>
              如果你對本服務條款有任何疑問，請聯絡：
            </p>
            <p className="mt-2">
              📧 電郵：<span className="text-purple-400">iatsam@gmail.com</span>
            </p>
          </section>
        </div>

        {/* Back */}
        <div className="mt-16 pt-8 border-t border-[#1a1a24]">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-purple-400 transition-colors"
          >
            ← 返回 Vox Pro 首頁
          </Link>
        </div>
      </div>
    </div>
  );
}
