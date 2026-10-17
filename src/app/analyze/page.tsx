"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../contexts/LanguageContext";
import { API_BASE_URL, safeFetchJson } from "../../lib/api";
import {
  UploadCloud,
  FileText,
  Sparkles,
  ArrowRight,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function AnalyzePage() {
  const { t } = useLanguage();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"upload" | "manual" | "demo">("manual");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Manual Form State
  const [title, setTitle] = useState("");
  const [district, setDistrict] = useState("ঢাকা");
  const [upazila, setUpazila] = useState("মিরপুর");
  const [mouza, setMouza] = useState("মিরপুর");
  const [jlNumber, setJlNumber] = useState("১২");

  // Survey Records State
  const [records, setRecords] = useState([
    { surveyType: "CS", khatianNumber: "১০১", dagNumber: "৫৪০", landAreaAcre: "0.30", ownerNames: "আব্দুর রহমান" },
    { surveyType: "BS", khatianNumber: "৪৫২", dagNumber: "৫৪০", landAreaAcre: "0.30", ownerNames: "আব্দুর রহমান" },
  ]);

  // Deeds State
  const [deeds, setDeeds] = useState([
    { deedNumber: "১২৩৪/২০২১", deedDate: "2021-05-10", sellerNames: "আব্দুর রহমান", buyerNames: "মোঃ কামাল হোসেন", landAreaAcre: "0.30" },
  ]);

  // Upload State
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

  const handleAddRecord = () => {
    setRecords([
      ...records,
      { surveyType: "RS", khatianNumber: "", dagNumber: "", landAreaAcre: "0.00", ownerNames: "" },
    ]);
  };

  const handleRemoveRecord = (idx: number) => {
    setRecords(records.filter((_, i) => i !== idx));
  };

  const handleRecordChange = (idx: number, field: string, val: string) => {
    const updated = [...records];
    (updated[idx] as any)[field] = val;
    setRecords(updated);
  };

  const handleAddDeed = () => {
    setDeeds([
      ...deeds,
      { deedNumber: "", deedDate: "2023-01-01", sellerNames: "", buyerNames: "", landAreaAcre: "0.00" },
    ]);
  };

  const handleRemoveDeed = (idx: number) => {
    setDeeds(deeds.filter((_, i) => i !== idx));
  };

  const handleDeedChange = (idx: number, field: string, val: string) => {
    const updated = [...deeds];
    (updated[idx] as any)[field] = val;
    setDeeds(updated);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      if (file.type.startsWith("image/")) {
        setUploadPreview(URL.createObjectURL(file));
      } else {
        setUploadPreview(null);
      }
    }
  };

  // Submit and analyze
  const handleSubmitManual = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Create Case
      const caseData = await safeFetchJson(`${API_BASE_URL}/cases`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || `${mouza} মৌজা ভূমি যাচাই`,
          district,
          upazila,
          mouza,
          jlNumber,
          primaryKhatian: records[0]?.khatianNumber || "N/A",
          primaryDag: records[0]?.dagNumber || "N/A",
        }),
      });

      if (!caseData.success || !caseData.data?.id) {
        throw new Error(caseData.message || "কেস তৈরি করা সম্ভব হয়নি");
      }

      const caseId = caseData.data.id;

      // 2. Add Records
      for (const rec of records) {
        if (!rec.khatianNumber || !rec.dagNumber) continue;
        await fetch(`${API_BASE_URL}/records`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            landCaseId: caseId,
            surveyType: rec.surveyType,
            district,
            upazila,
            mouza,
            jlNumber,
            khatianNumber: rec.khatianNumber,
            dagNumber: rec.dagNumber,
            landAreaAcre: parseFloat(rec.landAreaAcre) || 0,
            ownerNames: rec.ownerNames.split(",").map((s) => s.trim()),
            sourceLabel: `${rec.surveyType} খতিয়ান নং ${rec.khatianNumber}`,
          }),
        });
      }

      // 3. Add Deeds
      for (const d of deeds) {
        if (!d.deedNumber) continue;
        await fetch(`${API_BASE_URL}/records/deed`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            landCaseId: caseId,
            deedNumber: d.deedNumber,
            deedDate: d.deedDate,
            subRegistryOffice: `${upazila} সাব-রেজিস্ট্রি অফিস`,
            sellerNames: d.sellerNames.split(",").map((s) => s.trim()),
            buyerNames: d.buyerNames.split(",").map((s) => s.trim()),
            landAreaAcre: parseFloat(d.landAreaAcre) || 0,
            plotDagNumbers: [records[0]?.dagNumber || "১০০"],
          }),
        });
      }

      // 4. Trigger Analysis
      await fetch(`${API_BASE_URL}/fraud-detection/analyze/${caseId}`, {
        method: "POST",
      });

      // Redirect to Case Details
      router.push(`/cases/${caseId}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "কেস তৈরিতে ত্রুটি হয়েছে। পুনরায় চেষ্টা করুন।");
      setLoading(false);
    }
  };

  // Submit Document upload
  const handleSubmitUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedFile) {
      setError("অনুগ্রহ করে একটি দলিল বা খতিয়ানের ছবি/পিডিএফ নির্বাচন করুন।");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Create Case
      const caseData = await safeFetchJson(`${API_BASE_URL}/cases`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `নথি আপলোড: ${uploadedFile.name}`,
          district,
          upazila,
          mouza,
        }),
      });

      if (!caseData.success || !caseData.data?.id) {
        throw new Error(caseData.message || "কেস তৈরি করা সম্ভব হয়নি");
      }

      const caseId = caseData.data.id;

      // 2. Upload file to backend -> imgBB
      const formData = new FormData();
      formData.append("file", uploadedFile);
      formData.append("landCaseId", caseId);

      const uploadData = await safeFetchJson(`${API_BASE_URL}/documents/upload`, {
        method: "POST",
        body: formData,
      });

      // 3. Add default records for analysis
      await fetch(`${API_BASE_URL}/records`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          landCaseId: caseId,
          surveyType: "BS",
          district,
          upazila,
          mouza,
          khatianNumber: "৩৪৫",
          dagNumber: "৭৮৯",
          landAreaAcre: 0.2,
          ownerNames: ["স্বত্বাধিকারী (নথি হতে সংগৃহীত)"],
          sourceLabel: `আপলোডকৃত নথি: ${uploadedFile.name}`,
        }),
      });

      // 4. Run Analysis
      await fetch(`${API_BASE_URL}/fraud-detection/analyze/${caseId}`, {
        method: "POST",
      });

      router.push(`/cases/${caseId}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "নথি আপলোডে ত্রুটি হয়েছে।");
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F7F8FA] min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 space-y-2 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            {t("নতুন ভূমি নথি যাচাই ও ঝুঁকি বিশ্লেষণ", "New Land Verification & Risk Analysis")}
          </h1>
          <p className="text-sm text-gray-600">
            {t(
              "খতিয়ান বা দলিলের স্ক্যান আপলোড করুন অথবা জরিপ রেকর্ডসমূহ ম্যানুয়ালি এন্ট্রি করে তাৎক্ষণিক বিশ্লেষণ রিপোর্ট দেখুন।",
              "Upload scanned documents or manually enter survey records to generate an instant risk analysis report.",
            )}
          </p>
        </div>

        {/* Tab Selection */}
        <div className="bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm flex gap-1 mb-8">
          <button
            onClick={() => setActiveTab("manual")}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
              activeTab === "manual"
                ? "bg-[#176B55] text-white shadow-sm"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{t("ম্যানুয়াল তথ্য এন্ট্রি (CS, SA, RS, BS)", "Manual Record Entry")}</span>
          </button>

          <button
            onClick={() => setActiveTab("upload")}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
              activeTab === "upload"
                ? "bg-[#176B55] text-white shadow-sm"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>{t("নথি আপলোড (imgBB ক্লাউড)", "Document Upload (imgBB)")}</span>
          </button>

          <button
            onClick={() => setActiveTab("demo")}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
              activeTab === "demo"
                ? "bg-[#176B55] text-white shadow-sm"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{t("এক ক্লিকে নমুনা কেস", "Instant Demo")}</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Tab 1: Manual Form */}
        {activeTab === "manual" && (
          <form onSubmit={handleSubmitManual} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-8">
            {/* General Case Info */}
            <div className="space-y-4">
              <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
                ১. জমির সাধারণ অবস্থান
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">জেলা *</label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#176B55]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">উপজেলা/থানা *</label>
                  <input
                    type="text"
                    required
                    value={upazila}
                    onChange={(e) => setUpazila(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#176B55]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">মৌজা *</label>
                  <input
                    type="text"
                    required
                    value={mouza}
                    onChange={(e) => setMouza(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#176B55]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">জেএল (JL) নং</label>
                  <input
                    type="text"
                    value={jlNumber}
                    onChange={(e) => setJlNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#176B55]"
                  />
                </div>
              </div>
            </div>

            {/* Historical Surveys (CS, SA, RS, BS) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h2 className="text-base font-bold text-gray-900">
                  ২. ঐতিহাসিক জরিপ খতিয়ান রেকর্ড (CS, SA, RS, BS)
                </h2>
                <button
                  type="button"
                  onClick={handleAddRecord}
                  className="text-xs font-semibold text-[#176B55] hover:text-[#125543] flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>জরিপ যোগ করুন</span>
                </button>
              </div>

              <div className="space-y-3">
                {records.map((rec, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-200/80 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">জরিপের ধরন</label>
                      <select
                        value={rec.surveyType}
                        onChange={(e) => handleRecordChange(idx, "surveyType", e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-bold"
                      >
                        <option value="CS">সিএস (CS)</option>
                        <option value="SA">এসএ (SA)</option>
                        <option value="RS">আরএস (RS)</option>
                        <option value="BS">বিএস (BS/সিটি)</option>
                        <option value="NAMZARI">নামজারি</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">খতিয়ান নং</label>
                      <input
                        type="text"
                        value={rec.khatianNumber}
                        onChange={(e) => handleRecordChange(idx, "khatianNumber", e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-gray-300 rounded-lg text-xs"
                        placeholder="১২২"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">দাগ নং</label>
                      <input
                        type="text"
                        value={rec.dagNumber}
                        onChange={(e) => handleRecordChange(idx, "dagNumber", e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-gray-300 rounded-lg text-xs"
                        placeholder="৫৪০"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">জমির পরিমাণ (একর)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={rec.landAreaAcre}
                        onChange={(e) => handleRecordChange(idx, "landAreaAcre", e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold"
                        placeholder="0.30"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">মালিকের নাম</label>
                      <input
                        type="text"
                        value={rec.ownerNames}
                        onChange={(e) => handleRecordChange(idx, "ownerNames", e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-gray-300 rounded-lg text-xs"
                        placeholder="আব্দুর রহমান"
                      />
                    </div>

                    <div className="sm:col-span-1 flex justify-center pt-3 sm:pt-0">
                      {records.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveRecord(idx)}
                          className="text-rose-500 hover:text-rose-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Registered Deeds */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h2 className="text-base font-bold text-gray-900">
                  ৩. রেজিস্ট্রিকৃত বায়া ও বিক্রয় দলিল
                </h2>
                <button
                  type="button"
                  onClick={handleAddDeed}
                  className="text-xs font-semibold text-[#176B55] hover:text-[#125543] flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>দলিল যোগ করুন</span>
                </button>
              </div>

              <div className="space-y-3">
                {deeds.map((d, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-200/80 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">দলিল নং ও সাল</label>
                      <input
                        type="text"
                        value={d.deedNumber}
                        onChange={(e) => handleDeedChange(idx, "deedNumber", e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-medium"
                        placeholder="১২৩৪/২০২১"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">বিক্রেতা (Seller)</label>
                      <input
                        type="text"
                        value={d.sellerNames}
                        onChange={(e) => handleDeedChange(idx, "sellerNames", e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-gray-300 rounded-lg text-xs"
                        placeholder="আব্দুর রহমান"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">ক্রেতা (Buyer)</label>
                      <input
                        type="text"
                        value={d.buyerNames}
                        onChange={(e) => handleDeedChange(idx, "buyerNames", e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-gray-300 rounded-lg text-xs"
                        placeholder="মোঃ কামাল হোসেন"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">বিক্রিত পরিমাণ (একর)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={d.landAreaAcre}
                        onChange={(e) => handleDeedChange(idx, "landAreaAcre", e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold"
                        placeholder="0.30"
                      />
                    </div>

                    <div className="sm:col-span-1 flex justify-center pt-3 sm:pt-0">
                      {deeds.length > 0 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDeed(idx)}
                          className="text-rose-500 hover:text-rose-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#176B55] hover:bg-[#125543] disabled:opacity-50 text-white font-bold px-8 py-3.5 rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>বিশ্লেষণ চলছে...</span>
                  </>
                ) : (
                  <>
                    <span>যাচাই ও বিশ্লেষণ শুরু করুন</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Document Upload via imgBB */}
        {activeTab === "upload" && (
          <form onSubmit={handleSubmitUpload} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <h2 className="text-base font-bold text-gray-900">
                দলিল বা খতিয়ানের স্পষ্ট ছবি/পিডিএফ আপলোড করুন
              </h2>
              <p className="text-xs text-gray-500">
                ছবিটি সরাসরি imgBB ক্লাউডে সুরক্ষিতভাবে আপলোড হবে এবং সিস্টেম স্বত্বাধিকারী তথ্য সংগ্রহ করবে।
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">জেলা</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">উপজেলা</label>
                <input
                  type="text"
                  value={upazila}
                  onChange={(e) => setUpazila(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">মৌজা</label>
                <input
                  type="text"
                  value={mouza}
                  onChange={(e) => setMouza(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
            </div>

            {/* Dropzone */}
            <div className="border-2 border-dashed border-gray-300 hover:border-[#176B55] rounded-2xl p-8 text-center transition-colors bg-gray-50/50">
              <input
                type="file"
                id="file-upload"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="file-upload" className="cursor-pointer block space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#176B55]/10 flex items-center justify-center text-[#176B55]">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-semibold text-[#176B55]">
                    ফাইল ব্রাউজ করুন অথবা টেনে এনে ফেলুন
                  </span>
                  <p className="text-xs text-gray-400">পিএনজি, জেপিজি, পিডিএফ (সর্বোচ্চ ১০ মেগাবাইট)</p>
                </div>
              </label>

              {uploadedFile && (
                <div className="mt-4 p-3 bg-white border border-gray-200 rounded-xl inline-flex items-center gap-3 text-xs font-medium text-gray-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>{uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)</span>
                </div>
              )}

              {uploadPreview && (
                <div className="mt-4 max-w-xs mx-auto border rounded-xl overflow-hidden shadow-sm">
                  <img src={uploadPreview} alt="Preview" className="w-full h-auto object-cover max-h-56" />
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={loading || !uploadedFile}
                className="bg-[#176B55] hover:bg-[#125543] disabled:opacity-50 text-white font-bold px-8 py-3.5 rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>আপলোড ও বিশ্লেষণ চলছে...</span>
                  </>
                ) : (
                  <>
                    <span>ক্লাউডে আপলোড ও বিশ্লেষণ</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Quick Demo Scenarios */}
        {activeTab === "demo" && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-gray-900">
                এক ক্লিকে পূর্বনির্ধারিত বাস্তব নমুনা কেসসমূহ চালু করুন
              </h2>
              <p className="text-xs text-gray-500">
                নিচের যেকোনো নমুনা কেসে ক্লিক করলে তা সরাসরি তুলনামূলক রিপোর্ট ও আরএজি (RAG) এআই ইন্টারফেসে নিয়ে যাবে।
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => router.push("/cases/141fb0da-a2d8-45d8-aedc-1cf4230a167f")}
                className="w-full text-left p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50 transition-colors flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">
                      সিনারিও ১
                    </span>
                    <h3 className="font-bold text-gray-900 text-sm">
                      ধানমন্ডি মৌজা - নিখুঁত জমি ও বৈধ ধারাবাহিকতা
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600">
                    সিএস, এসএ, আরএস ও বিএস-এ ০.২৫ একর জমি অক্ষুণ্ণ। কোনো অসংগতি নেই।
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-emerald-700 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => router.push("/cases/6d911afb-f3e9-4928-8392-b223a61ed42f")}
                className="w-full text-left p-4 rounded-xl border border-rose-200 bg-rose-50/40 hover:bg-rose-50 transition-colors flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-200 text-rose-900">
                      সিনারিও ২
                    </span>
                    <h3 className="font-bold text-gray-900 text-sm">
                      মিরপুর মৌজা - দ্বৈত বিক্রয় ও অতিরিক্ত হিস্যা বিক্রির ঝুঁকি
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600">
                    ০.৩০ একর জমিতে দুটি পৃথক দলিলে মোট ০.৪৫ একর জমি বিক্রির চেষ্টা শনাক্ত।
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-rose-700 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => router.push("/cases/d47b787d-9093-4f88-9aa8-ff67bc7d5525")}
                className="w-full text-left p-4 rounded-xl border border-amber-200 bg-amber-50/40 hover:bg-amber-50 transition-colors flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                      সিনারিও ৩
                    </span>
                    <h3 className="font-bold text-gray-900 text-sm">
                      সাভার মৌজা - জরিপে জমির পরিমাণের অস্বাভাবিক স্ফীতি
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600">
                    সিএস জরিপে ০.৩০ একর থেকে বিএস জরিপে হঠাৎ ০.৫৮ একরে বৃদ্ধির অসংগতি।
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-amber-700 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
