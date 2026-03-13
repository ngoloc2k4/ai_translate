export type Locale = "vi" | "en" | "ko"

export const translations = {
  vi: {
    // Header
    appTitle: "AI Translation Lab",
    workbench: "Bàn làm việc",
    history: "Lịch sử",
    apiKeys: "Khóa API",
    docs: "Tài liệu",
    
    // Language selector
    sourceLanguage: "Ngôn ngữ nguồn",
    targetLanguage: "Ngôn ngữ đích",
    autoDetect: "Tự động phát hiện",
    swapLanguages: "Đổi ngôn ngữ",
    
    // Provider & Model
    provider: "Nhà cung cấp",
    model: "Mô hình",
    
    // Tone & Mode
    tone: "Giọng điệu",
    mode: "Chế độ",
    creativity: "Sáng tạo",
    
    // Actions
    translate: "DỊCH",
    cancel: "HỦY",
    stop: "Dừng",
    copy: "Sao chép",
    clear: "Xóa",
    speak: "Đọc",
    share: "Chia sẻ",
    settings: "Cài đặt",
    
    // Placeholders
    sourcePlaceholder: "Dán văn bản nguồn hoặc tài liệu kỹ thuật vào đây...",
    outputPlaceholder: "Bản dịch sẽ xuất hiện ở đây...",
    
    // Status
    ready: "Sẵn sàng",
    translating: "Đang dịch...",
    streaming: "Đang truyền",
    latency: "ĐỘ TRỄ",
    
    // Stats
    chars: "KÝ TỰ",
    input: "VÀO",
    output: "RA",
    total: "TỔNG",
    
    // Messages
    invalidApiKey: "Vui lòng đặt khóa API của bạn trong cài đặt",
    translationError: "Dịch thất bại: ",
    textTooLong: "Văn bản vượt quá độ dài tối đa",
    
    // Settings
    apiKeyTitle: "Khóa API",
    geminiApiKey: "Khóa API Google Gemini",
    groqApiKey: "Khóa API Groq",
    done: "Xong",
    fontSize: "Cỡ chữ",
    small: "Nhỏ",
    medium: "Trung bình",
    large: "Lớn",
    language: "Ngôn ngữ",
    
    // History
    todaysHistory: "Lịch sử hôm nay",
    clearAll: "Xóa tất cả",
    
    // Mobile nav
    navTranslate: "Dịch",
    navHistory: "Lịch sử",
    navSaved: "Đã lưu",
    navAPI: "API",
    
    // Tones
    toneDefault: "Mặc định",
    toneAcademic: "Học thuật",
    toneConcise: "Ngắn gọn",
    toneEmotional: "Cảm xúc",
    toneFriendly: "Thân thiện",
    toneFormal: "Trang trọng",
    toneHumorous: "Hài hước",
    toneInspirational: "Truyền cảm hứng",
    toneNostalgic: "Hoài niệm",
    toneOrnate: "Hoa mỹ",
    tonePresentation: "Thuyết trình",
    toneProfessional: "Chuyên nghiệp",
    toneSerious: "Nghiêm túc",
    
    // Modes
    modeDefault: "Mặc định",
    modeBilingual: "Song ngữ",
    modeBilingualParagraph: "Song ngữ (đoạn)",
    modeCorrecting: "Sửa lỗi",
    modeMixing: "Trộn ngôn ngữ",
    modeRewriting: "Viết lại",
    modeStrictness: "Nghiêm ngặt",
    modeSummarizing: "Tóm tắt",
    
    // Creativity
    creativityLow: "Thấp",
    creativityDefault: "Mặc định",
    creativityHigh: "Cao",

    // Providers
    providerGemini: "Google Gemini",
    providerGroq: "Groq",
    providerNvidia: "NVIDIA NIM",
    providerOpenrouter: "OpenRouter",
    providerCustom: "Custom",
  },
  en: {
    // Header
    appTitle: "AI Translation Lab",
    workbench: "Workbench",
    history: "History",
    apiKeys: "API Keys",
    docs: "Docs",
    
    // Language selector
    sourceLanguage: "Source Language",
    targetLanguage: "Target Language",
    autoDetect: "Auto detect",
    swapLanguages: "Swap languages",
    
    // Provider & Model
    provider: "Provider",
    model: "Model",
    
    // Tone & Mode
    tone: "Tone",
    mode: "Mode",
    creativity: "Creativity",
    
    // Actions
    translate: "TRANSLATE",
    cancel: "CANCEL",
    stop: "Stop",
    copy: "Copy",
    clear: "Clear",
    speak: "Read",
    share: "Share",
    settings: "Settings",
    
    // Placeholders
    sourcePlaceholder: "Paste source text or technical documentation here...",
    outputPlaceholder: "Translation will appear here...",
    
    // Status
    ready: "Ready",
    translating: "Translating...",
    streaming: "Streaming",
    latency: "LATENCY",
    
    // Stats
    chars: "CHARS",
    input: "IN",
    output: "OUT",
    total: "TOTAL",
    
    // Messages
    invalidApiKey: "Please set your API key in settings",
    translationError: "Translation failed: ",
    textTooLong: "Text exceeds maximum length",
    
    // Settings
    apiKeyTitle: "API Keys",
    geminiApiKey: "Google Gemini API Key",
    groqApiKey: "Groq API Key",
    done: "Done",
    fontSize: "Font Size",
    small: "Small",
    medium: "Medium",
    large: "Large",
    language: "Language",
    
    // History
    todaysHistory: "Today's History",
    clearAll: "Clear All",
    
    // Mobile nav
    navTranslate: "Translate",
    navHistory: "History",
    navSaved: "Saved",
    navAPI: "API",
    
    // Tones
    toneDefault: "Default",
    toneAcademic: "Academic",
    toneConcise: "Concise",
    toneEmotional: "Emotional",
    toneFriendly: "Friendly",
    toneFormal: "Formal",
    toneHumorous: "Humorous",
    toneInspirational: "Inspirational",
    toneNostalgic: "Nostalgic",
    toneOrnate: "Ornate",
    tonePresentation: "Presentation",
    toneProfessional: "Professional",
    toneSerious: "Serious",
    
    // Modes
    modeDefault: "Default",
    modeBilingual: "Bilingual",
    modeBilingualParagraph: "Bilingual (Paragraph)",
    modeCorrecting: "Correcting",
    modeMixing: "Mixing",
    modeRewriting: "Rewriting",
    modeStrictness: "Strictness",
    modeSummarizing: "Summarizing",
    
    // Creativity
    creativityLow: "Low",
    creativityDefault: "Default",
    creativityHigh: "High",

    // Providers
    providerGemini: "Google Gemini",
    providerGroq: "Groq",
    providerNvidia: "NVIDIA NIM",
    providerOpenrouter: "OpenRouter",
    providerCustom: "Custom",
  },
  ko: {
    // Header
    appTitle: "AI 번역 연구실",
    workbench: "워크벤치",
    history: "기록",
    apiKeys: "API 키",
    docs: "문서",
    
    // Language selector
    sourceLanguage: "원본 언어",
    targetLanguage: "목표 언어",
    autoDetect: "자동 감지",
    swapLanguages: "언어 교환",
    
    // Provider & Model
    provider: "공급자",
    model: "모델",
    
    // Tone & Mode
    tone: "어조",
    mode: "모드",
    creativity: "창의성",
    
    // Actions
    translate: "번역",
    cancel: "취소",
    stop: "중지",
    copy: "복사",
    clear: "지우기",
    speak: "읽기",
    share: "공유",
    settings: "설정",
    
    // Placeholders
    sourcePlaceholder: "원본 텍스트 또는 기술 문서를 여기에 붙여넣으세요...",
    outputPlaceholder: "번역 결과가 여기에 표시됩니다...",
    
    // Status
    ready: "준비됨",
    translating: "번역 중...",
    streaming: "스트리밍",
    latency: "지연 시간",
    
    // Stats
    chars: "문자",
    input: "입력",
    output: "출력",
    total: "합계",
    
    // Messages
    invalidApiKey: "설정에서 API 키를 설정해주세요",
    translationError: "번역 실패: ",
    textTooLong: "텍스트가 최대 길이를 초과했습니다",
    
    // Settings
    apiKeyTitle: "API 키",
    geminiApiKey: "Google Gemini API 키",
    groqApiKey: "Groq API 키",
    done: "완료",
    fontSize: "글자 크기",
    small: "작게",
    medium: "중간",
    large: "크게",
    language: "언어",
    
    // History
    todaysHistory: "오늘의 기록",
    clearAll: "모두 지우기",
    
    // Mobile nav
    navTranslate: "번역",
    navHistory: "기록",
    navSaved: "저장됨",
    navAPI: "API",
    
    // Tones
    toneDefault: "기본",
    toneAcademic: "학술적",
    toneConcise: "간결한",
    toneEmotional: "감정적인",
    toneFriendly: "친근한",
    toneFormal: "격식있는",
    toneHumorous: "유머러스한",
    toneInspirational: "영감을 주는",
    toneNostalgic: "향수어린",
    toneOrnate: "화려한",
    tonePresentation: "프레젠테이션",
    toneProfessional: "전문적인",
    toneSerious: "진지한",
    
    // Modes
    modeDefault: "기본",
    modeBilingual: "이중 언어",
    modeBilingualParagraph: "이중 언어 (단락)",
    modeCorrecting: "수정",
    modeMixing: "혼합",
    modeRewriting: "재작성",
    modeStrictness: "엄격함",
    modeSummarizing: "요약",
    
    // Creativity
    creativityLow: "낮음",
    creativityDefault: "기본",
    creativityHigh: "높음",

    // Providers
    providerGemini: "Google Gemini",
    providerGroq: "Groq",
    providerNvidia: "NVIDIA NIM",
    providerOpenrouter: "OpenRouter",
    providerCustom: "Custom",
  },
} as const

export const LANGUAGE_FLAGS: Record<string, string> = {
  auto: "🌐",
  vi: "🇻🇳",
  en: "🇬🇧",
  ko: "🇰🇷",
  ja: "🇯🇵",
  zh: "🇨🇳",
  "zh-TW": "🇹🇼",
  es: "🇪🇸",
  fr: "🇫🇷",
  de: "🇩🇪",
  it: "🇮🇹",
  pt: "🇵🇹",
  ru: "🇷🇺",
  th: "🇹🇭",
  id: "🇮🇩",
  ms: "🇲🇾",
  hi: "🇮🇳",
  ar: "🇸🇦",
  tr: "🇹🇷",
  nl: "🇳🇱",
}
