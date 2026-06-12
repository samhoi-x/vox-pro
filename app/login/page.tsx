import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginSkeleton() {
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
          {/* Google login skeleton */}
          <div className="w-full py-3 px-4 border border-[#2a2a3a] rounded-lg flex items-center justify-center gap-3">
            <div className="w-5 h-5 rounded-full bg-[#2a2a3a] animate-pulse" />
            <div className="h-4 bg-[#2a2a3a] rounded w-32 animate-pulse" />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#2a2a3a]" />
            <span className="text-xs text-gray-500">或者</span>
            <div className="flex-1 h-px bg-[#2a2a3a]" />
          </div>

          {/* Email/password skeleton */}
          <div className="space-y-3">
            <div className="w-full h-12 bg-[#0f0f14] border border-[#2a2a3a] rounded-lg animate-pulse" />
            <div className="w-full h-12 bg-[#0f0f14] border border-[#2a2a3a] rounded-lg animate-pulse" />
            <div className="w-full h-12 bg-purple-600/50 rounded-lg animate-pulse" />
          </div>

          <p className="text-center text-sm text-gray-500">
            載入中...
          </p>
        </div>
      </div>
    </div>
  );
}
