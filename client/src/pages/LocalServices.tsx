import { cn } from "@/lib/utils";
import { bahyaHospitalInfo, bahyaLocalGuide, bahyaSources, type LocalGuideLanguage } from "@/lib/localServices";
import {
  Activity, ArrowLeft, Building2, CalendarCheck, ExternalLink, GraduationCap, HeartHandshake,
  HeartPulse, Languages, Mail, MapPin, Microscope, Phone, ShieldCheck, Sparkles, Stethoscope,
  UsersRound,
} from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

type Copy = {
  back: string; language: string; eyebrow: string; title: string; body: string;
  safetyTitle: string; safetyBody: string; access: string; accessBody: string;
  contact: string; contactBody: string; publishedHours: string; hoursValue: string;
  call: string; email: string; bookingLink: string; officialWebsite: string;
  journey: string; journeyBody: string; journeySteps: Array<{ step: string; detail: string }>;
  eligibility: string; eligibilityBody: string; eligibilityNote: string;
  hospital: string; hospitalBody: string; hospitalMotto: string; pillarSource: string; services: string; serviceBody: string; locations: string;
  locationsBody: string; viewMap: string; verifyTravel: string; sources: string;
  sourceBody: string; verified: string; officialSource: string; urgency: string;
  urgencyBody: string; note: string; careMessage: string;
  serviceCards: Array<{ title: string; body: string; source: keyof typeof bahyaSources }>;
};

