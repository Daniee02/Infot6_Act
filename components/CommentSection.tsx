'use client'

import { useState } from 'react'

type Comment = { id: number; author_name: string; author_initials: string; content: string; created_at: string }

const MOCK_COMMENTS: Comment[] = [
  { id: 1, author_name: 'Sarah Chen', author_initials: 'SC', content: 'Excellent breakdown! The code examples for multi-head attention finally made this click for me.', created_at: '2025-04-19T14:22:00Z' },
  { id: 2, author_name: 'Ravi S.', author_initials: 'RS', content: 'The O(n²) complexity section is what trips up most teams going to longer contexts. Good that you called it out.', created_at: '2025-04-19T16:48:00Z' },
  { id: 3, author_name: 'Jana Wu', author_initials: 'JW', content: 'Great article overall! Worth noting the "it" → "cat" example is from the original BERTology paper.', created_at: '2025-04-20T09:10:00Z' },
]

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function CommentSection({ articleId }: { articleId: number }) {
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS)
  const [text, setText] = useState('')
  const [posting, setPosting] = useState(false)
  const [focused, setFocused] = useState(false)

  const handlePost = async () => {
    if (!text.trim() || posting) return
    setPosting(true)
    // Replace with: await supabase.from('comments').insert({ article_id: articleId, content: text.trim() })
    await new Promise(r => setTimeout(r, 500))
    setComments(prev => [{ id: Date.now(), author_name: 'You', author_initials: 'YO', content: text.trim(), created_at: new Date().toISOString() }, ...prev])
    setText('')
    setPosting(false)
  }

  return (
    <div style={{ marginTop: 56 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <h3 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>Discussion</h3>
        <span className="tag tag-neutral" style={{ fontSize: 12 }}>{comments.length}</span>
      </div>

      <div className="card" style={{ padding: 20, marginBottom: 32, borderColor: focused ? 'var(--border-focus)' : 'var(--border)' }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <div className="avatar avatar-md">YO</div>
          <div style={{ flex: 1 }}>
            <textarea
              value={text} onChange={e => setText(e.target.value)}
              onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
              placeholder="Share your thoughts…" rows={focused || text ? 4 : 2}
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

      <div>
        {comments.map(comment => (
          <div key={comment.id} className="comment-item">
            <div className="avatar avatar-sm">{comment.author_initials}</div>
            <div className="comment-body">
              <div className="comment-author">{comment.author_name}<span className="comment-time">{timeAgo(comment.created_at)}</span></div>
              <div className="comment-text">{comment.content}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}