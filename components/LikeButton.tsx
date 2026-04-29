'use client'

import { useState, useCallback } from 'react'

export default function LikeButton({ articleId, initialCount, initialLiked = false }: { articleId: number; initialCount: number; initialLiked?: boolean }) {
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [animating, setAnimating] = useState(false)

  const handleLike = useCallback(async () => {
    const newLiked = !liked
    setLiked(newLiked)
    setCount(c => newLiked ? c + 1 : c - 1)
    setAnimating(true)
    setTimeout(() => setAnimating(false), 400)
    // Replace with: await supabase.from('likes').insert/delete(...)
  }, [liked, articleId])

  return (
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
  )
}