"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "../contexts/LanguageContext";
import { ShieldCheck, Scale, FileText, AlertTriangle } from "lucide-react";

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#17212B] text-gray-300 pt-12 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 bg-white rounded-lg p-1">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <div>
                <span className="text-xl font-bold text-white tracking-tight">
                  ভূমিপ্রহরী
                </span>
                <span className="ml-2 text-xs text-[#20a382] font-semibold">
                  (LandGuard AI)
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-400 max-w-md leading-relaxed">
              {t(
                "বাংলাদেশের সাধারণ নাগরিক ও জমি ক্রেতাদের জন্য এআই-চালিত ভূমি নথি যাচাই, সিএস/এসএ/আরএস/বিএস জরিপ তুলনা এবং প্রতারণার ঝুঁকি শনাক্তকরণ প্ল্যাটফর্ম।",
                "AI-assisted land record verification, survey comparison (CS/SA/RS/BS), and fraud risk detection platform for Bangladesh.",
              )}
            </p>
            <div className="p-3 bg-gray-800/70 border border-gray-700/60 rounded-lg text-xs text-amber-300/90 flex gap-2.5 items-start">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
              <span>
                {t(
                  "সতর্কতা: ভূমিপ্রহরী একটি সিদ্ধান্ত-সহায়ক সফটওয়্যার। এটি কোনো আদালতের রায় বা সরকারি প্রত্যয়নপত্র নয়। জমি হস্তান্তরের পূর্বে সাব-রেজিস্ট্রি বালাম ও সহকারী কমিশনার (ভূমি) কার্যালয়ে মূল নথি যাচাই বাধ্যতামূলক।",
                  "Notice: BhumiProhori is a decision-support tool. Always inspect official government volume books and title deeds before executing transactions.",
                )}
              </span>
            </div>
          </div>

          {/* Core modules */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              {t("সেবাসমূহ", "Features")}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/analyze" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#20a382]" />
                  <span>{t("জমির নথি যাচাই", "Document Verification")}</span>
                </Link>
              </li>
              <li>
                <Link href="/cases" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#20a382]" />
                  <span>{t("যাচাই কেসসমূহ", "Case History")}</span>
                </Link>
              </li>
              <li>
                <Link href="/laws" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-[#20a382]" />
                  <span>{t("এআই আইন সহকারী (RAG)", "Legal Knowledge Base")}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal references */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              {t("আইনি তথ্যসূত্র", "Legal Sources")}
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>• স্টেট একুইজিশন অ্যান্ড টেন্যান্সি অ্যাক্ট ১৯৫০</li>
              <li>• রেজিস্ট্রেশন আইন ১৯০৮ (ধারা ৫২ক)</li>
              <li>• ভূমি অপরাধ প্রতিরোধ ও প্রতিকার আইন ২০২৩</li>
              <li>• সম্পত্তি হস্তান্তর আইন ১৮৮২</li>
              <li>• সার্ভে অ্যান্ড সেটেলমেন্ট ম্যানুয়াল ১৯৩৫</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 gap-4">
          <p>
            © 2026 ভূমিপ্রহরী (BhumiProhori) — সর্বস্বত্ব সংরক্ষিত।
          </p>
          <div className="flex gap-4">
            <span>বাংলা প্রথম ইন্টারফেস</span>
            <span>•</span>
            <span>নিরাপদ ও এনক্রিপ্টেড ডাটাবেজ</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
