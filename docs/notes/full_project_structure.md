Dưới đây là **full project structure chuẩn production cho Next.js 14+ (App Router)** dành riêng cho **AI Translate Webapp**. Thiết kế này tối ưu cho:

- serverless (Vercel)
- code maintainable
- dễ mở rộng provider AI
- tách rõ **UI / logic / providers / prompts**

Cấu trúc này phù hợp khi project **lớn hơn demo và có thể open-source**.

---

# 1. Full Project Structure

```
ai-translate-webapp
│
├── app
│   ├── api
│   │   └── translate
│   │       └── route.ts
│   │
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   │
│   └── providers.tsx
│
├── components
│   ├── translator
│   │   ├── TranslatorPanel.tsx
│   │   ├── SourceInput.tsx
│   │   ├── ResultOutput.tsx
│   │   ├── TranslateButton.tsx
│   │
│   ├── settings
│   │   ├── SettingsModal.tsx
│   │   └── ApiKeyForm.tsx
│   │
│   ├── history
│   │   ├── HistoryPanel.tsx
│   │   └── HistoryItem.tsx
│   │
│   ├── controls
│   │   ├── LanguageSelector.tsx
│   │   ├── ModelSelector.tsx
│   │   ├── ToneSelector.tsx
│   │   ├── ModeSelector.tsx
│   │   └── TemperatureSlider.tsx
│   │
│   └── ui
│       ├── Button.tsx
│       ├── Modal.tsx
│       ├── Dropdown.tsx
│       └── Textarea.tsx
│
├── lib
│   ├── ai
│   │   ├── providers
│   │   │   ├── gemini.ts
│   │   │   ├── groq.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── prompt
│   │   │   ├── buildPrompt.ts
│   │   │   └── promptTemplates.ts
│   │   │
│   │   └── models.ts
│   │
│   ├── storage
│   │   ├── localStorage.ts
│   │   ├── historyStorage.ts
│   │   └── keyStorage.ts
│   │
│   ├── utils
│   │   ├── hash.ts
│   │   ├── date.ts
│   │   └── validateKey.ts
│   │
│   └── constants
│       ├── languages.ts
│       └── providers.ts
│
├── hooks
│   ├── useTranslation.ts
│   ├── useHistory.ts
│   └── useLocalStorage.ts
│
├── types
│   ├── api.ts
│   ├── translation.ts
│   └── history.ts
│
├── styles
│   └── tailwind.css
│
├── middleware.ts
│
├── public
│   └── logo.svg
│
├── package.json
├── tailwind.config.ts
├── next.config.js
├── tsconfig.json
└── README.md
```

---

# 2. Giải thích từng phần

---

# `/app`

App Router của Next.js.

```
app/
```

### page.tsx

Trang chính translator.

```tsx
app/page.tsx
```

Render:

```
TranslatorPanel
HistoryPanel
```

---

### layout.tsx

Global layout.

```tsx
<html>
<body>
<AppProviders>
{children}
</AppProviders>
</body>
</html>
```

---

### providers.tsx

React providers:

- Theme
- Context
- Toast

---

### globals.css

Tailwind + global style.

---

# `/app/api`

API routes serverless.

```
app/api/translate/route.ts
```

Endpoint:

```
POST /api/translate
```

Responsibilities:

1. validate API key
2. build prompt
3. call provider
4. stream response

---

# `/components`

UI components.

---

# translator

Main translator UI.

```
TranslatorPanel
```

Structure:

```
SourceInput
LanguageSelector
ModelSelector
TranslateButton
ResultOutput
```

---

# settings

Modal nhập API key.

```
SettingsModal
```

Contains:

```
ApiKeyForm
```

---

# history

History UI.

```
HistoryPanel
HistoryItem
```

Hiển thị:

```
source text
translated text
copy button
```

---

# controls

Controls của translator.

```
LanguageSelector
ModelSelector
ToneSelector
ModeSelector
TemperatureSlider
```

---

# ui

Reusable UI primitives.

```
Button
Dropdown
Modal
Textarea
```

---

# `/lib`

Logic core của application.

---

# `/lib/ai/providers`

Tách logic gọi API theo provider.

```
gemini.ts
groq.ts
```

Ví dụ:

```tsx
export async function translateWithGemini(...)
```

---

# `/lib/ai/prompt`

Prompt engineering.

```
buildPrompt.ts
promptTemplates.ts
```

Ví dụ:

```tsx
buildPrompt(options)
```

---

# `/lib/ai/models.ts`

List models.

```tsx
export const MODELS = {
  gemini: [],
  groq: []
}
```

---

# `/lib/storage`

Quản lý LocalStorage.

```
keyStorage.ts
historyStorage.ts
```

---

# `/lib/utils`

Utility functions.

```
hash
date
validateKey
```

---

# `/lib/constants`

Static constants.

```
languages.ts
providers.ts
```

---

# `/hooks`

Custom React hooks.

---

### useTranslation

Quản lý logic translate.

```
call API
handle streaming
update UI
```

---

### useHistory

```
load history
save history
reset daily
```

---

### useLocalStorage

Wrapper cho localStorage.

---

# `/types`

TypeScript types.

---

### translation.ts

```tsx
export type TranslationRequest
```

---

### history.ts

```tsx
export type HistoryItem
```

---

### api.ts

API response types.

---

# `/middleware.ts`

Dùng để:

- rate limit
- security headers

Ví dụ:

```
10 request/min/IP
```

---

# 3. Data Flow (Code Level)

User action:

```
user input text
```

↓

```
useTranslation hook
```

↓

```
POST /api/translate
```

↓

```
route.ts
```

↓

```
buildPrompt()
```

↓

```
provider API
```

↓

```
stream response
```

↓

```
ResultOutput UI
```

↓

```
save history
```

---

# 4. API Route Example Flow

```tsx
POST /api/translate
```

Steps:

```
validate input
validate api key
build prompt
call provider
stream response
return text
```

---

# 5. Deployment Ready Features

Structure này đã hỗ trợ:

### streaming

Vercel AI SDK.

### caching

history cache.

### rate limit

middleware.

### multi provider

providers folder.

---

# 6. Optional (Highly Recommended)

Thêm folder:

```
/tests
```

```
prompt.test.ts
api.test.ts
```

---

# 7. Project Size (ước lượng)

Khi hoàn chỉnh:

| Part | LOC |
| --- | --- |
| UI | ~1200 |
| API | ~300 |
| Providers | ~200 |
| Hooks | ~300 |

Total:

```
~2000 lines
```

Đủ **production-level side project**.
