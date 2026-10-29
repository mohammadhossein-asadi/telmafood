# telmafood

### پلتفرم کشف دستورپذها — جستجو، فیل터링، ذخیره و پخت

اعلیه لایحه کشف دستورپذهای مدرن که با Next.js 16 ساخته شده و فیل터링 پیشرفته چندمعیار، صفحه‌بندی بی‌نهایت، ذخیره دستورپذها و رابط کاربری تکملی موبایل-محور دارد — زیربت ساخته‌شده با API دستورپذ Edamam.

[![نسخه زنده](https://img.shields.io/badge/نسخه_زنده-به_زودی-0a0a0a?style=for-the-badge&labelColor=0a0a0a&color=3b82f6)](#)
[![مجوز: MIT](https://img.shields.io/badge/مجوز-MIT-0a0a0a?style=for-the-badge&labelColor=0a0a0a&color=22c55e)](LICENSE)
[![Next.js 16](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

</div>

---

## Overview

تلمافود پلتفرمی کشف دستورپذ است که به API جستجوی دستورپذ Edamam متصل می‌شود تا دسترسی به هزاران دستورپذ را فراهم می‌کند. کاربران می‌توانند بر اساس کلیدواژه جستجو کنند، فیلتر کنند بر اساس نوع وعده، رژیم غذایی، برچسب‌های سلامت، آشپزی، نوع غذا، زمان پخت، شمار مواد اولیه و برد کالری — و سپس مفضلشان را برای بعد ذخیره کنند.

---

## ویژگی‌ها

| ویژگی | توضیح |
|:--------|:------------|
| **جستجوی کلیدواژه** | جستجوی متن آزاد دستورپذ از طریق API Edamam |
| **۸ دسته فیلتر** | نوع وعده، رژیم غذایی، برچسب‌های سلامت (۳۴)، آشپزی (۱۹)، نوع غذا (۱۶)، زمان پخت، مواد اولیه، کالری |
| **صفحه‌بندی بی‌نهایت** | الگوی «بارگذاری بیشتر» با پرتMED_QUERY‌های بی‌نهایت React Query |
| **صفحات جزئیات دستورپذ** | نمای کامل دستورپذ با مواد اولیه، تغذیه، لینک منبع |
| **ذخیره/نشان** | ذخیره‌سازی محلی پایدار از طریق Zustand با اعلان‌های توست |
| **صفحه دستورپذ‌های ذخیره‌شده** | مشاهده تمام دستورپذ‌های نشان‌دار |
| **صفحه اصلی** | بومی جستجو، زروطوعات نوع وعده، نوارکش‌های لغت آشپزی |
| **تم تاریک/روشن** | آگاه به سیستم با next-themes |
| **ناوبری موبایل** | نوار دکمه‌های پایینی برای کاربران موبایل |
| **دستیار هوش مصنوعی** | چت جریان‌دار دستورپذ: پرسیدن درباره یک دستورپذ، تولید برنامه‌های غذا و لیست خرید، دریافت جایگزین‌های مواد اولیه (روتر چند-تأمین‌کننده با فیل‌بک) |
| **مکان‌های معرفی شده** | لایه پول‌بندی تبلیغاتی — SponsoredCard، ContextualBanner، HeroPromo، PremiumPromoBlock با ردیابی نمای و برچسب‌های افشاگری |
| **پشتیبان‌گیری داده دستورپذ** | کلاینت اصلی‌شده TheMealDB جا ارز lookup دستورپذ را هنگام خالی شدن سهمیه Edamam کارکردنلا به کار می‌برد، همراه با محدودیت نرخ درخواست (۳ درخواست بر ثانیه) |
| **آدرس به عنوان حالت** | حالت فیلتر با پارامترهای URL همگام‌سازی می‌شود برای لینک‌های قابل اشتراک‌گذاری |
| **کلیه‌بندی 골격請您** | کلیه، راهرو (SSR جریان‌دار)، و صفحه جزئیات کلیه skeletal |
| **PWA** | برنامه قابل نصب با کارگر سرویس، کپسول آفلاین و مانیفست |
| **SEO & کفآی 이르지نس** | metadata Open Graph/Twitter، robots.txt، نقشه сайта، لینک ورود به محتوا، معانی radiogroup/search |

---

## پشته فناوری

| لایه | فناوری‌ها |
|:------|:-------------|
| **فریم‌ورک** | Next.js 16 (App Router) |
| **زبان** | TypeScript 5 |
| **React** | React 19 |
| **استایل‌دهی** | Tailwind CSS 4، shadcn/ui |
| **دریافت داده** | TanStack React Query 5.101 |
| **حالت** | Zustand 5 (دستورپذ‌های ذخیره‌شده پایدار) |
| **تم** | next-themes 0.4 |
| **API** | API جستجوی دستورپذ Edamam v2 (سाइड‌سرور) + پشتیبان TheMealDB |
| **هوش مصنوعی** | روتر جریان‌دار چند-تأمین‌کننده (OpenRouter، Groq، Hugging Face، Ollama) |
| **اعتبارسنجی** | Zod |
| **تست** | Vitest، Testing Library، Playwright E2E |
| **آیکون‌ها** | Lucide React |
| **توست** | Sonner 2 |
| **فونت** | DM Sans، DM Serif Display (Google Fonts) |

---

## ساختار پروژه

```
تلمافود/
├── src/
│   ├── app/
│   │   ├── page.tsx             # الرئيسية (بومی + زروطوعات + نوارکش‌های آشپزی)
│   │   ├── recipes/             # جستجو + فیلتر + رگرا Bee بی‌نهایت (+ loading.tsx)
│   │   ├── recipe/[id]/page.tsx # جزئیات دستورپذ
│   │   ├── saved/               # دستورپذ‌های ذخیره‌شده (+ loading.tsx)
│   │   ├── not-found.tsx        # صفحه 404
│   │   ├── sitemap.ts           # نقشه сайта دینامیک
│   │   ├── global-error.tsx     # مرز خطای جهانی
│   │   └── api/
│   │       ├── recipes/         # پروکسی Что Серверной Edamam (+ [id] route)
│   │       └── ai/              # مقاصد هوش مصنوعی جریان‌دار (چت، برنامه غذا،
│   │                            #   پرسش‌و‌جو دستورپذ، لیست خرید، جایگزینی‌ها)
│   ├── components/
│   │   ├── ai/                  # ChatWidget، ChatInterface، useAIFeatures
│   │   ├── ad/                  # AdContainer، SponsoredCard، ContextualBanner،
│   │   │                        #   HeroPromo، PremiumPromoBlock، useAdImpression
│   │   ├── filters/             # FilterBar، FilterAccordion، Kleksi‌ها، رادیوها
│   │   ├── home/                # بومی، زروطوعات، نوارکش آشپزی
│   │   ├── layout/              # هدر، پاور، ناوبری موبایل
│   │   ├── recipe/              # کارت/چیدمان/جزئیات دستورپذ، skele، دکمه ذخیره
│   │   ├── search/              # میزبان جستجو
│   │   ├── ui/                  # کاهش‌های پایه shadcn/ui (base-nova)
│   │   ├── ErrorBoundary.tsx    # مرز خطای سطح برنامه
│   │   └── ServiceWorkerRegistration.tsx
│   ├── lib/
│   │   ├── ai/                  # روتر تأمین‌کننده (groq، openrouter، hf، ollama)
│   │   ├── ads/                 # تبلیغات ا utilization، انواع، ابزارها
│   │   ├── api/
│   │   │   ├── edamam.ts        # کلاینت API (فراخوانی داخلی /api/recipes)
│   │   │   ├── backup.ts        # پشتیبان TheMealDB با محدودیت نرخ
│   │   │   ├── rate-limiter.ts  # تنظیم درخواست که توسط کلاینت پشتیبان استفاده می‌شود
│   │   │   ├── schemas.ts       # اعتبارسنجی Zod
│   │   │   └── types.ts         # رابط‌های TypeScript
│   │   ├── هوک‌ها/               # useRecipes، useRecipe
│   │   ├── فروشگاه/               # recipeStore (دستورپذ‌های ذخیره‌شده پایدار)
│   │   └── ابزارها/               # ثابت‌ها (گزینه‌های فیلتر)
│   ├── providers/               # QueryProvider، ThemeProvider
│   └── test/                    # تنظیم Vitest
├── public/                      # مانیفست.json، sw.js، robots.txt، تصاویر
├── components.json
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## سیستم فیلتر

| فیلتر | گزینه‌ها |
|:-------|:--------|
| **نوع وعده** | صبحانه، ناهار، شام، Changement آش parietal، teatime |
| **رژیم غذایی** | متوازن، فیبر بالا، پروتئین بالا، کرب پایین، چربی پایین، سدیم پایین |
| **برچسب‌های سلامت** | ۳۴ گزینه (گیاهی، راژیمی، بدون گلوتن، سازگار کیโต و غیره) |
| **آشپزی** | ۱۹ آشپزی (آمریکایی، آسیایی، فرانسوی، هندی، ایتالیایی، ژاپنی و غیره) |
| **نوع غذا** | ۱۶ نوع (شوربه، سالاد، غذای اصلی، دسرها و غیره) |
| **زمان پخت** | ۶ برد (زیر ۵ دقیقه تا بیش از ۱ ساعت) |
| **شمار مواد اولیه** | ۴ برد |
| **برد کالری** | ۵ برد (زیر ۲۰۰ تا بیش از ۸۰۰) |

---

## شروع سریع

### پیش‌نیازها

- **Node.js** >= 18.0.0

### نصب

```bash
git clone https://github.com/mohammadhossein-asadi/telmafood.git
cd telmafood
npm install
```

### پیکربندی محیط

یک فایل `.env.local` ایجاد کنید (از `.env.example` کپی کنید):

```env
# API دستورپذ Edamam (اصلی)
EDAMAM_API_ID="your-edamam-app-id"
EDAMAM_API_KEY="your-edamam-app-key"

# تأمین‌کننده هوش مصنوعی (برای ویژگی چت — اختیاری)
OPENROUTER_API_KEY="your-openrouter-key"
```

### توسعه

```bash
npm run dev
```

در `http://localhost:3000` باز می‌شود.

### بیلد تولید

```bash
npm run build
npm run start
```

---

## اسکریپت‌ها

| دستور | توضیح |
|:--------|:------------|
| `npm run dev` | شروع سرور توسعه Next.js |
| `npm run build` | بیلد تولید |
| `npm run start` | اجرای سرور تولید |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test:run` | تست‌های واحد Vitest |
| `npm run test:e2e` | تست‌های E2E Playwright |

---

## تصمیمات کلیدی معماری

### آدرس به عنوان حالت برای لینک‌های قابل اشتراک‌گذاری

تمام حالت فیلتر با پارامترهای کوئری URL همگام‌سازی می‌شود، که لینک‌سازی عمیق و لینک‌های قابل اشتراک‌گذاری جستجوی دستورپذ را بدون حالت ساید‌سرور ممکن می‌سازد.

### الگوی پرت MED_QUERY بی‌نهایت

`useInfiniteQuery` React Query ساختار صفحه‌بندی «بارگذاری بیشتر» را به عنوان قدرت می‌دارد، با کش‌سازی خودکار و رفرش پس‌زمینه برای تجربه کاربری نرم.

### پروکسی API ساید‌سرور

کلیدهای API Edamam ساید سرور می‌مانند: کلاینت `edamam.ts` مقاصد داخلی `/api/recipes` را فراخوانی می‌کند که درخواست‌ها را به Edamam فوروارد می‌کنند، بنابراین رازها هرگز به دفترچه‌خاطر مرورگر نمی‌رسند. محدودیت‌دهنده نرخ تنها کلاینت پشتیبان TheMealDB را تنظیم می‌کند.

### ذخیره‌سازی محلی پایدار

Zustand با میدلور `persist` دستورپذ‌های نشان‌دار را در localStorage ذخیره می‌کند و ازiscale نوبت‌های مرورگر بدون بک‌اند جان می‌ماند.

### روتر هوش مصنوعی چند-تأمین‌کننده

ویژگی‌های هوش مصنوعی از طریق روتر تأمین‌کننده pluggable (OpenRouter، Groq، Hugging Face، Ollama) با فیل‌بک جریان‌دار می‌شوند، بنابراین دستیار هنگامی که تأمین‌کننده در دسترس نیست، به TEN slope می‌شود.

### طراحی واکنش‌گرا موبایل-اول

ناوبری نوار دکمه پایینی در موبایل، نوار کناری در دسکتاپ — کدبر اساس یک رو به متدهای واکنش‌گرا Tailwind.

---

## مجوز

این پروژه تحت [مجوز MIT](LICENSE) منتشر شده است.

---

<div align="center" dir="rtl">

**محمد حسین اسدی** — مهندس فرانت‌اند و فرون‌اند کامل

[![کانال](https://img.shields.io/badge/GitHub-mohammadhossein--asadi-0a0a0a?style=flat-square&logo=github)](https://github.com/mohammadhossein-asadi)
[![لینکدین](https://img.shields.io/badge/لینکدین-mohammadhossein--asadi-0a66c2?style=flat-square&logo=linkedin)](https://linkedin.com/in/mohammadhossein-asadi)

</div>
