'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type Comment = {
  id: number
  article_id: number
  parent_comment_id: number | null
  comment_text: string
  created_at: string
}

export default function CommentSection({ articleId }: { articleId: number }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [text, setText] = useState('')
  const [replyTo, setReplyTo] = useState<number | null>(null)

  const loadComments = async () => {
    const { data } = await supabase
      .from('article_comments')
      .select('*')
      .eq('article_id', articleId)
      .order('created_at', { ascending: true })

    setComments(data || [])
  }

  const handleComment = async () => {
    const { data } = await supabase.auth.getUser()
    const user = data.user
    if (!user || !text) return

    await supabase.from('article_comments').insert({
      article_id: articleId,
      user_id: user.id,
      comment_text: text,
      parent_comment_id: replyTo,
    })

    setText('')
    setReplyTo(null)
    loadComments()
  }

  useEffect(() => {
    loadComments()
  }, [])

  const rootComments = comments.filter((c) => c.parent_comment_id === null)
  const replies = (id: number) => comments.filter((c) => c.parent_comment_id === id)

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold">Comments</h2>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={replyTo ? 'Write a reply...' : 'Write a comment...'}
        className="mt-4 w-full rounded-2xl bg-slate-900 px-4 py-3"
      />

      <button
        onClick={handleComment}
        className="mt-3 rounded-2xl bg-blue-600 px-4 py-2 font-semibold hover:bg-blue-500"
      >
        {replyTo ? 'Reply' : 'Comment'}
      </button>

      <div className="mt-6 space-y-4">
        {rootComments.map((comment) => (
          <div key={comment.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p>{comment.comment_text}</p>
            <button
              onClick={() => setReplyTo(comment.id)}
              className="mt-2 text-sm text-blue-300"
            >
              Reply
            </button>

            <div className="mt-3 ml-6 space-y-3">
              {replies(comment.id).map((reply) => (
                <div key={reply.id} className="rounded-xl bg-slate-900 p-3">
                  {reply.comment_text}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}