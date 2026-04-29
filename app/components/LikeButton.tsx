'use client'

import { useState, useCallback, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function LikeButton({ articleId, initialCount }: { articleId: number; initialCount: number }) {
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(initialCount)
  const [animating, setAnimating] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return
      const { data: like } = await supabase
        .from('article_likes')
        .select('id')
        .eq('article_id', articleId)
        .eq('user_id', data.user.id)
        .single()
      if (like) setLiked(true)
    })
  }, [articleId])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const handleLike = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { showToast('Sign in to like articles'); return }

    const newLiked = !liked
    setLiked(newLiked)
    setCount(c => newLiked ? c + 1 : c - 1)
    setAnimating(true)
    setTimeout(() => setAnimating(false), 400)

    if (newLiked) {
      await supabase.from('article_likes').insert({ article_id: articleId, user_id: user.id })
      showToast('❤️ Liked!')
    } else {
      await supabase.from('article_likes').delete()
        .eq('article_id', articleId).eq('user_id', user.id)
    }
  }, [liked, articleId])

  return (
    <div style={{ position: 'relative' }}>
      {toast && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius)', padding: '6px 12px',
          fontSize: 12, fontWeight: 500, color: 'var(--text-primary)',
          whiteSpace: 'nowrap', boxShadow: 'var(--shadow)', zIndex: 10,
        }}>
          {toast}
        </div>
      )}
      <button className={`like-btn ${liked ? 'liked' : ''}`} onClick={handleLike} aria-pressed={liked}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
          style={{ transform: animating ? 'scale(1.35)' : 'scale(1)', transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
          <path d="M8 13.5C8 13.5 1.5 9.8 1.5 6a3.5 3.5 0 017 0 3.5 3.5 0 017 0c0 3.8-6.5 7.5-6.5 7.5z"
            fill={liked ? 'currentColor' : 'transparent'} stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"
            style={{ transition: 'fill 0.2s' }} />
        </svg>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 500, transform: animating ? 'scale(1.15)' : 'scale(1)', transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)', display: 'inline-block' }}>
          {count}
        </span>
      </button>
    </div>
  )
}