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

      const name = user.user_metadata?.full_name || user.email || 'Anonymous'

      const { data, error: insertError } = await supabase
        .from('articles')
        .insert({
          title: title.trim(),
          content: content.trim(),
          excerpt: excerpt.trim() || null,
          tags,
          author_id: user.id,
          author_name: name,
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
        background: 'rgba(4,4,13,0.95)',
        backdropFilter: 'blur(20px)',
      }}>
        <div className="container" style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', height: 56, gap: 16,
        }}>
          {/* Write / Preview toggle */}
          <div style={{
            display: 'flex',
            background: 'var(--bg-elevated)',
            borderRadius: 'var(--radius-sm)',
            padding: 3,
            border: '1px solid var(--border)',
            gap: 2,
          }}>
            {(['write', 'preview'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: '5px 16px', border: 'none', borderRadius: 6,
                cursor: 'pointer', fontSize: 13, fontWeight: 500,
                fontFamily: 'var(--font-body)', transition: 'all 0.18s',
                background: tab === t ? 'var(--primary)' : 'transparent',
                color: tab === t ? '#fff' : 'var(--text-muted)',
                boxShadow: tab === t ? '0 2px 8px var(--primary-glow)' : 'none',
              }}>
                {t === 'write' ? '✏️ Write' : '👁 Preview'}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {wordCount} words · {readingTime} min read
            </span>
            {error && (
              <span style={{
                fontSize: 12, color: 'var(--danger)',
                background: 'rgba(248,113,113,0.1)',
                border: '1px solid rgba(248,113,113,0.2)',
                borderRadius: 'var(--radius-sm)',
                padding: '4px 10px',
              }}>
                ⚠ {error}
              </span>
            )}
            <button className="btn btn-ghost btn-sm" onClick={() => router.back()}>
              Cancel
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={handlePublish}
              disabled={saving}
              style={{ minWidth: 110 }}
            >
              {saving ? (
                <><div className="spinner" style={{ width: 13, height: 13 }} /> Publishing…</>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M6.5 1L12 12H1L6.5 1z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                  </svg>
                  Publish
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main editor */}
      <div className="container" style={{ paddingTop: 48, maxWidth: 820 }}>
        {tab === 'write' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

            {/* Tags */}
            <div style={{ marginBottom: 28 }}>
              <div style={{
                display: 'flex', alignItems: 'center',
                gap: 8, flexWrap: 'wrap', minHeight: 38,
                padding: '8px 0',
                borderBottom: '1px solid var(--border)',
              }}>
                {tags.map(tag => (
                  <span key={tag} className="tag tag-primary" style={{ gap: 6 }}>
                    {tag}
                    <button
                      onClick={() => setTags(t => t.filter(x => x !== tag))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, fontSize: 16, lineHeight: 1, opacity: 0.7 }}
                    >×</button>
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
                    placeholder={tags.length === 0 ? 'Add up to 5 tags (press Enter)…' : '+ add tag'}
                    style={{
                      background: 'none', border: 'none', outline: 'none',
                      fontFamily: 'var(--font-mono)', fontSize: 13,
                      color: 'var(--text-secondary)',
                      caretColor: 'var(--primary)', minWidth: 160,
                    }}
                  />
                )}
              </div>

              {/* Suggested tags */}
              <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>
                  SUGGESTED:
                </span>
                {SUGGESTED_TAGS.filter(t => !tags.includes(t)).slice(0, 8).map(tag => (
                  <button
                    key={tag}
                    onClick={() => addTag(tag)}
                    className="tag tag-neutral"
                    style={{ cursor: 'pointer', fontSize: 11 }}
                  >
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
                width: '100%', background: 'transparent',
                border: 'none', outline: 'none', resize: 'none',
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(32px, 5vw, 52px)',
                fontWeight: 800, letterSpacing: '-0.04em',
                color: 'var(--text-primary)', lineHeight: 1.1,
                caretColor: 'var(--primary)', marginBottom: 8,
              }}
            />

            {/* Excerpt / subtitle */}
            <textarea
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
              placeholder="Add a short description (shown on article cards)…"
              rows={2}
              style={{
                width: '100%', background: 'transparent',
                border: 'none', outline: 'none', resize: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: 18, color: 'var(--text-muted)',
                lineHeight: 1.6, caretColor: 'var(--primary)',
                marginBottom: 8,
              }}
            />

            {/* Divider */}
            <div style={{ height: 1, background: 'var(--border)', margin: '16px 0 24px' }} />

            {/* Markdown toolbar */}
            <div style={{
              display: 'flex', gap: 4, marginBottom: 12,
              padding: '8px 14px',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              flexWrap: 'wrap', alignItems: 'center',
            }}>
              {[
                { label: 'B', title: 'Bold', insert: '**text**', style: { fontWeight: 700 } },
                { label: 'I', title: 'Italic', insert: '*text*', style: { fontStyle: 'italic' } },
                { label: '`', title: 'Code', insert: '`code`', style: {} },
              ].map(({ label, title, insert, style }) => (
                <button key={label} title={title}
                  onClick={() => setContent(c => c + insert)}
                  style={{
                    width: 30, height: 30,
                    border: '1px solid var(--border)', borderRadius: 6,
                    background: 'var(--bg-hover)', color: 'var(--text-secondary)',
                    cursor: 'pointer', fontSize: 13,
                    fontFamily: 'var(--font-mono)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s', ...style,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  {label}
                </button>
              ))}

              <div style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 4px' }} />

              {[
                { label: 'H2', insert: '\n## Heading\n' },
                { label: 'H3', insert: '\n### Subheading\n' },
                { label: '― List', insert: '\n- Item\n' },
                { label: '" Quote', insert: '\n> Blockquote\n' },
                { label: '</> Code', insert: '\n```python\n# code here\n```\n' },
              ].map(({ label, insert }) => (
                <button key={label} title={label}
                  onClick={() => setContent(c => c + insert)}
                  style={{
                    padding: '0 10px', height: 30,
                    border: '1px solid var(--border)', borderRadius: 6,
                    background: 'var(--bg-hover)', color: 'var(--text-secondary)',
                    cursor: 'pointer', fontSize: 12,
                    fontFamily: 'var(--font-mono)',
                    display: 'flex', alignItems: 'center',
                    transition: 'all 0.15s', whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  {label}
                </button>
              ))}

              <span style={{
                marginLeft: 'auto', fontSize: 11,
                color: 'var(--text-muted)', fontFamily: 'var(--font-mono)',
                alignSelf: 'center', opacity: 0.7,
              }}>
                Markdown
              </span>
            </div>

            {/* Content textarea */}
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder={`Write your article here using Markdown…\n\n## Introduction\nStart with a compelling opening that draws readers in.\n\n## Main Section\nDive into the details here.\n\n\`\`\`python\n# Example code\nprint("Hello, ML world!")\n\`\`\``}
              style={{
                width: '100%', minHeight: 560,
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                outline: 'none', resize: 'vertical',
                fontFamily: 'var(--font-mono)',
                fontSize: 14, lineHeight: 1.9,
                color: 'var(--text-secondary)',
                caretColor: 'var(--primary)',
                padding: '28px 32px',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={e => {
                e.target.style.borderColor = 'var(--primary)'
                e.target.style.boxShadow = '0 0 0 3px var(--primary-glow)'
              }}
              onBlur={e => {
                e.target.style.borderColor = 'var(--border)'
                e.target.style.boxShadow = 'none'
              }}
            />

            {/* Bottom hint */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginTop: 12, fontSize: 12, color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
            }}>
              <span>Tip: Use ## for headings, **bold**, *italic*, and ```code blocks```</span>
              <span>{wordCount} words · ~{readingTime} min read</span>
            </div>
          </div>

        ) : (
          /* Preview */
          <div>
            <div style={{ marginBottom: 48, paddingBottom: 36, borderBottom: '1px solid var(--border)' }}>
              {tags.length > 0 && (
                <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                  {tags.map(tag => <span key={tag} className="tag tag-primary">{tag}</span>)}
                </div>
              )}
              <h1 style={{ fontSize: 'clamp(28px, 5vw, 46px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 16 }}>
                {title || <span style={{ color: 'var(--text-muted)' }}>Untitled article</span>}
              </h1>
              {excerpt && (
                <p style={{ fontSize: 19, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 20, fontStyle: 'italic' }}>
                  {excerpt}
                </p>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)', display: 'inline-block' }} />
                Preview mode · {wordCount} words · {readingTime} min read
              </div>
            </div>

            <div className="prose">
              {content
                ? content.split('\n').map((line, i) => {
                    if (line.startsWith('## '))  return <h2 key={i}>{line.slice(3)}</h2>
                    if (line.startsWith('### ')) return <h3 key={i}>{line.slice(4)}</h3>
                    if (line.startsWith('> '))  return <blockquote key={i}>{line.slice(2)}</blockquote>
                    if (line.startsWith('- '))  return <li key={i} style={{ marginLeft: 20 }}>{line.slice(2)}</li>
                    if (line.startsWith('```')) return null
                    if (!line.trim())           return <br key={i} />
                    return <p key={i}>{line}</p>
                  })
                : <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    Start writing to see the preview here…
                  </p>
              }
            </div>
          </div>
        )}
      </div>
    </div>
  )
}