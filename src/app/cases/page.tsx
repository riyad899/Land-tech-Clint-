"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "../../contexts/LanguageContext";
import { API_BASE_URL, safeFetchJson } from "../../lib/api";
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  HelpCircle,
  PlusCircle,
  Printer,
  ChevronRight,
  Search,
} from "lucide-react";

export default function CasesPage() {
  const { t } = useLanguage();
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("ALL");

  useEffect(() => {
    safeFetchJson(`${API_BASE_URL}/cases`)
      .then((data) => {
        if (data.success && data.data) {
          setCases(data.data || []);
        }
      })
      .catch((err) => console.error("Error fetching cases:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.mouza?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.caseNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.district?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity =
      filterSeverity === "ALL" || c.overallRiskLevel === filterSeverity;

    return matchesSearch && matchesSeverity;
  });

  const getRiskBadge = (level: string) => {
    switch (level) {
      case "HIGH_PRIORITY":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>উচ্চ অগ্রাধিকার (ঝুঁকিপূর্ণ)</span>
          </span>
        );
      case "REVIEW_REQUIRED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>পর্যালোচনা প্রয়োজন</span>
          </span>
        );
      case "VERIFIED":
      case "INFORMATION":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>যাচাইকৃত (ঝুঁকিমুক্ত)</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800 border border-gray-200">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>তথ্য অপর্যাপ্ত</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-[#F7F8FA] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              {t("ভূমি যাচাই কেসসমূহ", "Land Verification Cases")}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {t(
                "সকল পরীক্ষিত ভূমি নথি, জরিপ তুলনা এবং প্রতারণার ঝুঁকি মূল্যায়ন তালিকা।",
                "History of all examined land records, cross-survey comparisons, and risk evaluations.",
              )}
            </p>
          </div>

          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 bg-[#176B55] hover:bg-[#125543] text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t("নতুন যাচাই শুরু করুন", "New Verification")}</span>
          </Link>
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder={t("কেস নম্বর, মৌজা বা জেলা দিয়ে খুঁজুন...", "Search by case number, mouza...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#176B55]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="text-xs font-semibold text-gray-600 whitespace-nowrap">ঝুঁকির স্তর:</label>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium text-gray-800"
            >
              <option value="ALL">সকল কেস</option>
              <option value="HIGH_PRIORITY">উচ্চ অগ্রাধিকার</option>
              <option value="REVIEW_REQUIRED">পর্যালোচনা প্রয়োজন</option>
              <option value="INFORMATION">যাচাইকৃত / তথ্যপূর্ণ</option>
              <option value="INSUFFICIENT_DATA">তথ্য অপর্যাপ্ত</option>
            </select>
          </div>
        </div>

        {/* Cases Grid / List */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500 space-y-3">
            <div className="w-8 h-8 border-4 border-[#176B55] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm">কেসের তথ্য লোড হচ্ছে...</p>
          </div>
        ) : filteredCases.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500 space-y-4">
            <FileText className="w-12 h-12 mx-auto text-gray-300" />
            <h3 className="font-bold text-gray-800">কোনো কেস পাওয়া যায়নি</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              আপনার অনুসন্ধান অনুযায়ী কোনো রেকর্ড নেই অথবা এখনও কোনো কেস তৈরি করা হয়নি।
            </p>
            <Link
              href="/analyze"
              className="inline-block bg-[#176B55] text-white text-xs font-semibold px-4 py-2 rounded-lg"
            >
              নতুন কেস তৈরি করুন
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCases.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-200/90 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                      {item.caseNumber}
                    </span>
                    {getRiskBadge(item.overallRiskLevel)}
                    <span className="text-xs text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString("bn-BD")}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-gray-900">
                    <Link href={`/cases/${item.id}`} className="hover:text-[#176B55] transition-colors">
                      {item.title}
                    </Link>
                  </h3>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
                    <span>
                      <strong>মৌজা:</strong> {item.mouza || "N/A"}
                    </span>
                    <span>
                      <strong>উপজেলা:</strong> {item.upazila || "N/A"}
                    </span>
                    <span>
                      <strong>জেলা:</strong> {item.district || "N/A"}
                    </span>
                    <span>
                      <strong>রেকর্ড সংখ্যা:</strong> {item._count?.records || 0} টি
                    </span>
                    <span>
                      <strong>দলিল:</strong> {item._count?.deeds || 0} টি
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  <Link
                    href={`/cases/${item.id}/report`}
                    className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg border border-gray-200 text-xs font-medium flex items-center gap-1.5"
                    title="প্রিন্টযোগ্য অফিসিয়াল রিপোর্ট"
                  >
                    <Printer className="w-4 h-4 text-gray-600" />
                    <span className="hidden sm:inline">রিপোর্ট</span>
                  </Link>

                  <Link
                    href={`/cases/${item.id}`}
                    className="bg-[#176B55] hover:bg-[#125543] text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-1 shadow-sm transition-all"
                  >
                    <span>বিস্তারিত দেখুন</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
