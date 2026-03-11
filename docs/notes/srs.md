---

# AI Translate Web Application

Version: 1.1
Date: 2026-03-06
Author: Loc Ngo

---

# 1. Introduction

## 1.1 Purpose

Tài liệu này mô tả chi tiết yêu cầu chức năng và phi chức năng của hệ thống **AI Translate Web Application**.

Ứng dụng cung cấp công cụ dịch thuật sử dụng **Large Language Models (LLM)** như:

- Google Gemini
- Groq (Llama models)

Hệ thống được thiết kế theo nguyên tắc:

- **Zero infrastructure cost**
- **Privacy-first**
- **Bring Your Own Key (BYOK)**

Người dùng sử dụng **API Key cá nhân**, hệ thống không lưu trữ dữ liệu trên server.

---

## 1.2 Scope

AI Translate Web Application là một **web-based translation assistant** với các khả năng:

- dịch văn bản
- paraphrase
- giải thích ngữ pháp
- tóm tắt văn bản
- điều chỉnh tone và creativity của bản dịch

Ứng dụng hoạt động trên:

- Desktop browser
- Mobile browser

Deployment environment:

- **Vercel serverless platform**

---

## 1.3 Definitions

| Term | Meaning |
| --- | --- |
| BYOK | Bring Your Own Key – người dùng cung cấp API key |
| LLM | Large Language Model |
| API Provider | Dịch vụ AI như Gemini hoặc Groq |
| Streaming | Hiển thị kết quả từng phần khi model đang generate |
| LocalStorage | Storage trên browser |

---

# 2. System Overview

## 2.1 Product Perspective

Ứng dụng sử dụng kiến trúc **serverless full-stack** dựa trên Next.js.

Architecture layers:

```
Browser (Client)
       ↓
Next.js Frontend
       ↓
Next.js API Routes
       ↓
LLM Providers
```

Không sử dụng:

- Database
- Server state
- User authentication

---

## 2.2 System Goals

Mục tiêu hệ thống:

1. cung cấp dịch thuật AI chất lượng cao
2. không lưu dữ liệu người dùng
3. chi phí vận hành bằng 0
4. tối ưu trải nghiệm realtime

---

## 2.3 User Characteristics

Người dùng mục tiêu:

- developers
- translators
- language learners
- content writers

Người dùng cần biết cách lấy API key từ:

- Google AI Studio
- Groq Console

---

## 2.4 Constraints

| Constraint | Description |
| --- | --- |
| Deployment | Vercel free tier |
| Storage | Browser LocalStorage |
| AI providers | Gemini / Groq |
| Backend | Serverless API |

---

# 3. Functional Requirements

---

# 3.1 API Key Management (BYOK)

### FR-01 Add API Key

Người dùng có thể nhập API Key cho từng provider.

Supported providers:

- Google Gemini
- Groq

---

### FR-02 Store API Key

API key được lưu trong browser:

```
localStorage
```

Key name:

```
ai_translate_keys
```

---

### FR-03 Update / Delete Key

User có thể:

- cập nhật key
- xóa key

---

### FR-04 Key Validation

Server API phải kiểm tra format key trước khi gọi provider.

Ví dụ:

Gemini:

```
AIza...
```

Groq:

```
gsk_...
```

---

# 3.2 Translation

---

### FR-05 Input Text

Người dùng nhập văn bản cần xử lý.

Supported input:

- sentence
- paragraph
- document text

---

### FR-06 Source Language

Người dùng có thể chọn:

```
Auto detect
```

hoặc chọn thủ công.

---

### FR-07 Target Language

Người dùng chọn ngôn ngữ đích từ dropdown.

Ví dụ:

- English
- Vietnamese
- Korean
- Japanese
- Chinese

---

### FR-08 Select Provider

User chọn provider:

```
Gemini
Groq
```

---

### FR-09 Select Model

User chọn model.

Ví dụ:

Gemini

```
gemini-1.5-flash
gemini-1.5-pro
```

Groq

```
llama3-8b
mixtral-8x7b
```

---

### FR-10 Translation Request

Khi user nhấn **Translate**, client gửi request:

```
POST /api/translate
```

Body:

```json
{
  "text": "Hello",
  "targetLang": "Vietnamese",
  "provider": "gemini",
  "apiKey": "user_api_key",
  "options": {}
}
```

---

### FR-11 Streaming Response

API phải hỗ trợ **streaming response** để hiển thị text theo thời gian thực.

---

# 3.3 Translation Options

---

## FR-12 Tone Selection

User có thể chọn tone của bản dịch.

Available tones:

```
default
formal
casual
creative
academic
```

---

## FR-13 Translation Mode

Available modes:

