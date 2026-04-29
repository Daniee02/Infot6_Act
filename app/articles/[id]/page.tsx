import Link from 'next/link'
import { notFound } from 'next/navigation'
import LikeButton from '../../../components/LikeButton'
import ShareButton from '../../../components/ShareButton'
import CommentSection from '../../../components/CommentSection'
type Params = { params: { id: string } }

async function getArticle(id: string) {
  // Replace with your Supabase query
  return {
    id: parseInt(id),
    title: 'Understanding Transformer Attention Mechanisms',
    content: `## Introduction\n\nThe transformer architecture, introduced in the landmark 2017 paper *"Attention is All You Need"*, has fundamentally reshaped natural language processing and beyond. At its core lies the **self-attention mechanism**.\n\n## What is Self-Attention?\n\nSelf-attention allows every token in a sequence to directly attend to every other token, regardless of distance. This overcomes the sequential bottleneck of RNNs.\n\nGiven a sequence of tokens represented as vectors, we compute three projections:\n\n- **Query (Q)** — what information am I looking for?\n- **Key (K)** — what information do I contain?\n- **Value (V)** — what information do I propagate?\n\n\`\`\`python\ndef attention(Q, K, V):\n    d_k = Q.size(-1)\n    scores = torch.matmul(Q, K.transpose(-2, -1)) / d_k ** 0.5\n    weights = F.softmax(scores, dim=-1)\n    return torch.matmul(weights, V)\n\`\`\`\n\n## Conclusion\n\nSelf-attention is the beating heart of every modern language model. Understanding it deeply is essential for any AI practitioner.`,
    tags: ['transformers', 'nlp', 'attention'],
    author_name: 'Alex Kim',
    author_initials: 'AK',
    author_bio: 'ML researcher focused on efficient transformer architectures and interpretability.',
    reading_time: 8,
    likes_count: 142,
    comments_count: 23,
    created_at: '2025-04-18',
  }
}

export default async function ArticlePage({ params }: Params) {
  const article = await getArticle(params.id)
  if (!article) notFound()

  const date = new Date(article.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div>
      <div className="article-hero">
        <div className="container-narrow">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, fontSize: 13, color: 'var(--text-muted)' }}>
            <Link href="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
            <span>›</span>
            <Link href="/articles" style={{ color: 'var(--text-muted)' }}>Articles</Link>
            <span>›</span>
            <span style={{ color: 'var(--text-secondary)' }}>{article.title}</span>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
            {article.tags.map(tag => <Link key={tag} href={`/articles?tag=${tag}`} className="tag tag-primary">{tag}</Link>)}
          </div>

          <h1 style={{ fontSize: 'clamp(28px, 5vw, 46px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 24 }}>
            {article.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="avatar avatar-md">{article.author_initials}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{article.author_name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {date} · {article.reading_time} min read
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <LikeButton articleId={article.id} initialCount={article.likes_count} />
              <ShareButton title={article.title} />
            </div>
          </div>
        </div>
      </div>

      <div className="container-narrow" style={{ paddingBottom: 80 }}>
        <article className="prose">
          {article.content.split('\n\n').map((block, i) => {
            if (block.startsWith('## ')) return <h2 key={i}>{block.slice(3)}</h2>
            if (block.startsWith('### ')) return <h3 key={i}>{block.slice(4)}</h3>
            if (block.startsWith('```')) {
              const code = block.replace(/```\w*\n?/, '').replace(/```$/, '')
              return <pre key={i}><code>{code}</code></pre>
            }
            if (block.startsWith('- ')) {
              return <ul key={i}>{block.split('\n').map((l, j) => <li key={j}>{l.slice(2)}</li>)}</ul>
            }
            return <p key={i}>{block.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1')}</p>
          })}
        </article>

        <div className="card" style={{ padding: '24px 28px', marginTop: 48, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div className="avatar avatar-lg">{article.author_initials}</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{article.author_name}</div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{article.author_bio}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 0', marginTop: 32, borderTop: '1px solid var(--border)', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>Did you find this helpful?</span>
          <div style={{ display: 'flex', gap: 10 }}>
            <LikeButton articleId={article.id} initialCount={article.likes_count} />
            <ShareButton title={article.title} />
          </div>
        </div>

        <CommentSection articleId={article.id} />
      </div>
    </div>
  )
}