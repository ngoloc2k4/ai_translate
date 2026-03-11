1. Tổng quan tính năng từ UI

Dựa trên các screenshot bạn gửi, hệ thống là AI Translation / Writing Assistant có khả năng:

Dịch ngôn ngữ

Viết lại / chỉnh sửa câu

Xuất song ngữ

Điều chỉnh tone văn phong

Điều chỉnh mode xử lý


Các thành phần chính trên màn hình:

Component	Chức năng

Language selector	chọn ngôn ngữ nguồn và đích
Model selector	chọn model AI
Mode	chế độ xử lý văn bản
Tone	phong cách văn bản
Creativity	mức sáng tạo
Text input	nhập nội dung
Output	kết quả
Utility buttons	đọc, copy, clear



---

2. Danh sách Tone (cập nhật theo yêu cầu)

Tone options

default
academic
concise
emotional
friendly
formal
humorous
inspirational
nostalgic
ornate
presentation
professional
serious

Mô tả chức năng

Tone	Mục đích

default	văn bản bình thường
academic	văn phong học thuật
concise	ngắn gọn
emotional	giàu cảm xúc
friendly	thân thiện
formal	trang trọng
humorous	hài hước
inspirational	truyền cảm hứng
nostalgic	hoài niệm
ornate	hoa mỹ
presentation	phù hợp thuyết trình
professional	chuyên nghiệp
serious	nghiêm túc



---

3. Mode xử lý văn bản

Mode options

default
bilingual
correcting
mixing
rewriting
strictness
summarizing


---

4. Mode Bilingual (spec chi tiết)

Input

hi chào bạn. tôi muốn nói cái này

Output

hi chào bạn.
hi hello.

tôi muốn nói cái này
I want to talk about this.

Logic xử lý

1. Split sentence



input -> split by sentence

hi chào bạn.
tôi muốn nói cái này

2. Translate từng câu



sentence
translation

3. Output format



sentence_original
sentence_translation

4. Spacing



mỗi cặp câu cách nhau 1 line


A
B

C
D


---

5. Pagination

Theo yêu cầu:

REMOVE pagination

UI cần bỏ:

<  1/1  >

Thay bằng:

single output block


---

6. Functional Requirement (SRS style)

FR1 — Language Selection

User có thể chọn:

source_language
target_language

FR2 — Model Selection

User chọn model AI

Ví dụ

gemini-2.5-flash

FR3 — Mode Processing

User chọn mode xử lý:

bilingual
rewriting
summarizing
correcting
...

FR4 — Tone Control

Tone ảnh hưởng cách AI viết output.

FR5 — Creativity

3 mức:

low
default
high

FR6 — Input Limit

max: 5000 characters

FR7 — Output Tools

Buttons:

speak
copy
clear


---

7. UI Component Breakdown

Header

menu
notification
darkmode
history


---

Language selector

[ Vietnamese ] ⇄ [ Korean ]

Feature:

swap language


---

Text input

textarea
max: 5000 chars


---

Output area

result display


---

8. Data Model (frontend)

type TranslationRequest = {
  sourceLang: string
  targetLang: string
  text: string
  model: string
  mode: Mode
  tone: Tone
  creativity: "low" | "default" | "high"
}


---

9. Mode Bilingual Pseudocode

function bilingualTranslate(text):

  sentences = splitSentence(text)

  results = []

  for s in sentences:
      t = translate(s)

      results.append(s)
      results.append(t)
      results.append("")

  return join(results)


---

10. API Request Format

POST /api/translate

body

{
  "source_lang": "vi",
  "target_lang": "en",
  "text": "hi chào bạn. tôi muốn nói cái này",
  "mode": "bilingual",
  "tone": "friendly",
  "model": "gemini-2.5-flash",
  "creativity": "default"
}


---

11. Output Example

hi chào bạn.
hi hello.

tôi muốn nói cái này.
I want to talk about this.


---

Nếu bạn muốn, tôi có thể tiếp tục viết:

Full SRS document (chuẩn IEEE 830)

Full Next.js project architecture

Database schema

Prompt engineering cho Gemini

API design

AI pipeline


để bạn build project này production-ready.
