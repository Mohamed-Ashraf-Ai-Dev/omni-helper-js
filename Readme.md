# ✨ OmniHelper.js — مكتبة JavaScript الشاملة ✨

[![npm version](https://img.shields.io/npm/v/@omni-helper-js/omnihelper.svg)](https://www.npmjs.com/package/@omni-helper-js/omnihelper)
[![npm downloads](https://img.shields.io/npm/dm/@omni-helper-js/omnihelper.svg)](https://www.npmjs.com/package/@omni-helper-js/omnihelper)
[![license](https://img.shields.io/npm/l/@omni-helper-js/omnihelper.svg)](LICENSE)

---

## 🚀 نظرة عامة (Overview)

**OmniHelper.js** هي مكتبة JavaScript شاملة تم نشرها رسميًا على **npm**، وتهدف إلى أن تكون **صندوق أدوات متكامل** يغنيك عن استخدام عشرات المكتبات الصغيرة في مشاريعك.

المكتبة مبنية بـ **JavaScript خالص (Vanilla JS)** بدون أي تبعيات خارجية، وتعمل بكفاءة في:
- 🌐 المتصفح (Browser)
- 🟢 Node.js

---

## 📦 التثبيت (Installation)

```bash
npm install @omni-helper-js/omnihelper
```

---

## 🛠️ الاستخدام (Usage)

### Node.js
```js
const OmniHelper = require('@omni-helper-js/omnihelper');
```

### Browser
```html
<script src="OmniHelper.js"></script>
```

---

## 👨‍💻 المطور
**Mohamed Ashraf**  
Facebook: https://www.facebook.com/share/1Gf47LvFjv/

---

## 📜 License
Open Source – Free for personal & commercial use
| `slideToggle(...)` | تبديل بين `slideDown` و `slideUp`. |
| `bounce(...)` | تطبيق تأثير الارتداد. |
| `shake(...)` | تطبيق تأثير الاهتزاز. |
| `pulse(...)` | تطبيق تأثير النبض. |
| `zoomIn(...)` | تكبير العنصر. |
| `zoomOut(...)` | تصغير العنصر. |
| `rotate(...)` | تدوير العنصر. |
| `translate(...)` | تحريك العنصر أفقياً وعمودياً. |
| `scale(...)` | تغيير حجم العنصر. |
| `stop(element)` | إيقاف جميع الرسوم المتحركة على العنصر. |

**أمثلة على الاستخدام:**

```javascript
OmniHelper.Anim.fadeIn('.modal', 300, function() {
    console.log('النافذة الآن مرئية.');
});

OmniHelper.Anim.shake('.input-field', 2, 400);
```

---

### 4. إشعارات التنبيه (Notifier) 🔔

توفر هذه الوحدة إشعارات "توست" (Toast Notifications) أنيقة وجذابة تظهر على الصفحة لأحداث مختلفة، دون الحاجة إلى أي تنسيقات CSS إضافية.

| الوظيفة | الوصف |
| :--- | :--- |
| `notify(message, type, duration, position)` | عرض إشعار بنوع وموقع محددين. |
| `info(message, duration)` | عرض إشعار معلوماتي. |
| `success(message, duration)` | عرض إشعار نجاح. |
| `warning(message, duration)` | عرض إشعار تحذير. |
| `error(message, duration)` | عرض إشعار خطأ. |
| `removeAll()` | إزالة جميع الإشعارات النشطة. |
| `setDefaultOptions(options)` | تعيين الخيارات الافتراضية للإشعارات. |

**أمثلة على الاستخدام:**

```javascript
OmniHelper.Notify.notify('تمت العملية بنجاح! ✅', 'success', 3000, 'top-right');
OmniHelper.Notify.error('فشل الاتصال بالخادم 🛑');
```

---

### 5. الأدوات العامة (Utility Functions) 💡

مجموعة شاملة من الوظائف المساعدة التي تغطي مهام البرمجة الشائعة، بما في ذلك معالجة البيانات، التحقق من الصحة (Validation)، التنسيق، والتعامل مع DOM.

| الفئة | الوظائف البارزة |
| :--- | :--- |
| **التحكم في التدفق** | `debounce`, `throttle`, `sleep`, `retry`, `memoize`, `once`, `waitFor` |
| **البيانات والكائنات** | `deepClone`, `deepMerge`, `pick`, `omit`, `get`, `set`, `has`, `isEmpty`, `isEqual` |
| **المصفوفات** | `random`, `shuffle`, `unique`, `chunk`, `compact`, `sum`, `mean`, `keyBy` |
| **السلاسل النصية** | `capitalize`, `camelCase`, `kebabCase`, `snakeCase`, `startCase`, `truncate`, `repeat`, `pad` |
| **التحقق والتنسيق** | `generateUUID`, `isValidEmail`, `isValidURL`, `isValidPhone`, `isValidDate`, `formatDate`, `formatNumber`, `formatCurrency`, `formatPercent` |
| **التشفير والهروب** | `encodeBase64`, `decodeBase64`, `escapeHtml`, `unescapeHtml` |
| **بيئة التشغيل** | `detectBrowser`, `detectOS`, `detectDevice` |
| **التخزين وDOM** | `getCookie`, `setCookie`, `deleteCookie`, `getStorage`, `setStorage`, `removeStorage`, `clearStorage`, `downloadFile`, `copyToClipboard`, `getSelectionText`, `addEventListener`, `querySelector`, `closest`, `parents`, `siblings`, `next`, `prev`, `createElement`, `setAttributes`, `addClass`, `removeClass`, `toggleClass`, `hasClass`, `getData`, `setStyle`, `getDimensions`, `isVisible`, `isInViewport`, `onLoad`, `onDOMReady` |

**أمثلة على الاستخدام:**

```javascript
// منع التنفيذ المتكرر (Debounce)
const debouncedSearch = OmniHelper.Utils.debounce(function(query) {
    console.log('البحث عن:', query);
}, 300);

// التحقق من البريد الإلكتروني
OmniHelper.Utils.isValidEmail('test@example.com'); // true

// التنسيق كعملة
OmniHelper.Utils.formatCurrency(1234.56, 'USD', 'en-US'); // '$1,234.56'
```

---

## الترخيص (License) 📜

هذه المكتبة مفتوحة المصدر (Open Source) ومتاحة للجميع، ويمكنك استخدامها بحرية تامة في أي مشروع، سواء كان تجارياً أو شخصياً. **نحن نؤمن بمشاركة المعرفة!**

---

## الدعم والتواصل (Support & Contact) 🤝

إذا كان لديك أي استفسارات، أو احتجت إلى دعم فني، أو أردت تقديم اقتراحات لتحسين المكتبة، يرجى التواصل مباشرةً مع المطور:

*   **فيسبوك:** [https://www.facebook.com/share/1Gf47LvFjv/](https://www.facebook.com/share/1Gf47LvFjv/)

**نحن هنا لمساعدتك في بناء مشاريعك العظيمة!** 🌟
