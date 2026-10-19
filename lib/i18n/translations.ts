export type Locale = "vi" | "en" | "ko"

export const translations = {
  vi: {
    // Header
    appTitle: "Translation Lab",
    workbench: "Dịch thuật",
    history: "Lịch sử",
    apiKeys: "Khóa API",
    docs: "Tài liệu",

    // Language selector
    from: "Từ",
    to: "Sang",
    sourceLanguage: "Ngôn ngữ nguồn",
    targetLanguage: "Ngôn ngữ đích",
    autoDetect: "Phát hiện ngôn ngữ",
    swapLanguages: "Đổi ngôn ngữ",
    swap: "Đổi chiều",
    searchLanguage: "Tìm kiếm ngôn ngữ...",
    noLanguagesFound: "Không tìm thấy ngôn ngữ",
    allLanguages: "Tất cả ngôn ngữ",
    popularLanguages: "Phổ biến",
    autoTranslate: "Tự động dịch",
    autoTranslateHint: "Tự động dịch sau 1s dừng gõ",
    clearText: "Xóa văn bản",

    // Provider & Model & Engine
    provider: "Nhà cung cấp",
    model: "Mô hình",
    aiEngine: "Động cơ dịch",
    advanced: "Nâng cao",
    advancedSettings: "Cấu hình AI & Nâng cao",
    quickSettings: "Tùy chọn nâng cao",

    // Tone & Mode
    tone: "Giọng điệu",
    mode: "Chế độ",
    creativity: "Sáng tạo",
    temperature: "Độ sáng tạo (Temperature)",
    temperatureHint: "0.0: Chính xác, nguyên bản • 0.7: Tự nhiên • 1.2: Linh hoạt, hoa mỹ",

    // Panels
    source: "Văn bản gốc",
    sourceTitle: "Văn bản gốc",
    translated: "Bản dịch",
    resultTitle: "Bản dịch",
    translatedText: "Bản dịch",

    // Actions
    translate: "Dịch",
    translating: "Đang dịch...",
    cancel: "Hủy",
    stop: "Dừng",
    copy: "Sao chép",
    copied: "Đã sao chép!",
    clear: "Xóa",
    paste: "Dán",
    speak: "Phát âm",
    share: "Chia sẻ",
    settings: "Cài đặt",
    done: "Hoàn tất",

    // Placeholders & Empty States
    startTyping: "Nhập hoặc dán văn bản cần dịch...",
    sourcePlaceholder: "Nhập hoặc dán văn bản cần dịch...",
    outputPlaceholder: "Bản dịch sẽ xuất hiện ở đây...",
    emptyStateTitle: "Bản dịch sẽ xuất hiện ở đây",
    emptyStateDesc: "Nhập hoặc dán văn bản phía trên rồi nhấn nút Dịch để bắt đầu.",

    // Status
    ready: "Sẵn sàng",
    streaming: "Đang truyền...",
    latency: "Độ trễ",
    providersReady: "{count}/5 nhà cung cấp sẵn sàng",

    // Stats
    chars: "Ký tự",
    words: "Từ",
    input: "Vào",
    output: "Ra",
    total: "Tổng",

    // Messages
    invalidApiKey: "Chưa cấu hình API Key. Vui lòng mở Cài đặt để thêm khóa.",
    translationError: "Dịch thất bại: ",
    textTooLong: "Văn bản vượt quá giới hạn 5.000 ký tự",

    // Settings
    apiKeyTitle: "Khóa API Nhà cung cấp",
    apiKeyDesc: "Cấu hình API Key trực tiếp. Khóa được lưu trữ an toàn ngay trên trình duyệt của bạn.",
    geminiApiKey: "Google Gemini API Key",
    groqApiKey: "Groq Cloud API Key",
    fontSize: "Cỡ chữ",
    fontSizeDesktop: "Cỡ chữ Desktop",
    fontSizeMobile: "Cỡ chữ Mobile",
    small: "Nhỏ",
    medium: "Vừa",
    large: "Lớn",
    language: "Ngôn ngữ giao diện",

    // History
    todaysHistory: "Lịch sử hôm nay",
    today: "Hôm nay",
    yesterday: "Hôm qua",
    clearAll: "Xóa toàn bộ",

    // Mobile nav
    navTranslate: "Dịch",
    navHistory: "Lịch sử",
    navSaved: "Đã lưu",
    navAPI: "API",

    // Tones (Humanized)
    toneDefault: "Tự nhiên (Mặc định)",
    toneFormal: "Trang trọng & Lịch sự",
    toneFriendly: "Thân mật & Gần gũi",
    toneAcademic: "Học thuật & Chuyên ngành",
    toneConcise: "Ngắn gọn & Súc tích",
    toneProfessional: "Chuyên nghiệp",
    toneHumorous: "Hài hước",
    toneEmotional: "Truyền cảm",
    toneInspirational: "Truyền cảm hứng",
    toneNostalgic: "Hoài niệm",
    toneOrnate: "Hoa mỹ, văn chương",
    tonePresentation: "Thuyết trình",
    toneSerious: "Nghiêm túc",

    // Modes (Humanized)
    modeDefault: "Mặc định (Dịch tiêu chuẩn)",
    modeBilingual: "Song ngữ (Kèm văn bản gốc)",
    modeBilingualParagraph: "Song ngữ theo từng đoạn",
    modeCorrecting: "Sửa lỗi ngữ pháp & Tối ưu",
    modeMixing: "Trộn ngôn ngữ giao tiếp",
    modeRewriting: "Viết lại văn phong tự nhiên",
    modeStrictness: "Dịch sát nghĩa tuyệt đối",
    modeSummarizing: "Tóm tắt & Dịch cô đọng",

    // Creativity
    creativityLow: "Chính xác",
    creativityDefault: "Cân bằng",
    creativityHigh: "Sáng tạo",

    clipboardError: "Không thể truy cập bộ nhớ tạm",
    providerGemini: "Google Gemini",
    providerGroq: "Groq",
    providerNvidia: "NVIDIA NIM",
    providerOpenrouter: "OpenRouter",
    providerCustom: "Custom Provider",
    endpoint: "Endpoint",
    endpointPlaceholder: "Nhập endpoint API tùy chỉnh...",
    apiKeysPlaceholder: "Nhập khóa API cho {provider}...",
    customProviderName: "Tên nhà cung cấp",
    customApiKey: "Khóa API tùy chỉnh (Bearer Token)",
    customEndpointUrl: "URL Endpoint tùy chỉnh",
    customModels: "Mô hình tùy chỉnh",
    modelsPlaceholder: "model-1, model-2",
    commaSeparated: "Danh sách model phân tách bằng dấu phẩy",
  },

  en: {
    // Header
    appTitle: "Translation Lab",
    workbench: "Translate",
    history: "History",
    apiKeys: "API Keys",
    docs: "Docs",

    // Language selector
    from: "From",
    to: "To",
    sourceLanguage: "Source Language",
    targetLanguage: "Target Language",
    autoDetect: "Auto Detect",
    swapLanguages: "Swap languages",
    swap: "Swap",
    searchLanguage: "Search language...",
    noLanguagesFound: "No languages found for",
    allLanguages: "All Languages",
    popularLanguages: "Popular",
    autoTranslate: "Auto-translate",
    autoTranslateHint: "Auto-translate 1s after typing stops",
    clearText: "Clear text",

    // Provider & Model & Engine
    provider: "AI Provider",
    model: "Model",
    aiEngine: "Translation Engine",
    advanced: "Advanced",
    advancedSettings: "AI Engine & Settings",
    quickSettings: "Advanced settings",

    // Tone & Mode
    tone: "Tone",
    mode: "Mode",
    creativity: "Creativity",
    temperature: "Creativity (Temperature)",
    temperatureHint: "0.0: Precise & literal • 0.7: Natural • 1.2: Highly creative",

    // Panels
    source: "Original text",
    sourceTitle: "Original text",
    translated: "Translation",
    resultTitle: "Translation",
    translatedText: "Translation",

    // Actions
    translate: "Translate",
    translating: "Translating...",
    cancel: "Cancel",
    stop: "Stop",
    copy: "Copy",
    copied: "Copied!",
    clear: "Clear",
    paste: "Paste",
    speak: "Listen",
    share: "Share",
    settings: "Settings",
    done: "Done",

    // Placeholders & Empty States
    startTyping: "Enter or paste text to translate...",
    sourcePlaceholder: "Enter or paste text to translate...",
    outputPlaceholder: "Translation will appear here...",
    emptyStateTitle: "Translation will appear here",
    emptyStateDesc: "Enter or paste text above and tap Translate to start.",

    // Status
    ready: "Ready",
    streaming: "Streaming...",
    latency: "Latency",
    providersReady: "{count}/5 providers configured",

    // Stats
    chars: "Chars",
    words: "Words",
    input: "Input",
    output: "Output",
    total: "Total",

    // Messages
    invalidApiKey: "API Key not configured. Please open Settings to add keys.",
    translationError: "Translation failed: ",
    textTooLong: "Text exceeds maximum 5,000 characters",

    // Settings
    apiKeyTitle: "Provider API Keys",
    apiKeyDesc: "Configure API keys directly. Keys are securely stored in your local browser.",
    geminiApiKey: "Google Gemini API Key",
    groqApiKey: "Groq Cloud API Key",
    fontSize: "Font Size",
    fontSizeDesktop: "Desktop Font Size",
    fontSizeMobile: "Mobile Font Size",
    small: "Small",
    medium: "Medium",
    large: "Large",
    language: "Interface Language",

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

    // Tones (Humanized)
    toneDefault: "Natural (Default)",
    toneFormal: "Formal & Polite",
    toneFriendly: "Friendly & Casual",
    toneAcademic: "Academic & Technical",
    toneConcise: "Concise & Direct",
    toneProfessional: "Professional",
    toneHumorous: "Humorous",
    toneEmotional: "Emotional",
    toneInspirational: "Inspirational",
    toneNostalgic: "Nostalgic",
    toneOrnate: "Ornate & Literary",
    tonePresentation: "Presentation",
    toneSerious: "Serious",

    // Modes (Humanized)
    modeDefault: "Default (Standard Translation)",
    modeBilingual: "Bilingual (With original text)",
    modeBilingualParagraph: "Bilingual (Paragraph by paragraph)",
    modeCorrecting: "Proofread & Correct",
    modeMixing: "Language Mix",
    modeRewriting: "Natural Rewrite",
    modeStrictness: "Strict & Literal",
    modeSummarizing: "Summarize & Translate",

    // Creativity
    creativityLow: "Precise",
    creativityDefault: "Balanced",
    creativityHigh: "Creative",

    clipboardError: "Clipboard access failed",
    providerGemini: "Google Gemini",
    providerGroq: "Groq",
    providerNvidia: "NVIDIA NIM",
    providerOpenrouter: "OpenRouter",
    providerCustom: "Custom Provider",
    endpoint: "Endpoint",
    endpointPlaceholder: "Enter custom API endpoint...",
    apiKeysPlaceholder: "Enter API key for {provider}...",
    customProviderName: "Custom Provider Name",
    customApiKey: "Custom API Key (Bearer Token)",
    customEndpointUrl: "Custom Endpoint URL",
    customModels: "Custom Models",
    modelsPlaceholder: "model-1, model-2",
    commaSeparated: "Comma-separated model IDs",
  },

  ko: {
    // Header
    appTitle: "Translation Lab",
    workbench: "번역",
    history: "기록",
    apiKeys: "API 키",
    docs: "문서",

    // Language selector
    from: "출발어",
    to: "도착어",
    sourceLanguage: "원본 언어",
    targetLanguage: "목표 언어",
    autoDetect: "자동 감지",
    swapLanguages: "언어 교환",
    swap: "교환",
    searchLanguage: "언어 검색...",
    noLanguagesFound: "일치하는 언어를 찾을 수 없습니다:",
    allLanguages: "모든 언어",
    popularLanguages: "인기 언어",
    autoTranslate: "자동 번역",
    autoTranslateHint: "입력 중지 1초 후 자동 번역",
    clearText: "텍스트 지우기",

    // Provider & Model & Engine
    provider: "AI 공급자",
    model: "모델",
    aiEngine: "번역 엔진",
    advanced: "고급",
    advancedSettings: "AI 엔진 및 상세 설정",
    quickSettings: "고급 설정",

    // Tone & Mode
    tone: "어조",
    mode: "모드",
    creativity: "창의성",
    temperature: "창의성 (Temperature)",
    temperatureHint: "0.0: 정확하고 직역 • 0.7: 자연스러움 • 1.2: 풍부하고 창의적",

    // Panels
    source: "원문",
    sourceTitle: "원문",
    translated: "번역문",
    resultTitle: "번역문",
    translatedText: "번역문",

    // Actions
    translate: "번역",
    translating: "번역 중...",
    cancel: "취소",
    stop: "중지",
    copy: "복사",
    copied: "복사됨!",
    clear: "지우기",
    paste: "붙여넣기",
    speak: "듣기",
    share: "공유",
    settings: "설정",
    done: "완료",

    // Placeholders & Empty States
    startTyping: "번역할 텍스트를 입력하거나 붙여넣으세요...",
    sourcePlaceholder: "번역할 텍스트를 입력하거나 붙여넣으세요...",
    outputPlaceholder: "번역 결과가 여기에 표시됩니다...",
    emptyStateTitle: "번역 결과가 여기에 표시됩니다",
    emptyStateDesc: "위 영역에 텍스트를 입력하고 번역 버튼을 누르세요.",

    // Status
    ready: "준비됨",
    streaming: "스트리밍 중...",
    latency: "지연 시간",
    providersReady: "{count}/5개 공급자 준비됨",

    // Stats
    chars: "문자",
    words: "단어",
    input: "입력",
    output: "출력",
    total: "합계",

    // Messages
    invalidApiKey: "API 키가 설정되지 않았습니다. 설정에서 키를 추가하세요.",
    translationError: "번역 실패: ",
    textTooLong: "텍스트가 최대 5,000자를 초과했습니다",

    // Settings
    apiKeyTitle: "공급자 API 키",
    apiKeyDesc: "API 키를 직접 설정하세요. 키는 브라우저에 안전하게 저장됩니다.",
    geminiApiKey: "Google Gemini API 키",
    groqApiKey: "Groq Cloud API 키",
    fontSize: "글꼴 크기",
    fontSizeDesktop: "데스크톱 글꼴 크기",
    fontSizeMobile: "모바일 글꼴 크기",
    small: "작게",
    medium: "보통",
    large: "크게",
    language: "인터페이스 언어",

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

    // Tones (Humanized)
    toneDefault: "자연스러움 (기본)",
    toneFormal: "격식체 & 정중함",
    toneFriendly: "친근함 & 대화체",
    toneAcademic: "학술 & 전문적",
    toneConcise: "간결 & 명확함",
    toneProfessional: "비즈니스 전문",
    toneHumorous: "유머러스함",
    toneEmotional: "감성적",
    toneInspirational: "영감을 주는",
    toneNostalgic: "향수를 자극하는",
    toneOrnate: "문학적 & 화려함",
    tonePresentation: "발표용",
    toneSerious: "진지함",

    // Modes (Humanized)
    modeDefault: "기본 (표준 번역)",
    modeBilingual: "이중 언어 (원문 병기)",
    modeBilingualParagraph: "문단별 이중 언어",
    modeCorrecting: "문법 교정 & 수정",
    modeMixing: "언어 혼합",
    modeRewriting: "자연스러운 문장 재작성",
    modeStrictness: "엄격한 직역",
    modeSummarizing: "요약 및 번역",

    // Creativity
    creativityLow: "정확성",
    creativityDefault: "균형",
    creativityHigh: "창의적",

    clipboardError: "클립보드 복사 실패",
    providerGemini: "Google Gemini",
    providerGroq: "Groq",
    providerNvidia: "NVIDIA NIM",
    providerOpenrouter: "OpenRouter",
    providerCustom: "Custom Provider",
    endpoint: "엔드포인트",
    endpointPlaceholder: "사용자 정의 API 엔드포인트 입력...",
    apiKeysPlaceholder: "{provider}용 API 키 입력...",
    customProviderName: "공급자 이름",
    customApiKey: "사용자 정의 API 키 (Bearer Token)",
    customEndpointUrl: "사용자 정의 엔드포인트 URL",
    customModels: "사용자 정의 모델",
    modelsPlaceholder: "model-1, model-2",
    commaSeparated: "쉼표로 구분된 모델 ID 목록",
  },
} as const
