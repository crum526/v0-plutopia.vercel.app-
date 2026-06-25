'use client'

import { useState, useEffect, useRef } from 'react'
import { RefreshCw, X } from 'lucide-react'

export function UpdatePrompt() {
  const [showUpdate, setShowUpdate] = useState(false)
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null)
  const pendingUpdate = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return
    }

    const handleControllerChange = () => {
      // Only reload when the user explicitly clicked "Update Now".
      // Without this guard, the first SW install also fires controllerchange
      // and would cause an unwanted reload.
      if (pendingUpdate.current) {
        window.location.reload()
      }
    }

    navigator.serviceWorker.ready.then((registration) => {
      console.log('[SW] Service worker ready')

      // If a new SW is already waiting (e.g. page was refreshed after update landed)
      if (registration.waiting) {
        console.log('[SW] Found existing waiting worker')
        setWaitingWorker(registration.waiting)
        setShowUpdate(true)
      }

      // Detect when a new SW finishes installing and enters the waiting state
      registration.addEventListener('updatefound', () => {
        console.log('[SW] Update found')
        const newWorker = registration.installing
        if (!newWorker) return

        newWorker.addEventListener('statechange', () => {
          console.log('[SW] New worker state:', newWorker.state)
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New SW is installed and waiting — show the update banner
            console.log('[SW] New version waiting — showing update prompt')
            setWaitingWorker(newWorker)
            setShowUpdate(true)
          }
        })
      })

      // Poll for updates every 30 seconds
      const interval = setInterval(() => {
        registration.update().catch(() => {})
      }, 30000)

      return () => clearInterval(interval)
    })

    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange)

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange)
    }
  }, [])

  const handleUpdate = () => {
    if (!waitingWorker) return
    console.log('[SW] User confirmed update — sending SKIP_WAITING')
    pendingUpdate.current = true
    waitingWorker.postMessage({ type: 'SKIP_WAITING' })
    setShowUpdate(false)
  }

  const handleDismiss = () => {
    setShowUpdate(false)
  }

  if (!showUpdate) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:bottom-6 md:right-6 md:left-auto md:w-80 z-50">
      <div className="bg-plutopia-dark border border-plutopia-accent rounded-lg shadow-lg p-4 flex items-start gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <RefreshCw size={18} className="text-plutopia-accent" />
            <h3 className="font-semibold text-white">Update Available</h3>
          </div>
          <p className="text-sm text-plutopia-ghost mb-3">A new version of Plutopia is available.</p>
          <button
            onClick={handleUpdate}
            className="w-full bg-plutopia-accent hover:bg-plutopia-accent/90 text-plutopia-darker font-medium py-2 px-3 rounded transition-colors text-sm"
          >
            Update Now
          </button>
        </div>
        <button
          onClick={handleDismiss}
          className="text-plutopia-ghost hover:text-white transition-colors flex-shrink-0 mt-1"
          aria-label="Dismiss"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  )
}
