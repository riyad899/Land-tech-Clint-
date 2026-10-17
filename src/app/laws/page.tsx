"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL, safeFetchJson } from "../../lib/api";
import { Scale, Sparkles, Send, Loader2, BookOpen, ShieldCheck, Database } from "lucide-react";

export default function LawsPage() {
  const [stats, setStats] = useState<any>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<any>(null);

  useEffect(() => {
    safeFetchJson(`${API_BASE_URL}/rag/stats`)
      .then((data) => {
        if (data.success && data.data) {
          setStats(data.data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleAskLaw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setAiAnswer(null);

    try {
      const data = await safeFetchJson(`${API_BASE_URL}/rag/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: query.trim(),
          limit: 5,
        }),
      });

      if (data.success && data.data) {
        setAiAnswer(data.data);
      } else {
        setAiAnswer({
          answer: data.message || "দুঃখিত, এআই সার্ভার হতে উত্তর প্রস্তুত করা যায়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।",
          sources: [],
          fromCache: false,
        });
      }
    } catch (err) {
      console.error("Ask law error:", err);
      setAiAnswer({
        answer: "সংযোগ স্থাপন করা যায়নি। অনুগ্রহ করে ব্যাকএন্ড সার্ভার সংযোগ পরীক্ষা করুন।",
        sources: [],
        fromCache: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const LAW_CARDS = [
    {
      title: "স্টেট একুইজিশন অ্যান্ড টেন্যান্সি অ্যাক্ট ১৯৫০",
      section: "ধারা ১৪৩ - নামজারি ও জমাভাগ",
      category: "Mutation (নামজারি)",
      desc: "জমি ক্রয় বা প্রাপ্তির পর সহকারী কমিশনার (ভূমি) এর মাধ্যমে নামজারি ও জমাভাগ করানো বাধ্যতামূলক। পূর্ববর্তী রেকর্ডের নাম পরিবর্তন ব্যতিরেকে শুধু দলিলের ভিত্তিতে চূড়ান্ত স্বত্ব প্রতিষ্ঠিত হয় না।",
    },
    {
      title: "রেজিস্ট্রেশন আইন ১৯০৮",
      section: "ধারা ৫২ক - দলিল নিবন্ধনের পূর্বশর্ত",
      category: "Registration (দলিল রেজিস্ট্রি)",
      desc: "স্থাবর সম্পত্তি হস্তান্তরের দলিল নিবন্ধনের সময় বিক্রেতার নামে নামজারি খতিয়ান, দাখিলা ও পূর্ববর্তী ২৫ বছরের বায়া দলিল সাব-রেজিস্ট্রার কর্তৃক যাচাই বাধ্যতামূলক।",
    },
    {
      title: "ভূমি অপরাধ প্রতিরোধ ও প্রতিকার আইন ২০২৩",
      section: "ধারা ৪ ও ৫ - জাল দলিল ও দ্বৈত বিক্রয়",
      category: "Fraud Prevention (প্রতারণা দমন)",
      desc: "অন্যের জমি নিজের বলে দাবি করে জাল দলিল তৈরি অথবা একই জমি একাধিক ব্যক্তির নিকট প্রতারণামূলক হস্তান্তর (দ্বৈত বিক্রয়) অজামিনযোগ্য ফৌজদারি অপরাধ (সর্বোচ্চ ৭ বছর কারাদণ্ড)।",
    },
    {
      title: "বাংলাদেশের ভূমি জরিপ ক্রমবিন্যাস",
      section: "CS, SA, RS ও BS জরিপ পদ্ধতি",
      category: "Survey Procedure (জরিপ পদ্ধতি)",
      desc: "সিএস (১৮৮৮-১৯৪০) বিজ্ঞানসম্মত ভিত্তি জরিপ; এসএ (১৯৫৬-১৯৬২) জমিদারি উচ্ছেদ জরিপ; আরএস সংশোধন জরিপ এবং বিএস (১৯৯৮+) আধুনিক সিটি ও জেলা জরিপ।",
    },
  ];

  return (
    <div className="bg-[#F7F8FA] min-h-screen py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#176B55]/10 text-[#176B55] text-xs font-semibold">
            <Scale className="w-3.5 h-3.5" />
            <span>আইনি জ্ঞানভাণ্ডার ও আরএজি (RAG) এআই</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900">
            বাংলাদেশের ভূমি আইন ও বিধিমালার এআই সহকারী
          </h1>
          <p className="text-sm text-gray-600">
            বাংলাদেশের প্রচলিত ভূমি আইন, নামজারি নীতিমালা এবং জরিপ বিধিমালার আলোকে তথ্যনিষ্ঠ ও নির্ভরযোগ্য উত্তর জানুন।
          </p>
        </div>

        {/* Live RAG Question Box */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#176B55]" />
              <span>এআই আইন উপদেষ্টাকে যেকোনো প্রশ্ন করুন</span>
            </h2>
            {stats && (
              <span className="text-[11px] font-mono text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md flex items-center gap-1.5">
                <Database className="w-3 h-3 text-[#176B55]" />
                <span>{stats.totalActiveDocuments} টি আইনি ক্লজ ভেক্টর ডাটাবেজে সক্রিয়</span>
              </span>
            )}
          </div>

          <form onSubmit={handleAskLaw} className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="যেমন: খতিয়ানের ভুলের প্রতিকার কী? অথবা দ্বৈত বিক্রয় হলে কী কী আইনি পদক্ষেপ নেওয়া যায়?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 px-4 py-3.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#176B55]"
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="bg-[#176B55] hover:bg-[#125543] disabled:opacity-50 text-white font-bold px-6 py-3.5 rounded-xl transition-all flex items-center gap-2 text-sm shadow-sm"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>জানুন</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 text-[11px] text-gray-500 pt-1">
              <span>জনপ্রিয় প্রশ্ন:</span>
              <button
                type="button"
                onClick={() => setQuery("ভূমি অপরাধ প্রতিরোধ ও প্রতিকার আইন ২০২৩ এর মূল বিষয়গুলো কী?")}
                className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
              >
                "ভূমি অপরাধ প্রতিরোধ ও প্রতিকার আইন ২০২৩"
              </button>
              <button
                type="button"
                onClick={() => setQuery("নামজারি না থাকলে কি জমি বিক্রি করা যায়?")}
                className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
              >
                "নামজারি না থাকলে কি জমি বিক্রি করা যায়?"
              </button>
              <button
                type="button"
                onClick={() => setQuery("সিএস ও বিএস খতিয়ানের মধ্যে পার্থক্য কী?")}
                className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
              >
                "সিএস ও বিএস খতিয়ানের পার্থক্য"
              </button>
            </div>
          </form>

          {/* AI Response Display */}
          {aiAnswer && (
            <div className="p-6 bg-[#F7F8FA] rounded-xl border border-gray-200 space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#176B55]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>ভূমিপ্রহরী এআই উত্তর (সূত্রভিত্তিক):</span>
                </div>
                {aiAnswer.fromCache && (
                  <span className="text-[11px] font-mono text-emerald-800 bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                    ⚡ রেডিস ক্যাশ (১ ঘণ্টার জন্য সংরক্ষিত)
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap font-medium">
                {aiAnswer.answer}
              </p>

              {aiAnswer.sources && aiAnswer.sources.length > 0 && (
                <div className="pt-3 border-t border-gray-200 text-xs text-gray-500 space-y-1.5">
                  <span className="font-bold text-gray-700 block">উদ্ধৃত তথ্যসূত্রসমূহ:</span>
                  {aiAnswer.sources.map((s: any, idx: number) => (
                    <div key={idx} className="p-2 bg-white rounded border border-gray-200 text-[11px] text-gray-600">
                      <strong>{s.sourceLabel || s.sourceId}:</strong> {s.content?.slice(0, 160)}...
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Core Law Reference Cards */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">
            বাংলাদেশে প্রযোজ্য প্রধান প্রধান ভূমি আইন ও বিধিমালা
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LAW_CARDS.map((law, idx) => (
              <div key={idx} className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm space-y-2">
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#176B55]/10 text-[#176B55]">
                  {law.category}
                </span>
                <h3 className="text-base font-bold text-gray-900">{law.title}</h3>
                <span className="text-xs text-gray-500 font-medium block">{law.section}</span>
                <p className="text-xs text-gray-600 leading-relaxed pt-1">{law.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
