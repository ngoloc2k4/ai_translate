"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAppSettings } from "@/store/useAppSettings"

export default function LoginPage() {
  const [username, setUsername] = useState("admin")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [activeSession, setActiveSession] = useState<{
    authenticated: boolean
    expiresAt?: number
    configured: boolean
  } | null>(null)
  const [error, setError] = useState("")
  const router = useRouter()
  const { setServerKeys } = useAppSettings()

  // Check current session status on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth", { method: "GET" })
        if (res.ok) {
          const data = await res.json()
          if (data.success && data.authenticated) {
            setActiveSession(data)
          } else {
            setActiveSession(null)
          }
        }
      } catch (err) {
        console.error("Failed to check auth status", err)
      } finally {
        setIsCheckingSession(false)
      }
    }
    checkAuth()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      })

      const data = await res.json()

      if (data.success) {
        // Fetch and hydrate server-side keys into store immediately
        try {
          const keysRes = await fetch("/api/keys")
          if (keysRes.ok) {
            const keysData = await keysRes.json()
            if (keysData.success && keysData.data) {
              setServerKeys(keysData.data)
            }
          }
        } catch {}

        router.push("/")
        router.refresh()
      } else {
        setError(data.error || "Login failed")
      }
    } catch (err) {
      setError("An unexpected network error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const formatExpiresDate = (timestamp?: number) => {
    if (!timestamp) return "30 ngày"
    try {
      const date = new Date(timestamp)
      const daysRemaining = Math.max(0, Math.ceil((timestamp - Date.now()) / (1000 * 60 * 60 * 24)))
      return `${date.toLocaleDateString("vi-VN")} (${daysRemaining} ngày còn lại)`
    } catch {
      return "30 ngày"
    }
  }

  return (
    <div className="min-h-screen bg-[#090d16] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#0f172a] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80">
        
        {/* Header Icon & Title */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/25">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-base font-bold text-white uppercase tracking-wider">
            {activeSession?.authenticated ? "Phiên Quản Trị" : "Đăng Nhập Quản Trị"}
          </h1>
          <p className="text-xs text-slate-400 mt-1 text-center">
            Mở khóa API Key máy chủ (Gemini, Groq, NVIDIA, OpenRouter...)
          </p>
        </div>

        {/* Existing Active Session Banner */}
        {!isCheckingSession && activeSession?.authenticated ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/50 text-emerald-300 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-400">
                <svg className="w-4 h-4 shrink-0 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Bạn đang trong phiên đăng nhập hợp lệ</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Hạn phiên: <span className="font-mono text-emerald-300 font-semibold">{formatExpiresDate(activeSession.expiresAt)}</span>
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <Link
                href="/"
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-lg shadow-blue-500/25 active:scale-95"
              >
                <span>Vào Translation Lab</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>

              <Link
                href="/logout"
                className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-red-950/50 hover:text-red-400 text-slate-300 font-semibold text-xs py-2.5 rounded-xl border border-slate-700/60 transition-all active:scale-95"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Đăng xuất (Chuyển về BYOK)</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Login Form */
          <form onSubmit={handleLogin} className="space-y-3.5">
            {/* Username with Autocomplete */}
            <div>
              <label htmlFor="login-username" className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Tài khoản (Username)
              </label>
              <input
                id="login-username"
                name="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors font-mono"
                placeholder="admin"
                required
              />
            </div>

            {/* Password with Autocomplete */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="login-password" className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Mật khẩu (Password)
                </label>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#090d16] border border-slate-800 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors font-mono"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 cursor-pointer"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div role="alert" className="text-xs text-red-400 bg-red-950/30 border border-red-900/50 rounded-xl p-3 flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Session Expiry Notice */}
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 pt-1">
              <svg className="w-3.5 h-3.5 text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Phiên đăng nhập được duy trì an toàn trong 30 ngày.</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-lg shadow-blue-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang xác thực...</span>
                </>
              ) : (
                <span>Đăng Nhập</span>
              )}
            </button>
          </form>
        )}

        {/* Back Link */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            ← Quay lại Translation Lab
          </Link>
        </div>
      </div>
    </div>
  )
}
