import { Github, Linkedin, Award, Users, Heart, Sparkles, ArrowLeft, HeartHandshake, Languages } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

import radwaImg from "../assets/Radwa-Sengr.png";
import ranaImg from "../assets/Rana-Amin.png";
import mariamImg from "../assets/Mariam-Deraz.png";
import bassantImg from "../assets/Bassant-Saleh.png";
import gehadImg from "../assets/Gehad-Fahdy.png";
import teamPhotoImg from "../assets/team-photo.jpg";

interface TeamMember {
  name: string;
  role: { ar: string; en: string };
  bio: { ar: string; en: string };
  image: string;
  github: string;
  linkedin: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Radwa Sengr",
    role: { ar: "مطور واجهات المستخدم (Frontend Developer)", en: "Frontend Developer" },
    bio: {
      ar: "تطوير واجهات المستخدم التفاعلية وتحسين تجربة المريض بشكل سلس ومريح وموثوق.",
      en: "Developing interactive user interfaces and optimizing the patient experience to be warm, accessible, and seamless.",
    },
    image: radwaImg,
    github: "https://github.com/RadwaSengr",
    linkedin: "https://www.linkedin.com/in/radwa-s-2b4079306",
  },
  {
    name: "Rana Amin",
    role: { ar: "مهندس ذكاء اصطناعي (AI Engineer)", en: "AI Engineer" },
    bio: {
      ar: "تطوير نماذج الذكاء الاصطناعي، بناء الهندسة المعمارية لنظام RAG وربط النماذج بالواجهات.",
      en: "Developing AI models, architecting the RAG evidence pipeline, and integrating intelligence into client applications.",
    },
    image: ranaImg,
    github: "https://github.com/Rana719",
    linkedin: "https://www.linkedin.com/in/rana-amin-855085282",
  },
  {
    name: "Mariam Deraz",
    role: { ar: "مصممة تجربة المستخدم والذكاء الاصطناعي (AI & UX Designer)", en: "AI & UX Designer" },
    bio: {
      ar: "تصميم تجربة المستخدم وتنسيق الهوية البصرية الحانية وتسهيل وصول المريضات للمعلومة.",
      en: "Designing empathetic user experiences, visual identity, and effortless patient information access.",
    },
    image: mariamImg,
    github: "https://github.com",
    linkedin: "https://www.linkedin.com/in/mariam-draz-b54647374",
  },
  {
    name: "Bassant Saleh",
    role: { ar: "مهندسة أمان وذكاء اصطناعي (AI & Safety Engineer)", en: "AI & Safety Engineer" },
    bio: {
      ar: "إدارة قواعد البيانات وإعداد البنية التحتية البرمجية وضوابط الأمان الطبية وتكامل APIs.",
      en: "Managing database infrastructure, clinical safety guardrails, and secure API integrations.",
    },
    image: bassantImg,
    github: "https://github.com/512005",
    linkedin: "https://www.linkedin.com/in/bassant-saleh-812b75315",
  },
  {
    name: "Gehad Fahdy",
    role: { ar: "أخصائية محتوى طبي وذكاء اصطناعي (AI & Medical Content Specialist)", en: "AI & Medical Content Specialist" },
    bio: {
      ar: "مراجعة وإعداد المحتوى الطبي الموثوق المستند للأدلة العلمية وتجهيز التوجيهات السريرية.",
      en: "Reviewing and curating evidence-based medical content and trusted clinical educational materials.",
    },
    image: gehadImg,
    github: "https://github.com/gehad570",
    linkedin: "https://www.linkedin.com/in/gehad-fahdy-538687319",
  },
];

const copy = {
  en: {
    back: "Back to overview",
    language: "العربية",
    badge: "Top 5 Finalist at AI Hackathon",
    title: "BreastCancerCare AI — ReNova Team",
    subtitle: "A bilingual intelligent assistant grounded in peer-reviewed clinical knowledge, supporting breast cancer patients and survivors from pre-booking through treatment to follow-up care.",
    hackathonLabel: "AI Hackathon 2026",
    hackathonCaption: "Finals day celebrating the top 5 innovative healthcare AI solutions.",
    teamHeading: "Meet the ReNova Team",
  },
  ar: {
    back: "العودة إلى الصفحة التعريفية",
    language: "English",
    badge: "ضمن أفضل 5 مشاريع في هاكاثون الذكاء الاصطناعي",
    title: "BreastCancerCare AI — فريق ReNova",
    subtitle: "مساعد ذكي ثنائي اللغة مبني على مصادر علمية موثوقة لمساندة مريضات سرطان الثدي وتوفير التوعية والإرشاد من مرحلة التشخيص وحتى المتابعة بعد العلاج.",
    hackathonLabel: "هاكاثون الذكاء الاصطناعي 2026",
    hackathonCaption: "يوم التصفيات النهائية بين أفضل 5 مشاريع مبتكرة في قطاع الرعاية الصحية.",
    teamHeading: "فريق عمل ReNova",
  },
} as const;

