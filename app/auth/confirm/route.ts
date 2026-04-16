import { type NextRequest, NextResponse } from 'next/server'
import { type EmailOtpType } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null

  const redirectUrl = new URL('/dashboard', request.url)

  if (!token_hash || !type) {
    redirectUrl.pathname = '/auth'
    return NextResponse.redirect(redirectUrl)
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash,
  })

  if (error) {
    redirectUrl.pathname = '/auth'
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.redirect(redirectUrl)
}