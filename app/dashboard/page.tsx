import Link from 'next/link'

type Article = { id: number; title: string; tags: string[]; likes_count: number; comments_count: number; created_at: string; status: 'published' | 'draft' }

async function getDashboardData() {
  // Replace with your Supabase query
  return {
    user: { email: 'alex@mlhub.dev', name: 'Alex Kim' },
    articles: [
      { id: 1, title: 'Understanding Transformer Attention Mechanisms', tags: ['transformers', 'nlp'], likes_count: 142, comments_count: 23, created_at: '2025-04-18', status: 'published' },
      { id: 2, title: 'Diffusion Models: From Noise to Image', tags: ['generative-ai'], likes_count: 98, comments_count: 15, created_at: '2025-04-15', status: 'published' },
      { id: 3, title: 'Draft: RLHF Implementation Notes', tags: ['rlhf'], likes_count: 0, comments_count: 0, created_at: '2025-04-20', status: 'draft' },
    ] as Article[],
  }
}

function StatCard({ label, value, delta, icon, accent }: { label: string; value: string | number; delta?: string; icon: string; accent?: string }) {
  return (
    <div className="card stat-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="stat-label">{label}</span>
        <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: accent ? `rgba(${accent}, 0.1)` : 'var(--bg-elevated)', border: `1px solid ${accent ? `rgba(${accent}, 0.2)` : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
          {icon}
        </div>
      </div>
      <div className="stat-value gradient-text-subtle">{value}</div>
      {delta && <div className="stat-delta">↑ {delta} this month</div>}
    </div>
  )
}

export default async function DashboardPage() {
  const { user, articles } = await getDashboardData()
  const totalLikes = articles.reduce((s, a) => s + a.likes_count, 0)
  const totalComments = articles.reduce((s, a) => s + a.comments_count, 0)
  const published = articles.filter(a => a.status === 'published').length

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ borderBottom: '1px solid var(--border)', padding: '48px 0 40px' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <div className="section-label" style={{ marginBottom: 12 }}>Your workspace</div>
              <h1 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8 }}>
                Welcome back, <span className="gradient-text">{user.name}</span>
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, fontFamily: 'var(--font-mono)' }}>{user.email}</p>
            </div>
            <Link href="/articles/new" className="btn btn-primary">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.5v11M1.5 7h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
              New article
            </Link>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 40 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 48 }}>
          <StatCard label="ARTICLES" value={articles.length} delta="+1" icon="📝" accent="124,110,250" />
          <StatCard label="PUBLISHED" value={published} icon="🚀" accent="34,211,238" />
          <StatCard label="TOTAL LIKES" value={totalLikes} delta="+24" icon="♥" accent="248,113,113" />
          <StatCard label="COMMENTS" value={totalComments} delta="+8" icon="💬" accent="52,211,153" />
        </div>

        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>{articles.length} articles</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <span className="tag tag-neutral">All ({articles.length})</span>
            <span className="tag tag-success">Published ({published})</span>
            <span className="tag tag-neutral">Drafts ({articles.length - published})</span>
          </div>
        </div>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th><th>Tags</th><th>Status</th><th>Likes</th><th>Comments</th><th>Date</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map(article => (
                <tr key={article.id}>
                  <td style={{ maxWidth: 280 }}>
                    <Link href={`/articles/${article.id}`} style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14 }}>{article.title}</Link>
                  </td>
                  <td><div style={{ display: 'flex', gap: 6 }}>{article.tags.slice(0, 2).map(tag => <span key={tag} className="tag tag-primary" style={{ fontSize: 11 }}>{tag}</span>)}</div></td>
                  <td><span className={`tag ${article.status === 'published' ? 'tag-success' : 'tag-neutral'}`} style={{ fontSize: 11 }}>{article.status === 'published' ? '● Live' : '○ Draft'}</span></td>
                  <td><span style={{ color: '#F87171', fontFamily: 'var(--font-mono)', fontSize: 13 }}>♥ {article.likes_count}</span></td>
                  <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>💬 {article.comments_count}</span></td>
                  <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>{new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link href={`/articles/${article.id}`} className="btn btn-ghost btn-sm">View</Link>
                      <button className="btn btn-danger btn-sm">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}