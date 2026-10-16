import { NextResponse } from "next/server"
import { verifyPasswordConstantTime, createSessionToken } from "@/lib/utils/authSession"

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    const correctPassword = process.env.APP_PASSWORD

    if (!correctPassword) {
      // If server does not have auth enabled, reject manual login attempts
      return NextResponse.json(
        { success: false, error: "Server authentication is not configured" },
        { status: 400 }
      )
    }

    if (verifyPasswordConstantTime(password, correctPassword)) {
      const token = await createSessionToken()

      const response = NextResponse.json({ success: true })
      
      response.cookies.set("ai_translate_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
      })

      return response
    }

    return NextResponse.json(
      { success: false, error: "Invalid password" },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
