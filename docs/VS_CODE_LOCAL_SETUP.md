# تشغيل AI After-Care Assistant محليًا عبر VS Code

## قبل البدء

استخدمي **Node.js 22 أو أحدث** و`pnpm` 10 وVisual Studio Code. يعمل خط Medical RAG على TiDB Vector Search لأن الفهرسة تستخدم `VECTOR(64)` وHNSW ومسافة cosine؛ لا يكفي MySQL التقليدي وحده لمسار PDF والاسترجاع المتجهي. ثبّتي أيضًا إضافة **ESLint** و**Prettier** و**Tailwind CSS IntelliSense** إذا لم يقترحها VS Code تلقائيًا.

> لا تضعي بيانات مرضى حقيقية أو ملفات PDF تحتوي معلومات صحية شخصية في بيئة التطوير المحلية. استخدمي مصادر تعليمية عامة وموثوقة فقط.

## الإعداد

بعد تصدير المشروع إلى مستودع Git أو تنزيله كملف ZIP، افتحي المجلد الجذري `aftercare-rag` في VS Code ثم شغّلي الأوامر التالية من الطرفية المدمجة:

في macOS أو Linux استخدمي:

```bash
corepack pnpm install --frozen-lockfile
pnpm dev
```

في Windows PowerShell، استخدمي الأوامر التالية لتجاوز سياسة ملفات PowerShell دون الحاجة لصلاحيات Administrator:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
corepack.cmd pnpm install --frozen-lockfile
corepack.cmd pnpm dev
```

افتحي ملف `.env` يدويًا وأدخلي رابط قاعدة TiDB ومتغير `JWT_SECRET` أولاً. لن تعمل مزايا LLM وتخزين PDF كما هي خارج Manus إلا إذا كانت لديك بيئة مصرح بها لـ Forge أو استبدلتِ موصّل LLM والتخزين بموفّر خاص بك. لا تنسخي أي مفتاح فعلي داخل Git أو المحادثة.

| المجموعة | مطلوبة لـ | المتغيرات |
|---|---|---|
| قاعدة البيانات | الجلسات والملاحظات ومستندات RAG والمتجهات | `DATABASE_URL` |
| أمان الجلسات | ملفات تعريف الارتباط محليًا | `JWT_SECRET` |
| LLM والتخزين | الإجابة المدعومة بالمصادر ورفع PDF | `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY` |
| OAuth | دخول المشرف وإدخال PDF من صفحة RAG | `VITE_APP_ID`, `OAUTH_SERVER_URL`, `VITE_OAUTH_PORTAL_URL` |

## قاعدة البيانات وRAG

أنشئي قاعدة بيانات TiDB فارغة باسم `aftercare_rag` أو بالاسم الموجود في `DATABASE_URL`. ثم طبّقي الترحيلات:

```bash
pnpm drizzle-kit migrate
```

تتضمن الترحيلات جداول المحادثات والملاحظات ووثائق المعرفة والمقاطع وجدول `knowledge_chunk_vectors` وفهرس HNSW. عند تعديل `drizzle/schema.ts` مستقبلًا، ولّدي ترحيلًا جديدًا ثم راجعي SQL قبل تطبيقه:

```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

## تشغيل التطبيق

بعد تجهيز المتغيرات والترحيلات، شغّلي:

```bash
pnpm dev
```

سيطبع الخادم رابط التشغيل المحلي في الطرفية، وعادةً يكون `http://localhost:3000`. افتحيه في المتصفح، أو اضغطي **Run Task** في VS Code واخترّي **AfterCare: Run development server**.

| المهمة في VS Code | البديل من الطرفية | الغرض |
|---|---|---|
| AfterCare: Run development server | `pnpm dev` | تشغيل الواجهة والخادم مع إعادة تحميل تلقائية؛ أصبح متعدد المنصات عبر `scripts/dev.mjs` |
| AfterCare: Type check | `pnpm check` | فحص TypeScript قبل الالتزام بالتغييرات |
| AfterCare: Run tests | `pnpm test` | تشغيل اختبارات السلامة وRAG |
| AfterCare: Apply database migrations | `pnpm drizzle-kit migrate` | تطبيق ترحيلات Drizzle المراجَعة |
| AfterCare: Generate migration | `pnpm drizzle-kit generate` | إنشاء SQL عند تغيير المخطط |

## تسلسل تجربة RAG محليًا

بعد تسجيل الدخول كمشرف، افتحي `/rag`. تقبل صفحة الإدخال PDF من WHO أو NCI أو NCCN مع رابط HTTPS أصلي للمصدر. يسير المستند عبر parsing وتنظيف وتقطيع متداخل وembeddings ذات 64 بُعدًا وفهرسة HNSW، ثم يظهر الاسترجاع مع الصفحة ورقم المقطع قبل استعماله في إجابة الدردشة.

## فحص سريع قبل العرض

نفّذي الأوامر التالية، ثم افتحي `/rag` وجرّبي سؤال متابعة عام:

```bash
pnpm check
pnpm test
```

يفترض أن تظهر المقاطع المسترجعة مع مسافة cosine، وأن تحمل الإجابة استشهادات المصدر والصفحة ورقم المقطع. إذا ظهر خطأ في `VECTOR` أو HNSW، تحققي من أن `DATABASE_URL` يشير إلى TiDB يدعم Vector Search وليس خادم MySQL عاديًا.
