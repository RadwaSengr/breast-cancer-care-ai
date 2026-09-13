export type BahyaKnowledgeSource = {
  title: string;
  organization: string;
  sourceUrl: string;
  content: string;
};

export const BAHYA_KNOWLEDGE_SOURCES: BahyaKnowledgeSource[] = [
  {
    title: "مؤسسة بهية: حجز الكشف والخدمات المحلية",
    organization: "مؤسسة بهية",
    sourceUrl: "https://baheya.org/ar/media_article/320",
    content: "مؤسسة بهية — مصدر رسمي للحجز والخدمات المحلية في مصر. للحجز أو الاستفسار اتصلي بالخط الساخن 16602 من الأحد إلى الخميس، من 9 صباحًا إلى 5 مساءً. يسأل ممثل خدمة العملاء أسئلة لتحديد الحالة ثم يوجه المتصلة إلى الكشف المبكر أو عيادة الجراحة حسب الحالة وتوافر الخدمة. تذكر صفحة بهية أن حجز الكشف المبكر يكون لمن هن 35 سنة فأكثر مع تاريخ وراثي أو 40 سنة فأكثر دون تاريخ وراثي عند عدم وجود أعراض، وأن عيادة الجراحة مخصصة عند وجود أعراض لمن هن 25 سنة فأكثر. أكدي الأهلية والتوافر والمواعيد مباشرة عبر 16602. Bahya Foundation official local-services source: booking, screening, surgery-clinic referral, Egypt hotline 16602.",
  },
  {
    title: "مؤسسة بهية: الدعم النفسي والخدمات الداعمة",
    organization: "مؤسسة بهية",
    sourceUrl: "https://baheya.org/ar/baheya_services/4",
    content: "مؤسسة بهية — مصدر رسمي للدعم النفسي والخدمات الداعمة. تذكر بهية أنها تقدم جلسات استشارة فردية وجماعية منتظمة لدعم المريضات وأسرهن، إلى جانب فعاليات ترفيهية وزيارات منزلية لدعم المريضات عند غياب مقدمي الرعاية. هذه خدمات دعم محلية مساندة وليست بديلًا عن تقييم فريق الرعاية. لتأكيد الخدمة أو التوافر اتصلي على 16602. Bahya Foundation official psychosocial-support source: individual and group counselling, family support, activities, home visits, local services in Egypt.",
  },
];

const localServicePattern = /بهية|bahya|16602|حجز|احجز|موعد|فرع|فروع|الشيخ زايد|العجوزة|الهرم|خدمات محلية|خدمة محلية|دعم نفسي|دعم اجتماعي|دعم في مصر|egypt.*service|local.*service|book.*appointment|screening.*appointment|branch|hotline|psychosocial/i;

export function isBahyaLocalServicesQuestion(question: string) {
  return localServicePattern.test(question);
}
