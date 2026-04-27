'use client'

export default function ShareButton() {
  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href)
    alert('Article link copied!')
  }

  return (
    <button
      onClick={handleShare}
      className="rounded-2xl bg-emerald-600 px-4 py-2 font-semibold hover:bg-emerald-500"
    >
      Share
    </button>
  )
}