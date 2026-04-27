'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

type Article = {
  id: number
  title: string
  content: string
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, content')
        .order('created_at', { ascending: false })

      if (!error && data) setArticles(data)
    }

    load()
  }, [])

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Articles</h1>
          <Link
            href="/articles/new"
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-500"
          >
            Publish
          </Link>
        </div>

        {articles.length === 0 && (
          <p className="text-slate-300">
            No articles yet. Click “Publish” to add one.
          </p>
        )}

        <ul className="space-y-4">
          {articles.map((a) => (
            <li key={a.id}>
              <Link
                href={`/articles/${a.id}`}
                className="block rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 hover:bg-slate-800"
              >
                <h2 className="text-xl font-semibold">{a.title}</h2>
                <p className="mt-1 line-clamp-2 text-sm text-slate-300">
                  {a.content}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}