"use client";

import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { getTrialEnd } from "@/lib/trial";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "iatsam@gmail.com";

// ── Types ──────────────────────────────────────────────────────────
interface Stats {
  totalUsers: number;
  tierCounts: { free: number; pro: number; lifetime: number };
  trialActive: number;
  trialExpired: number;
  recentSignups: { id: string; email: string; tier: string; created_at: string }[];
  dailySignups: { date: string; count: number }[];
}

interface User {
  id: string;
  email: string;
  subscription_tier: string;
  trial_started_at: string | null;
  creem_customer_id: string | null;
  created_at: string;
}

const TIERS = ["free", "pro", "lifetime"] as const;
const TIER_LABELS: Record<string, string> = { free: "🆓 Free", pro: "⭐ Pro", lifetime: "👑 永久" };
const TIER_COLORS: Record<string, string> = {
  free: "bg-gray-600/20 text-gray-400 border-gray-600/30",
  pro: "bg-purple-600/20 text-purple-300 border-purple-600/30",
  lifetime: "bg-amber-600/20 text-amber-300 border-amber-600/30",
};

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  // Snapshot of "now" for trial-status display (page data isn't live anyway)
  const [now] = useState(() => Date.now());

  // ── Auth guard (email-based; real enforcement is server-side) ──
  useEffect(() => {
    if (user && user.email !== ADMIN_EMAIL) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  // ── Load data ──────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/users"),
      ]);
      if (statsRes.ok) setStats(await statsRes.json());
      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error("Admin load failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.email === ADMIN_EMAIL) loadData();
  }, [user, loadData]);

  // ── Update tier ────────────────────────────────────────────────
  const updateTier = async (userId: string, tier: string) => {
    setUpdating(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, tier }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, subscription_tier: tier } : u)),
        );
        loadData(); // refresh stats
      }
    } catch (err) {
      console.error("Update tier failed:", err);
    } finally {
      setUpdating(null);
    }
  };

  // ── Filter ─────────────────────────────────────────────────────
  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.subscription_tier.toLowerCase().includes(search.toLowerCase()),
  );

  // ── Loading ────────────────────────────────────────────────────
  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-[#0f0f14] flex items-center justify-center">
        <p className="text-gray-400">驗證中...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f14] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── Helpers ────────────────────────────────────────────────────
  const maxDaily = Math.max(...(stats?.dailySignups.map((d) => d.count) || []), 1);

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString("zh-HK", { month: "short", day: "numeric" });
  };

  const formatFull = (d: string) => {
    const date = new Date(d);
    return date.toLocaleString("zh-HK");
  };

  const trialStatus = (u: User) => {
    if (!u.trial_started_at) return { label: "—", color: "text-gray-600" };
    if (u.subscription_tier !== "free") return { label: "已升級", color: "text-purple-400" };
    const end = getTrialEnd(u.trial_started_at);
    if (now > end.getTime()) return { label: "已過期", color: "text-red-400" };
    const hours = Math.floor((end.getTime() - now) / (1000 * 60 * 60));
    return { label: `${Math.floor(hours / 24)}d ${hours % 24}h`, color: "text-emerald-400" };
  };

  // ── RENDER ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0f0f14] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-black">🛡️ Admin Dashboard</h1>
            <p className="text-xs text-gray-500 mt-1">Vox Pro 後台管理</p>
          </div>
          <div className="flex gap-2">
            <a
              href="/dashboard"
              className="text-xs px-4 py-2 border border-[#2a2a3a] text-gray-400 rounded-lg hover:bg-[#1a1a24] transition-colors"
            >
              ← 返回前台
            </a>
          </div>
        </div>

        {/* ── Stats cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="總用戶" value={stats?.totalUsers || 0} icon="👥" />
          <StatCard label="⭐ Pro" value={stats?.tierCounts.pro || 0} icon="⭐" accent="purple" />
          <StatCard label="👑 永久" value={stats?.tierCounts.lifetime || 0} icon="👑" accent="amber" />
          <StatCard label="試用中" value={stats?.trialActive || 0} icon="⏳" accent="emerald" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="🆓 Free" value={stats?.tierCounts.free || 0} icon="🆓" />
          <StatCard label="試用已過期" value={stats?.trialExpired || 0} icon="⏰" accent="red" />
          <StatCard label="付費用戶" value={(stats?.tierCounts.pro || 0) + (stats?.tierCounts.lifetime || 0)} icon="💳" accent="purple" />
          <StatCard
            label="轉換率"
            value={`${stats ? Math.round(((stats.tierCounts.pro + stats.tierCounts.lifetime) / Math.max(stats.totalUsers, 1)) * 100) : 0}%`}
            icon="📊"
            accent="emerald"
          />
        </div>

        {/* ── Daily signup chart ── */}
        {stats && (
          <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-xl p-5">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-4">
              📈 每日註冊趨勢（7 日）
            </h2>
            <div className="flex items-end gap-2 h-24">
              {stats.dailySignups.map((d) => (
                <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-gray-500">{d.count}</span>
                  <div
                    className="w-full bg-purple-600 rounded-t-sm transition-all"
                    style={{ height: `${(d.count / maxDaily) * 80}%`, minHeight: d.count > 0 ? 4 : 0 }}
                  />
                  <span className="text-[10px] text-gray-600">{formatDate(d.date)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Recent signups ── */}
        {stats && stats.recentSignups.length > 0 && (
          <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-xl p-5">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3">
              🆕 最近註冊
            </h2>
            <div className="space-y-2">
              {stats.recentSignups.map((u) => (
                <div key={u.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-300 truncate max-w-[200px]">{u.email}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${TIER_COLORS[u.tier]}`}>
                    {TIER_LABELS[u.tier]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── User management table ── */}
        <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#2a2a3a] flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wide">
              👥 用戶管理（{filteredUsers.length}）
            </h2>
            <input
              type="text"
              placeholder="搜尋 email 或 plan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-xs bg-[#0f0f14] border border-[#2a2a3a] rounded-lg px-3 py-2 text-gray-300 placeholder-gray-600 w-56 focus:outline-none focus:border-purple-600"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2a2a3a] text-gray-500 text-xs uppercase">
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4 hidden md:table-cell">註冊時間</th>
                  <th className="text-left py-3 px-4 hidden md:table-cell">試用狀態</th>
                  <th className="text-left py-3 px-4">Plan</th>
                  <th className="text-right py-3 px-4">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a3a]">
                {filteredUsers.map((u) => {
                  const ts = trialStatus(u);
                  return (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4">
                        <span className="text-gray-300 truncate max-w-[180px] block">{u.email}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-xs hidden md:table-cell">
                        {u.created_at ? formatFull(u.created_at) : "—"}
                      </td>
                      <td className={`py-3 px-4 text-xs hidden md:table-cell ${ts.color}`}>
                        {ts.label}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${TIER_COLORS[u.subscription_tier]}`}>
                          {TIER_LABELS[u.subscription_tier]}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <select
                          value={u.subscription_tier}
                          onChange={(e) => updateTier(u.id, e.target.value)}
                          disabled={updating === u.id}
                          className="text-xs bg-[#0f0f14] border border-[#2a2a3a] rounded-lg px-2 py-1.5 text-gray-300 focus:outline-none focus:border-purple-600 disabled:opacity-50"
                        >
                          {TIERS.map((t) => (
                            <option key={t} value={t}>
                              {TIER_LABELS[t]}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-600">
                      冇匹配嘅用戶
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Stat card component ────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon: string;
  accent?: string;
}) {
  const borderMap: Record<string, string> = {
    purple: "border-purple-600/30",
    amber: "border-amber-600/30",
    emerald: "border-emerald-600/30",
    red: "border-red-600/30",
  };

  return (
    <div
      className={`bg-[#1a1a24] border ${borderMap[accent || ""] || "border-[#2a2a3a]"} rounded-xl p-4`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <p className="text-2xl font-black">{value}</p>
    </div>
  );
}
