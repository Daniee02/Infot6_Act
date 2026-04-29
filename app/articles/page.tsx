'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const SUGGESTED_TAGS = ['transformers', 'rlhf', 'nlp', 'computer-vision', 'generative-ai', 'alignment', 'architecture', 'scaling', 'engineering', 'research', 'tutorial']

export default function NewArticlePage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [preview, setPreview] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const addTag = (tag: string) => {
    const clean = tag.toLowerCase().trim().replace(/\s+/g, '-')
    if (clean && !tags.includes(clean) && tags.length < 5) { setTags(p => [...p, clean]); setTagInput('') }
  }

  const handlePublish = async () => {
    if (!title.trim()) { setError('Please add a title.'); return }
    if (!content.trim()) { setError('Content cannot be empty.'); return }
    setSaving(true)
    // Replace with: await supabase.from('articles').insert({ title, content, tags })
    await new Promise(r => setTimeout(r, 900))
    setSaving(false)
    router.push('/')
  }

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length
  const readingTime = Math.max(1, Math.round(wordCount / 220))

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 80 }}>
      <div style={{ borderBottom: '1px solid var(--border)', padding: '14px 0', position: 'sticky', top: 64, zIndex: 50, background: 'rgba(4,4,13,0.9)', backdropFilter: 'blur(16px)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setPreview(false)} className={`btn btn-sm ${!preview ? 'btn-secondary' : 'btn-ghost'}`}>Write</button>
            <button onClick={() => setPreview(true)} className={`btn btn-sm ${preview ? 'btn-secondary' : 'btn-ghost'}`}>Preview</button>
            <div style={{ width: 1, height: 20, background: 'var(--border)' }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{wordCount} words · {readingTime} min read</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {error && <span style={{ fontSize: 13, color: 'var(--danger)' }}>{error}</span>}
            <button className="btn btn-ghost btn-sm" onClick={() => router.back()}>Discard</button>
            <button className="btn btn-primary btn-sm" onClick={handlePublish} disabled={saving} style={{ minWidth: 100 }}>
              {saving ? <><div className="spinner" style={{ width: 14, height: 14 }} /> Publishing…</> : 'Publish'}
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 40 }}>
        {!preview ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <textarea
                value={title} onChange={e => setTitle(e.target.value)}
                placeholder="Article title…" rows={2}
                style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', resize: 'none', fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1.15, caretColor: 'var(--primary)' }}
              />
              <div style={{ height: 1, background: 'var(--border)', marginTop: 16 }} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                {tags.map(tag => (
                  <span key={tag} className="tag tag-primary">
                    {tag}
                    <button onClick={() => setTags(t => t.filter(x => x !== tag))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, fontSize: 14 }}>×</button>
                  </span>
                ))}
                {tags.length < 5 && (
                  <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(tagInput) } }}
                    placeholder="Add tags (press Enter)…"
                    style={{ background: 'none', border: 'none', outline: 'none', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-secondary)', caretColor: 'var(--primary)', minWidth: 180 }}
                  />
                )}
              </div>
              <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', alignSelf: 'center' }}>SUGGESTED:</span>
                {SUGGESTED_TAGS.filter(t => !tags.includes(t)).slice(0, 8).map(tag => (
                  <button key={tag} onClick={() => addTag(tag)} className="tag tag-neutral" style={{ cursor: 'pointer' }}>+ {tag}</button>
                ))}
              </div>
            </div>

            <textarea
              value={content} onChange={e => setContent(e.target.value)}
              placeholder={'Write your article in Markdown…\n\n## Introduction\n\nStart with a hook.'}
              style={{ width: '100%', minHeight: 600, background: 'transparent', border: 'none', outline: 'none', resize: 'none', fontFamily: 'var(--font-mono)', fontSize: 15, lineHeight: 1.85, color: 'var(--text-secondary)', caretColor: 'var(--primary)' }}
            />
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: 48, paddingBottom: 32, borderBottom: '1px solid var(--border)' }}>
              {tags.length > 0 && <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>{tags.map(tag => <span key={tag} className="tag tag-primary">{tag}</span>)}</div>}
              <h1 style={{ fontSize: 'clamp(28px, 5vw, 46px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 16 }}>
                {title || <span style={{ color: 'var(--text-muted)' }}>Untitled article</span>}
              </h1>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Preview · {wordCount} words · {readingTime} min read</div>
            </div>
            <div className="prose container-narrow" style={{ padding: 0 }}>
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'var(--font-body)', fontSize: 17, lineHeight: 1.85, color: 'var(--text-secondary)', background: 'none', border: 'none', padding: 0 }}>
                {content || <span style={{ color: 'var(--text-muted)' }}>Your content will appear here.</span>}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}