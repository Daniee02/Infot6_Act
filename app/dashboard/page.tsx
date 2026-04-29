import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { redirect } from 'next/navigation'

async function getDashboardData() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .eq('author_id', user.id)
    .order('created_at', { ascending: false })

  return {
    user,
    articles: articles ?? [],
  }
}

function StatCard({ label, value, delta, icon, accent }: {
  label: string; value: string | number; delta?: string; icon: string; accent?: string
}) {
  return (
    <div className="card stat-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="stat-label">{label}</span>
        <div style={{
          width: 36, height: 36, borderRadius: 'var(--radius-sm)',
          background: accent ? `rgba(${accent}, 0.1)` : 'var(--bg-elevated)',
          border: `1px solid ${accent ? `rgba(${accent}, 0.2)` : 'var(--border)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
        }}>
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

  const totalLikes = articles.reduce((s: number, a: any) => s + (a.likes_count ?? 0), 0)
  const totalComments = articles.reduce((s: number, a: any) => s + (a.comments_count ?? 0), 0)
  const published = articles.filter((a: any) => a.status === 'published' || !a.status).length

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'there'
  const initials = displayName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div style={{ paddingBottom: 80 }}>

      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border)', padding: '48px 0 40px' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div className="avatar avatar-lg">{initials}</div>
              <div>
                <div className="section-label" style={{ marginBottom: 6 }}>Your workspace</div>
                <h1 style={{ fontSize: 'clamp(22px, 4vw, 34px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 4 }}>
                  Welcome back, <span className="gradient-text">{displayName}</span>
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: 13, fontFamily: 'var(--font-mono)' }}>
                  {user.email}
                </p>
              </div>
            </div>
            <Link href="/articles/new" className="btn btn-primary">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1.5v11M1.5 7h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              New article
            </Link>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 40 }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 48 }}>
          <StatCard label="ARTICLES" value={articles.length} icon="📝" accent="124,110,250" />
          <StatCard label="PUBLISHED" value={published} icon="🚀" accent="34,211,238" />
          <StatCard label="TOTAL LIKES" value={totalLikes} icon="♥" accent="248,113,113" />
          <StatCard label="COMMENTS" value={totalComments} icon="💬" accent="52,211,153" />
        </div>

        {/* Articles table */}
        <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div className="section-label" style={{ marginBottom: 8 }}>Your articles</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>
              {articles.length} article{articles.length !== 1 ? 's' : ''}
            </h2>
          </div>
        </div>

        {articles.length === 0 ? (
          <div className="card empty-state">
            <div className="empty-state-icon">📄</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>No articles yet</h3>
            <p style={{ fontSize: 14, marginBottom: 24 }}>Start writing and share your ML insights.</p>
            <Link href="/articles/new" className="btn btn-primary">Write your first article</Link>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Tags</th>
                  <th>Likes</th>
                  <th>Comments</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article: any) => (
                  <tr key={article.id}>
                    <td style={{ maxWidth: 300 }}>
                      <Link href={`/articles/${article.id}`}
                        style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14, lineHeight: 1.4 }}>
                        {article.title}
                      </Link>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {(article.tags ?? []).slice(0, 2).map((tag: string) => (
                          <span key={tag} className="tag tag-primary" style={{ fontSize: 11 }}>{tag}</span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span style={{ color: '#F87171', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                        ♥ {article.likes_count ?? 0}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                        💬 {article.comments_count ?? 0}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
                        {new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Link href={`/articles/${article.id}`} className="btn btn-ghost btn-sm">View</Link>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={async () => {
                            await supabase.from('articles').delete().eq('id', article.id)
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}