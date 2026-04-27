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
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto flex min-h-[85vh] max-w-2xl items-center justify-center">
        <div className="w-full rounded-3xl border border-white/10 bg-slate-900 p-8 text-center">
          <h1 className="text-3xl font-bold">Welcome!</h1>
          <p className="mt-4 text-slate-300">You are logged in as:</p>
          <p className="mt-1 break-all text-lg font-semibold text-blue-300">
            {email}
          </p>

          <div className="mt-6 flex flex-col items-center gap-3">
            <Link
              href="/articles"
              className="w-full max-w-xs rounded-2xl bg-blue-600 px-4 py-2 font-semibold hover:bg-blue-500"
            >
              View Articles
            </Link>

            <Link
              href="/articles/new"
              className="w-full max-w-xs rounded-2xl bg-emerald-600 px-4 py-2 font-semibold hover:bg-emerald-500"
            >
              Publish Article
            </Link>
          </div>

          <button
            onClick={handleLogout}
            className="mt-6 rounded-2xl bg-red-600 px-6 py-2 font-semibold hover:bg-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    </main>
  )
}