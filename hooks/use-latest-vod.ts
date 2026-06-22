'use client'

import { useState, useEffect } from 'react'

const TWITCH_CHANNEL = process.env.NEXT_PUBLIC_TWITCH_CHANNEL ?? 'plutovswrld'
const FALLBACK_VOD_ID = '2720117957'

export function useLatestVod() {
  const [vodId, setVodId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchLatestVod() {
      try {
        const res = await fetch(`https://decapi.me/twitch/videos/${TWITCH_CHANNEL}?limit=1`, {
          signal: controller.signal,
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const text = (await res.text()).trim()
        const match = text.match(/\/videos\/(\d+)/)
        if (!match) throw new Error('No VOD found')
        setVodId(match[1])
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        setError((err as Error).message)
        setVodId(FALLBACK_VOD_ID)
      } finally {
        setLoading(false)
      }
    }

    fetchLatestVod()
    return () => controller.abort()
  }, [])

  return { vodId, loading, error }
}
