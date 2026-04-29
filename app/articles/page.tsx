import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const ALL_TAGS = ['transformers', 'rlhf', 'nlp', 'computer-vision', 'alignment', 'generative-ai', 'scaling', 'engineering', 'vectors', 'architecture', 'research', 'tutorial']

async function getArticles(tag?: string) {
  let query = supabase
    .from('articles')
    .select('*, article_likes(count), article_comments(count)')
    .order('created_at', { ascending: false })

  if (tag) query = query.contains('tags', [tag])
  const { data } = await query
  return data ?? []
}

function ArticleCard({ article }: { article: any }) {
  const date = new Date(article.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })
  const initials = (article.author_name || 'AN')
    .split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
  const tags: string[] = article.tags ?? []
  const likesCount = article.article_likes?.[0]?.count ?? 0
  const commentsCount = article.article_comments?.[0]?.count ?? 0

  return (
    <Link href={`/articles/${article.id}`} style={{ display: 'block' }}>
      <article className="card card-hover article-card">
        <div className="article-card-meta">
          {tags.slice(0, 2).map(tag => (
            <span key={tag} className="tag tag-primary">{tag}</span>
          ))}
          {tags.length === 0 && <span className="tag tag-neutral">article</span>}
          <span className="article-reading-time" style={{ marginLeft: 'auto' }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M6 3.5V6l1.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            {article.reading_time ?? 5} min
          </span>
        </div>
        <div>
          <h2 className="article-card-title">{article.title}</h2>
          {article.excerpt && (
            <p className="article-card-excerpt" style={{ marginTop: 8 }}>{article.excerpt}</p>
          )}
        </div>
        <div className="article-card-footer">
          <div className="article-card-author">
            <div className="avatar avatar-sm">{initials}</div>
            <span>{article.author_name || 'Anonymous'}</span>
            <span style={{ color: 'var(--text-muted)' }}>· {date}</span>
          </div>
          <div className="article-card-stats">
            <span>♥ {likesCount}</span>
            <span>💬 {commentsCount}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>
}) {
  const { tag } = await searchParams
  const articles = await getArticles(tag)

  return (
    <div style={{ paddingBottom: 80 }}>

      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border)', padding: '56px 0 40px' }}>
        <div className="container">
          <div className="section-label" style={{ marginBottom: 12 }}>All articles</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8 }}>
                {tag
                  ? <>Articles tagged <span className="gradient-text">#{tag}</span></>
                  : <>Explore <span className="gradient-text">ML Articles</span></>
                }
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
                {articles.length} article{articles.length !== 1 ? 's' : ''} published
              </p>
            </div>
            <Link href="/articles/new" className="btn btn-primary">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1.5v11M1.5 7h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              Write article
            </Link>
          </div>

          {/* Tag filters */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 28 }}>
            <Link
              href="/articles"
              className={`tag ${!tag ? 'tag-primary' : 'tag-neutral'}`}
            >
              All
            </Link>
            {ALL_TAGS.map(t => (
              <Link
                key={t}
                href={`/articles?tag=${t}`}
                className={`tag ${tag === t ? 'tag-primary' : 'tag-neutral'}`}
              >
                {t}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Articles grid */}
      <div className="container" style={{ paddingTop: 40 }}>
        {articles.length === 0 ? (
          <div className="card empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>
              {tag ? `No articles tagged #${tag}` : 'No articles yet'}
            </h3>
            <p style={{ fontSize: 14, marginBottom: 24 }}>
              {tag ? 'Try a different tag or browse all.' : 'Be the first to publish!'}
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              {tag && (
                <Link href="/articles" className="btn btn-ghost btn-sm">
                  Clear filter
                </Link>
              )}
              <Link href="/articles/new" className="btn btn-primary">
                Write an article
              </Link>
            </div>
          </div>
        ) : (
          <div className="articles-grid">
            {articles.map((article: any, i: number) => (
              <div
                key={article.id}
                className="anim-fade-up"
                style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}
              >
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}