```
translate
paraphrase
explain
summarize
```

---

## FR-14 Creativity Level

User có thể chỉnh **temperature**.

Presets:

| Mode | Temperature |
| --- | --- |
| Precise | 0.1 |
| Balanced | 0.5 |
| Creative | 0.9 |

---

# 3.4 Translation History

---

### FR-15 Save History

Sau khi dịch xong, hệ thống lưu lịch sử vào:

```
localStorage
```

---

### FR-16 History Structure

```json
{
  "date": "2026-03-06",
  "items": []
}
```

---

### FR-17 Daily Reset

Khi app load:

```
if history.date < today
  clear history
```

---

### FR-18 Copy Result

User có thể copy kết quả.

---

### FR-19 Cached Result

Nếu user dịch cùng câu trong ngày:

```
return cached result
```

---

# 3.5 Advanced Features

---

### FR-20 Grammar Explanation

Mode **Explain** hiển thị:

```
Translation
Explanation
```

---

### FR-21 Text Summarization

Mode **Summarize**:

- dịch
- tóm tắt nội dung

---

# 4. Non Functional Requirements

---

# 4.1 Performance

- UI không bị blocking
- response streaming dưới 2s khi provider phản hồi

---

# 4.2 Security

System phải đảm bảo:

- không lưu API key server
- không lưu translation data server

---

### Security Measures

- API key format validation
- rate limiting
- input length limit

---

# 4.3 Rate Limiting

API cần giới hạn request:

```
10 requests / minute / IP
```

---

# 4.4 Scalability

Serverless architecture cho phép:

- scale tự động
- không quản lý server

---

# 4.5 Maintainability

Source code quản lý trên:

```
GitHub
```

Deployment:

```
Vercel CI/CD
```

---

# 4.6 Usability

UI phải:

- responsive
- mobile friendly
- dark mode compatible

---

# 5. System Architecture

## 5.1 High Level Architecture

```
User Browser
     │
     ▼
Next.js Frontend
     │
     ▼
Next.js API Routes
     │
     ▼
AI Providers
```

---

## 5.2 Data Flow

```
User input text
     ↓
Frontend send API request
     ↓
API route build prompt
     ↓
API call LLM
     ↓
stream response
     ↓
UI render result
     ↓
save history
```

---

# 6. Data Design

---

# 6.1 API Keys Storage

localStorage key:

```
ai_translate_keys
```

Value:

```json
{
  "gemini": "AIza...",
  "groq": "gsk_..."
}
```

---

# 6.2 Translation History

localStorage key:

```
ai_translate_history
```

Structure:

```json
{
  "date": "2026-03-06",
  "items": [
    {
      "id": "timestamp",
      "sourceText": "Hello",
      "translatedText": "Xin chào",
      "sourceLang": "en",
      "targetLang": "vi",
      "provider": "gemini",
      "time": "10:30"
    }
  ]
}
```

---

# 7. UI Design

---

## Main Screen

Layout:

```
+----------------------------------+
| Header (App name + settings)     |
+----------------------------------+

Source Text

[ textarea ]

Provider / Model

Language selector

[ Translate button ]

-----------------------------------

Translated Result

-----------------------------------

History (today)
```

---

## Settings Modal

Fields:

```
Gemini API Key
Groq API Key
```

Buttons:

```
Save
Clear
```

---

# 8. Error Handling

---

### ER-01 Invalid API Key

UI message:

```
Invalid API key
```

---

### ER-02 Provider Quota Exceeded

```
Provider quota reached
```

---

### ER-03 Network Error

```
Network error. Please retry.
```

---

# 9. Technology Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 14 |
| Styling | TailwindCSS |
| State | React Hooks |
| AI SDK | Vercel AI SDK |
| Deployment | Vercel |
| Storage | LocalStorage |

---

# 10. Future Enhancements

Planned features:

- speech-to-text translation
- text-to-speech
- multi-language chat translation
- document translation
- browser extension

---

# Conclusion

AI Translate Web Application được thiết kế với mục tiêu:

- **privacy-first**
- **zero infrastructure cost**
- **LLM-powered translation**

Hệ thống tận dụng khả năng của các LLM hiện đại để cung cấp trải nghiệm dịch thuật linh hoạt và mạnh mẽ.

---

Nếu muốn, tôi có thể tiếp tục giúp bạn viết thêm:

- **Project architecture document (rất quan trọng khi open-source)**
- **Prompt engineering spec cho translator (giúp dịch tốt hơn Google Translate)**
- **Next.js folder structure chuẩn production**
- **API route code hoàn chỉnh Gemini + Groq + streaming**.

Những phần này sẽ giúp project của bạn **trông như production-grade SaaS thay vì side project**.

---
