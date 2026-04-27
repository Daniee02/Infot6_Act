'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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

    const { data: userData } = await supabase.auth.getUser()
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
      setMessage(error.message)
    } else if (data) {
      setMessage('Article published successfully!')
      router.push(`/articles/${data.id}`)
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-3xl font-bold">Publish Article</h1>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Article title"
          className="mt-6 w-full rounded-2xl bg-slate-900 px-4 py-3"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your article..."
          rows={10}
          className="mt-4 w-full rounded-2xl bg-slate-900 px-4 py-3"
        />

        {message && (
          <p className="mt-4 text-sm text-red-300">{message}</p>
        )}

        <button
          onClick={handlePublish}
          disabled={loading}
          className="mt-6 rounded-2xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500 disabled:opacity-60"
        >
          {loading ? 'Publishing...' : 'Publish'}
        </button>
      </div>
    </main>
  )
}