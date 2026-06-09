"use client";

import { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string | null;
};

export default function FeedbackModal({ isOpen, onClose, userEmail }: Props) {
  const [category, setCategory] = useState("suggestion");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSending(true);
    setError("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail || "anonymous",
          category,
          message: message.trim(),
        }),
      });

      if (!res.ok) throw new Error("發送失敗");
      setSent(true);
    } catch {
      setError("發送失敗，請稍後再試");
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl w-full max-w-md p-6 space-y-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[var(--text)] flex items-center gap-2">
            💬 幫助和回饋
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text)] text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {sent ? (
          <div className="text-center py-6 space-y-3">
            <div className="text-4xl">✅</div>
            <p className="text-[var(--text)] font-medium">感謝你嘅回饋！</p>
            <p className="text-sm text-[var(--text-muted)]">我哋會認真睇你嘅意見</p>
            <button
              onClick={() => { setSent(false); setMessage(""); onClose(); }}
              className="text-sm text-[var(--accent)] hover:underline"
            >
              關閉
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] mb-1.5 uppercase tracking-wide">
                類型
              </label>
              <div className="flex gap-2">
                {[
                  { value: "suggestion", label: "💡 建議" },
                  { value: "bug", label: "🐛 問題回報" },
                  { value: "other", label: "💬 其他" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setCategory(opt.value)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      category === opt.value
                        ? "bg-[var(--accent-glow)] border-[var(--accent-glow)] text-white"
                        : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] mb-1.5 uppercase tracking-wide">
                訊息
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="寫低你嘅意見、建議或遇到嘅問題..."
                rows={4}
                required
                className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] placeholder-[var(--text-dim)] focus:border-[var(--accent)] focus:outline-none resize-none text-sm"
              />
            </div>

            {/* Email preview */}
            <p className="text-xs text-[var(--text-dim)]">
              回覆將會發送到：{userEmail || "未登入"}
            </p>

            {error && (
              <p className="text-sm text-[var(--danger)]">{error}</p>
            )}

            <button
              type="submit"
              disabled={sending || !message.trim()}
              className="w-full py-3 bg-[var(--accent-glow)] text-white rounded-lg font-bold hover:brightness-110 transition-all disabled:opacity-50"
            >
              {sending ? "發送中..." : "發送回饋 ✉️"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
