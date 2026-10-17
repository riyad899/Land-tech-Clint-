"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { API_BASE_URL, safeFetchJson } from "../../../../lib/api";
import { Suspense } from "react";
import { Printer, ArrowLeft } from "lucide-react";

function ReportContent() {
  const params = useParams();
  const id = params?.id as string;

  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    safeFetchJson(`${API_BASE_URL}/reports/${id}`)
      .then((data) => {
        if (data.success && data.data) {
          setReport(data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-[#176B55] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-gray-600">প্রতিবেদন তৈরি হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <p className="text-sm text-gray-600">প্রতিবেদন পাওয়া যায়নি।</p>
          <Link href="/cases" className="text-xs text-[#176B55] underline">কেস তালিকায় ফিরুন</Link>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8 print:p-0 print:bg-white text-gray-900">
      {/* Floating Action Bar (Hidden in Print) */}
      <div className="max-w-4xl mx-auto px-4 mb-6 flex items-center justify-between print:hidden">
        <Link
          href={`/cases/${id}`}
          className="text-xs font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>কেস বিবরণে ফিরুন</span>
        </Link>

        <button
          onClick={handlePrint}
          className="bg-[#176B55] hover:bg-[#125543] text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow-sm flex items-center gap-2 transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>প্রিন্ট করুন বা পিডিএফ সেভ করুন</span>
        </button>
      </div>

      {/* Printable Sheet (Standard A4 / Letter) */}
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-2xl border border-gray-200 shadow-lg print:shadow-none print:border-none print:p-4 space-y-8">
        {/* Official Header */}
        <div className="border-b-2 border-[#176B55] pb-6 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 flex-shrink-0">
              <Image src="/logo.png" alt="Logo" fill className="object-contain" priority />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-extrabold text-[#176B55] tracking-tight">
                ভূমিপ্রহরী (BhumiProhori)
              </h1>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                AI-চালিত ভূমি নথি যাচাই ও প্রতারণার ঝুঁকি বিশ্লেষণ প্রতিবেদন
              </p>
              <p className="text-[11px] text-gray-400">
                Land Document Verification & Fraud Risk Assessment Report
              </p>
            </div>
          </div>

          <div className="text-right space-y-1 text-xs">
            <div className="font-mono font-bold text-gray-800 bg-gray-100 px-2.5 py-1 rounded inline-block">
              {report.reportId}
            </div>
            <p className="text-[11px] text-gray-500">
              তারিখ: {report.generatedAtBengali}
            </p>
          </div>
        </div>

        {/* Case Metadata */}
        <div className="bg-[#F7F8FA] p-5 rounded-xl border border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-gray-500 block mb-0.5">কেস নম্বর</span>
            <span className="font-bold text-gray-900">{report.case.caseNumber}</span>
          </div>
          <div>
            <span className="text-gray-500 block mb-0.5">মৌজা ও জেএল</span>
            <span className="font-bold text-gray-900">{report.case.mouza} (জেএল: {report.case.jlNumber || "—"})</span>
          </div>
          <div>
            <span className="text-gray-500 block mb-0.5">উপজেলা ও জেলা</span>
            <span className="font-bold text-gray-900">{report.case.upazila}, {report.case.district}</span>
          </div>
          <div>
            <span className="text-gray-500 block mb-0.5">সার্বিক ঝুঁকি মূল্যায়ন</span>
            <span className="font-bold text-rose-700">
              {report.case.overallRiskLevel === "HIGH_PRIORITY"
                ? "উচ্চ অগ্রাধিকার"
                : report.case.overallRiskLevel === "REVIEW_REQUIRED"
                ? "পর্যালোচনা প্রয়োজন"
                : "যাচাইকৃত (ঝুঁকিমুক্ত)"}
            </span>
          </div>
        </div>

        {/* Examined Surveys Table */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-1">
            ১. পরীক্ষিত ঐতিহাসিক জরিপ খতিয়ানসমূহ (CS, SA, RS, BS)
          </h2>
          <table className="w-full text-left text-xs border border-gray-200">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 font-bold text-gray-700">
                <th className="p-2.5 border-r">জরিপ টাইপ</th>
                <th className="p-2.5 border-r">খতিয়ান নং</th>
                <th className="p-2.5 border-r">দাগ নং</th>
                <th className="p-2.5 border-r">জমির পরিমাণ</th>
                <th className="p-2.5 border-r">শ্রেণি</th>
                <th className="p-2.5">রেকর্ডীয় মালিক</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-800">
              {report.examinedRecords?.map((r: any, idx: number) => (
                <tr key={idx}>
                  <td className="p-2.5 font-bold text-[#176B55] border-r">{r.surveyType}</td>
                  <td className="p-2.5 font-mono border-r">{r.khatianNumber}</td>
                  <td className="p-2.5 font-mono border-r">{r.dagNumber}</td>
                  <td className="p-2.5 font-bold border-r">{r.landAreaAcre} একর</td>
                  <td className="p-2.5 border-r">{r.landClass || "—"}</td>
                  <td className="p-2.5">{Array.isArray(r.ownerNames) ? r.ownerNames.join(", ") : r.ownerNames}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Examined Deeds (if present) */}
        {report.examinedDeeds && report.examinedDeeds.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-1">
              ২. পরীক্ষিত সাব-রেজিস্ট্রিকৃত দলিলসমূহ
            </h2>
            <table className="w-full text-left text-xs border border-gray-200">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 font-bold text-gray-700">
                  <th className="p-2.5 border-r">দলিল নং ও তারিখ</th>
                  <th className="p-2.5 border-r">সাব-রেজিস্ট্রি অফিস</th>
                  <th className="p-2.5 border-r">বিক্রেতা (Seller)</th>
                  <th className="p-2.5 border-r">ক্রেতা (Buyer)</th>
                  <th className="p-2.5">বিক্রিত পরিমাণ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-800">
                {report.examinedDeeds.map((d: any, idx: number) => (
                  <tr key={idx}>
                    <td className="p-2.5 font-mono font-bold border-r">{d.deedNumber}</td>
                    <td className="p-2.5 border-r">{d.subRegistryOffice}</td>
                    <td className="p-2.5 border-r">{Array.isArray(d.sellerNames) ? d.sellerNames.join(", ") : d.sellerNames}</td>
                    <td className="p-2.5 border-r">{Array.isArray(d.buyerNames) ? d.buyerNames.join(", ") : d.buyerNames}</td>
                    <td className="p-2.5 font-bold">{d.landAreaAcre} একর</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Risk Findings Table */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-1">
            ৩. চিহ্নিত অসংগতি, দ্বৈত বিক্রয় ও আইনি পর্যবেক্ষণ
          </h2>
          <div className="space-y-3">
            {report.findings?.map((f: any, idx: number) => (
              <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-gray-900">
                  <span className="text-[#176B55]">{idx + 1}. {f.title}</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-gray-200">{f.severity}</span>
                </div>
                <p className="text-gray-700 leading-relaxed">{f.description}</p>
                {f.recommendedAction && (
                  <div className="pt-1 text-[#176B55]">
                    <strong>করণীয়:</strong> {f.recommendedAction}
                  </div>
                )}
                {f.legalContext && (
                  <div className="text-gray-500 text-[11px]">
                    <strong>আইনি রেফারেন্স:</strong> {f.legalContext}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Official Disclaimer */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-500 leading-relaxed space-y-1">
          <span className="font-bold text-gray-800 block">আইনি ঘোষণা ও সতর্কবার্তা:</span>
          <p>{report.officialDisclaimerBengali}</p>
        </div>

        {/* Signature & Seal Area */}
        <div className="pt-12 flex justify-between items-end text-xs text-gray-600 border-t border-gray-200">
          <div className="space-y-1">
            <div className="w-32 border-b border-gray-400 pb-1 font-semibold text-center">ভূমিপ্রহরী এআই ইঞ্জিন</div>
            <p className="text-[11px] text-gray-400">স্বয়ংক্রিয়ভাবে সংকলিত ও ভেরিফাইড</p>
          </div>

          <div className="space-y-1 text-right">
            <div className="w-48 border-b border-gray-400 pb-1 font-semibold text-center">অনুমোদিত পর্যালোচক / আইনজীবী</div>
            <p className="text-[11px] text-gray-400">সরেজমিন পরিদর্শনকারী কর্মকর্তা</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center p-8">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-4 border-[#176B55] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium text-gray-600">প্রতিবেদন তৈরি হচ্ছে...</p>
          </div>
        </div>
      }
    >
      <ReportContent />
    </Suspense>
  );
}