export default function About() {
  const [, navigate] = useLocation();
  const [language, setLanguage] = useState<"ar" | "en">(() =>
    typeof window !== "undefined" && new URLSearchParams(window.location.search).get("lang") === "ar" ? "ar" : "en"
  );
  const isArabic = language === "ar";
  const t = copy[language];

  const switchLanguage = () => {
    const nextLanguage = language === "en" ? "ar" : "en";
    setLanguage(nextLanguage);
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("lang", nextLanguage);
    window.history.replaceState({}, "", `${window.location.pathname}?${searchParams.toString()}`);
  };

  return (
    <div dir={isArabic ? "rtl" : "ltr"} className={cn("brand-pink min-h-screen bg-[#fffafc] text-slate-900", isArabic && "font-arabic")}>
      {/* Top Header & Navigation */}
      <header className="border-b border-slate-100 bg-white/85 backdrop-blur">
        <div className="container grid grid-cols-[1fr_auto_1fr] items-center py-4">
          <button
            onClick={() => navigate(`/?lang=${language}`)}
            className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-teal-800"
          >
            <ArrowLeft className={cn("size-4 transition group-hover:-translate-x-0.5", isArabic && "rotate-180 group-hover:translate-x-0.5")} />
            {t.back}
          </button>

          <div className="hidden items-center gap-2 sm:flex">
            <span className="flex size-8 items-center justify-center rounded-xl bg-teal-700 text-white shadow-sm">
              <HeartHandshake className="size-4" />
            </span>
            <span>
              <strong className="font-display block text-sm leading-4 tracking-tight">BreastCancerCare</strong>
              <span className="block text-[0.55rem] font-bold uppercase tracking-[0.14em] text-teal-700">ReNova Team</span>
            </span>
          </div>

          <button
            onClick={switchLanguage}
            className="ms-auto inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-teal-200 hover:text-teal-800"
          >
            <Languages className="size-4" />
            {t.language}
          </button>
        </div>
      </header>

      <main className="container max-w-6xl py-12 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 text-pink-700 text-xs sm:text-sm font-semibold mb-6 shadow-sm border border-pink-200">
            <Award className="w-4 h-4 text-pink-600" />
            <span>{t.badge}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-pink-700 via-rose-600 to-teal-800 bg-clip-text text-transparent">
            {t.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Group Photo Section */}
        <div className="max-w-4xl mx-auto mb-16 overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-lg">
          <div className="relative group overflow-hidden">
            <img
              src={teamPhotoImg}
              alt="BreastCancerCare AI Team"
              className="w-full h-64 sm:h-96 object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent flex items-end p-6">
              <div className="text-white">
                <div className="flex items-center gap-2 text-pink-300 text-sm font-semibold mb-1">
                  <Sparkles className="w-4 h-4" /> {t.hackathonLabel}
                </div>
                <p className="text-sm sm:text-base font-medium opacity-90">
                  {t.hackathonCaption}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-10">
            <Users className="w-6 h-6 text-pink-600" />
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">{t.teamHeading}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="group relative rounded-2xl border border-pink-100 bg-white p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:border-pink-300 transition-all duration-300"
              >
                <div className="relative mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full border-2 border-pink-500/40 object-cover shadow-inner group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-0 right-0 p-1 bg-pink-600 text-white rounded-full shadow">
                    <Heart className="w-3.5 h-3.5 fill-current" />
                  </span>
                </div>

                <h3 className="font-display text-lg font-bold text-slate-900 mb-1">{member.name}</h3>
                <p className="text-xs font-semibold text-pink-700 mb-3">
                  {member.role[language]}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed mb-6 flex-grow">
                  {member.bio[language]}
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 w-full justify-center">
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-full border border-slate-200 hover:bg-pink-50 hover:text-pink-700 text-slate-500 transition-colors"
                    title="GitHub Profile"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-full border border-slate-200 hover:bg-pink-50 hover:text-pink-700 text-slate-500 transition-colors"
                    title="LinkedIn Profile"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}