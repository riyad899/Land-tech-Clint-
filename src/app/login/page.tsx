"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../contexts/LanguageContext";
import { API_BASE_URL } from "../../lib/api";
import { Lock, Mail, ArrowRight, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const { t } = useLanguage();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "লগইন ব্যর্থ হয়েছে");
      }

      // Store token
      if (data.data?.accessToken) {
        localStorage.setItem("bhumiprohori_token", data.data.accessToken);
      }

      router.push("/cases");
    } catch (err: any) {
      setError(err.message || "ভুল ইমেইল বা পাসওয়ার্ড");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCitizen = () => {
    setEmail("citizen@bhumiprohori.com");
    setPassword("demo1234");
  };

  const fillDemoReviewer = () => {
    setEmail("reviewer@bhumiprohori.com");
    setPassword("demo1234");
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-gray-200 shadow-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="relative w-14 h-14 mx-auto">
            <Image src="/logo.png" alt="Logo" fill className="object-contain" priority />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">
            {t("ভূমিপ্রহরী একাউন্টে প্রবেশ করুন", "Sign in to BhumiProhori")}
          </h2>
          <p className="text-xs text-gray-500">
            {t(
              "আপনার সংরক্ষিত ভূমি কেস ও আইনি রিপোর্ট দেখতে লগইন করুন",
              "Enter your credentials to access saved land verification reports",
            )}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              ইমেইল ঠিকানা *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@bhumiprohori.com"
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#176B55]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-gray-700">
                পাসওয়ার্ড *
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-[#176B55] hover:underline"
              >
                পাসওয়ার্ড ভুলে গেছেন?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#176B55]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#176B55] hover:bg-[#125543] disabled:opacity-50 text-white font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>লগইন করুন</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Google OAuth Login */}
        <div className="space-y-3 pt-2">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-gray-500 font-medium">অথবা</span>
            </div>
          </div>

          <a
            href={`${API_BASE_URL}/auth/google`}
            className="w-full border border-gray-300 hover:bg-gray-50 py-2.5 px-4 rounded-xl text-xs font-semibold text-gray-700 flex items-center justify-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.14z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.93 6.72-4.93z"
              />
            </svg>
            <span>গুগল (Google) দিয়ে সাইন-ইন করুন</span>
          </a>
        </div>

        {/* Demo Fast Login Shortcuts */}
        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/80 text-xs space-y-2">
          <span className="font-bold text-gray-700 block">তাৎক্ষণিক ডেমো লগইন:</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={fillDemoCitizen}
              className="flex-1 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 font-medium text-gray-700"
            >
              সাধারণ নাগরিক
            </button>
            <button
              type="button"
              onClick={fillDemoReviewer}
              className="flex-1 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 font-medium text-gray-700"
            >
              আইনজীবী / পর্যালোচক
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-600">
          নতুন ব্যবহারকারী?{" "}
          <Link href="/register" className="text-[#176B55] font-bold hover:underline">
            নিবন্ধন করুন
          </Link>
        </p>
      </div>
    </div>
  );
}
