import { Button } from "@/components/ui/button";
import { Check, ClipboardList, Copy, MessageSquare, Printer, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export type TreatmentPhase = "diagnosis" | "surgery" | "chemo_radiation" | "hormone" | "survivorship";

interface DoctorVisitPrepModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAskAi?: (question: string) => void;
  language: "ar" | "en";
}

const PHASES_DATA = {
  ar: {
    title: "مُجهّز أسئلة موعد الطبيب",
    subtitle: "اختاري مرحلتكِ الحالية وحددي الأسئلة التي تودين طرحها على طبيبكِ في الزيارة القادمة.",
    phases: [
      { id: "diagnosis", name: "قبل العلاج والتشخيص" },
      { id: "surgery", name: "قبل وبعد الجراحة" },
      { id: "chemo_radiation", name: "الكيماوي والإشعاعي" },
      { id: "hormone", name: "العلاج الهرموني" },
      { id: "survivorship", name: "المتابعة والتعافي" },
    ],
    questions: {
      diagnosis: [
        "ما نوع سرطان الثدي ومرحلته الدقيقة، وهل تم فحص المستقبلات الهرمونية (ER/PR/HER2)؟",
        "ما هي خطة العلاج المقترحة والجدول الزمني المتوقع لبدئها؟",
        "هل أحتاج إلى فحوصات أو تحاليل إضافية قبل بدء العلاج؟",
        "من سيكون جهة اتصالي في الفريق الطبي عند حدوث أي طارئ؟",
      ],
      surgery: [
        "ما هو نوع الجراحة الأنسب لحالتي (استئصال جزئي أم كلي)، وما الأسباب؟",
        "هل سأحتاج إلى إزالة الغدد الليمفاوية الحارسة وتحليلها؟",
        "ما هي الخيارات المتاحة لإعادة بناء الثدي ومتى يمكن إجراؤها؟",
        "ما هي الاحتياطات لتجنب تورم الذراع (الوذمة اللمفية Lymphedema) بعد الجراحة؟",
        "متى يجب أن أتواصل فوراً مع قسم الجراحة في حال حدوث حمى أو نزيف أو إفرازات من الجرح؟",
      ],
      chemo_radiation: [
        "ما هي الآثار الجانبية الأكثر شيوعاً لهذا البروتوكول وكيف أتعامل معها؟",
        "ما هي درجة الحرارة التي تعتبر خطراً وتتطلب التوجه للطوارئ فوراً عند نقص المناعة؟",
        "هل هناك أدوية للغثيان أو الألم يجب أن تكون متوفرة في المنزل قبل الجلسة؟",
        "كيف تؤثر هذه الجلسات على الخصوبة وما خيارات الحفاظ عليها قبل البدء؟",
        "ما النصائح التغذوية المناسبة لتقوية الجسم أثناء فترة الجلسات؟",
      ],
      hormone: [
        "ما هي مدة العلاج الهرموني المقررة لحالتي (5 سنوات أم 10 سنوات)؟",
        "ما هي الآثار الجانبية المتوقعة مثل الهبات الساخنة أو آلام المفاصل وكيف أخفف منها؟",
        "هل أحتاج إلى فحص دوري لكثافة العظام أثناء تناول هذا الدواء؟",
        "ماذا أفعل في حال نسيت تناول الجرعة اليومية في موعدها؟",
      ],
      survivorship: [
        "ما هو جدول الفحوصات الدورية والماموجرام المطلوب خلال أول 5 سنوات بعد التعافي؟",
        "ما هي الأعراض أو العلامات غير المعتادة التي تستوجب مراجعتكم فوراً؟",
        "ما التمارين الرياضية أو برامج العلاج الطبيعي الآمنة لتحسين حركة الذراع والكتف؟",
        "هل هناك مجموعات دعم أو رعاية نفسية متاحة للمحاربات والناجيات؟",
      ],
    },
    copyBtn: "نسخ الأسئلة المحددة",
    copied: "تم النسخ بنجاح!",
    printBtn: "طباعة القائمة",
    askAiBtn: "اسألي المساعد عنها",
    selectAll: "تحديد الكل",
    clearAll: "إلغاء التحديد",
    noSelection: "يرجى تحديد سؤال واحد على الأقل للنسخ أو الطباعة.",
  },
  en: {
    title: "Doctor Visit Question Checklist",
    subtitle: "Select your current treatment phase and choose the questions you want to discuss with your oncology team.",
    phases: [
      { id: "diagnosis", name: "Diagnosis & Plan" },
      { id: "surgery", name: "Surgery & Recovery" },
      { id: "chemo_radiation", name: "Chemo & Radiation" },
      { id: "hormone", name: "Hormone Therapy" },
      { id: "survivorship", name: "Follow-up & Survivorship" },
    ],
    questions: {
      diagnosis: [
        "What specific type and stage of breast cancer is this, and what are the hormone receptor results (ER/PR/HER2)?",
        "What is the recommended treatment plan and sequence (surgery first vs. chemo first)?",
        "Are any additional scans, genetic tests, or second opinions recommended before we start?",
        "Who should I contact after hours or on weekends if urgent symptoms develop?",
      ],
      surgery: [
        "What surgical option is best for my situation (lumpectomy vs. mastectomy), and why?",
        "Will you evaluate the sentinel lymph nodes during the procedure?",
        "What are my reconstruction options, and can it be done immediately or delayed?",
        "What steps should I take to minimize the risk of arm lymphedema after surgery?",
        "What wound or fever signs should prompt immediate contact with the surgical team?",
      ],
      chemo_radiation: [
        "What are the most common expected side effects and how will we prevent or manage them?",
        "What fever threshold (e.g., 38°C/100.4°F) requires emergency evaluation for neutropenia?",
        "What anti-nausea medications will be prescribed to keep at home?",
        "How will this treatment affect fertility, and what preservation options exist before starting?",
        "Are there specific dietary or activity recommendations during my treatment cycle?",
      ],
      hormone: [
        "How many years of endocrine therapy are recommended for my recurrence risk (5 or 10 years)?",
        "What side effects like hot flashes or bone/joint aches might occur and how can they be managed?",
        "Do I need regular bone density (DEXA) scans while on this medication?",
        "What should I do if I accidentally miss a daily dose?",
      ],
      survivorship: [
        "What is my personalized follow-up schedule and mammogram frequency for the next 5 years?",
        "Which new or persistent symptoms should I report to the oncology team right away?",
        "What physical therapy exercises are recommended to restore full shoulder/arm mobility?",
        "What local psychosocial support resources are available for survivorship support?",
      ],
    },
    copyBtn: "Copy Selected Questions",
    copied: "Copied successfully!",
    printBtn: "Print Checklist",
    askAiBtn: "Ask in Chat",
    selectAll: "Select all",
    clearAll: "Clear selection",
    noSelection: "Please select at least one question to copy or print.",
  },
} as const;