const copy: Record<LocalGuideLanguage, Copy> = {
  en: {
    back: "Back to overview", language: "العربية", eyebrow: "Egypt local-services guide", title: "Find a verified path to local support.",
    body: "A practical guide to publicly listed Bahya access, support, rehabilitation, and location information. It is separate from the medical RAG assistant and does not assess symptoms, determine eligibility, or manage appointments.",
    safetyTitle: "Local navigation, not medical triage", safetyBody: "Use this page to find official contact paths. For urgent or severe symptoms, contact your own care team or local emergency services—do not wait for this guide or a chatbot.",
    access: "Start with the official contact path", accessBody: "The published booking article directs people to the Bahya hotline. A customer-service representative can explain the next administrative step and current availability.",
    contact: "Contact and booking", contactBody: "Details below are linked to Bahya’s official pages and were checked on 18 August 2026. Confirm availability, requirements, and current hours directly with Bahya.",
    publishedHours: "Published calling hours", hoursValue: "Sunday–Thursday, 9:00 AM–5:00 PM", call: "Call 16602", email: "Email Bahya", bookingLink: "Read booking guidance",
    journey: "How the published journey begins", journeyBody: "This is a high-level navigation summary from Bahya’s official booking guidance—not a clinical pathway or a promise of service.",
    journeySteps: [
      { step: "Call the official hotline 16602", detail: "Booking and inquiries run through Bahya’s hotline, Sunday–Thursday, 9 AM–5 PM. A customer-service representative answers first and asks questions to understand your situation." },
      { step: "Assessment and referral", detail: "Based on your answers, the representative refers you to early-detection screening or the surgery clinic, depending on your situation and current availability at Bahya hospitals." },
      { step: "Visit the branch with your national ID", detail: "Bring your personal identification to confirm the appointment at the branch you were directed to. Confirm the destination with Bahya before traveling." },
      { step: "A supported treatment journey", detail: "Bahya provides free, comprehensive care along a journey that can extend up to 10 years: surgery, chemotherapy, radiotherapy, hormone therapy, physiotherapy rehabilitation, and psychosocial support." },
    ],
    eligibility: "Published eligibility for early detection", eligibilityBody: "Bahya’s official booking guidance publishes these age categories. They are a navigation summary—not a determination of your eligibility. Confirm your eligibility directly with the hotline.",
    eligibilityNote: "Eligibility rules can change; always confirm directly with Bahya.",
    hospital: "About Baheya — the institution itself", hospitalBody: "A short, non-clinical profile of the Baheya institution so you know who you are heading to. This is general institutional information published by Baheya—not a description of what your own care will look like.",     hospitalMotto: "About Baheya",
    pillarSource: "Read more",
    services: "Support mentioned on official pages", serviceBody: "Availability, suitability, and service details must be confirmed with Bahya. These descriptions do not replace an assessment or a clinician’s guidance.",
    locations: "Published service locations", locationsBody: "Use the official map link and confirm the destination with Bahya before traveling.", viewMap: "Open official map", verifyTravel: "Verify before travel",
    sources: "Source control and updates", sourceBody: "Every card links to a Bahya official page. The guide intentionally avoids copying rules that can change, including eligibility, capacity, and appointment availability.",
    verified: "Last verified", officialSource: "Official Bahya source", urgency: "If you feel unwell now", urgencyBody: "Do not use this directory to decide what to do about symptoms. Contact your clinical team or local emergency services for urgent or severe concerns.",
    careMessage: "\"You are not alone.\" — Bahya accompanies every Egyptian woman facing breast cancer.\n\"Bahya stands behind every Egyptian woman.\"",
    officialWebsite: "Visit bahya.org",
    note: "BreastCancerCare AI is an independent educational prototype. This directory provides source-linked navigation only and does not claim affiliation with Bahya.",
    serviceCards: [
      { title: "Psychosocial support", body: "Bahya’s support page describes individual and group counselling, family support, and supportive activities. Ask Bahya what is currently available for you or your family.", source: "support" },
      { title: "Physiotherapy and rehabilitation", body: "The physiotherapy department describes assessment-led rehabilitation, education/support programs, and remote physiotherapy. A Bahya clinician determines what is appropriate and available.", source: "rehabilitation" },
      { title: "Patient support during the journey", body: "The official support material describes practical and emotional support elements alongside care. Contact Bahya to ask about the current pathway and access details.", source: "support" },
    ],
  },
  ar: {
    back: "العودة إلى الصفحة التعريفية", language: "English", eyebrow: "دليل الخدمات المحلي في مصر", title: "اعثري على مسار موثق للدعم المحلي.",
    body: "دليل عملي لمعلومات الوصول والدعم والتأهيل والمواقع المنشورة علنًا من بهية. هذا الدليل منفصل عن مساعد RAG الطبي؛ لا يقيّم الأعراض ولا يحدد الأهلية ولا يدير المواعيد.",
    safetyTitle: "دليل وصول محلي، وليس فرزًا طبيًا", safetyBody: "استخدمي هذه الصفحة للوصول إلى مسارات التواصل الرسمية. عند وجود أعراض عاجلة أو شديدة، تواصلي مع فريق رعايتك أو الطوارئ المحلية؛ لا تنتظري الدليل أو المحادثة.",
    access: "ابدئي بمسار التواصل الرسمي", accessBody: "توجّه مقالة الحجز المنشورة إلى الخط الساخن لبهية. يمكن لممثل خدمة العملاء توضيح الخطوة الإدارية التالية والتوافر الحالي.",
    contact: "التواصل والحجز", contactBody: "البيانات أدناه مرتبطة بصفحات بهية الرسمية وتم التحقق منها في 18 أغسطس 2026. أكّدي التوافر والمتطلبات وساعات العمل الحالية مباشرة مع بهية.",
    publishedHours: "ساعات الاتصال المنشورة", hoursValue: "الأحد–الخميس، 9:00 صباحًا–5:00 مساءً", call: "اتصلي بـ 16602", email: "راسلي بهية", bookingLink: "اقرئي إرشادات الحجز",
    journey: "كيف تبدأ الرحلة المنشورة", journeyBody: "هذا ملخص إرشادي عالي المستوى من خطوات الحجز الرسمية، وليس مسارًا طبيًا أو وعدًا بتقديم خدمة.",
    journeySteps: [
      { step: "اتصلي بالخط الساخن الرسمي 16602", detail: "الحجز والاستفسارات تتم عبر الخط الساخن لبهية من الأحد إلى الخميس، 9 صباحًا إلى 5 مساءً. يرد عليكِ ممثل خدمة العملاء ويطرح أسئلة لفهم حالتك أولاً." },
      { step: "التقييم والتحويل", detail: "بناءً على إجاباتك، يوجّهكِ الممثل إلى الكشف المبكر أو عيادة الجراحة حسب حالتك والتوافر الحالي في مستشفيات بهية." },
      { step: "الذهاب للفرع بالبطاقة الشخصية", detail: "اصطحبي بطاقتك الشخصية لتأكيد الموعد في الفرع الذي تم توجيهك إليه، وأكدي الوجهة مع بهية قبل التوجه." },
      { step: "رحلة علاج مساندة ومتكاملة", detail: "تقدّم بهية رعاية مجانية وشاملة في رحلة قد تمتد إلى 10 سنوات: الجراحة، العلاج الكيميائي والإشعاعي والهرموني، العلاج الطبيعي لإعادة التأهيل، والدعم النفسي والاجتماعي." },
    ],
    eligibility: "شروط الأهلية المنشورة للكشف المبكر", eligibilityBody: "تنشر إرشادات الحجز الرسمية في بهية فئات السن التالية. هي ملخص إرشادي وليس تحديدًا لأهليتك — أكدي أهليتك مباشرة مع الخط الساخن.",
    eligibilityNote: "قواعد الأهلية قابلة للتغيير؛ تأكدي دائمًا مباشرة من بهية.",
    hospital: "عن مؤسسة بهية — المؤسسة نفسها", hospitalBody: "نبذة عامة غير طبية عن مؤسسة بهية لتعرفي إلى أين تتوجهين. هذه معلومات عامة منشورة عن المؤسسة — وليست وصفًا لما ستكون عليه رعايتك أنتِ.", hospitalMotto: "شعار بهية",
    pillarSource: "اقرئي المزيد",
    services: "دعم مذكور في الصفحات الرسمية", serviceBody: "يجب تأكيد التوافر والملاءمة وتفاصيل الخدمة مع بهية. هذه الأوصاف لا تحل محل التقييم أو إرشاد المختصين.",
    locations: "مواقع الخدمة المنشورة", locationsBody: "استخدمي رابط الخريطة الرسمي وأكدي الوجهة مع بهية قبل التوجه إليها.", viewMap: "افتحي الخريطة الرسمية", verifyTravel: "أكدي قبل التوجه",
    sources: "ضبط المصادر والتحديث", sourceBody: "كل بطاقة مرتبطة بصفحة رسمية من بهية. يتجنب الدليل عمدًا نسخ قواعد يمكن أن تتغير، مثل الأهلية والسعة وتوافر المواعيد.",
    verified: "آخر تحقق", officialSource: "مصدر بهية الرسمي", urgency: "إذا كنتِ لا تشعرين بأنك بخير الآن", urgencyBody: "لا تستخدمي هذا الدليل لاتخاذ قرار بشأن الأعراض. تواصلي مع فريقك العلاجي أو الطوارئ المحلية عند القلق العاجل أو الشديد.",
    careMessage: "\"إنتِ مش لوحدك.\" — بهية تساند كل ست مصرية تواجه سرطان الثدي.\n\"بهية في ظهر كل ست مصرية.\"",
    officialWebsite: "زوري الموقع الرسمي baheya.org",
    note: "BreastCancerCare AI نموذج تعليمي مستقل. يوفر هذا الدليل تنقلاً مرتبطًا بالمصادر فقط ولا يدّعي أي تبعية لبهية.",
    serviceCards: [
      { title: "الدعم النفسي والاجتماعي", body: "تذكر صفحة الدعم في بهية جلسات فردية وجماعية ودعمًا للأسرة وأنشطة مساندة. اسألي بهية عمّا هو متاح حاليًا لك أو لأسرتك.", source: "support" },
      { title: "العلاج الطبيعي وإعادة التأهيل", body: "يصف قسم العلاج الطبيعي تأهيلاً قائمًا على التقييم، وبرامج تثقيف ودعم، وعلاجًا طبيعيًا عن بُعد. يحدد مختصو بهية ما هو مناسب ومتاح.", source: "rehabilitation" },
      { title: "دعم المريضة خلال الرحلة", body: "تصف مواد الدعم الرسمية جوانب مساندة عملية ونفسية بجانب الرعاية. تواصلي مع بهية لسؤالهم عن المسار الحالي وتفاصيل الوصول.", source: "support" },
    ],
  },
};

