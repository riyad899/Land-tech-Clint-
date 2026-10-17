"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Language = "bn" | "en";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (bn: string, en: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "bn",
  setLang: () => {},
  toggleLang: () => {},
  t: (bn) => bn,
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLangState] = useState<Language>("bn");

  useEffect(() => {
    const saved = localStorage.getItem("bhumiprohori_lang") as Language;
    if (saved && (saved === "bn" || saved === "en")) {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("bhumiprohori_lang", newLang);
  };

  const toggleLang = () => {
    const next = lang === "bn" ? "en" : "bn";
    setLang(next);
  };

  const t = (bn: string, en: string) => (lang === "bn" ? bn : en);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
