'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

export default function ShareButton({ title, url }: { title: string; url?: string }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const currentUrl = typeof window !== 'undefined' ? (url ?? window.location.href) : ''

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(currentUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [currentUrl])

  const options = [
    { id: 'copy', label: copied ? '✓ Copied!' : 'Copy link' },
    { id: 'twitter', label: 'Share on X' },
    { id: 'linkedin', label: 'Share on LinkedIn' },
    { id: 'hn', label: 'Share on HN' },
  ]

  const handleOption = (id: string) => {
    if (id === 'copy') { handleCopy(); return }
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
      hn: `https://news.ycombinator.com/submitlink?u=${encodeURIComponent(currentUrl)}&t=${encodeURIComponent(title)}`,
    }
    window.open(urls[id], '_blank', 'noopener,noreferrer')
    setOpen(false)
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button className="share-btn" onClick={() => setOpen(v => !v)}>
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <circle cx="12" cy="3" r="1.8" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="3" cy="7.5" r="1.8" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="12" cy="12" r="1.8" stroke="currentColor" strokeWidth="1.3" />
          <path d="M4.7 8.4l5.7 2.8M10.4 3.8L4.7 6.6" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        Share
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
          <path d="M2 4l3.5 3.5L9 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="share-dropdown">
          {options.map((opt, i) => (
            <button key={opt.id} className="share-dropdown-item" onClick={() => handleOption(opt.id)}
              style={{ borderTop: i > 0 ? '1px solid var(--border)' : 'none', color: opt.id === 'copy' && copied ? 'var(--success)' : undefined }}>
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}