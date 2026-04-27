'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../../lib/supabase'
import LikeButton from '../../../components/LikeButton'
import CommentSection from '../../../components/CommentSection'

type Article = {
  id: number
  title: string
  content: string
  created_at: string
}

export default function ArticleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params.id)
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadArticle = async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, content, created_at')
        .eq('id', id)
        .single()

      if (error) {
        console.error(error.message)
        router.push('/articles')
        return
      }

      setArticle(data)
      setLoading(false)
    }

    if (id) loadArticle()
  }, [id, router])

  if (loading || !article) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
        <div className="mx-auto max-w-3xl">Loading...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold">{article.title}</h1>
          <Link
            href="/articles"
            className="text-sm text-blue-300 hover:text-blue-200"
          >
            Back to Articles
          </Link>
        </div>

        <p className="text-xs text-slate-500">
          {new Date(article.created_at).toLocaleString()}
        </p>

        <p className="mt-4 whitespace-pre-line text-slate-200">
          {article.content}
        </p>

        <div className="mt-6">
          <LikeButton articleId={article.id} />
        </div>

        <CommentSection articleId={article.id} />
      </div>
    </main>
  )
}