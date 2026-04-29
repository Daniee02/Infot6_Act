import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import LikeButton from '../../../components/LikeButton'
import ShareButton from '../../../components/ShareButton'
import CommentSection from '../../../components/CommentSection'

type Params = { params: { id: string } }

async function getArticle(id: string) {
  const { data } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single()
  return data
}

export default async function ArticlePage({ params }: Params) {
  const article = await getArticle(params.id)
  if (!article) notFound()

  const date = new Date(article.created_at).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  })

  const initials = (article.author_name || 'AN')
    .split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div>
      {/* Article Hero */}
      <div className="article-hero">
        <div className="container-narrow">

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, fontSize: 13, color: 'var(--text-muted)' }}>
            <Link href="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
            <span>›</span>
            <Link href="/articles" style={{ color: 'var(--text-muted)' }}>Articles</Link>
            <span>›</span>
            <span style={{ color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>
              {article.title}
            </span>
          </div>

          {/* Tags */}
          {article.tags?.length > 0 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
              {article.tags.map((tag: string) => (
                <Link key={tag} href={`/articles?tag=${tag}`} className="tag tag-primary">{tag}</Link>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 46px)', fontWeight: 800,
            letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 24
          }}>
            {article.title}
          </h1>

          {/* Author + actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="avatar avatar-md">{initials}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{article.author_name || 'Anonymous'}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {date} · {article.reading_time ?? 5} min read
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <LikeButton articleId={article.id} initialCount={article.likes_count ?? 0} />
              <ShareButton title={article.title} />
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container-narrow" style={{ paddingBottom: 80 }}>

        {article.excerpt && (
          <p style={{ fontSize: 19, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 40, fontStyle: 'italic', borderLeft: '3px solid var(--primary)', paddingLeft: 20 }}>
            {article.excerpt}
          </p>
        )}

        <article className="prose">
          {(article.content || '').split('\n').map((line: string, i: number) => {
            if (line.startsWith('## ')) return <h2 key={i}>{line.slice(3)}</h2>
            if (line.startsWith('### ')) return <h3 key={i}>{line.slice(4)}</h3>
            if (line.startsWith('> ')) return <blockquote key={i}>{line.slice(2)}</blockquote>
            if (line.startsWith('- ')) return <li key={i} style={{ marginLeft: 20 }}>{line.slice(2)}</li>
            if (line.startsWith('```')) return null
            if (!line.trim()) return <br key={i} />
            return <p key={i}>{line}</p>
          })}
        </article>

        {/* Author bio */}
        <div className="card" style={{ padding: '24px 28px', marginTop: 48, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div className="avatar avatar-lg">{initials}</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{article.author_name || 'Anonymous'}</div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {article.author_bio || 'ML practitioner sharing knowledge with the community.'}
            </div>
          </div>
        </div>

        {/* Bottom actions */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '24px 0', marginTop: 32,
          borderTop: '1px solid var(--border)',
          flexWrap: 'wrap', gap: 12,
        }}>
          <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>Did you find this helpful?</span>
          <div style={{ display: 'flex', gap: 10 }}>
            <LikeButton articleId={article.id} initialCount={article.likes_count ?? 0} />
            <ShareButton title={article.title} />
          </div>
        </div>

        <CommentSection articleId={article.id} />
      </div>
    </div>
  )
}