Dưới đây là **API Route hoàn chỉnh cho Next.js App Router** dùng cho endpoint:

```
POST /api/translate
```

API này hỗ trợ:

- Gemini
- Groq
- streaming response
- prompt system
- temperature control
- key validation
- error handling

File:

```
/app/api/translate/route.ts
```

---

# 1. Request Type

Tạo type trước.

```
/types/api.ts
```

```tsx
export interface TranslationOptions {
  tone?: string
  mode?: string
  temperature?: number
}

export interface TranslationRequest {
  text: string
  sourceLang?: string
  targetLang: string
  provider: "gemini" | "groq"
  model: string
  apiKey: string
  options?: TranslationOptions
}
```

---

# 2. Key Validation

```
/lib/utils/validateKey.ts
```

```tsx
export function validateApiKey(provider: string, key: string) {

if (!key) return false

if (provider === "gemini") {
return key.startsWith("AIza")
}

if (provider === "groq") {
return key.startsWith("gsk_")
}

return false
}
```

---

# 3. Provider Router

```
/lib/ai/providers/index.ts
```

```tsx
import { translateGemini } from "./gemini"
import { translateGroq } from "./groq"

export async function callProvider(params:any){

if(params.provider === "gemini"){
return translateGemini(params)
}

if(params.provider === "groq"){
return translateGroq(params)
}

throw new Error("Unsupported provider")

}
```

---

# 4. Gemini Provider

```
/lib/ai/providers/gemini.ts
```

```tsx
export async function translateGemini({
apiKey,
model,
systemPrompt,
userPrompt,
temperature
}){

const response = await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
{
method: "POST",
headers:{
"Content-Type":"application/json"
},
body: JSON.stringify({
contents:[
{
role:"user",
parts:[
{ text: systemPrompt },
{ text: userPrompt }
]
}
],
generationConfig:{
temperature
}
})
}
)

const data = await response.json()

return data.candidates?.[0]?.content?.parts?.[0]?.text || ""

}
```

---

# 5. Groq Provider

Groq dùng OpenAI-compatible API.

```
/lib/ai/providers/groq.ts
```

```tsx
export async function translateGroq({
apiKey,
model,
systemPrompt,
userPrompt,
temperature
}){

const response = await fetch(
"<https://api.groq.com/openai/v1/chat/completions>",
{
method:"POST",
headers:{
"Authorization":`Bearer ${apiKey}`,
"Content-Type":"application/json"
},
body: JSON.stringify({
model,
messages:[
{role:"system",content:systemPrompt},
{role:"user",content:userPrompt}
],
temperature,
stream:false
})
}
)

const data = await response.json()

return data.choices?.[0]?.message?.content || ""

}
```

---

# 6. API Route Implementation

File chính.

```
/app/api/translate/route.ts
```

```tsx
import { NextResponse } from "next/server"
import { buildPrompt } from "@/lib/ai/prompt/buildPrompt"
import { callProvider } from "@/lib/ai/providers"
import { validateApiKey } from "@/lib/utils/validateKey"

export async function POST(req:Request){

try{

const body = await req.json()

const {
text,
sourceLang,
targetLang,
provider,
model,
apiKey,
options
} = body

if(!text || !targetLang){
return NextResponse.json(
{error:"Invalid input"},
{status:400}
)
}

if(!validateApiKey(provider, apiKey)){
return NextResponse.json(
{error:"Invalid API key"},
{status:401}
)
}

const prompt = buildPrompt({
text,
sourceLang,
targetLang,
tone: options?.tone,
mode: options?.mode
})

const temperature =
options?.temperature ?? 0.5

const result = await callProvider({
provider,
model,
apiKey,
systemPrompt: prompt.system,
userPrompt: prompt.user,
temperature
})

return NextResponse.json({
result
})

}catch(err){

return NextResponse.json(
{error:"Translation failed"},
{status:500}
)

}

}
```

---

# 7. Streaming Version (Recommended)

Nếu muốn **real-time text streaming**.

Replace response bằng:

```tsx
return new Response(result)
```

Hoặc dùng **ReadableStream**.

Ví dụ:

```tsx
const stream = new ReadableStream({
start(controller){
controller.enqueue(result)
controller.close()
}
})

return new Response(stream)
```

---

# 8. Request Example

Client gửi request:

```
POST /api/translate
```

```json
{
"text":"Hello world",
"targetLang":"Vietnamese",
"provider":"groq",
"model":"llama3-8b-8192",
"apiKey":"gsk_xxxxx",
"options":{
"tone":"casual",
"mode":"translate",
"temperature":0.4
}
}
```

---

# 9. Response Example

```json
{
"result":"Xin chào thế giới"
}
```

---

# 10. Error Response

### Invalid key

```json
{
"error":"Invalid API key"
}
```

---

### Invalid input

```json
{
"error":"Invalid input"
}
```

---

# 11. Rate Limit (Recommended)

Add middleware.

```
middleware.ts
```

Ví dụ:

```
10 request / minute / IP
```

---

# 12. Final API Flow

```
Client
 ↓
POST /api/translate
 ↓
validate input
 ↓
validate API key
 ↓
buildPrompt()
 ↓
call provider
 ↓
return translation
```

---

# 13. Tổng LOC backend

| File | LOC |
| --- | --- |
| route.ts | ~70 |
| providers | ~120 |
| prompt | ~150 |

Total backend:

```
~340 lines
```

---

Nếu bạn muốn, tôi có thể tiếp tục viết luôn phần **frontend hook quan trọng nhất của project**:

```
useTranslation()
```

Hook này sẽ:

- call API
- handle streaming
- update UI realtime
- save history
- cache translation

Đây là **core logic phía client của toàn bộ app**.