export default function LocalServices() {
  const [, navigate] = useLocation();
  const [language, setLanguage] = useState<LocalGuideLanguage>(() => new URLSearchParams(window.location.search).get("lang") === "ar" ? "ar" : "en");
  const t = copy[language];
  const isArabic = language === "ar";

  const changeLanguage = () => {
    const next = language === "en" ? "ar" : "en";
    setLanguage(next);
    window.history.replaceState({}, "", `/services?lang=${next}`);
  };

  return (
    <div dir={isArabic ? "rtl" : "ltr"} className={cn("brand-pink min-h-screen bg-[#fff8fb] text-slate-900", isArabic && "font-arabic")}>
      <header className="border-b border-slate-100 bg-white/85 backdrop-blur"><div className="container grid grid-cols-[1fr_auto_1fr] items-center py-4"><button onClick={() => navigate(`/?lang=${language}`)} className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-teal-800"><ArrowLeft className={cn("size-4 transition group-hover:-translate-x-0.5", isArabic && "rotate-180 group-hover:translate-x-0.5")} />{t.back}</button><div className="hidden items-center gap-2 sm:flex"><span className="flex size-8 items-center justify-center rounded-xl bg-teal-700 text-white shadow-sm"><CompassIcon /></span><span><strong className="font-display block text-sm leading-4 tracking-tight">BreastCancerCare</strong><span className="block text-[0.55rem] font-bold uppercase tracking-[0.14em] text-teal-700">Local services guide</span></span></div><button onClick={changeLanguage} className="ms-auto inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-teal-200 hover:text-teal-800"><Languages className="size-4" />{t.language}</button></div></header>
      <main className="container max-w-6xl py-8 sm:py-12">
        <section className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white px-6 py-9 shadow-[0_20px_50px_-30px_rgba(15,47,73,0.3)] sm:px-10 sm:py-12"><p className="eyebrow"><Sparkles className="size-3.5" />{t.eyebrow}</p><h1 className="font-display mt-4 max-w-4xl text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">{t.title}</h1><p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">{t.body}</p><div className="mt-8 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-950"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-amber-700" /><div><h2 className="font-display font-bold">{t.safetyTitle}</h2><p className="mt-1 text-sm leading-6">{t.safetyBody}</p></div></div></section>

        <section className="mt-8 overflow-hidden rounded-[2rem] border border-pink-100 bg-gradient-to-br from-pink-50 via-white to-rose-50/60 px-6 py-9 shadow-sm sm:px-10 sm:py-11"><p className="eyebrow"><Building2 className="size-3.5" />{t.hospital}</p><h2 className="font-display mt-4 max-w-4xl text-2xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-4xl">{bahyaHospitalInfo.name[language]}<span className="ms-3 inline-flex align-middle rounded-full border border-pink-200 bg-pink-50 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.1em] text-pink-800">{bahyaHospitalInfo.type[language]}</span></h2><p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">{bahyaHospitalInfo.description[language]}</p><div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">{bahyaHospitalInfo.highlights[language].map(stat => <div key={stat.value} className="rounded-2xl border border-pink-100 bg-white/80 px-4 py-4 text-center"><p className="font-display text-xl font-bold text-pink-800">{stat.value}</p><p className="mt-1 text-xs font-semibold text-slate-500">{stat.label}</p></div>)}</div><div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{bahyaHospitalInfo.pillars[language].map(pillar => { const Icon = ({ Microscope, HeartPulse, Activity, GraduationCap } as const)[pillar.icon]; return <article key={pillar.title} className="rounded-[1.5rem] border border-pink-100/80 bg-white p-5 shadow-sm"><Icon className="size-5 text-pink-700" /><h3 className="font-display mt-3 text-base font-bold text-slate-900">{pillar.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{pillar.detail}</p><SourceLink href={bahyaSources[pillar.source]} label={t.pillarSource} /></article>; })}</div><p className="mt-7 text-center text-sm font-semibold text-pink-900 italic">{bahyaHospitalInfo.motto[language]}</p></section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.12fr_0.88fr]"><article className="rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-sm sm:p-8"><p className="eyebrow"><CalendarCheck className="size-3.5" />{t.access}</p><h2 className="font-display mt-3 text-2xl font-semibold tracking-tight text-slate-950">{t.contact}</h2><p className="mt-3 leading-7 text-slate-600">{t.contactBody}</p><div className="mt-6 grid gap-3 sm:grid-cols-2"><a href={`tel:${bahyaLocalGuide.hotline}`} className="rounded-2xl border border-teal-100 bg-teal-50 p-4 transition hover:-translate-y-0.5 hover:border-teal-200"><Phone className="size-5 text-teal-800" /><p className="mt-3 font-display text-xl font-bold text-slate-900">{bahyaLocalGuide.hotline}</p><p className="mt-1 text-sm font-semibold text-teal-800">{t.call}</p></a><a href={`mailto:${bahyaLocalGuide.email}`} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-teal-200"><Mail className="size-5 text-teal-800" /><p className="mt-3 break-all font-semibold text-slate-900">{bahyaLocalGuide.email}</p><p className="mt-1 text-sm font-semibold text-teal-800">{t.email}</p></a></div><div className="mt-5 flex flex-wrap items-center gap-3 text-sm"><span className="rounded-full bg-amber-50 px-3 py-1.5 font-semibold text-amber-900">{t.publishedHours}: {t.hoursValue}</span><SourceLink href={bahyaSources.booking} label={t.bookingLink} /></div></article>
          <article className="rounded-[1.5rem] border border-pink-100 bg-pink-50/60 p-6 shadow-sm sm:p-8"><p className="eyebrow"><HeartHandshake className="size-3.5" />{t.journey}</p><p className="mt-4 leading-7 text-slate-700">{t.journeyBody}</p><ol className="mt-6 space-y-4">{t.journeySteps.map((item, index) => <li key={item.step} className="flex gap-3"><span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-pink-700 text-xs font-bold text-white">{index + 1}</span><div><p className="text-sm font-bold text-slate-900">{item.step}</p><p className="pt-0.5 text-sm leading-6 text-slate-600">{item.detail}</p></div></li>)}</ol><p className="mt-6 rounded-2xl bg-white p-4 text-center text-sm font-semibold text-pink-900 italic">{t.careMessage}</p></article></section>

        <section className="mt-10"><p className="eyebrow"><ShieldCheck className="size-3.5" />{t.eligibility}</p><p className="mt-3 max-w-3xl leading-7 text-slate-600">{t.eligibilityBody}</p><div className="mt-5 grid gap-4 md:grid-cols-3">{bahyaLocalGuide.screeningConditions[language].map(condition => <article key={condition.age} className="rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-sm"><p className="font-display text-3xl font-bold text-pink-800">{condition.age}</p><p className="mt-2 text-sm font-bold text-slate-800">{condition.history}</p><p className="mt-1.5 text-sm leading-6 text-slate-600">{condition.note}</p></article>)}</div><p className="mt-4 text-xs font-medium text-slate-500">{t.eligibilityNote}</p><SourceLink href={bahyaSources.booking} label={t.bookingLink} /></section>

        <section className="mt-10"><p className="eyebrow"><UsersRound className="size-3.5" />{t.services}</p><p className="mt-3 max-w-3xl leading-7 text-slate-600">{t.serviceBody}</p><div className="mt-5 grid gap-4 md:grid-cols-3">{t.serviceCards.map((service, index) => { const Icon = [UsersRound, Stethoscope, HeartHandshake][index]; return <article key={service.title} className="rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-sm"><Icon className="size-6 text-teal-700" /><h2 className="font-display mt-4 text-xl font-bold text-slate-900">{service.title}</h2><p className="mt-3 text-sm leading-7 text-slate-600">{service.body}</p><SourceLink href={bahyaSources[service.source]} label={t.officialSource} /></article>; })}</div></section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.12fr_0.88fr]"><article className="rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-sm sm:p-8"><p className="eyebrow"><MapPin className="size-3.5" />{t.locations}</p><p className="mt-3 leading-7 text-slate-600">{t.locationsBody}</p><div className="mt-6 grid gap-3 sm:grid-cols-2">{bahyaLocalGuide.locations.map(location => <a key={location.id} href={location.mapUrl} target="_blank" rel="noreferrer" className="rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-teal-200 hover:bg-teal-50/40"><Building2 className="size-5 text-teal-800" /><h2 className="mt-3 font-display text-lg font-bold text-slate-900">{location[language].title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{location[language].address}</p><span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-teal-800">{t.viewMap}<ExternalLink className="size-3.5" /></span></a>)}</div><p className="mt-5 text-xs font-medium text-slate-500">{t.verifyTravel}</p></article>
          <article className="rounded-[1.5rem] bg-slate-950 p-6 text-white shadow-xl sm:p-8"><p className="eyebrow !text-teal-300">{t.sources}</p><p className="mt-4 text-sm leading-7 text-slate-300">{t.sourceBody}</p><p className="mt-6 text-sm font-semibold text-teal-200">{t.verified}: 18 Aug 2026</p><div className="mt-5 flex flex-wrap gap-2"><a href={bahyaSources.contact} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-teal-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-teal-300"><ExternalLink className="size-4" />{t.officialSource}</a><a href={bahyaSources.home} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-teal-300 px-4 py-2.5 text-sm font-bold text-teal-200 transition hover:bg-teal-300/10"><ExternalLink className="size-4" />{t.officialWebsite}</a></div></article></section>

        <section className="mt-8 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-950"><h2 className="font-display font-bold">{t.urgency}</h2><p className="mt-1.5 text-sm leading-6">{t.urgencyBody}</p></section><p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-6 text-slate-500">{t.note}</p>
      </main>
    </div>
  );
}

function SourceLink({ href, label }: { href: string; label: string }) {
  return <a href={href} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-teal-800 hover:text-teal-950"><ExternalLink className="size-3.5" />{label}</a>;
}

function CompassIcon() {
  return <MapPin className="size-4" aria-hidden="true" />;
}
