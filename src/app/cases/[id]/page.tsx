"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "../../../contexts/LanguageContext";
import { API_BASE_URL, safeFetchJson } from "../../../lib/api";
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  Printer,
  Scale,
  Sparkles,
  Send,
  Loader2,
  HelpCircle,
  Clock,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

import { Suspense } from "react";

function CaseDetailContent() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { t } = useLanguage();

  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // RAG Chat Assistant State
  const [chatQuery, setChatQuery] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ role: "user" | "ai"; text: string; sources?: any[] }>>([
    {
      role: "ai",
      text: "আসসালামু আলাইকুম। আমি 'ভূমিপ্রহরী' এআই উপদেষ্টা। এই কেসের জরিপ অসংগতি, নামজারি প্রক্রিয়া বা বাংলাদেশের ভূমি আইন সংক্রান্ত যেকোনো প্রশ্ন জিজ্ঞেস করুন।",
    },
  ]);

  useEffect(() => {
    if (!id) return;

    safeFetchJson(`${API_BASE_URL}/cases/${id}`)
      .then((data) => {
        if (data.success && data.data) {
          setCaseData(data.data);
        } else {
          setError(data.message || "কেস তথ্য পাওয়া যায়নি");
        }
      })
      .catch((err) => {
        console.error("Case fetch error:", err);
        setError("সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSendRagQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatQuery.trim() || chatLoading) return;

    const userMessage = chatQuery.trim();
    setChatQuery("");
    setChatHistory((prev) => [...prev, { role: "user", text: userMessage }]);
    setChatLoading(true);

    try {
      const data = await safeFetchJson(`${API_BASE_URL}/rag/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `কেস প্রেক্ষাপট: মৌজা ${caseData?.mouza || ""}, জেলা ${caseData?.district || ""}, খতিয়ান ${caseData?.primaryKhatian || ""}, দাগ ${caseData?.primaryDag || ""}। প্রশ্ন: ${userMessage}`,
          limit: 4,
        }),
      });

      if (data.success && data.data?.answer) {
        setChatHistory((prev) => [
          ...prev,
          {
            role: "ai",
            text: data.data.answer,
            sources: data.data.sources || [],
          },
        ]);
      } else {
        setChatHistory((prev) => [
          ...prev,
          {
            role: "ai",
            text: data.message || "দুঃখিত, এআই সার্ভার হতে উত্তর প্রস্তুত করা যায়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।",
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      setChatHistory((prev) => [
        ...prev,
        {
          role: "ai",
          text: "সংযোগ ত্রুটির কারণে উত্তর দেওয়া সম্ভব হয়নি।",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#176B55] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-gray-700">কেসের তথ্য ও ঝুঁকি বিশ্লেষণ লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center p-8">
        <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center max-w-md space-y-4">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-gray-900">ত্রুটি</h2>
          <p className="text-xs text-gray-600">{error || "কেস খুঁজে পাওয়া যায়নি"}</p>
          <Link href="/cases" className="inline-block bg-[#176B55] text-white text-xs font-semibold px-4 py-2 rounded-lg">
            সকল কেস তালিকায় ফিরুন
          </Link>
        </div>
      </div>
    );
  }

  const getRiskBanner = (level: string) => {
    switch (level) {
      case "HIGH_PRIORITY":
        return {
          bgColor: "bg-rose-50 border-rose-200 text-rose-900",
          icon: AlertOctagon,
          title: "উচ্চ অগ্রাধিকার — গুরুতর অসংগতি ও প্রতারণার ঝুঁকি শনাক্ত",
          desc: "উপস্থাপিত নথিসমূহে একই দাগের অতিরিক্ত হস্তান্তর (দ্বৈত বিক্রয়) অথবা জরিপে অস্বাভাবিক অসংগতি পরিলক্ষিত হয়েছে। কোনো প্রকার লেনদেনের পূর্বে রেকর্ড রুম ও সাব-রেজিস্ট্রি বালাম যাচাই বাধ্যতামূলক।",
        };
      case "REVIEW_REQUIRED":
        return {
          bgColor: "bg-amber-50 border-amber-200 text-amber-900",
          icon: AlertTriangle,
          title: "পর্যালোচনা প্রয়োজন — সম্ভাব্য জরিপ অসংগতি বিদ্যমান",
          desc: "ঐতিহাসিক জরিপের সাথে বর্তমান রেকর্ডের জমির পরিমাণে বা মালিকানার শৃঙ্খলায় কিছু পার্থক্য পাওয়া গেছে। সহকারী কমিশনার (ভূমি) অফিস হতে নামজারি যাচাই করা সমীচীন।",
        };
      case "VERIFIED":
      case "INFORMATION":
        return {
          bgColor: "bg-emerald-50 border-emerald-200 text-emerald-900",
          icon: CheckCircle2,
          title: "প্রাথমিক যাচাই সম্পন্ন — দৃশ্যমান বড় কোনো অসংগতি পাওয়া যায়নি",
          desc: "পরীক্ষিত সিএস, এসএ, আরএস ও বিএস রেকর্ডের আয়তন এবং দলিল শৃঙ্খলায় সামঞ্জস্য রয়েছে। ক্রয়ের পূর্বে সরেজমিন দখলি স্বত্ব যাচাই করুন।",
        };
      default:
        return {
          bgColor: "bg-gray-50 border-gray-200 text-gray-900",
          icon: HelpCircle,
          title: "তথ্য অপর্যাপ্ত — অতিরিক্ত নথিপত্র প্রয়োজন",
          desc: "একটিমাত্র রেকর্ডের ভিত্তিতে পূর্ণাঙ্গ তুলনা সম্ভব হয়নি। সিএস বা আরএস খতিয়ানের কপি যুক্ত করুন।",
        };
    }
  };

  const banner = getRiskBanner(caseData.overallRiskLevel);
  const BannerIcon = banner.icon;

  return (
    <div className="bg-[#F7F8FA] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
            <Link href="/cases" className="hover:text-gray-900 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>কেস তালিকা</span>
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-bold">{caseData.caseNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/cases/${caseData.id}/report`}
              className="bg-white hover:bg-gray-50 text-gray-800 text-xs font-semibold px-4 py-2 rounded-lg border border-gray-300 shadow-sm flex items-center gap-2 transition-all"
            >
              <Printer className="w-4 h-4 text-[#176B55]" />
              <span>অফিসিয়াল রিপোর্ট প্রিন্ট/পিডিএফ</span>
            </Link>
          </div>
        </div>

        {/* Executive Case Header */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-4">
            <div>
              <span className="text-xs font-mono font-bold bg-gray-100 text-gray-800 px-2.5 py-1 rounded">
                {caseData.caseNumber}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
                {caseData.title}
              </h1>
            </div>
            <div className="text-xs text-gray-400">
              বিশ্লেষণ তারিখ: {new Date(caseData.updatedAt).toLocaleDateString("bn-BD")}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-500 block mb-0.5">মৌজা ও জেএল</span>
              <span className="font-bold text-gray-900 text-sm">{caseData.mouza} (জেএল: {caseData.jlNumber || "N/A"})</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-500 block mb-0.5">উপজেলা ও জেলা</span>
              <span className="font-bold text-gray-900 text-sm">{caseData.upazila}, {caseData.district}</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-500 block mb-0.5">মূল খতিয়ান ও দাগ</span>
              <span className="font-bold text-gray-900 text-sm">খতিয়ান {caseData.primaryKhatian || "N/A"} • দাগ {caseData.primaryDag || "N/A"}</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-500 block mb-0.5">পরীক্ষিত রেকর্ড/দলিল</span>
              <span className="font-bold text-gray-900 text-sm">
                {caseData.records?.length || 0} টি রেকর্ড • {caseData.deeds?.length || 0} টি দলিল
              </span>
            </div>
          </div>

          {/* Risk Level Banner */}
          <div className={`p-4 sm:p-5 rounded-xl border flex items-start gap-3.5 ${banner.bgColor}`}>
            <BannerIcon className="w-6 h-6 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-bold text-sm sm:text-base">{banner.title}</h3>
              <p className="text-xs leading-relaxed opacity-90">{banner.desc}</p>
            </div>
          </div>
        </div>

        {/* Section 1: Side-by-side Historical Survey Comparison Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                ১. ঐতিহাসিক জরিপ খতিয়ান তুলনামূলক সারণী (CS, SA, RS, BS)
              </h2>
              <p className="text-xs text-gray-500">
                একই মৌজা ও দাগে সিএস হতে বিএস জরিপ পর্যন্ত জমির পরিমাণের ধারাবাহিকতা ও স্বত্বাধিকারীর পরিবর্তন
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 font-bold">
                  <th className="py-3 px-4">জরিপ ক্রম</th>
                  <th className="py-3 px-4">সাল</th>
                  <th className="py-3 px-4">খতিয়ান নং</th>
                  <th className="py-3 px-4">দাগ নং</th>
                  <th className="py-3 px-4">জমির পরিমাণ</th>
                  <th className="py-3 px-4">রেকর্ডীয় মালিক</th>
                  <th className="py-3 px-4">উৎস নথি</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-800">
                {caseData.records?.map((r: any) => (
                  <tr key={r.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#176B55]">
                      <span className="px-2 py-0.5 rounded bg-[#176B55]/10 border border-[#176B55]/20">
                        {r.surveyType} খতিয়ান
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500">{r.surveyYear || "—"}</td>
                    <td className="py-3.5 px-4 font-mono font-semibold">{r.khatianNumber}</td>
                    <td className="py-3.5 px-4 font-mono font-semibold">{r.dagNumber}</td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      {r.landAreaAcre} একর
                    </td>
                    <td className="py-3.5 px-4">
                      {Array.isArray(r.ownerNames) ? r.ownerNames.join(", ") : r.ownerNames}
                    </td>
                    <td className="py-3.5 px-4 text-gray-500">{r.sourceLabel || "খতিয়ান রেকর্ড"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Deeds & Ownership Transfers (if any) */}
        {caseData.deeds && caseData.deeds.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
              ২. সাব-রেজিস্ট্রিকৃত বিক্রয় ও বায়া দলিলের তালিকা
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 font-bold">
                    <th className="py-3 px-4">দলিল নং ও তারিখ</th>
                    <th className="py-3 px-4">সাব-রেজিস্ট্রি অফিস</th>
                    <th className="py-3 px-4">বিক্রেতা (Seller)</th>
                    <th className="py-3 px-4">ক্রেতা (Buyer)</th>
                    <th className="py-3 px-4">বিক্রিত পরিমাণ</th>
                    <th className="py-3 px-4">দাগ নম্বরসমূহ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-800">
                  {caseData.deeds.map((d: any) => (
                    <tr key={d.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3 px-4 font-bold">
                        {d.deedNumber}
                        <span className="block text-[11px] text-gray-400 font-normal">
                          {new Date(d.deedDate).toLocaleDateString("bn-BD")}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{d.subRegistryOffice}</td>
                      <td className="py-3 px-4 font-medium text-rose-700">
                        {Array.isArray(d.sellerNames) ? d.sellerNames.join(", ") : d.sellerNames}
                      </td>
                      <td className="py-3 px-4 font-medium text-emerald-700">
                        {Array.isArray(d.buyerNames) ? d.buyerNames.join(", ") : d.buyerNames}
                      </td>
                      <td className="py-3 px-4 font-bold text-gray-900">{d.landAreaAcre} একর</td>
                      <td className="py-3 px-4 font-mono">
                        {Array.isArray(d.plotDagNumbers) ? d.plotDagNumbers.join(", ") : d.plotDagNumbers}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section 3: Rule-Based Risk Findings */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-4">
          <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                ৩. চিহ্নিত অসংগতি ও আইনি ঝুঁকি বিশ্লেষণ
              </h2>
              <p className="text-xs text-gray-500">
                স্বয়ংক্রিয় ফ্রড ডিটেকশন ইঞ্জিনের বিশ্লেষিত প্রমাণ ও সুনির্দিষ্ট পর্যবেক্ষণসমূহ
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
              মোট ফাইন্ডিংস: {caseData.findings?.length || 0} টি
            </span>
          </div>

          <div className="space-y-4">
            {caseData.findings?.map((f: any, idx: number) => {
              const isHigh = f.severity === "HIGH_PRIORITY";
              const isReview = f.severity === "REVIEW_REQUIRED";
              return (
                <div
                  key={f.id || idx}
                  className={`p-5 rounded-xl border space-y-3 ${
                    isHigh
                      ? "bg-rose-50/40 border-rose-200"
                      : isReview
                      ? "bg-amber-50/40 border-amber-200"
                      : "bg-emerald-50/40 border-emerald-200"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        isHigh ? "bg-rose-200 text-rose-900" : isReview ? "bg-amber-200 text-amber-900" : "bg-emerald-200 text-emerald-900"
                      }`}>
                        {f.ruleId}
                      </span>
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                        {f.titleBengali}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-gray-700 leading-relaxed font-medium">
                    {f.descriptionBengali}
                  </p>

                  {f.recommendedActionBengali && (
                    <div className="p-3 bg-white/80 rounded-lg border border-gray-200 text-xs text-gray-800 space-y-1">
                      <span className="font-bold text-[#176B55] block">
                        সুপারিশকৃত করণীয় পদক্ষেপ:
                      </span>
                      <p>{f.recommendedActionBengali}</p>
                    </div>
                  )}

                  {f.legalContext && (
                    <div className="text-[11px] text-gray-500 flex items-center gap-1.5 pt-1">
                      <Scale className="w-3.5 h-3.5 text-[#176B55]" />
                      <span>{f.legalContext}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 4: Interactive RAG Legal Assistant */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#176B55]/10 flex items-center justify-center text-[#176B55]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  ৪. ভূমিপ্রহরী এআই পরামর্শক (RAG Legal Assistant)
                </h2>
                <p className="text-xs text-gray-500">
                  বাংলাদেশের ভূমি আইন, জরিপ পদ্ধতি ও এই কেস সংক্রান্ত যেকোনো প্রশ্ন জিজ্ঞেস করুন।
                </p>
              </div>
            </div>
            <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
              OpenRouter + Nemotron LLM
            </span>
          </div>

          {/* Chat Messages */}
          <div className="space-y-4 max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-xl border border-gray-200/80">
            {chatHistory.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 text-xs leading-relaxed ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-3.5 rounded-2xl max-w-2xl space-y-2 ${
                    msg.role === "user"
                      ? "bg-[#176B55] text-white rounded-tr-none"
                      : "bg-white text-gray-800 border border-gray-200 shadow-sm rounded-tl-none"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Sources citation */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-500 space-y-1">
                      <span className="font-bold text-[#176B55] block">
                        উদ্ধৃত আইনি তথ্যসূত্র:
                      </span>
                      {msg.sources.map((s, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                          <span>•</span>
                          <span>{s.sourceLabel || s.sourceId}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {chatLoading && (
              <div className="flex items-center gap-2 text-xs text-gray-500 p-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#176B55]" />
                <span>ভূমি আইন ও রেফারেন্স তথ্য ঘেঁটে এআই উত্তর প্রস্তুত করছে...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSendRagQuestion} className="flex gap-2">
            <input
              type="text"
              placeholder="এই অসংগতির কারণে জমি কেনা কি ঝুঁকিপূর্ণ? অথবা যেকোনো ভূমি আইনি প্রশ্ন লিখুন..."
              value={chatQuery}
              onChange={(e) => setChatQuery(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#176B55]"
            />
            <button
              type="submit"
              disabled={chatLoading || !chatQuery.trim()}
              className="bg-[#176B55] hover:bg-[#125543] disabled:opacity-50 text-white px-5 py-3 rounded-xl font-semibold flex items-center gap-1.5 transition-all text-xs sm:text-sm"
            >
              <span>পাঠান</span>
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Prompt Suggestions */}
          <div className="flex flex-wrap gap-2 text-[11px]">
            <span className="text-gray-400 font-medium pt-1">উদাহরণ প্রশ্ন:</span>
            <button
              type="button"
              onClick={() => setChatQuery("একই দাগ একাধিক দলিলে বিক্রি হলে আইনের ধারা কী?")}
              className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              "একই দাগ একাধিক দলিলে বিক্রি হলে আইনের ধারা কী?"
            </button>
            <button
              type="button"
              onClick={() => setChatQuery("জরিপে জমি বৃদ্ধির কারণে কী কী সমস্যা হতে পারে?")}
              className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              "জরিপে জমি বৃদ্ধির কারণে কী কী সমস্যা হতে পারে?"
            </button>
            <button
              type="button"
              onClick={() => setChatQuery("বায়া দলিলের ধারাবাহিকতা না থাকলে নামজারি কি সম্ভব?")}
              className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              "বায়া দলিলের ধারাবাহিকতা না থাকলে নামজারি কি সম্ভব?"
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CaseDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center p-8">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-4 border-[#176B55] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-gray-700">লোড হচ্ছে...</p>
          </div>
        </div>
      }
    >
      <CaseDetailContent />
    </Suspense>
  );
}
