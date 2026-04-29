'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type Status = 'verifying' | 'success' | 'error'

export default function ConfirmPage() {
  const router = useRouter()
  const [status, setStatus] = useState<Status>('verifying')
  const [countdown, setCountdown] = useState(5)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const verify = async () => {
      try {
        // Get params from URL query string
        const url = new URL(window.location.href)
        const token_hash = url.searchParams.get('token_hash')
        const type = url.searchParams.get('type')

        // Also check hash fragment (Supabase sometimes puts tokens there)
        const hashParams = new URLSearchParams(window.location.hash.replace('#', ''))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')

        if (accessToken && refreshToken) {
          // Hash-based flow — set session directly
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })
          if (error) throw error
          setStatus('success')

        } else if (token_hash && type) {
          // PKCE flow — verify OTP
          const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as any,
          })
          if (error) throw error
          setStatus('success')

        } else {
          // Try getting the session anyway — might already be set
          const { data: { session } } = await supabase.auth.getSession()
          if (session) {
            setStatus('success')
          } else {
            throw new Error('No confirmation token found. Please check your email link.')
          }
        }
      } catch (err: any) {
        console.error(err)
        setErrorMsg(err.message || 'Verification failed.')
        setStatus('error')
      }
    }

    verify()
  }, [])

  useEffect(() => {
    if (status !== 'success') return
    const iv = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(iv); router.push('/') }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(iv)
  }, [status, router])

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px',
    }}>
      <div className="card anim-scale-in" style={{ maxWidth: 440, width: '100%', padding: '48px 40px', textAlign: 'center' }}>

        {/* Verifying */}
        {status === 'verifying' && (
          <>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(124,110,250,0.1)', border: '1px solid rgba(124,110,250,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px' }}>
              <div className="spinner" style={{ width: 26, height: 26 }} />
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Verifying your email</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Just a moment…</p>
          </>
        )}

        {/* Success */}
        {status === 'success' && (
          <>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px' }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M6 14l6 6 10-10" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Email confirmed! 🎉</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 28 }}>
              Redirecting in{' '}
              <span style={{ color: 'var(--primary-light)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                {countdown}s
              </span>
            </p>
            <div style={{ height: 3, background: 'var(--bg-elevated)', borderRadius: 2, overflow: 'hidden', marginBottom: 28 }}>
              <div style={{
                height: '100%',
                width: `${((5 - countdown) / 5) * 100}%`,
                background: 'linear-gradient(90deg, var(--primary), var(--accent))',
                transition: 'width 1s linear',
                borderRadius: 2,
              }} />
            </div>
            <Link href="/" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Go to ML Hub now
            </Link>
          </>
        )}

        {/* Error */}
        {status === 'error' && (
          <>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px' }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M14 9v6M14 18.5v1" stroke="var(--danger)" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="14" cy="14" r="11" stroke="var(--danger)" strokeWidth="2" />
              </svg>
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Verification failed</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 8 }}>
              {errorMsg || 'This link may have expired.'}
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 28 }}>
              Try signing up again or contact support.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link href="/auth" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Back to sign in
              </Link>
              <Link href="/" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
                Go to homepage
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}