import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Machine Learning Hub',
  description: 'Simple ML platform using Supabase and Vercel',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
