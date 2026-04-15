'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-blue-200">
            System Integration and Architecture
          </p>

          <h1 className="text-5xl font-bold leading-tight md:text-7xl">
            Machine Learning Hub
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
            A simple integrated web application for exploring machine learning concepts,
            built with Next.js, Supabase Authentication, and deployed on Vercel.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/auth"
              className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500"
            >
              Get Started
            </Link>

            <a
              href="#features"
              className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Learn More
            </a>
          </div>
        </div>

        <div
          id="features"
          className="mt-20 grid gap-6 md:grid-cols-3"
        >
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-xl font-semibold">Frontend</h2>
            <p className="mt-3 text-slate-300">
              Displays the landing page, form, and user interface.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-xl font-semibold">Supabase Auth</h2>
            <p className="mt-3 text-slate-300">
              Handles sign up, login, and user session management.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-xl font-semibold">Vercel Deployment</h2>
            <p className="mt-3 text-slate-300">
              Publishes the app online so it can be accessed anywhere.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