export function DoctorVisitPrepModal({
  isOpen,
  onClose,
  onAskAi,
  language = "ar",
}: DoctorVisitPrepModalProps) {
  const isArabic = language === "ar";
  const t = PHASES_DATA[language];

  const [activePhase, setActivePhase] = useState<TreatmentPhase>("diagnosis");
  const [selectedQuestions, setSelectedQuestions] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentQuestions = t.questions[activePhase] || [];

  const toggleQuestion = (question: string) => {
    setSelectedQuestions(prev => ({
      ...prev,
      [question]: !prev[question],
    }));
  };

  const selectAll = () => {
    const next: Record<string, boolean> = { ...selectedQuestions };
    currentQuestions.forEach(q => {
      next[q] = true;
    });
    setSelectedQuestions(next);
  };

  const clearSelection = () => {
    const next: Record<string, boolean> = { ...selectedQuestions };
    currentQuestions.forEach(q => {
      next[q] = false;
    });
    setSelectedQuestions(next);
  };

  const getSelectedList = () => {
    return Object.entries(selectedQuestions)
      .filter(([, checked]) => checked)
      .map(([q]) => q);
  };

  const handleCopy = () => {
    const list = getSelectedList();
    if (list.length === 0) {
      alert(t.noSelection);
      return;
    }
    const formatted = list.map((q, i) => `${i + 1}. ${q}`).join("\n\n");
    navigator.clipboard.writeText(formatted).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        dir={isArabic ? "rtl" : "ltr"}
        className={cn(
          "relative w-full max-w-3xl rounded-3xl border border-pink-100 bg-white p-6 shadow-2xl max-h-[90vh] flex flex-col",
          isArabic && "font-arabic"
        )}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-pink-100 text-pink-700">
              <ClipboardList className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-800">
                <Sparkles className="size-3.5 text-pink-600" />
                <span>{t.title}</span>
              </div>
              <h2 className="font-display text-xl font-bold text-slate-900 sm:text-2xl mt-0.5">
                {t.title}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Phase selector tabs */}
        <div className="mt-4 flex flex-wrap gap-2 border-b border-slate-100 pb-3">
          {t.phases.map(phase => (
            <button
              key={phase.id}
              type="button"
              onClick={() => setActivePhase(phase.id as TreatmentPhase)}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-semibold transition",
                activePhase === phase.id
                  ? "bg-teal-700 text-white shadow-sm"
                  : "bg-slate-50 text-slate-600 hover:bg-teal-50 hover:text-teal-800"
              )}
            >
              {phase.name}
            </button>
          ))}
        </div>

        {/* Question checklist */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          <div className="flex justify-between items-center px-1 text-xs text-slate-500">
            <span>{t.subtitle}</span>
            <div className="flex gap-3">
              <button type="button" onClick={selectAll} className="text-teal-700 hover:underline font-medium">
                {t.selectAll}
              </button>
              <span>·</span>
              <button type="button" onClick={clearSelection} className="text-slate-500 hover:underline">
                {t.clearAll}
              </button>
            </div>
          </div>

          <div className="space-y-2.5 mt-2">
            {currentQuestions.map((question, idx) => {
              const isChecked = !!selectedQuestions[question];
              return (
                <div
                  key={idx}
                  onClick={() => toggleQuestion(question)}
                  className={cn(
                    "flex items-start gap-3 rounded-2xl border p-4 cursor-pointer transition",
                    isChecked
                      ? "border-teal-300 bg-teal-50/50 shadow-xs"
                      : "border-slate-200 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-300"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="mt-1 size-4 rounded accent-teal-700 shrink-0"
                  />
                  <span className="flex-1 text-sm font-medium text-slate-800 leading-6">
                    {question}
                  </span>
                  {onAskAi && (
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        onAskAi(question);
                        onClose();
                      }}
                      className="shrink-0 inline-flex items-center gap-1 rounded-lg border border-teal-200 bg-white px-2 py-1 text-[0.7rem] font-bold text-teal-800 hover:bg-teal-100 transition"
                      title={t.askAiBtn}
                    >
                      <MessageSquare className="size-3" />
                      <span className="hidden sm:inline">{t.askAiBtn}</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <span className="text-xs text-slate-500 font-medium">
            {getSelectedList().length} {isArabic ? "سؤال محدد" : "questions selected"}
          </span>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              onClick={handlePrint}
              variant="outline"
              className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
            >
              <Printer className="size-3.5 me-1.5" />
              {t.printBtn}
            </Button>
            <Button
              type="button"
              onClick={handleCopy}
              className="rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-sm"
            >
              {copied ? <Check className="size-3.5 me-1.5" /> : <Copy className="size-3.5 me-1.5" />}
              {copied ? t.copied : t.copyBtn}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
