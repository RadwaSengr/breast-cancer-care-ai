import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HeartHandshake, Home, MessageSquare, Sparkles } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function NotFound() {
  const [, navigate] = useLocation();
  const [language, setLanguage] = useState<"ar" | "en">(() =>
    typeof window !== "undefined" && new URLSearchParams(window.location.search).get("lang") === "ar" ? "ar" : "en"
  );
  const isArabic = language === "ar";

  const t = {
    en: {
      title: "404",
      subtitle: "Page not found",
      body: "Sorry, the page you are looking for does not exist or may have been moved. You can return home or ask your questions in the assistant.",
      home: "Return to Home",
      chat: "Open AI Assistant",
      brand: "BreastCancerCare AI",
    },
    ar: {
      title: "٤٠٤",
      subtitle: "الصفحة غير موجودة",
      body: "عذرًا، الصفحة التي تبحثين عنها غير موجودة أو قد تم نقلها. يمكنكِ العودة للصفحة الرئيسية أو طرح استفساركِ عبر المساعد الذكي.",
      home: "العودة للرئيسية",
      chat: "فتح المساعد الذكي",
      brand: "BreastCancerCare AI",
    },
  }[language];

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className={cn("brand-pink min-h-screen w-full flex items-center justify-center bg-[#fffafc] px-4", isArabic && "font-arabic")}
    >
      <Card className="w-full max-w-lg shadow-[0_24px_60px_-25px_rgba(190,24,93,0.25)] border border-pink-100 bg-white/95 backdrop-blur-md rounded-3xl">
        <CardContent className="pt-10 pb-10 text-center">
          <div className="flex justify-center mb-6">
            <div className="flex size-16 items-center justify-center rounded-3xl bg-pink-100 text-pink-700 shadow-sm">
              <HeartHandshake className="size-8" />
            </div>
          </div>

          <p className="eyebrow"><Sparkles className="size-3.5 inline-block me-1" />{t.brand}</p>
          <h1 className="font-display text-5xl font-extrabold text-slate-900 mt-2 mb-2">{t.title}</h1>
          <h2 className="font-display text-2xl font-bold text-pink-800 mb-4">{t.subtitle}</h2>

          <p className="text-slate-600 mb-8 leading-relaxed text-sm max-w-sm mx-auto">
            {t.body}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => navigate(`/?lang=${language}`)}
              className="bg-teal-700 hover:bg-teal-800 text-white px-5 py-2.5 rounded-xl transition-all duration-200 shadow-md"
            >
              <Home className="w-4 h-4 me-2" />
              {t.home}
            </Button>
            <Button
              onClick={() => navigate(`/chat?lang=${language}`)}
              variant="outline"
              className="border-pink-200 text-pink-800 hover:bg-pink-50 px-5 py-2.5 rounded-xl transition-all duration-200"
            >
              <MessageSquare className="w-4 h-4 me-2" />
              {t.chat}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
