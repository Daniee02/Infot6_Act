'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function LikeButton({ articleId }: { articleId: number }) {
  const [count, setCount] = useState(0)

  const loadLikes = async () => {
    const { count, error } = await supabase
      .from('article_likes')
      .select('*', { count: 'exact', head: true })
      .eq('article_id', articleId)

    if (error) {
      console.error('Load likes error:', error.message)
      return
    }
    setCount(count || 0)
  }

  const handleLike = async () => {
    const { data, error: userError } = await supabase.auth.getUser()
    if (userError) {
      alert(userError.message)
      return
    }

    const user = data.user
    if (!user) {
      alert('Please log in to like.')
      return
    }

    const { error } = await supabase.from('article_likes').upsert({
      article_id: articleId,
      user_id: user.id,
    })

    if (error) {
      alert('Like failed: ' + error.message)
      console.error('Like error:', error.message)
      return
    }

    loadLikes()
  }

  useEffect(() => {
    loadLikes()
  }, [])

  return (
    <button
      onClick={handleLike}
      className="rounded-xl bg-pink-600 px-4 py-2 text-sm font-semibold hover:bg-pink-500"
    >
      Like ({count})
    </button>
  )
}