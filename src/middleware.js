import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const res = NextResponse.next()

  // ✅ เพิ่มส่วนนี้: เช็คว่ามีค่า Config ของ Supabase หรือไม่
  // ถ้าไม่มี (แสดงว่ากำลังใช้ Mockup Mode) ให้ข้ามการเช็ค Login ไปเลย
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return res
  }

  try {
    // ถ้ามี Config ครบ ค่อยเริ่มเช็ค Session จริง
    const supabase = createMiddlewareClient({ req, res })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  } catch (e) {
    // ถ้าเกิด Error ตอนเชื่อมต่อ (เช่น เน็ตหลุด) ให้ปล่อยผ่านไปก่อนเพื่อให้ Mockup ทำงานได้
    console.warn("Middleware warning: Could not connect to Supabase, skipping auth check.")
  }

  return res
}