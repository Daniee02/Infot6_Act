'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

type Article = {
  id: number
  title: string
  content: string
  created_at: string
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])

  useEffect(() => {
    const loadArticles = async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) setArticles(data)
    }

    loadArticles()
  }, [])

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold">Articles</h1>
          <Link
            href="/articles/new"
            className="rounded-2xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500"
          >
            Publish Article
          </Link>
        </div>

        <div className="grid gap-6">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.id}`}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
            >
              <h2 className="text-2xl font-semibold">{article.title}</h2>
              <p className="mt-3 line-clamp-3 text-slate-300">
                {article.content}
              </p>
            </Link>
          ))}

          {articles.length === 0 && (
            <p className="text-slate-300">
              No articles yet. Click “Publish Article” to add one.
            </p>
          )}
        </div>
      </div>
    </main>
  )
}