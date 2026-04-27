'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type Comment = {
  id: number
  article_id: number
  comment_text: string
  created_at: string
}

export default function CommentSection({ articleId }: { articleId: number }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)

  const loadComments = async () => {
    const { data, error } = await supabase
      .from('article_comments')
      .select('id, article_id, comment_text, created_at')
      .eq('article_id', articleId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Load comments error:', error.message)
      return
    }

    setComments(data || [])
    setLoading(false)
  }

  const handleComment = async () => {
    if (!text.trim()) return

    const { data, error: userError } = await supabase.auth.getUser()
    if (userError) {
      alert(userError.message)
      return
    }
    const user = data.user
    if (!user) {
      alert('Please log in to comment.')
      return
    }

    const { error } = await supabase.from('article_comments').insert({
      article_id: articleId,
      user_id: user.id,
      comment_text: text.trim(),
    })

    if (error) {
      alert('Comment failed: ' + error.message)
      console.error('Comment error:', error.message)
      return
    }

    setText('')
    loadComments()
  }

  useEffect(() => {
    loadComments()
  }, [])

  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold">Comments</h2>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a comment..."
        rows={3}
        className="mt-3 w-full rounded-xl bg-slate-900 px-3 py-2 text-sm"
      />

      <button
        onClick={handleComment}
        className="mt-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-500"
      >
        Comment
      </button>

      {loading && (
        <p className="mt-3 text-sm text-slate-400">Loading comments...</p>
      )}

      <ul className="mt-4 space-y-3">
        {comments.map((c) => (
          <li
            key={c.id}
            className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm"
          >
            {c.comment_text}
            <p className="mt-1 text-[10px] text-slate-500">
              {new Date(c.created_at).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}