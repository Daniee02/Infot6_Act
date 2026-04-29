import Link from 'next/link'

type Article = {
  id: number
  title: string
  excerpt: string
  tags: string[]
  author_name: string
  author_initials: string
  reading_time: number
  likes_count: number
  comments_count: number
  created_at: string
}

async function getArticles(): Promise<Article[]> {
  // Replace with: const { data } = await supabase.from('articles').select('*').order('created_at', { ascending: false })
  return [
    { id: 1, title: 'Understanding Transformer Attention Mechanisms', excerpt: 'A deep dive into how self-attention works in modern language models, from the math to the intuition behind each head.', tags: ['transformers', 'nlp'], author_name: 'Alex Kim', author_initials: 'AK', reading_time: 8, likes_count: 142, comments_count: 23, created_at: '2025-04-18' },
    { id: 2, title: 'Diffusion Models: From Noise to Image', excerpt: 'Exploring how diffusion models iteratively denoise latent representations to synthesize photorealistic imagery.', tags: ['generative-ai', 'computer-vision'], author_name: 'Sarah Chen', author_initials: 'SC', reading_time: 11, likes_count: 98, comments_count: 15, created_at: '2025-04-15' },
    { id: 3, title: 'RLHF: Aligning Language Models with Human Intent', excerpt: 'How reinforcement learning from human feedback shapes the behavior of large language models toward human preferences.', tags: ['rlhf', 'alignment'], author_name: 'Marcus P.', author_initials: 'MP', reading_time: 14, likes_count: 204, comments_count: 47, created_at: '2025-04-10' },
    { id: 4, title: 'Graph Neural Networks for Molecular Property Prediction', excerpt: 'Using GNNs to model molecular graphs and predict pharmacological properties for drug discovery workflows.', tags: ['gnn', 'research'], author_name: 'Jana Wu', author_initials: 'JW', reading_time: 9, likes_count: 76, comments_count: 11, created_at: '2025-04-07' },
    { id: 5, title: 'Mixture of Experts: Scaling Without Compromise', excerpt: 'An analysis of MoE architectures and how sparse activation enables massive parameter counts without proportional compute costs.', tags: ['architecture', 'scaling'], author_name: 'Ravi S.', author_initials: 'RS', reading_time: 12, likes_count: 189, comments_count: 34, created_at: '2025-04-03' },
    { id: 6, title: 'Building a RAG Pipeline with Vector Databases', excerpt: 'Step-by-step implementation of retrieval-augmented generation using embedding models and semantic vector search.', tags: ['rag', 'engineering'], author_name: 'Lucia M.', author_initials: 'LM', reading_time: 10, likes_count: 115, comments_count: 28, created_at: '2025-03-28' },
  ]
}

const POPULAR_TAGS = ['transformers', 'rlhf', 'nlp', 'computer-vision', 'alignment', 'generative-ai', 'scaling', 'engineering', 'vectors', 'architecture']

function ArticleCard({ article }: { article: Article }) {
  const date = new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  return (
    <Link href={`/articles/${article.id}`} style={{ display: 'block' }}>
      <article className="card card-hover article-card">
        <div className="article-card-meta">
          {article.tags.slice(0, 2).map(tag => <span key={tag} className="tag tag-primary">{tag}</span>)}
          <span className="article-reading-time" style={{ marginLeft: 'auto' }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" /><path d="M6 3.5V6l1.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
            {article.reading_time} min
          </span>
        </div>
        <div>
          <h2 className="article-card-title">{article.title}</h2>
          <p className="article-card-excerpt" style={{ marginTop: 8 }}>{article.excerpt}</p>
        </div>
        <div className="article-card-footer">
          <div className="article-card-author">
            <div className="avatar avatar-sm">{article.author_initials}</div>
            <span>{article.author_name}</span>
            <span style={{ color: 'var(--text-muted)' }}>· {date}</span>
          </div>
          <div className="article-card-stats">
            <span>♥ {article.likes_count}</span>
            <span>💬 {article.comments_count}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}

export default async function HomePage() {
  const articles = await getArticles()

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-label anim-fade-in">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 8px var(--success)', display: 'inline-block' }} />
            Explore · Learn · Publish
          </div>
          <h1 className="hero-title anim-fade-up">
            The Frontier of <span className="gradient-text">Machine Learning</span>
          </h1>
          <p className="hero-subtitle anim-fade-up delay-100">
            Deep-dive articles, research breakdowns, and engineering guides — written by practitioners for practitioners.
          </p>
          <div className="hero-actions anim-fade-up delay-200">
            <Link href="/articles" className="btn btn-primary btn-lg">
              Browse Articles
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
            <Link href="/articles/new" className="btn btn-secondary btn-lg">Start Writing</Link>
          </div>
          <div className="hero-stats anim-fade-up delay-300">
            {[{ value: '2,400+', label: 'Articles' }, { value: '840', label: 'Authors' }, { value: '48', label: 'Topics' }, { value: '18K', label: 'Readers' }].map(stat => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div className="hero-stat-value gradient-text-subtle">{stat.value}</div>
                <div className="hero-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span className="section-label">Browse by topic</span>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {POPULAR_TAGS.map(tag => <Link key={tag} href={`/articles?tag=${tag}`} className="tag tag-neutral">{tag}</Link>)}
            </div>
          </div>
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <div>
              <div className="section-label" style={{ marginBottom: 8 }}>Latest articles</div>
              <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em' }}>Fresh from the community</h2>
            </div>
            <Link href="/articles" className="btn btn-ghost btn-sm">View all</Link>
          </div>
          <div className="articles-grid">
            {articles.map((article, i) => (
              <div key={article.id} className="anim-fade-up" style={{ animationDelay: `${i * 0.06}s`, opacity: 0 }}>
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="card" style={{ padding: '56px 48px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(124,110,250,0.12) 0%, rgba(34,211,238,0.06) 100%)', borderColor: 'rgba(124,110,250,0.22)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)', width: 300, height: 200, background: 'radial-gradient(ellipse, rgba(124,110,250,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative' }}>
              <div className="section-label" style={{ justifyContent: 'center', marginBottom: 20 }}>Share your knowledge</div>
              <h2 style={{ fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 800, marginBottom: 16, letterSpacing: '-0.03em' }}>
                Ready to publish your <span className="gradient-text">research?</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 17, maxWidth: 480, margin: '0 auto 36px', lineHeight: 1.7 }}>
                Join thousands of ML practitioners sharing their insights, experiments, and breakthroughs.
              </p>
              <Link href="/articles/new" className="btn btn-primary btn-lg">Write an article</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}