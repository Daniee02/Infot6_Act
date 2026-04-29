'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const SUGGESTED_TAGS = ['transformers', 'rlhf', 'nlp', 'computer-vision', 'generative-ai', 'alignment', 'architecture', 'scaling', 'engineering', 'research', 'tutorial', 'benchmark']

export default function NewArticlePage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tab, setTab] = useState<'write' | 'preview'>('write')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const addTag = (tag: string) => {
    const clean = tag.toLowerCase().trim().replace(/\s+/g, '-')
    if (clean && !tags.includes(clean) && tags.length < 5) {
      setTags(p => [...p, clean])
      setTagInput('')
    }
  }

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length
  const readingTime = Math.max(1, Math.round(wordCount / 220))

  const handlePublish = async () => {
    setError('')
    if (!title.trim()) { setError('Please add a title.'); return }
    if (!content.trim()) { setError('Content cannot be empty.'); return }

    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setError('You must be signed in to publish.'); setSaving(false); return }

      const { data, error: insertError } = await supabase
        .from('articles')
        .insert({
          title: title.trim(),
          excerpt: excerpt.trim(),
          content: content.trim(),
          tags,
          author_id: user.id,
          author_name: user.user_metadata?.full_name || user.email,
          reading_time: readingTime,
        })
        .select()
        .single()

      if (insertError) throw insertError
      router.push(`/articles/${data.id}`)
    } catch (err: any) {
      setError(err.message || 'Failed to publish.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 80 }}>

      {/* Sticky toolbar */}
      <div style={{
        position: 'sticky', top: 64, zIndex: 50,
        borderBottom: '1px solid var(--border)',
        background: 'rgba(4,4,13,0.92)',
        backdropFilter: 'blur(20px)',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56, gap: 16 }}>
          <div style={{ display: 'flex', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', padding: 3, border: '1px solid var(--border)', gap: 2 }}>
            {(['write', 'preview'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: '5px 14px', border: 'none', borderRadius: 6, cursor: 'pointer',
                fontSize: 13, fontWeight: 500, fontFamily: 'var(--font-body)',
                transition: 'all 0.18s',
                background: tab === t ? 'var(--bg-hover)' : 'transparent',
                color: tab === t ? 'var(--text-primary)' : 'var(--text-muted)',
              }}>
                {t === 'write' ? '✏️ Write' : '👁 Preview'}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {wordCount} words · {readingTime} min
            </span>
            {error && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{error}</span>}
            <button className="btn btn-ghost btn-sm" onClick={() => router.back()}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={handlePublish} disabled={saving} style={{ minWidth: 110 }}>
              {saving
                ? <><div className="spinner" style={{ width: 13, height: 13 }} /> Publishing…</>
                : 'Publish'
              }
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 48, maxWidth: 820 }}>
        {tab === 'write' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

            {/* Tags */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', minHeight: 36 }}>
                {tags.map(tag => (
                  <span key={tag} className="tag tag-primary">
                    {tag}
                    <button onClick={() => setTags(t => t.filter(x => x !== tag))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: '0 0 0 2px', fontSize: 15, lineHeight: 1 }}>
                      ×
                    </button>
                  </span>
                ))}
                {tags.length < 5 && (
                  <input
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(tagInput) }
                      if (e.key === 'Backspace' && !tagInput && tags.length) setTags(t => t.slice(0, -1))
                    }}
                    placeholder={tags.length === 0 ? 'Add up to 5 tags…' : '+ tag'}
                    style={{
                      background: 'none', border: 'none', outline: 'none',
                      fontFamily: 'var(--font-mono)', fontSize: 13,
                      color: 'var(--text-secondary)', caretColor: 'var(--primary)', minWidth: 120,
                    }}
                  />
                )}
              </div>
              <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SUGGESTED:</span>
                {SUGGESTED_TAGS.filter(t => !tags.includes(t)).slice(0, 9).map(tag => (
                  <button key={tag} onClick={() => addTag(tag)} className="tag tag-neutral" style={{ cursor: 'pointer', fontSize: 11 }}>
                    + {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <textarea
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Article title…"
              rows={2}
              style={{
                width: '100%', background: 'transparent', border: 'none', outline: 'none',
                resize: 'none', fontFamily: 'var(--font-display)',
                fontSize: 'clamp(30px, 5vw, 48px)', fontWeight: 800,
                letterSpacing: '-0.035em', color: 'var(--text-primary)', lineHeight: 1.12,
                caretColor: 'var(--primary)', marginBottom: 4,
              }}
            />

            {/* Excerpt */}
            <textarea
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
              placeholder="Short description shown on article cards…"
              rows={2}
              style={{
                width: '100%', background: 'transparent', border: 'none', outline: 'none',
                resize: 'none', fontFamily: 'var(--font-body)',
                fontSize: 17, color: 'var(--text-muted)', lineHeight: 1.6,
                caretColor: 'var(--primary)', marginBottom: 20,
              }}
            />

            <div style={{ height: 1, background: 'var(--border)', marginBottom: 28 }} />

            {/* Markdown toolbar */}
            <div style={{
              display: 'flex', gap: 4, marginBottom: 16,
              padding: '8px 12px',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              flexWrap: 'wrap',
            }}>
              {[
                { label: 'B', insert: '**text**' },
                { label: 'I', insert: '*text*' },
                { label: '`', insert: '`code`' },
              ].map(({ label, insert }) => (
                <button key={label}
                  onClick={() => setContent(c => c + insert)}
                  style={{
                    width: 28, height: 28, border: '1px solid var(--border)', borderRadius: 6,
                    background: 'var(--bg-hover)', color: 'var(--text-secondary)',
                    cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-mono)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
                  }}>
                  {label}
                </button>
              ))}
              {[
                { label: 'H2', insert: '\n## ' },
                { label: 'H3', insert: '\n### ' },
                { label: '— List', insert: '\n- ' },
                { label: '❝ Quote', insert: '\n> ' },
                { label: '</> Code', insert: '\n```python\n\n```' },
              ].map(({ label, insert }) => (
                <button key={label}
                  onClick={() => setContent(c => c + insert)}
                  style={{
                    padding: '0 10px', height: 28, border: '1px solid var(--border)', borderRadius: 6,
                    background: 'var(--bg-hover)', color: 'var(--text-secondary)',
                    cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-mono)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s', whiteSpace: 'nowrap',
                  }}>
                  {label}
                </button>
              ))}
              <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', alignSelf: 'center' }}>
                Markdown supported
              </span>
            </div>

            {/* Content */}
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder={`Write your article here using Markdown…\n\n## Introduction\nStart with a compelling opening.\n\n## Section Title\nYour content here.\n\n\`\`\`python\n# Code example\nprint("Hello, ML world!")\n\`\`\``}
              style={{
                width: '100%', minHeight: 520,
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                outline: 'none', resize: 'vertical',
                fontFamily: 'var(--font-mono)', fontSize: 14,
                lineHeight: 1.9, color: 'var(--text-secondary)',
                caretColor: 'var(--primary)',
                padding: '24px 28px',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.target.style.borderColor = 'var(--border-focus)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>

        ) : (
          /* Preview */
          <div>
            <div style={{ marginBottom: 40, paddingBottom: 32, borderBottom: '1px solid var(--border)' }}>
              {tags.length > 0 && (
                <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
                  {tags.map(tag => <span key={tag} className="tag tag-primary">{tag}</span>)}
                </div>
              )}
              <h1 style={{ fontSize: 'clamp(28px, 5vw, 46px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 14 }}>
                {title || <span style={{ color: 'var(--text-muted)' }}>Untitled</span>}
              </h1>
              {excerpt && (
                <p style={{ fontSize: 18, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 16 }}>{excerpt}</p>
              )}
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Preview · {wordCount} words · {readingTime} min read
              </span>
            </div>
            <div className="prose">
              {content
                ? content.split('\n').map((line, i) => {
                    if (line.startsWith('## ')) return <h2 key={i}>{line.slice(3)}</h2>
                    if (line.startsWith('### ')) return <h3 key={i}>{line.slice(4)}</h3>
                    if (line.startsWith('> ')) return <blockquote key={i}>{line.slice(2)}</blockquote>
                    if (line.startsWith('- ')) return <li key={i} style={{ marginLeft: 20 }}>{line.slice(2)}</li>
                    if (line.startsWith('```')) return null
                    if (!line.trim()) return <br key={i} />
                    return <p key={i}>{line}</p>
                  })
                : <p style={{ color: 'var(--text-muted)' }}>Start writing to see the preview here.</p>
              }
            </div>
          </div>
        )}
      </div>
    </div>
  )
}