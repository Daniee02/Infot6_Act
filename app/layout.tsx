import type { Metadata } from 'next'
import './globals.css'
import Navbar from '../components/Navbar'

export const metadata: Metadata = {
  title: {
    default: 'ML Hub — Machine Learning & AI Articles',
    template: '%s | ML Hub',
  },
  description: 'Discover cutting-edge articles on machine learning, deep learning, AI research, and the future of intelligent systems.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Navbar />
        <main>{children}</main>
        <footer className="footer">
          <div className="container">
            <div className="footer-inner">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 24, height: 24, background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)', borderRadius: 6 }} />
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, letterSpacing: '-0.03em' }}>ML Hub</span>
              </div>
              <span>© {new Date().getFullYear()} ML Hub. Built for the curious mind.</span>
              <div style={{ display: 'flex', gap: 20 }}>
                <a href="/articles" style={{ color: 'var(--text-muted)' }}>Articles</a>
                <a href="/dashboard" style={{ color: 'var(--text-muted)' }}>Dashboard</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}