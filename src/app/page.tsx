"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "../contexts/LanguageContext";
import {
  ShieldCheck,
  FileSearch,
  Scale,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileCheck,
  Database,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F7F8FA] via-white to-white py-16 sm:py-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#176B55]/10 border border-[#176B55]/20 text-[#176B55] text-xs sm:text-sm font-medium">
                <Sparkles className="w-4 h-4 text-[#176B55]" />
                <span>{t("AI-চালিত ভূমি নথি বিশ্লেষণ প্ল্যাটফর্ম", "AI-Powered Land Document Analysis")}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
                <span className="text-[#176B55]">ভূমিপ্রহরী:</span>{" "}
                {t(
                  "জমির তথ্য যাচাই, প্রতারণার ঝুঁকি শনাক্ত।",
                  "Verify Land Records, Detect Fraud Risks.",
                )}
              </h1>

              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {t(
                  "সিএস (CS), এসএ (SA), আরএস (RS) ও বিএস (BS) খতিয়ান তুলনা, একাধিক ব্যক্তির নিকট একই জমি বিক্রয় (দ্বৈত বিক্রয়) শনাক্তকরণ এবং বাংলাদেশের ভূমি আইনের আলোকে নির্ভরযোগ্য এআই পরামর্শ প্রতিবেদন।",
                  "Compare historical survey records (CS, SA, RS, BS), detect duplicate sale risks, and generate evidence-grounded reports with Bangladesh land law citations.",
                )}
              </p>

              <div className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start pt-2">
                <Link
                  href="/analyze"
                  className="bg-[#176B55] hover:bg-[#125543] text-white font-semibold px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group text-base"
                >
                  <span>{t("জমির তথ্য যাচাই করুন", "Verify Land Records")}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/cases"
                  className="bg-white hover:bg-gray-50 text-gray-800 font-semibold px-6 py-3.5 rounded-xl border border-gray-300 shadow-sm transition-all flex items-center justify-center gap-2 text-base"
                >
                  <FileSearch className="w-5 h-5 text-gray-500" />
                  <span>{t("যাচাইকৃত কেস দেখুন", "View Sample Cases")}</span>
                </Link>
              </div>

              {/* Trust Indicators */}
             
            </div>

            {/* Right Card / Visual */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-6 space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12">
                      <Image
                        src="/logo.png"
                        alt="ভূমিপ্রহরী"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">ভূমিপ্রহরী অ্যানালাইজার</h3>
                      <p className="text-xs text-gray-500">ঢাকা জেলা • ধানমন্ডি মৌজা</p>
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    সক্রিয়
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-xs space-y-1">
                    <span className="text-gray-500 font-medium">রেকর্ড যাচাই স্ট্যাটাস:</span>
                    <div className="flex items-center justify-between font-semibold text-gray-800">
                      <span>সিএস ১০১২ দাগ • ০.২৫ একর</span>
                      <span className="text-emerald-600">✓ মিলেছে</span>
                    </div>
                    <div className="flex items-center justify-between font-semibold text-gray-800">
                      <span>বিএস ১০১২ দাগ • ০.২৫ একর</span>
                      <span className="text-emerald-600">✓ মিলেছে</span>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-200/80 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-800 font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>দ্বৈত বিক্রয় পর্যবেক্ষণ:</span>
                    </div>
                    <p className="text-gray-600">
                      বিক্রেতার রেজিস্ট্রিকৃত দলিলসমূহ যাচাই করা হয়েছে। কোনো অসংগতি বা অতিরিক্ত বিক্রয় নেই।
                    </p>
                  </div>

                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 text-xs">
                    <span className="text-emerald-800 font-bold block mb-1">
                      আইনি পরামর্শ (SAT Act ১৯৫০, ধারা ১৪৩):
                    </span>
                    <p className="text-emerald-900/80 leading-relaxed">
                      নামজারি ও হালনাগাদ দাখিলা বিদ্যমান। মালিকানার ধারাবাহিকতায় কোনো বিচ্ছিন্নতা পাওয়া যায়নি।
                    </p>
                  </div>
                </div>

                <Link
                  href="/cases/141fb0da-a2d8-45d8-aedc-1cf4230a167f"
                  className="w-full block text-center py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  সম্পূর্ণ ডেমো রিপোর্ট দেখুন →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Simple Process */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900">
              {t("কীভাবে কাজ করে ভূমিপ্রহরী?", "How BhumiProhori Works")}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              {t(
                "মাত্র ৩টি সহজ ধাপে আপনার জমির সকল ঐতিহাসিক জরিপ ও দলিলের জটিল অসংগতি যাচাই করুন।",
                "Review complex land record discrepancies in 3 straightforward steps.",
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-[#F7F8FA] border border-gray-200/80 hover:border-[#176B55]/40 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#176B55]/10 flex items-center justify-center text-[#176B55] font-bold text-lg">
                ১
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                {t("নথি আপলোড বা তথ্য এন্ট্রি", "Upload Document or Enter Data")}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {t(
                  "খতিয়ান বা দলিলের ছবি আপলোড করুন অথবা সিএস, এসএ, আরএস, বিএস দাগ ও খতিয়ান নম্বর ফর্মের মাধ্যমে জমা দিন।",
                  "Upload deed/khatian scan images or manually enter plot, khatian, and area metrics.",
                )}
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-[#F7F8FA] border border-gray-200/80 hover:border-[#176B55]/40 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#176B55]/10 flex items-center justify-center text-[#176B55] font-bold text-lg">
                ২
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                {t("স্বয়ংক্রিয় জরিপ ও দাগ তুলনা", "Cross-Survey Record Matching")}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {t(
                  "সিস্টেম স্বয়ংক্রিয়ভাবে সিএস থেকে বিএস পর্যন্ত জমির আয়তন হ্রাস-বৃদ্ধি, অতিরিক্ত হস্তান্তর ও ধারাবাহিক মালিকানা মেলায়।",
                  "The engine analyzes acreage changes from CS to BS and detects suspicious overselling.",
                )}
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-[#F7F8FA] border border-gray-200/80 hover:border-[#176B55]/40 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#176B55]/10 flex items-center justify-center text-[#176B55] font-bold text-lg">
                ৩
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                {t("ঝুঁকি বিশ্লেষণ ও ডাউনলোডযোগ্য রিপোর্ট", "Risk Report & Legal Advice")}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {t(
                  "স্পষ্ট প্রমাণ ও আইনি রেফারেন্স সহ প্রতিবেদন পান এবং এআই উপদেষ্টার কাছ থেকে করণীয় আইনি পদক্ষেপ জেনে নিন।",
                  "Get an evidence-backed Bengali verification report with legal next-step recommendations.",
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pre-Loaded Demonstration Scenarios */}
      <section className="py-16 bg-[#F7F8FA] border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold text-[#176B55] tracking-widest uppercase">
              {t("লাইভ টেস্ট সিনারিও", "Live Test Scenarios")}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              {t("প্রস্তুতকৃত বাস্তবধর্মী নমুনা কেস পরীক্ষা করুন", "Explore Real-World Verification Cases")}
            </h2>
            <p className="text-sm text-gray-600">
              {t(
                "সিস্টেমের সক্ষমতা তাৎক্ষণিকভাবে দেখতে নিচের যেকোনো একটি নমুনা কেসে প্রবেশ করুন:",
                "Click on any curated scenario to see the analysis and AI reasoning in action:",
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Scenario 1 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-100 text-emerald-800">
                  {t("ঝুঁকিমুক্ত জমি", "Verified Clean")}
                </span>
                <h3 className="text-lg font-bold text-gray-900">
                  ধানমন্ডি মৌজা - বৈধ খতিয়ান
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  সিএস হতে বিএস সিটি জরিপ পর্যন্ত ০.২৫ একর জমির অক্ষুণ্ণ ধারাবাহিকতা এবং নিয়মিত নামজারি খতিয়ান।
                </p>
              </div>
              <Link
                href="/cases/141fb0da-a2d8-45d8-aedc-1cf4230a167f"
                className="mt-6 flex items-center justify-between text-xs font-bold text-[#176B55] hover:text-[#125543] pt-4 border-t border-gray-100"
              >
                <span>কেস রিপোর্ট দেখুন</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Scenario 2 */}
            <div className="bg-white p-6 rounded-2xl border border-rose-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-md bg-rose-100 text-rose-800">
                  {t("উচ্চ ঝুঁকি (দ্বৈত বিক্রয়)", "High Risk (Duplicate Sale)")}
                </span>
                <h3 className="text-lg font-bold text-gray-900">
                  মিরপুর মৌজা - দ্বৈত বিক্রয় ও জাল দলিল
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  ০.৩০ একর জমিতে মোট ০.৪৫ একরের দুটি পৃথক দলিল সম্পাদন। অতিরিক্ত হিস্যা বিক্রির সুস্পষ্ট লক্ষণ।
                </p>
              </div>
              <Link
                href="/cases/6d911afb-f3e9-4928-8392-b223a61ed42f"
                className="mt-6 flex items-center justify-between text-xs font-bold text-rose-700 hover:text-rose-800 pt-4 border-t border-gray-100"
              >
                <span>ঝুঁকি বিশ্লেষণ দেখুন</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Scenario 3 */}
            <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-md bg-amber-100 text-amber-800">
                  {t("পর্যালোচনা প্রয়োজন", "Review Required")}
                </span>
                <h3 className="text-lg font-bold text-gray-900">
                  সাভার মৌজা - জমির অস্বাভাবিক বৃদ্ধি
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  সিএস এ ০.৩০ একর কিন্তু বিএস এ অস্বাভাবিকভাবে বৃদ্ধি পেয়ে ০.৫৮ একর হয়েছে (৯৩% বৃদ্ধি)।
                </p>
              </div>
              <Link
                href="/cases/d47b787d-9093-4f88-9aa8-ff67bc7d5525"
                className="mt-6 flex items-center justify-between text-xs font-bold text-amber-700 hover:text-amber-800 pt-4 border-t border-gray-100"
              >
                <span>অসংগতি তদন্ত দেখুন</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900">
            {t("আপনার জমির দলিল বা খতিয়ান যাচাই করতে প্রস্তুত?", "Ready to verify your land document?")}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            {t(
              "কোনো রেজিস্ট্রেশন ছাড়াই এখনই নথি আপলোড বা নম্বর দিয়ে ফ্রি প্রাথমিক যাচাই করুন।",
              "Upload a document or enter survey numbers for immediate verification.",
            )}
          </p>
          <div className="pt-2">
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 bg-[#176B55] hover:bg-[#125543] text-white font-bold px-8 py-4 rounded-xl shadow-lg transition-all text-base"
            >
              <span>{t("এখনই যাচাই শুরু করুন", "Start Verification Now")}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
