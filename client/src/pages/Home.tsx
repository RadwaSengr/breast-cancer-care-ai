import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, CheckCircle2, ChevronDown, HeartHandshake, Languages, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

const content = {
  en: {
    navAbout: "About us",
    navScope: "Scope & safety",
    navSources: "Trusted sources",
    navPipeline: "RAG pipeline",
    navLocal: "Local services",
    language: "العربية",
    eyebrow: "Patient education, with care",
    titleA: "A quieter space for",
    titleB: "your breast cancer questions.",
    intro: "BreastCancerCare AI offers calm, source-grounded educational guidance for people navigating breast cancer care — from questions before booking, through treatment, to follow-up.",
    primary: "Start a conversation",
    secondary: "Understand the boundaries",
    trust: "Educational support · Not medical advice",
    panelTitle: "Designed for the moments between appointments.",
    panelBody: "Bring a question, understand a term, prepare for your next conversation with your care team.",
    featureOne: "Bilingual, patient-first conversation",
    featureTwo: "Official sources shown in every answer",
    featureThree: "Prominent guidance for urgent symptoms",
    scopeEyebrow: "A clear, safer role",
    scopeTitle: "Supportive education—never a substitute for care.",
    scopeBody: "This assistant can help you understand general breast cancer care information and prepare questions. It does not diagnose symptoms, interpret results, prescribe medicines, or choose treatment. Your oncology and surgical teams know your history and remain your source for individualized advice.",
    urgentTitle: "If something feels urgent, do not wait for a chat.",
    urgentBody: "New or worsening severe symptoms, a fever, wound concerns, breathing difficulty, chest pain, or uncontrolled bleeding should be discussed with your care team urgently. For severe symptoms or an emergency, contact local emergency services.",
    sourceEyebrow: "Grounded, not guessed",
    sourceTitle: "Built around trusted patient resources.",
    sourceBody: "The prototype retrieves from a curated set of public education resources. Each response shows the source link in context so you can verify it and bring it to your clinical conversation.",
    sourceList: ["World Health Organization", "National Cancer Institute", "NCCN Guidelines for Patients"],
    finalTitle: "Take the next question with you.",
    finalBody: "Start with the information you need, then discuss what it means for you with your care team.",
    finalCta: "Open the assistant",
    footer: "BreastCancerCare AI is an educational prototype for the AI Hackathon.",
  },
  ar: {
    navAbout: "عن الفريق",
    navScope: "النطاق والسلامة",
    navSources: "المصادر الموثوقة",
    navPipeline: "خط RAG",
    navLocal: "الخدمات المحلية",
    language: "English",
    eyebrow: "تثقيف للمريضة، بعناية",
    titleA: "مساحة أكثر هدوءًا",
    titleB: "لأسئلتك عن سرطان الثدي.",
    intro: "يقدم BreastCancerCare AI دعماً تعليمياً هادئاً وموثقاً بالمصادر لمن يمرّون برحلة سرطان الثدي — من الأسئلة قبل الحجز مرورًا بالعلاج وحتى المتابعة.",
    primary: "ابدئي محادثة",
    secondary: "تعرّفي على الحدود",
    trust: "دعم تعليمي · ليس نصيحة طبية",
    panelTitle: "مصمم للحظات بين المواعيد الطبية.",
    panelBody: "اطرحي سؤالاً، افهمي مصطلحاً، واستعدّي لحوارك القادم مع فريق الرعاية.",
    featureOne: "محادثة ثنائية اللغة تضع المريضة أولاً",
    featureTwo: "مصادر رسمية في كل إجابة",
    featureThree: "إرشاد واضح عند ظهور أعراض عاجلة",
    scopeEyebrow: "دور واضح وأكثر أمانًا",
    scopeTitle: "تثقيف داعم، وليس بديلاً عن الرعاية.",
    scopeBody: "يساعدك هذا المساعد على فهم معلومات عامة عن رعاية سرطان الثدي وتحضير الأسئلة. لا يشخّص الأعراض، ولا يفسّر النتائج، ولا يصف الأدوية، ولا يختار العلاج. فريق الأورام والجراحة يعرف تاريخك الطبي ويظل مصدرك للنصيحة الفردية.",
    urgentTitle: "إذا شعرتِ أن الأمر عاجل، فلا تنتظري الدردشة.",
    urgentBody: "ينبغي مناقشة الأعراض الجديدة أو المتفاقمة بشدة، أو الحمى، أو مشكلات الجرح، أو صعوبة التنفس، أو ألم الصدر، أو النزيف غير المسيطر عليه مع فريق رعايتك بشكل عاجل. وعند وجود أعراض شديدة أو طارئة، اتصلي بخدمات الطوارئ المحلية.",
    sourceEyebrow: "موثق، وليس تخمينًا",
    sourceTitle: "مبني حول موارد موثوقة للمريضات.",
    sourceBody: "يسترجع النموذج الأولي من مجموعة منتقاة من الموارد العامة للتثقيف الصحي. تعرض كل إجابة رابط المصدر في سياقها لتتمكني من التحقق منه وطرحه في حديثك مع الفريق الطبي.",
    sourceList: ["منظمة الصحة العالمية", "المعهد الوطني للسرطان", "إرشادات NCCN للمرضى"],
    finalTitle: "خذي السؤال التالي معكِ.",
    finalBody: "ابدئي بالمعلومة التي تحتاجينها، ثم ناقشي ما تعنيه لحالتك مع فريق رعايتك.",
    finalCta: "افتحي المساعد",
    footer: "BreastCancerCare AI نموذج تعليمي أولي مقدم ضمن هاكاثون الذكاء الاصطناعي.",
  },
} as const;

