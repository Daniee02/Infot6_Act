'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import LikeButton from '../../../components/LikeButton'
import ShareButton from '../../../components/ShareButton'
import CommentSection from '../../../components/CommentSection'

type Article = {
  id: number
  title: string
  content: string
}

export default function ArticleDetailPage() {
  const params = useParams()
  const id = Number(params.id)   // this "id" comes from the [id] folder name
  const [article, setArticle] = useState<Article | null>(null)

  useEffect(() => {
    const loadArticle = async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single()

      if (!error && data) {
        setArticle(data)
      }
    }

    if (id) loadArticle()
  }, [id])

  if (!article) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
        <div className="mx-auto max-w-4xl">Loading...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold">{article.title}</h1>
        <p className="mt-6 whitespace-pre-line text-slate-300">
          {article.content}
        </p>

        <div className="mt-8 flex gap-4">
          <LikeButton articleId={article.id} />
          <ShareButton />
        </div>

        <CommentSection articleId={article.id} />
      </div>
    </main>
  )
}