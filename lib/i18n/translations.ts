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
    invalidApiKey: "Chưa có API key, hãy nhập API key trong Settings.",
    translationError: "Dịch thất bại: ",
    textTooLong: "Văn bản vượt quá độ dài tối đa",

    // Settings
    apiKeyTitle: "Khóa API",
    geminiApiKey: "Khóa API Google Gemini",
    groqApiKey: "Khóa API Groq",
    done: "Xong",
    fontSize: "Cỡ chữ",
    fontSizeDesktop: "Cỡ chữ Desktop",
    fontSizeMobile: "Cỡ chữ Mobile",
    small: "Nhỏ",
    medium: "Trung bình",
    large: "Lớn",
    language: "Ngôn ngữ",

    // History
    todaysHistory: "Lịch sử hôm nay",
    today: "Hôm nay",
    yesterday: "Hôm qua",
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

    clipboardError: "Lỗi sao chép vào bộ nhớ tạm",
    copied: "Đã chép",
    providerGemini: "Google Gemini",
    providerGroq: "Groq",
    providerNvidia: "NVIDIA NIM",
    providerOpenrouter: "OpenRouter",
    providerCustom: "Custom",
    endpoint: "Endpoint",
    endpointPlaceholder: "Nhập endpoint API tùy chỉnh...",
    apiKeysPlaceholder: "Nhập khóa API cho {provider}...",
    customProviderName: "Tên nhà cung cấp tùy chỉnh",
    customEndpointUrl: "URL Endpoint tùy chỉnh",
    customModels: "Mô hình tùy chỉnh",
    modelsPlaceholder: "mô hình-1, mô hình-2",
    commaSeparated: "Danh sách mô hình cách nhau bằng dấu phẩy",
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
    invalidApiKey: "Missing API key, please fill it in settings.",
    translationError: "Translation failed: ",
    textTooLong: "Text exceeds maximum length",

    // Settings
    apiKeyTitle: "API Keys",
    geminiApiKey: "Google Gemini API Key",
    groqApiKey: "Groq API Key",
    done: "Done",
    fontSize: "Font Size",
    fontSizeDesktop: "Desktop Font Size",
    fontSizeMobile: "Mobile Font Size",
    small: "Small",
    medium: "Medium",
    large: "Large",
    language: "Language",

    // History
    todaysHistory: "Today's History",
    today: "Today",
    yesterday: "Yesterday",
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

    clipboardError: "Failed to copy to clipboard",
    copied: "Copied",
    providerGemini: "Google Gemini",
    providerGroq: "Groq",
    providerNvidia: "NVIDIA NIM",
    providerOpenrouter: "OpenRouter",
    providerCustom: "Custom",
    endpoint: "Endpoint",
    endpointPlaceholder: "Enter custom API endpoint...",
    apiKeysPlaceholder: "Enter API key for {provider}...",
    customProviderName: "Custom Provider Name",
    customEndpointUrl: "Custom Endpoint URL",
    customModels: "Custom Models",
    modelsPlaceholder: "model-1, model-2",
    commaSeparated: "Comma-separated model IDs",
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
    fontSizeDesktop: "데스크탑 글꼴 크기",
    fontSizeMobile: "모바일 글꼴 크기",
    small: "작게",
    medium: "중간",
    large: "크게",
    language: "언어",

    // History
    todaysHistory: "오늘의 기록",
    today: "오늘",
    yesterday: "어제",
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

    clipboardError: "클립보드 복사 실패",
    copied: "복사됨",
    providerGemini: "Google Gemini",
    providerGroq: "Groq",
    providerNvidia: "NVIDIA NIM",
    providerOpenrouter: "OpenRouter",
    providerCustom: "Custom",
    endpoint: "엔드포인트",
    endpointPlaceholder: "사용자 정의 API 엔드포인트 입력...",
    apiKeysPlaceholder: "{provider}용 API 키 입력...",
    customProviderName: "사용자 정의 공급자 이름",
    customEndpointUrl: "사용자 정의 엔드포인트 URL",
    customModels: "사용자 정의 모델",
    modelsPlaceholder: "모델-1, 모델-2",
    commaSeparated: "쉼표로 구분된 모델 ID",
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
