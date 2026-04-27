'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../../lib/supabase'

export default function NewArticlePage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handlePublish = async () => {
    setMessage('')
    setLoading(true)

    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) {
      setMessage(userError.message)
      setLoading(false)
      return
    }
    const user = userData.user
    if (!user) {
      setMessage('You must be logged in.')
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('articles')
      .insert({
        title,
        content,
        author_id: user.id,
      })
      .select('id')
      .single()

    if (error) {
      setMessage('Publish failed: ' + error.message)
    } else if (data) {
      setMessage('Article published!')
      router.push(`/articles/${data.id}`)
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-slate-900 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Publish Article</h1>
          <Link
            href="/articles"
            className="text-sm text-blue-300 hover:text-blue-200"
          >
            Back to Articles
          </Link>
        </div>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="mt-2 w-full rounded-xl bg-slate-800 px-3 py-2 text-sm"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your article..."
          rows={8}
          className="mt-3 w-full rounded-xl bg-slate-800 px-3 py-2 text-sm"
        />

        {message && (
          <p className="mt-3 text-sm text-red-300">{message}</p>
        )}

        <button
          onClick={handlePublish}
          disabled={loading}
          className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-500 disabled:opacity-60"
        >
          {loading ? 'Publishing...' : 'Publish'}
        </button>
      </div>
    </main>
  )
}