# تشغيل BreastCancerCare AI خارج Manus

## مهم قبل الرفع إلى GitHub

هذا المشروع ليس واجهة ثابتة فقط. الدردشة تحتاج إلى خادم Node.js، وقاعدة بيانات MySQL/TiDB، ومفتاح مزود LLM متوافق مع OpenAI. لذلك GitHub مناسب لحفظ الكود، لكنه لا يشغّل `server/index.ts` ولا يحافظ على الأسرار. رفع مجلد `dist` إلى GitHub Pages سيعرض الواجهة فقط، ولن يجعل `/api/trpc/aftercare.chat` يعمل.

للحصول على نفس سلوك الرابط المنشور سابقًا، يجب نشر الواجهة والخادم معًا على استضافة Node.js، وتوفير قاعدة البيانات ومفتاح LLM في متغيرات البيئة السرية. كما أن مسار إدخال ملفات PDF في `/rag` يحتاج تكامل OAuth والتخزين الخاص بـ Manus، أو يجب استبدال `server/storage.ts` بتخزين S3/R2 خاص بك.

## تشغيل VS Code

1. ثبّتي Node.js 22 أو أحدث وفعّلي pnpm 10.
2. افتحي مجلد المشروع الجذري، ثم نفّذي:

```bash
corepack enable
pnpm install --frozen-lockfile
cp .env.example .env
```

في Windows PowerShell استخدمي `Copy-Item .env.example .env` بدل `cp`.

3. املئي `.env` على الأقل بـ `DATABASE_URL` و`JWT_SECRET` و`OPENAI_API_KEY`. لا ترفعي `.env` إلى GitHub.
4. أنشئي قاعدة TiDB/MySQL متوافقة، ثم طبقي الترحيلات:

```bash
pnpm db:push
```

5. شغلي المشروع:

```bash
pnpm dev
```

ثم افتحي `http://localhost:3000/chat?lang=ar`.

## فحوصات ما قبل الرفع

```bash
pnpm check
pnpm test
pnpm build
```

الأمر `pnpm dev` أصبح متعدد المنصات ولا يعتمد على `npx cross-env`. كما تم حذف متغيرات Umami الخاصة ببيئة Manus من HTML، وتصحيح إعداد TypeScript القديم الذي كان يمنع `pnpm check`.

## إعداد LLM

يدعم المشروع أي API متوافق مع OpenAI Chat Completions:

```env
OPENAI_BASE_URL=https://api.openai.com
OPENAI_API_KEY=ضع_المفتاح_محليًا_فقط
```

وللاستمرار على Manus Forge يمكن استخدام `BUILT_IN_FORGE_API_URL` و`BUILT_IN_FORGE_API_KEY` بدلًا منهما. لا تضعي أي مفتاح في الكود أو في GitHub.

## النشر

انشري الخادم على خدمة تدعم Node.js، واضبطي أمر البناء `pnpm build` وأمر التشغيل `pnpm start`، ثم أضيفي متغيرات البيئة من لوحة الاستضافة. لا تستخدمي `pnpm deploy` مع GitHub Pages إذا كان المطلوب تشغيل الشات؛ فهذا الأمر ينشر ملفات الواجهة ولا ينشر خادم API وقاعدة البيانات.

## ملاحظة سلامة

المساعد للتثقيف العام وليس للتشخيص أو النصيحة الطبية الفردية. لا تضعي بيانات مرضى حقيقية أو ملفات صحية شخصية في التطوير أو الاختبارات.
