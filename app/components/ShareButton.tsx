'use client'

import { useState, useRef, useEffect } from 'react'

type Props = {
  title: string
  url?: string
}

export default function ShareButton({ title, url }: Props) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const currentUrl = typeof window !== 'undefined' ? (url ?? window.location.href) : ''

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
    setOpen(false)
  }

  const options = [
    { id: 'copy', label: copied ? '✓ Copied!' : 'Copy link', action: handleCopy },
    {
      id: 'twitter', label: 'Share on X',
      action: () => { window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl)}`, '_blank'); setOpen(false) }
    },
    {
      id: 'linkedin', label: 'Share on LinkedIn',
      action: () => { window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`, '_blank'); setOpen(false) }
    },
    {
      id: 'hn', label: 'Share on HN',
      action: () => { window.open(`https://news.ycombinator.com/submitlink?u=${encodeURIComponent(currentUrl)}&t=${encodeURIComponent(title)}`, '_blank'); setOpen(false) }
    },
  ]

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button className="share-btn" onClick={() => setOpen(v => !v)}>
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <circle cx="12" cy="3" r="1.8" stroke="currentColor" strokeWidth="1.3"/>
          <circle cx="3" cy="7.5" r="1.8" stroke="currentColor" strokeWidth="1.3"/>
          <circle cx="12" cy="12" r="1.8" stroke="currentColor" strokeWidth="1.3"/>
          <path d="M4.7 8.4l5.7 2.8M10.4 3.8L4.7 6.6" stroke="currentColor" strokeWidth="1.2"/>
        </svg>
        Share
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
          <path d="M2 4l3.5 3.5L9 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div className="share-dropdown">
          {options.map((opt, i) => (
            <button
              key={opt.id}
              className="share-dropdown-item"
              onClick={opt.action}
              style={{
                borderTop: i > 0 ? '1px solid var(--border)' : 'none',
                color: opt.id === 'copy' && copied ? 'var(--success)' : undefined,
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}