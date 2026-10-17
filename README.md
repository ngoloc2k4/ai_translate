# AI Translation Lab

Ứng dụng web dịch thuật AI hiện đại, đa nhà cung cấp, tập trung vào trải nghiệm dịch thuật nhanh chóng, trực quan và bảo mật.

## ✨ Tính năng nổi bật

- **Đa nhà cung cấp AI**: Hỗ trợ Google Gemini, Groq, NVIDIA NIM, OpenRouter và Custom OpenAI-compatible endpoint.
- **Giao diện Translation-First**: Tối ưu cho thiết bị di động và máy tính, tốc độ phản hồi tức thì với Streaming SSE.
- **Tùy biến văn phong**: Hỗ trợ nhiều chế độ dịch (Song ngữ, Sửa lỗi ngữ pháp, Viết lại tự nhiên, Tóm tắt) và các giọng điệu (Trang trọng, Thân mật, Học thuật...).
- **Bảo mật & Riêng tư**: API Key được lưu trực tiếp trên trình duyệt (LocalStorage), có hỗ trợ chìa khóa quản lý từ phía máy chủ (Server-side keys).
- **Lịch sử dịch**: Lưu trữ cục bộ, dễ dàng sao chép, nghe phát âm và dịch lại.

## 🚀 Khởi chạy ứng dụng

### 1. Cài đặt phụ thuộc
```bash
bun install
```

### 2. Cấu hình môi trường (Tùy chọn)
Tạo file `.env.local` nếu muốn sử dụng API key phía server:
```env
# Server-side API Keys (Tùy chọn)
GEMINI_API_KEY=AIza...
GROQ_API_KEY=gsk_...
NVIDIA_API_KEY=nvapi-...
OPENROUTER_API_KEY=sk-or-...

# Mật khẩu quản trị máy chủ (Tùy chọn)
APP_PASSWORD=your-secret-password
```
> **Mẹo**: Bạn cũng có thể nhập API Key trực tiếp trong menu **Cài đặt (Settings)** ngay trên giao diện web mà không cần cấu hình file `.env.local`.

### 3. Chạy môi trường phát triển
```bash
bun dev
```
Mở trình duyệt tại [http://localhost:3000](http://localhost:3000) để bắt đầu dịch.

## 🛠️ Công nghệ sử dụng

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, Dark Theme
- **State Management**: Zustand
- **Runtime & Package Manager**: Bun
- **Triển khai**: Vercel
