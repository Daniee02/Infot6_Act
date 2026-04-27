'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function LikeButton({ articleId }: { articleId: number }) {
  const [count, setCount] = useState(0)

  const loadLikes = async () => {
    const { count } = await supabase
      .from('article_likes')
      .select('*', { count: 'exact', head: true })
      .eq('article_id', articleId)

    setCount(count || 0)
  }

  const handleLike = async () => {
    const { data } = await supabase.auth.getUser()
    const user = data.user
    if (!user) return

    await supabase.from('article_likes').upsert({
      article_id: articleId,
      user_id: user.id,
    })

    loadLikes()
  }

  useEffect(() => {
    loadLikes()
  }, [])

  return (
    <button
      onClick={handleLike}
      className="rounded-2xl bg-pink-600 px-4 py-2 font-semibold hover:bg-pink-500"
    >
      Like ({count})
    </button>
  )
}