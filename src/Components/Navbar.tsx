"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "../contexts/LanguageContext";
import { Globe, Menu, X, PlusCircle } from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
  const { lang, toggleLang, t } = useLanguage();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t("হোম", "Home") },
    { href: "/analyze", label: t("নতুন যাচাই", "New Verification") },
    { href: "/cases", label: t("কেসসমূহ", "Cases") },
    { href: "/laws", label: t("এআই আইন সহকারী", "Legal AI") },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 flex-shrink-0 transition-transform group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="ভূমিপ্রহরী Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 group-hover:text-[#176B55] transition-colors">
                  ভূমিপ্রহরী
                </span>

              </div>
           
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#176B55] text-white shadow-sm"
                      : "text-gray-700 hover:text-[#176B55] hover:bg-gray-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action & Language Switcher */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#176B55]" />
              <span>{lang === "bn" ? "English" : "বাংলা"}</span>
            </button>

            <Link
              href="/analyze"
              className="bg-[#176B55] hover:bg-[#125543] text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t("জমির তথ্য যাচাই", "Verify Land")}</span>
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleLang}
              className="p-2 text-xs font-semibold border rounded-lg border-gray-300 text-gray-700"
            >
              {lang === "bn" ? "EN" : "বাং"}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-gray-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2.5 rounded-lg text-base font-medium ${
                  isActive
                    ? "bg-[#176B55] text-white"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              href="/analyze"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full bg-[#176B55] text-white flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium shadow-sm"
            >
              <PlusCircle className="w-5 h-5" />
              <span>{t("জমির তথ্য যাচাই করুন", "Verify Land")}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
