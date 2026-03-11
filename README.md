# AI Translation Lab

A modern, multi-provider AI translation web application built with Next.js 16, React 19, and TypeScript. Translate text using multiple AI providers with advanced features including tone customization, translation modes, and creativity controls.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Bun](https://img.shields.io/badge/Bun-1.0-orange?logo=bun)

## ✨ Features

- **Multi-Provider Support**: Google Gemini, Groq, NVIDIA NIM, OpenRouter, and custom OpenAI-compatible providers
- **Advanced Controls**: 13 tones, 8 translation modes, creativity levels
- **Streaming Responses**: Real-time translation output with SSE
- **Translation History**: LocalStorage-based history with daily reset
- **Multi-Language UI**: Vietnamese, English, Korean
- **Security**: Input sanitization, server-side API key validation, rate limiting (10 req/min)
- **Responsive Design**: Dark-themed UI with Tailwind CSS v4

## 🚀 Quick Start

### Prerequisites
- [Bun](https://bun.sh/) 1.0+ or Node.js 18+
- API key for your preferred AI provider

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/ai_translate.git
cd ai_translate

# Install dependencies
bun install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your API keys

# Start development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to start translating.

## 📖 Usage

### 1. Configure API Keys

Click the **Settings** icon (⚙️) and enter your API keys:
- **Google Gemini**: [Get key](https://makersuite.google.com/app/apikey)
- **Groq**: [Get key](https://console.groq.com/keys)
- **NVIDIA NIM**: [Get key](https://build.nvidia.com/)
- **OpenRouter**: [Get key](https://openrouter.ai/keys)

Or set server-side keys in `.env.local`:
```bash
GEMINI_API_KEY=AIza...
GROQ_API_KEY=gsk_...
NVIDIA_API_KEY=nvapi-...
OPENROUTER_API_KEY=sk-or-...
```

### 2. Translate Text

1. Select source and target languages
2. Choose AI provider and model
3. Customize tone, mode, and creativity
4. Enter text and click **Translate**

### 3. View History

Access translation history at `/history` with options to:
- Reuse and edit previous translations
- Translate again with different settings
- Delete individual entries

## 🏗️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16.1.6 (App Router) |
| Language | TypeScript 5.x |
| UI Library | React 19.2.3 |
| Styling | Tailwind CSS v4 |
| Package Manager | Bun |
| Linting | ESLint 9.x |

## 📁 Project Structure

```
ai_translate/
├── app/                      # Next.js App Router
│   ├── api/translate/       # Translation API endpoint
│   ├── history/             # History page
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page (Workbench)
├── components/
│   └── TranslatorPanel.tsx  # Main translation UI
├── hooks/
│   ├── useHistory.ts        # Translation history hook
│   ├── useLocalStorage.ts   # LocalStorage hook
│   └── useTranslation.ts    # Translation logic hook
├── lib/
│   ├── ai/
│   │   ├── prompt/          # Prompt building & schemas
│   │   └── providers/       # Provider implementations
│   ├── utils/
│   │   ├── sanitizeInput.ts # Input sanitization
│   │   ├── validateKey.ts   # API key validation
│   │   └── logger.ts        # Structured logging
│   └── constants/
│       ├── languages.ts     # Supported languages
│       └── providers.ts     # Provider configs
├── types/
│   └── index.ts             # TypeScript definitions
└── docs/
    ├── SECURITY_AUDIT.md    # Security audit report
    └── SECURITY_FIXES_SUMMARY.md  # Security fixes
```

## 🔒 Security Features

- **Input Sanitization**: Prevents XSS, SQL injection, and prompt injection
- **Server-Side Validation**: API keys validated with provider APIs
- **Rate Limiting**: 10 requests/minute with headers
- **Security Headers**: HSTS, CSP, X-Frame-Options, X-XSS-Protection
- **Structured Logging**: Security event tracking with sensitive data filtering

See [SECURITY_AUDIT.md](docs/SECURITY_AUDIT.md) for details.

## 🛠️ Development

### Commands

```bash
# Development
bun dev                    # Start dev server
bun run build             # Build for production
bun run start             # Start production server
bun run lint              # Run ESLint

# Testing
bun test                  # Run tests (if configured)
```

### Environment Variables

```bash
# Server-side API keys (optional)
GEMINI_API_KEY=AIza...
GROQ_API_KEY=gsk_...
NVIDIA_API_KEY=nvapi-...
OPENROUTER_API_KEY=sk-or-...
CUSTOM_API_KEY=your-key
CUSTOM_API_ENDPOINT=https://api.example.com/v1/chat/completions

# Application
NODE_ENV=development
PORT=3000
```

See `.env.local.example` for the full list.

## 📚 Documentation

- [Security Audit Report](docs/SECURITY_AUDIT.md)
- [Security Fixes Summary](docs/SECURITY_FIXES_SUMMARY.md)
- [Contributing Guide](CONTRIBUTING.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:
- Development setup
- Coding guidelines
- Pull request process
- Code of conduct

### Quick Start for Contributors

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/ai_translate.git
cd ai_translate

# Create a branch
git checkout -b feature/your-feature

# Make changes and commit
git commit -m "feat: add your feature"

# Push and create PR
git push origin feature/your-feature
```

## 🐛 Issues

Found a bug or have a feature request? [Open an issue](https://github.com/your-org/ai_translate/issues) using our templates:
- 🐛 [Bug Report](.github/ISSUE_TEMPLATE/bug_report.md)
- ✨ [Feature Request](.github/ISSUE_TEMPLATE/feature_request.md)
- 🔒 [Security Issue](.github/ISSUE_TEMPLATE/security_issue.md)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI powered by [Tailwind CSS](https://tailwindcss.com/)
- AI providers: Google Gemini, Groq, NVIDIA NIM, OpenRouter

## 📞 Support

- **Documentation**: See `/docs` folder
- **Issues**: [GitHub Issues](https://github.com/your-org/ai_translate/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/ai_translate/discussions)

---

Made with ❤️ for seamless AI-powered translation.
