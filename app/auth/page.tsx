'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async () => {
    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      setMessage('Sign up successful. Check your email if confirmation is enabled.')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Sign up failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async () => {
    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      router.push('/dashboard')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto flex min-h-[85vh] max-w-md items-center">
        <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
          <h1 className="text-3xl font-bold">Login / Sign Up</h1>
          <p className="mt-2 text-sm text-slate-300">
            Use your email and password.
          </p>

          <div className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm text-slate-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
                placeholder="Enter your password"
              />
            </div>

            {message && (
              <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4 text-sm text-blue-200">
                {message}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleSignUp}
                disabled={loading}
                className="rounded-2xl bg-blue-600 px-4 py-3 font-semibold transition hover:bg-blue-500 disabled:opacity-60"
              >
                Sign Up
              </button>

              <button
                onClick={handleLogin}
                disabled={loading}
                className="rounded-2xl bg-emerald-600 px-4 py-3 font-semibold transition hover:bg-emerald-500 disabled:opacity-60"
              >
                Login
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-blue-300 hover:text-blue-200">
              Back to Landing Page
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
