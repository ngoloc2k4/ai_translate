# Contributing to AI Translation Lab

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## 🎯 Quick Start

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📋 Development Setup

### Prerequisites
- Node.js 18+ or Bun 1.0+
- Git

### Installation
```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/ai_translate.git
cd ai_translate

# Install dependencies
bun install

# Set up environment
cp .env.local.example .env.local
# Edit .env.local with your API keys

# Run development server
bun dev
```

## 🏗️ Project Structure

```
ai_translate/
├── app/                    # Next.js App Router
│   ├── api/translate/     # Translation API endpoint
│   ├── history/           # History page
│   └── page.tsx           # Home page
├── components/            # React components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and helpers
│   ├── ai/               # AI provider implementations
│   ├── utils/            # Utility functions
│   └── constants/        # App constants
├── types/                # TypeScript type definitions
└── docs/                 # Documentation
```

## 📝 Coding Guidelines

### Code Style
- Follow **Clean Code** principles
- Use meaningful, intention-revealing names
- Keep functions small (< 20 lines ideal)
- Each function should do **one thing**
- Remove redundant comments (let code speak)

### TypeScript
- Use strict mode (enabled)
- Define proper types for all functions
- Avoid `any` - use `unknown` if necessary
- Use interfaces for object shapes

### Component Guidelines
- Use functional components with hooks
- Keep components focused (single responsibility)
- Extract complex logic to custom hooks
- Use TypeScript for props

### Example: Clean Function
```typescript
// ✅ Good: Clear intention, small, does one thing
export function sanitizeInput(text: string): string {
  if (!text) return ''
  
  return text
    .trim()
    .slice(0, MAX_CHARACTERS)
    .replace(TRIPLE_QUOTES, "'\"'")
}

// ❌ Bad: Unclear, does too much
export function process(t: string) {
  // Clean and limit text and also fix quotes
  const x = t.trim().slice(0, 5000).replace(/"""/g, "'\"'")
  return x
}
```

## 🧪 Testing

### Before Submitting
```bash
# Type check
bun run lint

# Build
bun run build

# Test manually
# - Test all providers (Gemini, Groq, NVIDIA, OpenRouter)
# - Test translation history
# - Test settings modal
```

### Manual Testing Checklist
- [ ] Translation works with all providers
- [ ] History page displays correctly
- [ ] Settings modal saves API keys
- [ ] Rate limiting works (10 req/min)
- [ ] Mobile responsive design works
- [ ] No console errors

## 🔀 Pull Request Process

1. **Branch Naming**
   - `feature/description` for new features
   - `fix/description` for bug fixes
   - `refactor/description` for code improvements
   - `docs/description` for documentation

2. **Commit Messages**
   Follow [Conventional Commits](https://www.conventionalcommits.org/):
   ```
   feat: add NVIDIA NIM provider support
   fix: prevent XSS in translation input
   refactor: extract sanitization logic to utils
   docs: update README with security features
   ```

3. **PR Requirements**
   - Clear description of changes
   - Link related issues
   - Pass build checks
   - No sensitive data (API keys, etc.)
   - Update documentation if needed

## 🔒 Security Guidelines

### DO NOT Commit
- API keys or secrets
- `.env` files (use `.env.local.example`)
- Credentials or passwords
- Personal data

### Security Best Practices
- Sanitize all user inputs
- Validate API keys server-side
- Use environment variables for secrets
- Follow OWASP guidelines

## 📚 Documentation

### When to Update Docs
- Adding new features
- Changing API endpoints
- Modifying configuration
- Breaking changes

### Documentation Standards
- Use clear, concise language
- Include code examples
- Update README.md for major changes
- Add JSDoc comments for public functions

## 🐛 Reporting Issues

### Bug Reports
Include:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, browser, version)
- Screenshots if applicable

### Feature Requests
Include:
- Problem statement
- Proposed solution
- Use cases
- Alternatives considered

## 🎨 Design Guidelines

### UI/UX
- Follow existing design patterns
- Maintain dark theme consistency
- Ensure mobile responsiveness
- Test with different font sizes

### Accessibility
- Use semantic HTML
- Add aria-labels where needed
- Ensure keyboard navigation works
- Maintain color contrast ratios

## 💬 Communication

### Getting Help
- Check existing issues first
- Be clear and specific
- Provide context and examples
- Be respectful and patient

### Code Review
- Be constructive in feedback
- Explain reasoning for suggestions
- Accept feedback gracefully
- Focus on code, not people

## 🚀 Release Process

Releases are managed by maintainers. Typical process:
1. Features merged to main
2. Testing period
3. Version tag created
4. Release notes published

## 📜 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Keep discussions professional and on-topic

## 🙏 Thank You!

Every contribution helps make this project better. Whether it's a bug report, feature suggestion, or code contribution, we appreciate your time and effort.

---

**Questions?** Open an issue or contact the maintainers.
