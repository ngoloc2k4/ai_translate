Dưới đây là **Prompt Engineering System hoàn chỉnh cho AI Translate Webapp**. Thiết kế này giúp:

- dịch **ổn định hơn Google Translate**
- kiểm soát **tone / mode / creativity**
- tránh **LLM hallucination**
- output **predictable format**

Hệ thống prompt sẽ nằm trong:

```
/lib/ai/prompt
```

---

# 1. Prompt System Architecture

Prompt được xây dựng theo **3 layer**:

```
SYSTEM PROMPT
      +
TASK PROMPT
      +
USER TEXT
```

Flow:

```
User text
   ↓
BuildPrompt()
   ↓
LLM Request
```

Structure:

```
system:
   translator rules

user:
   translation instruction + text
```

---

# 2. Folder Structure

```
/lib/ai/prompt
│
├── buildPrompt.ts
├── promptTemplates.ts
├── tonePrompts.ts
├── modePrompts.ts
└── outputFormat.ts
```

---

# 3. Core Prompt Template

File:

```tsx
promptTemplates.ts
```

```tsx
export const BASE_TRANSLATOR_PROMPT = `
You are a professional multilingual translator.

Rules:

1. Preserve the original meaning accurately.
2. Maintain the context and intent of the text.
3. Avoid adding information not present in the original.
4. Keep translations natural and fluent.
5. Do not include commentary unless requested.

Always follow the instruction format strictly.
`;
```

---

# 4. Tone Prompt Layer

File:

```tsx
tonePrompts.ts
```

```tsx
export const tonePrompts = {
  default: `
Use a neutral and natural tone.
`,

  formal: `
Use professional and polite language.
Avoid slang or informal expressions.
`,

  casual: `
Use casual conversational language like talking to a friend.
Slang is allowed when appropriate.
`,

  creative: `
Use creative and expressive language.
Metaphors and stylistic expressions are allowed.
`,

  academic: `
Use academic tone and precise terminology.
Suitable for research or formal writing.
`
};
```

---

# 5. Translation Mode Prompts

File:

```tsx
modePrompts.ts
```

```tsx
export const modePrompts = {

translate: `
Translate the following text to the target language.
Preserve the meaning as accurately as possible.
`,

paraphrase: `
Rewrite the text in the same language.
Improve clarity and readability while keeping the original meaning.
`,

explain: `
Translate the text and then explain the important grammar or vocabulary.
`,

summarize: `
Translate the text and provide a short summary of the key ideas.
`
};
```

---

# 6. Output Format Control

Rất quan trọng để **tránh LLM nói linh tinh**.

File:

```tsx
outputFormat.ts
```

```tsx
export const outputFormats = {

translate: `
Output ONLY the translated text.
Do not include explanations.
`,

paraphrase: `
Output ONLY the rewritten text.
`,

explain: `
Output format:

Translation:
<translated text>

Explanation:
<short explanation>
`,

summarize: `
Output format:

Translation:
<translated text>

Summary:
<short summary>
`
};
```

---

# 7. Prompt Builder

File:

```tsx
buildPrompt.ts
```

```tsx
import { BASE_TRANSLATOR_PROMPT } from "./promptTemplates";
import { tonePrompts } from "./tonePrompts";
import { modePrompts } from "./modePrompts";
import { outputFormats } from "./outputFormat";

export function buildPrompt({
  text,
  sourceLang,
  targetLang,
  tone,
  mode
}) {

const toneInstruction = tonePrompts[tone] || tonePrompts.default;

const modeInstruction = modePrompts[mode] || modePrompts.translate;

const outputInstruction = outputFormats[mode] || outputFormats.translate;

const userPrompt = `
Source Language: ${sourceLang || "Auto detect"}

Target Language: ${targetLang}

${modeInstruction}

${toneInstruction}

${outputInstruction}

Text:
"""
${text}
"""
`;

return {
system: BASE_TRANSLATOR_PROMPT,
user: userPrompt
};

}
```

---

# 8. Example Prompt Output

User input:

```
Hello, how are you today?
```

Options:

```
tone: casual
mode: translate
targetLang: Vietnamese
```

Prompt generated:

```
SYSTEM

You are a professional multilingual translator.

Rules:
Preserve the original meaning accurately...

USER

Source Language: Auto detect
Target Language: Vietnamese

Translate the following text to the target language.

Use casual conversational language.

Output ONLY the translated text.

Text:
"""
Hello, how are you today?
"""
```

Output:

```
Chào bạn, hôm nay bạn thế nào?
```

---

# 9. Advanced Prompt Enhancements

Để dịch **tốt hơn Google Translate**, nên thêm:

---

## Context Awareness

Ví dụ:

```
context: marketing
```

Prompt:

```
Translate with marketing tone.
```

---

## Idiom Handling

Thêm rule:

```
If the text contains idioms, translate them naturally instead of literal translation.
```

---

## Preserve Formatting

Quan trọng khi dịch document.

Thêm rule:

```
Preserve formatting such as:
- line breaks
- bullet lists
- numbering
```

---

# 10. Temperature Strategy

Không nên cho user chỉnh tự do.

Mapping:

| Mode | Temperature |
| --- | --- |
| translate | 0.2 |
| paraphrase | 0.5 |
| creative | 0.8 |

Implementation:

```tsx
export function getTemperature(mode){

switch(mode){

case "translate":
return 0.2

case "paraphrase":
return 0.5

case "summarize":
return 0.4

default:
return 0.5
}

}
```

---

# 11. Anti Hallucination Guard

Thêm rule:

```
If the text cannot be translated, return the original text.
Do not invent content.
```

---

# 12. Optional: Bilingual Output Mode

Rất tốt cho **language learners**.

Prompt:

```
Output format:

Original:
...

Translation:
...
```

---

# 13. Final Prompt Pipeline

```
user options
     ↓
buildPrompt()
     ↓
system prompt
     +
user prompt
     ↓
LLM
     ↓
structured output
```

---

# 14. Kết quả

Prompt system này:

- ổn định hơn prompt đơn
- dễ mở rộng
- dễ debug
- hỗ trợ nhiều mode

---

Nếu bạn muốn, tôi có thể tiếp tục viết luôn phần **rất quan trọng tiếp theo của project**:

**API route hoàn chỉnh cho:**

- Gemini
- Groq
- streaming
- prompt system
- temperature control

File:

```
/app/api/translate/route.ts
```

Đây là **phần core backend của toàn bộ project**.
