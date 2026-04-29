'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import LikeButton from '@/app/components/LikeButton'
import ShareButton from '@/app/components/ShareButton'

type Props = {
  articleId: number
  authorId: string
  title: string
  initialLikes: number
}

type Toast = { msg: string; type: 'success' | 'error' | 'info' }

export default function ArticleActions({ articleId, authorId, title, initialLikes }: Props) {
  const router = useRouter()
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id ?? null)
    })
  }, [])

  const showToast = (msg: string, type: Toast['type'] = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', articleId)
        .eq('author_id', currentUserId!)
      if (error) throw error
      showToast('Article deleted successfully.')
      setTimeout(() => router.push('/articles'), 1500)
    } catch {
      showToast('Failed to delete article.', 'error')
    } finally {
      setDeleting(false)
      setShowConfirm(false)
    }
  }

  const isAuthor = currentUserId && currentUserId === authorId

  const toastColors = {
    success: { bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.3)', color: 'var(--success)' },
    error:   { bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.3)', color: 'var(--danger)' },
    info:    { bg: 'rgba(124,110,250,0.12)', border: 'rgba(124,110,250,0.3)', color: 'var(--primary-light)' },
  }

  return (
    <>
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 1000,
          padding: '12px 20px', borderRadius: 'var(--radius)',
          fontSize: 14, fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: 'var(--shadow-lg)',
          backdropFilter: 'blur(12px)',
          animation: 'fadeUp 0.25s ease forwards',
          background: toastColors[toast.type].bg,
          border: `1px solid ${toastColors[toast.type].border}`,
          color: toastColors[toast.type].color,
        }}>
          {toast.msg}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <LikeButton articleId={articleId} initialCount={initialLikes} />
        <ShareButton title={title} />

        {isAuthor && (
          <button
            onClick={() => setShowConfirm(true)}
            className="btn btn-danger btn-sm"
            style={{ borderRadius: 100 }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M2 3.5h9M5 3.5V2.5h3v1M10 3.5l-.5 7H3.5l-.5-7"
                stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Delete
          </button>
        )}
      </div>

      {showConfirm && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, backdropFilter: 'blur(6px)' }}
            onClick={() => setShowConfirm(false)} />
          <div className="card anim-scale-in" style={{
            position: 'fixed', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 201, padding: '40px 36px',
            maxWidth: 420, width: '90%', textAlign: 'center',
          }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <path d="M5 7h16M10 7V5h6v2M20 7l-1.5 15H7.5L6 7"
                  stroke="var(--danger)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 10 }}>Delete this article?</h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 28 }}>
              You're about to permanently delete{' '}
              <strong style={{ color: 'var(--text-primary)' }}>"{title}"</strong>.
              This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-ghost" onClick={() => setShowConfirm(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={deleting} style={{ flex: 1, justifyContent: 'center' }}>
                {deleting ? <><div className="spinner" style={{ width: 14, height: 14 }} /> Deleting…</> : 'Yes, delete it'}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}