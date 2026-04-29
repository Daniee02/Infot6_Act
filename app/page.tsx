import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const POPULAR_TAGS = ['transformers', 'rlhf', 'nlp', 'computer-vision', 'alignment', 'generative-ai', 'scaling', 'engineering', 'vectors', 'architecture']

async function getArticles() {
  const { data } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(12)
  return data ?? []
}

function ArticleCard({ article }: { article: any }) {
  const date = new Date(article.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })
  const initials = (article.author_name || 'AN')
    .split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
  const tags: string[] = article.tags ?? []

  return (
    <Link href={`/articles/${article.id}`} style={{ display: 'block' }}>
      <article className="card card-hover article-card">
        <div className="article-card-meta">
          {tags.slice(0, 2).map(tag => (
            <span key={tag} className="tag tag-primary">{tag}</span>
          ))}
          <span className="article-reading-time" style={{ marginLeft: 'auto' }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M6 3.5V6l1.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            {article.reading_time ?? '5'} min
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
            <span>♥ {article.likes_count ?? 0}</span>
            <span>💬 {article.comments_count ?? 0}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}

function EmptyState() {
  return (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="card empty-state">
        <div className="empty-state-icon">✍️</div>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>
          No articles yet
        </h3>
        <p style={{ fontSize: 14, marginBottom: 24 }}>
          Be the first to share your ML knowledge with the community.
        </p>
        <Link href="/articles/new" className="btn btn-primary">
          Write the first article
        </Link>
      </div>
    </div>
  )
}

export default async function HomePage() {
  const articles = await getArticles()

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-label anim-fade-in">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 8px var(--success)', display: 'inline-block' }} />
            Explore · Learn · Publish
          </div>
          <h1 className="hero-title anim-fade-up">
            The Frontier of{' '}
            <span className="gradient-text">Machine Learning</span>
          </h1>
          <p className="hero-subtitle anim-fade-up delay-100">
            Deep-dive articles, research breakdowns, and engineering guides —
            written by practitioners for practitioners.
          </p>
          <div className="hero-actions anim-fade-up delay-200">
            <Link href="/articles" className="btn btn-primary btn-lg">
              Browse Articles
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link href="/articles/new" className="btn btn-secondary btn-lg">Start Writing</Link>
          </div>
        </div>
      </section>

      {/* Tags */}
      <section className="section-sm">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span className="section-label">Browse by topic</span>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {POPULAR_TAGS.map(tag => (
                <Link key={tag} href={`/articles?tag=${tag}`} className="tag tag-neutral">{tag}</Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="section-sm">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <div>
              <div className="section-label" style={{ marginBottom: 8 }}>Latest articles</div>
              <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em' }}>
                Fresh from the community
              </h2>
            </div>
            {articles.length > 0 && (
              <Link href="/articles" className="btn btn-ghost btn-sm">View all</Link>
            )}
          </div>
          <div className="articles-grid">
            {articles.length > 0
              ? articles.map((article: any, i: number) => (
                  <div key={article.id} className="anim-fade-up" style={{ animationDelay: `${i * 0.06}s`, opacity: 0 }}>
                    <ArticleCard article={article} />
                  </div>
                ))
              : <EmptyState />
            }
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="card" style={{
            padding: '56px 48px', textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(124,110,250,0.12) 0%, rgba(34,211,238,0.06) 100%)',
            borderColor: 'rgba(124,110,250,0.22)', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)', width: 300, height: 200, background: 'radial-gradient(ellipse, rgba(124,110,250,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative' }}>
              <div className="section-label" style={{ justifyContent: 'center', marginBottom: 20 }}>Share your knowledge</div>
              <h2 style={{ fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 800, marginBottom: 16, letterSpacing: '-0.03em' }}>
                Ready to publish your <span className="gradient-text">research?</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 17, maxWidth: 480, margin: '0 auto 36px', lineHeight: 1.7 }}>
                Join ML practitioners sharing their insights, experiments, and breakthroughs.
              </p>
              <Link href="/articles/new" className="btn btn-primary btn-lg">Write an article</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}