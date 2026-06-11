import Link from "next/link";

export default function PrivacyPage() {
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
        <h1 className="text-3xl font-black mb-2">私隱政策</h1>
        <p className="text-sm text-gray-500 mb-10">最後更新日期：2026 年 6 月</p>

        {/* Intro */}
        <div className="prose prose-invert max-w-none space-y-8 text-gray-300 leading-relaxed">
          <section>
            <p>
              Vox Pro（下稱「本平台」或「我們」）尊重並保護使用者嘅個人資料私隱。
              本私隱政策說明我哋點樣收集、使用、儲存同保護你嘅資料。
              使用本平台即表示你同意本政策所列嘅做法。
            </p>
          </section>

          {/* 1. 收集嘅資料 */}
          <section>
            <h2 className="text-xl font-bold text-white mt-10 mb-4">1. 我哋收集咩資料</h2>
            <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-xl p-6 space-y-4">
              <div>
                <h3 className="font-bold text-purple-400 mb-2">帳戶資料</h3>
                <p className="text-sm">
                  當你註冊帳戶時，我哋會收集你嘅電郵地址。註冊同登入透過 Supabase 驗證服務處理。
                </p>
              </div>
              <div>
                <h3 className="font-bold text-purple-400 mb-2">練習進度</h3>
                <p className="text-sm">
                  我哋會記錄你喺平台上嘅練習進度，包括已完成嘅練習日數、連續練習記錄，用於提供個人化體驗同進度追蹤。
                </p>
              </div>
              <div>
                <h3 className="font-bold text-purple-400 mb-2">訂閱及付款資料</h3>
                <p className="text-sm">
                  當你選擇付費方案時，付款處理由 Creem 負責。我哋唔會直接儲存你嘅信用卡或付款詳情。我哋只會記錄你嘅訂閱狀態（免費／Pro／永久）同 Creem 客戶編號，用於識別你嘅方案權限。
                </p>
              </div>
              <div>
                <h3 className="font-bold text-purple-400 mb-2">Cookie 及技術資料</h3>
                <p className="text-sm">
                  本平台使用必要嘅 Cookie 維持登入狀態（Supabase SSR 認證 Cookie）。
                  我哋唔使用追蹤性廣告 Cookie 或第三方分析 Cookie。
                </p>
              </div>
            </div>
          </section>

          {/* 2. 資料用途 */}
          <section>
            <h2 className="text-xl font-bold text-white mt-10 mb-4">2. 我哋點樣使用你嘅資料</h2>
            <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-xl p-6">
              <ul className="space-y-2 text-sm">
                <li>✅ 提供同維護本平台嘅核心功能（進度追蹤、內容解鎖）</li>
                <li>✅ 根據你嘅訂閱方案提供對應嘅權限</li>
                <li>✅ 處理付款同訂閱管理</li>
                <li>✅ 發送與服務相關嘅通知（例如密碼重設）</li>
                <li>✅ 改善平台體驗同修正錯誤</li>
              </ul>
            </div>
          </section>

          {/* 3. 資料分享 */}
          <section>
            <h2 className="text-xl font-bold text-white mt-10 mb-4">3. 資料分享同第三方服務</h2>
            <p>
              我哋唔會出售、出租或交易你嘅個人資料。以下係我哋使用嘅第三方服務及其用途：
            </p>
            <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-xl p-6 mt-4 space-y-4">
              <div>
                <h3 className="font-bold text-purple-400 mb-1">Supabase</h3>
                <p className="text-sm">
                  提供用戶認證、資料庫同雲端儲存服務。你嘅電郵、練習進度同訂閱資料儲存於 Supabase 伺服器。
                  <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline ml-1 text-xs">
                    Supabase 私隱政策 →
                  </a>
                </p>
              </div>
              <div>
                <h3 className="font-bold text-purple-400 mb-1">Creem</h3>
                <p className="text-sm">
                  處理所有付款交易同訂閱管理。付款過程中你提供嘅付款資料由 Creem 直接處理同儲存。
                  <a href="https://creem.io/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline ml-1 text-xs">
                    Creem 私隱政策 →
                  </a>
                </p>
              </div>
              <div>
                <h3 className="font-bold text-purple-400 mb-1">Vercel</h3>
                <p className="text-sm">
                  提供網站託管服務。你訪問本平台時產生嘅技術日誌（IP 地址、瀏覽器類型等）可能由 Vercel 自動記錄。
                  <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline ml-1 text-xs">
                    Vercel 私隱政策 →
                  </a>
                </p>
              </div>
              <div>
                <h3 className="font-bold text-purple-400 mb-1">Resend</h3>
                <p className="text-sm">
                  處理系統電郵發送（例如密碼重設、意見回饋確認）。你嘅電郵地址會用於發送呢啲郵件。
                  <a href="https://resend.com/privacy" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline ml-1 text-xs">
                    Resend 私隱政策 →
                  </a>
                </p>
              </div>
              <div>
                <h3 className="font-bold text-purple-400 mb-1">YouTube</h3>
                <p className="text-sm">
                  本平台嵌入 YouTube 示範影片。當你播放影片時，YouTube 可能會根據其私隱政策收集數據。
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline ml-1 text-xs">
                    Google 私隱政策 →
                  </a>
                </p>
              </div>
            </div>
          </section>

          {/* 4. 資料保存 */}
          <section>
            <h2 className="text-xl font-bold text-white mt-10 mb-4">4. 資料保存</h2>
            <p>
              我哋會喺你嘅帳戶有效期間保存你嘅個人資料。如果你希望刪除帳戶同相關資料，請以註冊電郵發送請求至
              <span className="text-purple-400"> iatsam@gmail.com</span>，
              我哋會喺 30 日內處理並確認。
            </p>
          </section>

          {/* 5. 資料安全 */}
          <section>
            <h2 className="text-xl font-bold text-white mt-10 mb-4">5. 資料安全</h2>
            <p>
              我哋採用合理嘅技術同管理措施保護你嘅個人資料。Supabase 提供數據庫層級嘅安全保護（包括 Row Level Security），
              Creem 為付款資料提供 PCI-DSS 相容嘅安全標準處理。
              但請注意，無任何網絡傳輸或電子儲存方式係 100% 安全嘅。
            </p>
          </section>

          {/* 6. 你的權利 */}
          <section>
            <h2 className="text-xl font-bold text-white mt-10 mb-4">6. 你嘅權利</h2>
            <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-xl p-6">
              <ul className="space-y-2 text-sm">
                <li>🔍 <strong>查閱權</strong> — 你有權查閱我哋持有關於你嘅個人資料</li>
                <li>✏️ <strong>更正權</strong> — 你有權要求更正不準確嘅資料</li>
                <li>🗑️ <strong>刪除權</strong> — 你有權要求刪除你嘅帳戶同相關資料</li>
                <li>📋 <strong>資料攜帶權</strong> — 你有權以結構化格式接收你嘅資料</li>
              </ul>
            </div>
            <p className="mt-4">
              行使以上權利，請電郵至 <span className="text-purple-400">iatsam@gmail.com</span>。
            </p>
          </section>

          {/* 7. 政策更新 */}
          <section>
            <h2 className="text-xl font-bold text-white mt-10 mb-4">7. 政策更新</h2>
            <p>
              我哋可能會不時更新本私隱政策。重大變更時，我哋會透過平台公告或電郵通知你。
              建議定期查閱本頁面以了解最新版本。
            </p>
          </section>

          {/* 8. 聯絡 */}
          <section>
            <h2 className="text-xl font-bold text-white mt-10 mb-4">8. 聯絡我哋</h2>
            <p>
              如果你對本私隱政策有任何疑問，請聯絡：
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
