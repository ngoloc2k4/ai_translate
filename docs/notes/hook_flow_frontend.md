Dưới đây là **`useTranslation` hook hoàn chỉnh cho frontend**. Đây là **core client logic** của AI Translate Webapp. Hook này xử lý:

- gọi API `/api/translate`
- streaming response
- cập nhật UI realtime
- cache translation
- lưu history
- loading / error state

File:

```
/hooks/useTranslation.ts
```

---

# 1. Hook Overview

Hook trả về:

| State | Purpose |
| --- | --- |
| sourceText | text người dùng nhập |
| result | kết quả dịch |
| loading | trạng thái đang dịch |
| error | lỗi nếu có |

Functions:

| Function | Purpose |
| --- | --- |
| translate() | gọi API |
| reset() | reset kết quả |

---

# 2. Types

```tsx
/types/translation.ts
```

```tsx
export interface TranslateOptions {
  tone?: string
  mode?: string
  temperature?: number
}

export interface TranslateParams {
  text: string
  sourceLang?: string
  targetLang: string
  provider: "gemini" | "groq"
  model: string
  apiKey: string
  options?: TranslateOptions
}
```

---

# 3. Hook Implementation

```tsx
/hooks/useTranslation.ts
```

```tsx
"use client"

import { useState } from "react"
import { saveHistory } from "@/lib/storage/historyStorage"
import { hashText } from "@/lib/utils/hash"

export function useTranslation(){

const [result,setResult] = useState("")
const [loading,setLoading] = useState(false)
const [error,setError] = useState<string | null>(null)

async function translate(params:any){

setLoading(true)
setError(null)
setResult("")

try{

// cache check
const cacheKey = hashText(
params.text + params.targetLang
)

const cached = localStorage.getItem(cacheKey)

if(cached){
setResult(cached)
setLoading(false)
return
}

const res = await fetch("/api/translate",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body: JSON.stringify(params)
})

if(!res.ok){
throw new Error("API error")
}

// streaming reader
const reader = res.body?.getReader()
const decoder = new TextDecoder()

let finalText = ""

if(reader){

while(true){

const {done,value} = await reader.read()

if(done) break

const chunk = decoder.decode(value)

finalText += chunk

setResult(prev => prev + chunk)

}

}else{

finalText = await res.text()
setResult(finalText)

}

// cache result
localStorage.setItem(cacheKey,finalText)

// save history
saveHistory({
sourceText: params.text,
translatedText: finalText,
sourceLang: params.sourceLang || "auto",
targetLang: params.targetLang,
provider: params.provider
})

}catch(err:any){

setError(err.message)

}finally{

setLoading(false)

}

}

function reset(){

setResult("")
setError(null)

}

return{

result,
loading,
error,
translate,
reset

}

}
```

---

# 4. History Storage

Hook sử dụng function:

```
/lib/storage/historyStorage.ts
```

```tsx
export function saveHistory(item:any){

const key = "ai_translate_history"

const today = new Date().toISOString().split("T")[0]

const raw = localStorage.getItem(key)

let data = raw ? JSON.parse(raw) : null

if(!data || data.date !== today){

data = {
date: today,
items: []
}

}

data.items.unshift({
id: Date.now(),
time: new Date().toLocaleTimeString(),
...item
})

localStorage.setItem(key,JSON.stringify(data))

}
```

---

# 5. Hash Utility (Cache)

```
/lib/utils/hash.ts
```

```tsx
export function hashText(text:string){

let hash = 0

for(let i=0;i<text.length;i++){

hash = (hash<<5)-hash + text.charCodeAt(i)

hash |= 0

}

return "cache_" + hash

}
```

---

# 6. Example Usage

Trong component:

```tsx
/components/translator/TranslatorPanel.tsx
```

```tsx
"use client"

import { useTranslation } from "@/hooks/useTranslation"

export default function TranslatorPanel(){

const {
result,
loading,
error,
translate
} = useTranslation()

function handleTranslate(){

translate({
text:"Hello world",
targetLang:"Vietnamese",
provider:"groq",
model:"llama3-8b-8192",
apiKey:"user_key"
})

}

return(

<div>

<button onClick={handleTranslate}>
Translate
</button>

{loading && <p>Translating...</p>}

{result && <div>{result}</div>}

{error && <p>{error}</p>}

</div>

)

}
```

---

# 7. Streaming UI Behavior

Hook này giúp UI:

```
Hello wor
Hello world
Xin ch
Xin chào
```

Text **xuất hiện dần dần**.

UX giống:

- ChatGPT
- Claude
- Gemini

---

# 8. Cache Strategy

Cache key:

```
hash(sourceText + targetLang)
```

Ví dụ:

```
Hello + Vietnamese
```

Nếu dịch lại:

```
return cached result
```

Giảm API calls.

---

# 9. History Flow

Sau khi dịch xong:

```
saveHistory()
```

Stored:

```
localStorage
```

Key:

```
ai_translate_history
```

---

# 10. Hook State Flow

```
user click translate
      ↓
loading = true
      ↓
call API
      ↓
stream chunks
      ↓
update result
      ↓
save history
      ↓
loading = false
```

---

# 11. Final Client Logic

Frontend flow:

```
User input
   ↓
useTranslation()
   ↓
POST /api/translate
   ↓
stream response
   ↓
UI update
   ↓
save history
```

---

# 12. Lines of Code

| Part | LOC |
| --- | --- |
| useTranslation | ~90 |
| history storage | ~40 |
| hash | ~20 |

Total:

```
~150 lines
```

---

Nếu bạn muốn, tôi có thể tiếp tục thiết kế luôn phần **UI quan trọng nhất của project**:

**ChatGPT-style translator interface**

Layout:

```
+----------------------+----------------------+
| Source Text          | Translated Result    |
|                      |                      |
|                      |                      |
+----------------------+----------------------+
```

Thiết kế này **UX tốt hơn Google Translate** và thường được dùng trong AI translation tools.
