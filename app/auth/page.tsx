'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type Mode = 'signin' | 'signup'

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async () => {
    setError('')
    setSuccess('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    if (mode === 'signup' && !name) { setError('Please enter your name.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }

    setLoading(true)
    try {
      if (mode === 'signin') {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
          if (error.message.includes('Email not confirmed')) {
            setError('Please confirm your email first. Check your inbox.')
          } else if (error.message.includes('Invalid login')) {
            setError('Wrong email or password.')
          } else {
            setError(error.message)
          }
          return
        }
        if (data.user) {
          router.push('/')
          router.refresh()
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
            emailRedirectTo: `${window.location.origin}/auth/confirm`,
          }
        })
        if (error) throw error
        setSuccess('✅ Account created! Check your email and click the confirmation link.')
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        <div className="card anim-scale-in" style={{ padding: '40px 36px' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              width: 48, height: 48,
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
              borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 8px 24px var(--primary-glow)',
            }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="5" r="2.8" fill="white" fillOpacity="0.9" />
                <circle cx="4" cy="16" r="2.8" fill="white" fillOpacity="0.9" />
                <circle cx="18" cy="16" r="2.8" fill="white" fillOpacity="0.9" />
                <line x1="11" y1="7.5" x2="4.8" y2="13.5" stroke="white" strokeOpacity="0.6" strokeWidth="1.5" />
                <line x1="11" y1="7.5" x2="17.2" y2="13.5" stroke="white" strokeOpacity="0.6" strokeWidth="1.5" />
                <line x1="4" y1="16" x2="18" y2="16" stroke="white" strokeOpacity="0.6" strokeWidth="1.5" />
              </svg>
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6 }}>
              {mode === 'signin' ? 'Welcome back' : 'Join ML Hub'}
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
              {mode === 'signin'
                ? 'Sign in to your account to continue'
                : 'Create your account and start writing'}
            </p>
          </div>

          {/* Toggle tabs */}
          <div style={{
            display: 'flex',
            background: 'var(--bg-elevated)',
            borderRadius: 'var(--radius)',
            padding: 4,
            marginBottom: 28,
            border: '1px solid var(--border)',
          }}>
            {(['signin', 'signup'] as Mode[]).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); setSuccess('') }}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 500,
                  fontFamily: 'var(--font-body)',
                  transition: 'all 0.2s',
                  background: mode === m ? 'var(--primary)' : 'transparent',
                  color: mode === m ? '#fff' : 'var(--text-muted)',
                  boxShadow: mode === m ? '0 2px 8px var(--primary-glow)' : 'none',
                }}
              >
                {m === 'signin' ? 'Sign in' : 'Sign up'}
              </button>
            ))}
          </div>

          {/* Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {mode === 'signup' && (
              <div className="form-group">
                <label className="form-label">Full name</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Alex Kim"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Password</label>
                {mode === 'signin' && (
                  <Link href="/auth/reset" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    Forgot password?
                  </Link>
                )}
              </div>
              <input
                type="password"
                className="input"
                placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>

            {/* Error */}
            {error && (
              <div style={{
                padding: '12px 16px',
                background: 'rgba(248,113,113,0.08)',
                border: '1px solid rgba(248,113,113,0.22)',
                borderRadius: 'var(--radius)',
                fontSize: 13,
                color: 'var(--danger)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
              }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                  <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M7 4.5v3M7 9v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div style={{
                padding: '12px 16px',
                background: 'rgba(52,211,153,0.08)',
                border: '1px solid rgba(52,211,153,0.22)',
                borderRadius: 'var(--radius)',
                fontSize: 13,
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
                lineHeight: 1.6,
              }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                  <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M4.5 7l2 2 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {success}
              </div>
            )}

            {/* Submit */}
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', marginTop: 4, padding: '13px 0' }}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: 16, height: 16 }} />
                  {mode === 'signin' ? 'Signing in…' : 'Creating account…'}
                </>
              ) : (
                mode === 'signin' ? 'Sign in' : 'Create account'
              )}
            </button>
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>OR</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          {/* GitHub OAuth */}
          <button
            onClick={async () => {
              await supabase.auth.signInWithOAuth({
                provider: 'github',
                options: {
                  redirectTo: `${window.location.origin}/auth/confirm`,
                }
              })
            }}
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: 'center', gap: 10 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            Continue with GitHub
          </button>

          {mode === 'signup' && (
            <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 20, lineHeight: 1.6 }}>
              By creating an account you agree to our{' '}
              <Link href="/terms" style={{ color: 'var(--text-secondary)' }}>Terms</Link>
              {' '}and{' '}
              <Link href="/privacy" style={{ color: 'var(--text-secondary)' }}>Privacy Policy</Link>.
            </p>
          )}
        </div>

        {/* Back home */}
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link href="/" style={{
            fontSize: 13, color: 'var(--text-muted)',
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M8 2.5L4 6.5l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to home
          </Link>
        </div>

      </div>
    </div>
  )
}