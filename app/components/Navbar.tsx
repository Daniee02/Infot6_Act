'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/articles', label: 'Articles' },
  { href: '/dashboard', label: 'Dashboard' },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data }) => setUser(data.user))

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setDropdownOpen(false)
    router.push('/')
    router.refresh()
  }

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || ''
  const initials = displayName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <nav className="navbar" style={{ borderBottomColor: scrolled ? 'var(--border-strong)' : 'var(--border)' }}>
      <div className="container">
        <div className="navbar-inner">

          {/* Logo */}
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

          {/* Nav links */}
          <ul className="navbar-nav">
            {NAV_LINKS.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`navbar-link ${pathname === link.href ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="navbar-actions">
            {user ? (
              <>
                <Link href="/articles/new" className="btn btn-primary btn-sm">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M6.5 1.5v10M1.5 6.5h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                  Write
                </Link>

                {/* User dropdown */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setDropdownOpen(v => !v)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border)',
                      borderRadius: 100,
                      padding: '5px 12px 5px 5px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      color: 'var(--text-primary)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                  >
                    <div className="avatar avatar-sm" style={{ width: 26, height: 26, fontSize: 11 }}>
                      {initials}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 500, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {displayName}
                    </span>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                      style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', color: 'var(--text-muted)' }}>
                      <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <>
                      {/* Backdrop */}
                      <div
                        style={{ position: 'fixed', inset: 0, zIndex: 40 }}
                        onClick={() => setDropdownOpen(false)}
                      />
                      {/* Dropdown */}
                      <div style={{
                        position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border-strong)',
                        borderRadius: 'var(--radius)',
                        minWidth: 200,
                        boxShadow: 'var(--shadow-lg)',
                        zIndex: 50,
                        overflow: 'hidden',
                        animation: 'slideDown 0.18s ease forwards',
                      }}>
                        {/* User info */}
                        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                            {displayName}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {user.email}
                          </div>
                        </div>

                        {/* Links */}
                        {[
                          { href: '/dashboard', label: 'Dashboard', icon: '📊' },
                          { href: '/articles/new', label: 'New article', icon: '✏️' },
                        ].map(item => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setDropdownOpen(false)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 10,
                              padding: '10px 16px', fontSize: 14,
                              color: 'var(--text-secondary)',
                              transition: 'background 0.15s, color 0.15s',
                              borderBottom: '1px solid var(--border)',
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.background = 'var(--bg-hover)'
                              e.currentTarget.style.color = 'var(--text-primary)'
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.background = 'transparent'
                              e.currentTarget.style.color = 'var(--text-secondary)'
                            }}
                          >
                            <span>{item.icon}</span>
                            {item.label}
                          </Link>
                        ))}

                        {/* Sign out */}
                        <button
                          onClick={handleSignOut}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '10px 16px', fontSize: 14,
                            color: 'var(--danger)',
                            background: 'none', border: 'none',
                            cursor: 'pointer', width: '100%', textAlign: 'left',
                            fontFamily: 'var(--font-body)',
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(248,113,113,0.08)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M5 12H2.5A1.5 1.5 0 011 10.5v-7A1.5 1.5 0 012.5 2H5M9.5 10l3-3-3-3M12.5 7H5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Sign out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/auth" className="btn btn-ghost btn-sm">Sign in</Link>
                <Link href="/auth" className="btn btn-primary btn-sm">Get started</Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  )
}