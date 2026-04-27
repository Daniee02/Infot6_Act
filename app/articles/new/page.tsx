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
      setMessage('Article published!')
      // go straight to the article page
      router.push(`/articles/${data.id}`)
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-slate-900 p-6">
        <h1 className="text-2xl font-bold">Publish Article</h1>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="mt-4 w-full rounded-xl bg-slate-800 px-3 py-2 text-sm"
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