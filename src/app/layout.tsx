import type { Metadata } from "next";
import { Hind_Siliguri, Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { LanguageProvider } from "../contexts/LanguageContext";
import { Navbar } from "../Components/Navbar";
import { Footer } from "../Components/Footer";

const hindSiliguri = Hind_Siliguri({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["bengali", "latin"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ভূমিপ্রহরী | AI-চালিত জমির নথি যাচাই ও প্রতারণার ঝুঁকি শনাক্তকরণ",
  description:
    "জমির তথ্য যাচাই, প্রতারণার ঝুঁকি শনাক্ত। সিএস, এসএ, আরএস ও বিএস খতিয়ান তুলনা, দ্বৈত বিক্রয় শনাক্ত এবং এআই-চালিত আইনি ব্যাখ্যা।",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body className={`${hindSiliguri.variable} ${inter.variable} font-sans bg-white text-gray-900 antialiased min-h-screen flex flex-col`}>
        <LanguageProvider>
          <Suspense fallback={<div className="h-16 bg-white border-b border-gray-200" />}>
            <Navbar />
          </Suspense>
          <main className="flex-grow">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
