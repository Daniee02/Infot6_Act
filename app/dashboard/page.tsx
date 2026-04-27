'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

export default function DashboardPage() {
  const [email, setEmail] = useState('')
  const router = useRouter()

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        setEmail(data.user.email || '')
      } else {
        router.push('/auth')
      }
    }

    loadUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-950 via-slate-950 to-slate-900 px-6 py-12 text-white">
      <div className="mx-auto flex min-h-[85vh] max-w-2xl items-center justify-center">
        <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-2xl backdrop-blur">
          <h1 className="text-4xl font-bold">Welcome!</h1>
          <p className="mt-4 text-lg text-slate-300">
            You are logged in as:
          </p>
          <p className="mt-2 break-all text-xl font-semibold text-blue-300">
            {email}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/articles"
              className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500"
            >
              View Articles
            </Link>

            <Link
              href="/articles/new"
              className="rounded-2xl bg-purple-600 px-6 py-3 font-semibold transition hover:bg-purple-500"
            >
              Publish Article
            </Link>
          </div>

          <button
            onClick={handleLogout}
            className="mt-8 rounded-2xl bg-red-600 px-6 py-3 font-semibold transition hover:bg-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    </main>
  )
}