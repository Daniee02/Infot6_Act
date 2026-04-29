'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/',          label: 'Home' },
  { href: '/articles',  label: 'Articles' },
  { href: '/dashboard', label: 'Dashboard' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className="navbar" style={{ borderBottomColor: scrolled ? 'var(--border-strong)' : 'var(--border)' }}>
      <div className="container">
        <div className="navbar-inner">

          <Link href="/" className="navbar-logo">
            <div className="logo-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="4" r="2.2" fill="white" fillOpacity="0.9" />
                <circle cx="3" cy="13" r="2.2" fill="white" fillOpacity="0.9" />
                <circle cx="15" cy="13" r="2.2" fill="white" fillOpacity="0.9" />
                <line x1="9" y1="6" x2="3.8" y2="11.2" stroke="white" strokeOpacity="0.6" strokeWidth="1.3" />
                <line x1="9" y1="6" x2="14.2" y2="11.2" stroke="white" strokeOpacity="0.6" strokeWidth="1.3" />
                <line x1="3" y1="13" x2="15" y2="13" stroke="white" strokeOpacity="0.6" strokeWidth="1.3" />
              </svg>
            </div>
            <span className="gradient-text-subtle">ML Hub</span>
          </Link>

          <ul className="navbar-nav">
            {NAV_LINKS.map(link => (
              <li key={link.href}>
                <Link href={link.href} className={`navbar-link ${pathname === link.href ? 'active' : ''}`}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="navbar-actions">
            <Link href="/auth" className="btn btn-ghost btn-sm">Sign in</Link>
            <Link href="/articles/new" className="btn btn-primary btn-sm">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M6.5 1.5v10M1.5 6.5h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              Write
            </Link>
          </div>

        </div>
      </div>
    </nav>
  )
}