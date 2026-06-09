"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const { supabase } = useAuth();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Supabase puts the recovery token in the URL hash
    // The supabase client auto-detects it on page load
    supabase.auth.onAuthStateChange(async (event) => {
      if (event === "PASSWORD_RECOVERY") {
        // Hash contains the recovery token, user is ready to set new password
        setMessage("請輸入新密碼");
      }
    });
  }, [supabase]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("密碼已重設！");
      setDone(true);
    }

    setLoading(false);
  };

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f14] p-4">
        <div className="w-full max-w-sm space-y-6 text-center">
          <div className="text-4xl">✅</div>
          <h1 className="text-xl font-bold text-white">密碼已重設</h1>
          <p className="text-sm text-gray-400">而家可以用新密碼登入</p>
          <button
            onClick={() => router.push("/login")}
            className="w-full py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-500 transition-colors"
          >
            返回登入
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f14] p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-black text-white">
            🔐 設定新密碼
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            請輸入你嘅新密碼（至少 6 位）
          </p>
        </div>

        <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-xl p-6 space-y-4">
          <form onSubmit={handleReset} className="space-y-3">
            <input
              type="password"
              placeholder="新密碼（至少 6 位）"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 bg-[#0f0f14] border border-[#2a2a3a] rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-500 transition-colors disabled:opacity-50"
            >
              {loading ? "處理中..." : "重設密碼"}
            </button>
          </form>

          {message && (
            <p className="text-sm text-center text-amber-400">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
