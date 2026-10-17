"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../contexts/LanguageContext";
import { API_BASE_URL } from "../../lib/api";
import { Lock, Mail, User, Phone, ArrowRight, Loader2, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const { t } = useLanguage();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("CITIZEN");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone, role }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "নিবন্ধন ব্যর্থ হয়েছে");
      }

      if (data.data?.accessToken) {
        localStorage.setItem("bhumiprohori_token", data.data.accessToken);
      }

      router.push("/cases");
    } catch (err: any) {
      setError(err.message || "নিবন্ধনে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-gray-200 shadow-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="relative w-14 h-14 mx-auto">
            <Image src="/logo.png" alt="Logo" fill className="object-contain" priority />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">
            {t("ভূমিপ্রহরী নতুন একাউন্ট তৈরি", "Create BhumiProhori Account")}
          </h2>
          <p className="text-xs text-gray-500">
            {t("সঠিক তথ্য দিয়ে নিবন্ধন সম্পন্ন করুন", "Fill in your information to register")}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">পূর্ণ নাম *</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="যেমন: মোঃ কামরুল হাসান"
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#176B55]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">ইমেইল *</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#176B55]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">মোবাইল নম্বর</label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#176B55]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">পাসওয়ার্ড *</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="কমপক্ষে ৬ অক্ষর"
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#176B55]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">আপনার ভূমিকা (Role)</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#176B55] bg-white font-medium"
            >
              <option value="CITIZEN">সাধারণ নাগরিক (Citizen)</option>
              <option value="BUYER">জমি ক্রেতা (Land Buyer)</option>
              <option value="LANDOWNER">জমির মালিক (Landowner)</option>
              <option value="REVIEWER">আইনজীবী / বিশ্লেষক (Reviewer)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#176B55] hover:bg-[#125543] disabled:opacity-50 text-white font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>নিবন্ধন সম্পন্ন করুন</span>}
          </button>
        </form>

        <p className="text-center text-xs text-gray-600">
          ইতিমধ্যে একাউন্ট আছে?{" "}
          <Link href="/login" className="text-[#176B55] font-bold hover:underline">
            লগইন করুন
          </Link>
        </p>
      </div>
    </div>
  );
}
