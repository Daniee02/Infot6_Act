'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

type Comment = {
  id: number
  author_name: string
  author_initials: string
  comment_text: string
  created_at: string
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function CommentSection({ articleId }: { articleId: number }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [text, setText] = useState('')
  const [posting, setPosting] = useState(false)
  const [focused, setFocused] = useState(false)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  useEffect(() => {
    const fetchComments = async () => {
      const { data } = await supabase
        .from('article_comments')
        .select('*')
        .eq('article_id', articleId)
        .order('created_at', { ascending: false })
      setComments(data ?? [])
      setLoading(false)
    }
    fetchComments()
  }, [articleId])

  const handlePost = async () => {
    if (!text.trim() || posting) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { showToast('Please sign in to comment.'); return }

    setPosting(true)
    try {
      const name = user.user_metadata?.full_name || user.email || 'Anonymous'
      const initials = name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()

      const { data, error } = await supabase
        .from('article_comments')
        .insert({
          article_id: articleId,
          user_id: user.id,
          author_name: name,
          author_initials: initials,
          comment_text: text.trim(),
        })
        .select()
        .single()

      if (error) throw error
      setComments(prev => [data, ...prev])
      setText('')
      showToast('💬 Comment posted!')
    } catch (err: any) {
      showToast('Failed to post comment.')
    } finally {
      setPosting(false)
    }
  }

  return (
    <div style={{ marginTop: 56 }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius)', padding: '10px 20px',
          fontSize: 13, fontWeight: 500, color: 'var(--text-primary)',
          boxShadow: 'var(--shadow-lg)', zIndex: 100,
          animation: 'fadeUp 0.2s ease forwards',
        }}>
          {toast}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <h3 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>Discussion</h3>
        <span className="tag tag-neutral" style={{ fontSize: 12 }}>{comments.length}</span>
      </div>

      {/* Input */}
      <div className="card" style={{ padding: 20, marginBottom: 32, borderColor: focused ? 'var(--border-focus)' : 'var(--border)', transition: 'border-color 0.2s' }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <div className="avatar avatar-md">ME</div>
          <div style={{ flex: 1 }}>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Share your thoughts or questions…"
              rows={focused || text ? 4 : 2}
              style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', resize: 'none', fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.65, caretColor: 'var(--primary)' }}
            />
            {(focused || text) && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                <button className="btn btn-ghost btn-sm" onClick={() => { setText(''); setFocused(false) }}>Cancel</button>
                <button className="btn btn-primary btn-sm" onClick={handlePost} disabled={!text.trim() || posting}>
                  {posting ? <><div className="spinner" style={{ width: 13, height: 13 }} /> Posting</> : 'Post comment'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comments list */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}>
          <div className="spinner" />
        </div>
      ) : comments.length === 0 ? (
        <div className="empty-state" style={{ padding: '40px 0' }}>
          <div className="empty-state-icon" style={{ fontSize: 20 }}>💬</div>
          <p style={{ fontSize: 14 }}>No comments yet. Start the discussion!</p>
        </div>
      ) : (
        <div>
          {comments.map(comment => (
            <div key={comment.id} className="comment-item">
              <div className="avatar avatar-sm">{comment.author_initials || '?'}</div>
              <div className="comment-body">
                <div className="comment-author">
                  {comment.author_name}
                  <span className="comment-time">{timeAgo(comment.created_at)}</span>
                </div>
                <div className="comment-text">{comment.comment_text}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}