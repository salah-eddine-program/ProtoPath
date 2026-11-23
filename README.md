# ProtoPath — لوحة التحكم الهندسية ومخطط المنافذ

بيئة عمل هندسية متكاملة ثنائية اللغة (العربية RTL / الإنجليزية LTR) لتصميم الأنظمة المدمجة حول لوحة **ESP32-WROOM-32 DevKit V1**.

## التشغيل محلياً (Local Development)

```bash
npm install
npm run dev
```

## البناء للإنتاج (Production Build)

```bash
npm run build
```

## النشر الصحيح على GitHub Pages (بدون صفحة بيضاء)

هذا المشروع مبني بـ **React + Vite + TypeScript**، لذلك يجب نشر ناتج البناء (`dist/`) وليس الملفات المصدرية الخام (`index.html` + `src/main.tsx`).

1. تأكد من وجود ملف `.github/workflows/deploy.yml` فقط داخل `.github/workflows/` (احذف أي ملفات أخرى مثل `jekyll-gh-pages.yml` أو `static.yml` إذا كانت موجودة في المستودع).
2. في مستودع GitHub افتح: **Settings → Pages**.
3. تحت **Build and deployment** غيّر **Source** إلى **GitHub Actions** (وليس `Deploy from a branch`).
4. ادفع التغييرات إلى فرع `main` أو شغّل الـ Workflow يدوياً من تبويب **Actions ← Deploy ProtoPath to GitHub Pages ← Run workflow**.
