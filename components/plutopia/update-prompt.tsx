'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, X } from 'lucide-react'

export function UpdatePrompt() {
  const [showUpdate, setShowUpdate] = useState(false)
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return
    }

    const handleControllerChange = () => {
      console.log('[v0] Service worker controller changed, reloading')
      setShowUpdate(false)
      window.location.reload()
    }

    // Check for updates when the component mounts
    navigator.serviceWorker.ready.then((registration) => {
      console.log('[v0] Service worker ready')
      
      // Check if there's already a waiting worker
      if (registration.waiting) {
        console.log('[v0] Found existing waiting worker')
        setWaitingWorker(registration.waiting)
        setShowUpdate(true)
      }

      // Listen for waiting service worker
      registration.addEventListener('updatefound', () => {
        console.log('[v0] Update found')
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            console.log('[v0] New worker state:', newWorker.state)
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker is ready
              console.log('[v0] New service worker installed and ready')
              setWaitingWorker(newWorker)
              setShowUpdate(true)
            }
          })
        }
      })

      // Check for updates every 60 seconds
      const interval = setInterval(() => {
        console.log('[v0] Checking for updates')
        registration.update().catch(() => {
          // Silently handle errors
        })
      }, 60000)

      return () => clearInterval(interval)
    })

    // Listen for controller change to reload when update is applied
    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange)

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange)
    }
  }, [])

  const handleUpdate = () => {
    if (waitingWorker) {
      console.log('[v0] Sending SKIP_WAITING to service worker')
      waitingWorker.postMessage({ type: 'SKIP_WAITING' })
      setShowUpdate(false)
    }
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
