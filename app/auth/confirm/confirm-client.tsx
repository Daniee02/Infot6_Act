'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import type { EmailOtpType } from '@supabase/supabase-js'

export default function ConfirmClient() {
  const [message, setMessage] = useState('Verifying your email...')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null

    if (!token_hash || !type) {
      setMessage('Invalid confirmation link.')
      return
    }

    const verify = async () => {
      const { error } = await supabase.auth.verifyOtp({
        token_hash,
        type,
      })

      if (error) {
        setMessage(`Confirmation failed: ${error.message}`)
        return
      }

      setMessage('Email confirmed! Redirecting...')
      setTimeout(() => router.push('/dashboard'), 1500)
    }

    verify()
  }, [router, searchParams])

  return <main className="min-h-screen flex items-center justify-center">{message}</main>
}