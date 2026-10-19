"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAppSettings } from "@/store/useAppSettings"

export default function LogoutPage() {
  const [isLoggingOut, setIsLoggingOut] = useState(true)
  const [isLoggedOut, setIsLoggedOut] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [error, setError] = useState("")
  const router = useRouter()
  const { setServerKeys } = useAppSettings()
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    async function performLogout() {
      try {
        const res = await fetch("/api/auth", { method: "DELETE" })
        if (res.ok) {
          // Immediately wipe server keys from client state to enforce BYOK mode
          setServerKeys({})
          setIsLoggedOut(true)
        } else {
          setError("Không thể hủy phiên đăng nhập từ máy chủ")
        }
      } catch (err) {
        setError("Lỗi kết nối khi gửi yêu cầu đăng xuất")
      } finally {
        setIsLoggingOut(false)
      }
    }

    performLogout()
  }, [setServerKeys])

  // Countdown timer to automatically navigate back to workbench
  useEffect(() => {
    if (isLoggedOut) {
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
            router.push("/")
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
    }
  }, [isLoggedOut, router])

  const handleStopCountdown = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current)
      countdownIntervalRef.current = null
    }
    setCountdown(0)
  }

  return (
    <div className="min-h-screen bg-[#090d16] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#0f172a] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80 text-center">
        
        {isLoggingOut ? (
          <div className="py-8 space-y-4">
            <div className="w-12 h-12 border-3 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto" />
            <h1 className="text-sm font-bold text-white uppercase tracking-wider">
              Đang Đăng Xuất...
            </h1>
            <p className="text-xs text-slate-400">
              Đang xóa phiên cookie và bảo mật kết nối...
            </p>
          </div>
        ) : error ? (
          <div className="space-y-4">
            <div className="w-12 h-12 bg-red-950/40 border border-red-800/60 rounded-2xl flex items-center justify-center mx-auto text-red-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-base font-bold text-white">Đăng Xuất Thất Bại</h1>
            <p className="text-xs text-red-400 bg-red-950/30 p-2.5 rounded-xl border border-red-900/40">
              {error}
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors"
              >
                Thử lại
              </button>
              <Link
                href="/"
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Quay lại Translation Lab
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Success Icon */}
            <div className="w-12 h-12 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div>
              <h1 className="text-base font-bold text-white uppercase tracking-wider">
                Đã Đăng Xuất Thành Công
              </h1>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Phiên quản trị máy chủ đã bị hủy bỏ hoàn toàn.
              </p>
            </div>

            {/* BYOK Mode Notice */}
            <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-900/40 text-left space-y-1.5">
              <div className="flex items-center gap-1.5 text-blue-400 font-bold text-[11px]">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Chế độ BYOK (Bring Your Own Key)</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Ứng dụng hiện chuyển về chế độ sử dụng API Key cá nhân của bạn trong Cài đặt mà không sử dụng tài nguyên server.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-1">
              <Link
                href="/"
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-lg shadow-blue-500/25 active:scale-95"
              >
                <span>Vào Translation Lab {countdown > 0 && `(${countdown}s)`}</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>

              <Link
                href="/login"
                onClick={handleStopCountdown}
                className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs py-2.5 rounded-xl border border-slate-700/60 transition-all active:scale-95"
              >
                <span>Đăng nhập lại</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
