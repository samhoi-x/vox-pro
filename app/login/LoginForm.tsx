"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const { supabase, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);

  if (user) {
    router.push(redirect);
    return null;
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) setMessage(error.message);
      else setMessage("請檢查你的電郵確認連結 ✉️");
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setMessage(error.message);
      else router.push(redirect);
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) setMessage(error.message);
    else setMessage("已發送重設密碼連結到你的電郵 ✉️");

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  if (forgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f14] p-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-black bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent">
              🔑 重設密碼
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              輸入你嘅電郵，我哋會發送重設連結
            </p>
          </div>

          <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-xl p-6 space-y-4">
            <form onSubmit={handleForgotPassword} className="space-y-3">
              <input
                type="email"
                placeholder="電郵地址"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#0f0f14] border border-[#2a2a3a] rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-500 transition-colors disabled:opacity-50"
              >
                {loading ? "發送中..." : "發送重設連結"}
              </button>
            </form>

            {message && (
              <p className="text-sm text-center text-amber-400">{message}</p>
            )}

            <button
              onClick={() => { setForgotPassword(false); setMessage(""); }}
              className="w-full text-center text-sm text-purple-400 hover:underline"
            >
              ← 返回登入
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f14] p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-black bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent">
            🎤 Vox Pro
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            18 天聲音蛻變之旅
          </p>
        </div>

        <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-xl p-6 space-y-4">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-[#2a2a3a] rounded-lg text-white hover:bg-[#24243a] transition-colors font-medium"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            用 Google 登入
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#2a2a3a]" />
            <span className="text-xs text-gray-500">或者</span>
            <div className="flex-1 h-px bg-[#2a2a3a]" />
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-3">
            <input
              type="email"
              placeholder="電郵地址"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#0f0f14] border border-[#2a2a3a] rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
            />
            <input
              type="password"
              placeholder="密碼"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 bg-[#0f0f14] border border-[#2a2a3a] rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
            />

            {!isSignUp && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => { setForgotPassword(true); setMessage(""); }}
                  className="text-xs text-gray-500 hover:text-purple-400 transition-colors"
                >
                  忘記密碼？
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-500 transition-colors disabled:opacity-50"
            >
              {loading ? "處理中..." : isSignUp ? "註冊" : "登入"}
            </button>
          </form>

          {message && (
            <p className="text-sm text-center text-amber-400">{message}</p>
          )}

          <p className="text-center text-sm text-gray-500">
            {isSignUp ? "已經有帳號？" : "未有帳號？"}{" "}
            <button
              onClick={() => { setIsSignUp(!isSignUp); setMessage(""); }}
              className="text-purple-400 hover:underline"
            >
              {isSignUp ? "登入" : "註冊"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
