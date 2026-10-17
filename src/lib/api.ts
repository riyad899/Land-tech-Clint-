import axios from "axios";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const endpoints = {
  cases: "/cases",
  documents: "/documents",
  records: "/records",
  fraudDetection: "/fraud-detection",
  rag: "/rag",
  reports: "/reports",
  auth: "/auth",
};

export async function safeFetchJson<T = any>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<{ success: boolean; data?: T; message?: string }> {
  try {
    const res = await fetch(input, init);
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return {
        success: false,
        message: res.ok
          ? "অপ্রত্যাশিত সার্ভার প্রতিক্রিয়া।"
          : `সার্ভার ত্রুটি (${res.status}): অনুগ্রহ করে ব্যাকএন্ড সংযোগ যাচাই করুন।`,
      };
    }
    const json = await res.json();
    return json;
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি।",
    };
  }
}