export default function Home() {
  const [, navigate] = useLocation();
  const [language, setLanguage] = useState<"ar" | "en">(() => new URLSearchParams(window.location.search).get("lang") === "ar" ? "ar" : "en");
  const t = content[language];
  const alternateLanguage = language === "en" ? "ar" : "en";
  const isArabic = language === "ar";

  const goToChat = () => navigate(`/chat?lang=${language}`);
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const changeLanguage = (nextLanguage: "ar" | "en") => {
    setLanguage(nextLanguage);
    window.history.replaceState({}, "", `/?lang=${nextLanguage}`);
  };

  return (
    <div dir={isArabic ? "rtl" : "ltr"} className={cn("brand-pink min-h-screen overflow-x-hidden bg-[#fffafc] text-slate-900", isArabic && "font-arabic")}>
      <div className="medical-grid min-h-screen">
        <header className="container flex items-center justify-between py-6">
          <button onClick={() => navigate(`/?lang=${language}`)} className="flex items-center gap-3 text-start" aria-label="BreastCancerCare AI home">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-teal-700 text-white shadow-[0_8px_20px_-8px_rgba(15,118,110,0.8)]"><HeartHandshake className="size-5" /></span>
            <span>
              <strong className="font-display block text-base tracking-tight">BreastCancerCare</strong>
              <span className="block text-[0.64rem] font-bold uppercase tracking-[0.14em] text-teal-700">AI Assistant</span>
            </span>
          </button>
          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
            <button onClick={() => navigate(`/about?lang=${language}`)} className="transition hover:text-teal-700">{t.navAbout}</button>
            <button onClick={() => scrollTo("scope")} className="transition hover:text-teal-700">{t.navScope}</button>
            <button onClick={() => scrollTo("sources")} className="transition hover:text-teal-700">{t.navSources}</button>
            <button onClick={() => navigate(`/rag?lang=${language}`)} className="transition hover:text-teal-700">{t.navPipeline}</button>
            <button onClick={() => navigate(`/services?lang=${language}`)} className="transition hover:text-teal-700">{t.navLocal}</button>
          </nav>
          <button onClick={() => changeLanguage(alternateLanguage)} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-teal-200 hover:text-teal-800">
            <Languages className="size-4" /> {t.language}
          </button>
        </header>

        <main>
          <section className="container grid items-center gap-12 pb-20 pt-12 lg:grid-cols-[1.06fr_0.94fr] lg:pb-28 lg:pt-20">
            <div className="max-w-2xl">
              <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white px-3.5 py-2 text-xs font-bold uppercase tracking-[0.13em] text-teal-800 shadow-sm"><Sparkles className="size-3.5" />{t.eyebrow}</p>
              <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-slate-950 sm:text-5xl lg:text-[4.25rem]">
                <span className="block">{t.titleA}</span>
                <span className="text-teal-700">{t.titleB}</span>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">{t.intro}</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button onClick={goToChat} size="lg" className="h-12 rounded-xl bg-teal-700 px-6 text-base text-white shadow-[0_14px_28px_-16px_rgba(15,118,110,0.8)] transition hover:bg-teal-800 active:scale-[0.97]">
                  {t.primary}<ArrowRight className={cn("size-4", isArabic && "rotate-180")} />
                </Button>
                <Button onClick={() => scrollTo("scope")} variant="outline" size="lg" className="h-12 rounded-xl border-slate-200 bg-white px-6 text-base text-slate-700 hover:bg-slate-50">
                  {t.secondary}<ChevronDown className="size-4" />
                </Button>
              </div>
              <p className="mt-5 flex items-center gap-2 text-sm font-medium text-slate-500"><ShieldCheck className="size-4 text-teal-700" />{t.trust}</p>
            </div>

            <div className="relative mx-auto w-full max-w-xl">
              <div className="absolute -inset-6 rounded-[3rem] bg-teal-100/65 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white bg-slate-950 p-6 shadow-[0_32px_80px_-36px_rgba(15,47,73,0.75)] sm:p-8">
                <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-teal-500/20 to-transparent" />
                <div className="relative">
                  <div className="mb-12 flex items-center justify-between"><div className="flex gap-1.5"><span className="size-2 rounded-full bg-rose-300" /><span className="size-2 rounded-full bg-amber-200" /><span className="size-2 rounded-full bg-teal-300" /></div><span className="text-xs font-semibold text-slate-400">BreastCancerCare AI / Secure session</span></div>
                  <div className="rounded-2xl rounded-es-md bg-white/10 p-4 text-sm leading-6 text-slate-200">{t.panelTitle}</div>
                  <div className="ms-auto mt-4 max-w-[85%] rounded-2xl rounded-ee-md bg-teal-500 p-4 text-sm leading-6 text-white">{t.panelBody}</div>
                  <div className="mt-8 space-y-3">
                    {[t.featureOne, t.featureTwo, t.featureThree].map(feature => <div key={feature} className="flex items-center gap-3 text-sm text-slate-200"><CheckCircle2 className="size-4 shrink-0 text-teal-300" />{feature}</div>)}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="scope" className="border-y border-teal-100 bg-teal-50/65 py-20 lg:py-24">
            <div className="container grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
              <div><p className="eyebrow">{t.scopeEyebrow}</p><h2 className="font-display mt-4 text-3xl font-semibold leading-tight tracking-[-0.035em] text-slate-950 sm:text-4xl">{t.scopeTitle}</h2></div>
              <div className="space-y-6"><p className="text-lg leading-8 text-slate-600">{t.scopeBody}</p><div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950 shadow-sm"><div className="flex items-start gap-3"><div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-white"><ShieldCheck className="size-5" /></div><div><h3 className="font-display font-bold">{t.urgentTitle}</h3><p className="mt-1.5 text-sm leading-6">{t.urgentBody}</p></div></div></div></div>
            </div>
          </section>

          <section id="sources" className="container grid gap-10 py-20 lg:grid-cols-[1fr_0.9fr] lg:py-28">
            <div className="rounded-[2rem] border border-slate-100 bg-white p-8 shadow-[0_18px_50px_-30px_rgba(15,47,73,0.35)]"><p className="eyebrow">{t.sourceEyebrow}</p><h2 className="font-display mt-4 text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-4xl">{t.sourceTitle}</h2><p className="mt-5 text-base leading-8 text-slate-600">{t.sourceBody}</p></div>
            <div className="flex flex-col justify-center gap-3">{t.sourceList.map((source, index) => <div key={source} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-sm"><span className="font-display flex size-9 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-teal-800">0{index + 1}</span><span className="font-semibold text-slate-700">{source}</span></div>)}</div>
          </section>

          <section className="container pb-20"><div className="overflow-hidden rounded-[2rem] bg-slate-950 px-7 py-12 text-center shadow-xl sm:px-12"><p className="eyebrow !text-teal-300">BreastCancerCare AI</p><h2 className="font-display mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">{t.finalTitle}</h2><p className="mx-auto mt-4 max-w-xl leading-7 text-slate-300">{t.finalBody}</p><Button onClick={goToChat} size="lg" className="mt-8 h-12 rounded-xl bg-teal-400 px-6 text-base font-bold text-slate-950 hover:bg-teal-300">{t.finalCta}<ArrowRight className={cn("size-4", isArabic && "rotate-180")} /></Button></div></section>
        </main>
        <footer className="container border-t border-slate-100 py-7 text-center text-sm text-slate-500">{t.footer}</footer>
      </div>
    </div>
  );
}