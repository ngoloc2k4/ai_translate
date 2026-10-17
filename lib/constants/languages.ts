export interface LanguageItem {
  code: string
  name: string
  viName: string
  koName: string
}

export const LANGUAGES: LanguageItem[] = [
  { code: "auto", name: "Auto Detect", viName: "Phát hiện ngôn ngữ", koName: "자동 감지" },
  { code: "vi", name: "Vietnamese", viName: "Tiếng Việt", koName: "베트남어" },
  { code: "en", name: "English", viName: "Tiếng Anh", koName: "영어" },
  { code: "ko", name: "Korean", viName: "Tiếng Hàn", koName: "한국어" },
  { code: "ja", name: "Japanese", viName: "Tiếng Nhật", koName: "일본어" },
  { code: "zh", name: "Chinese (Simplified)", viName: "Tiếng Trung (Giản thể)", koName: "중국어 (간체)" },
  { code: "zh-TW", name: "Chinese (Traditional)", viName: "Tiếng Trung (Phồn thể)", koName: "중국어 (번체)" },
  { code: "es", name: "Spanish", viName: "Tiếng Tây Ban Nha", koName: "스페인어" },
  { code: "fr", name: "French", viName: "Tiếng Pháp", koName: "프랑스어" },
  { code: "de", name: "German", viName: "Tiếng Đức", koName: "독일어" },
  { code: "it", name: "Italian", viName: "Tiếng Ý", koName: "이탈리아어" },
  { code: "pt", name: "Portuguese", viName: "Tiếng Bồ Đào Nha", koName: "포르투갈어" },
  { code: "ru", name: "Russian", viName: "Tiếng Nga", koName: "러시아어" },
  { code: "th", name: "Thai", viName: "Tiếng Thái", koName: "태국어" },
  { code: "id", name: "Indonesian", viName: "Tiếng Indonesia", koName: "인도네시아어" },
  { code: "ms", name: "Malay", viName: "Tiếng Mã Lai", koName: "말레이어" },
  { code: "hi", name: "Hindi", viName: "Tiếng Hindi", koName: "힌디어" },
  { code: "ar", name: "Arabic", viName: "Tiếng Ả Rập", koName: "아랍어" },
  { code: "tr", name: "Turkish", viName: "Tiếng Thổ Nhĩ Kỳ", koName: "터키어" },
  { code: "nl", name: "Dutch", viName: "Tiếng Hà Lan", koName: "네덜란드어" },
]

export const VOICE_LANGUAGE_MAP: Record<string, string> = {
  vi: "vi-VN",
  en: "en-US",
  ko: "ko-KR",
  ja: "ja-JP",
  zh: "zh-CN",
  "zh-TW": "zh-TW",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  it: "it-IT",
  pt: "pt-PT",
  ru: "ru-RU",
  th: "th-TH",
  id: "id-ID",
  ms: "ms-MY",
  hi: "hi-IN",
  ar: "ar-SA",
  tr: "tr-TR",
  nl: "nl-NL",
}

export function getLanguageName(code: string, locale: string = "vi"): string {
  const item = LANGUAGES.find((l) => l.code === code)
  if (!item) return code
  if (locale === "vi") return item.viName
  if (locale === "ko") return item.koName
  return item.name
}

export const LANGUAGE_MAP: Record<string, string> = Object.fromEntries(
  LANGUAGES.map((l) => [l.code, l.name])
)
