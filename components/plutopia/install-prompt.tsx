'use client'

import { useEffect, useState } from 'react'
import { Download, X, Share, Plus } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISS_KEY = 'plutopia-install-dismissed'

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Already installed / running standalone -> never show
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      // @ts-expect-error iOS Safari only
      window.navigator.standalone === true
    if (standalone) return

    if (sessionStorage.getItem(DISMISS_KEY) === '1') return

    const ua = window.navigator.userAgent.toLowerCase()
    const iOS = /iphone|ipad|ipod/.test(ua) && !/crios|fxios/.test(ua)
    setIsIOS(iOS)

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // iOS has no beforeinstallprompt — show manual instructions instead.
    if (iOS) {
      setVisible(true)
    }

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const dismiss = () => {
    setVisible(false)
    sessionStorage.setItem(DISMISS_KEY, '1')
  }

  const install = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-24 z-[70] w-[calc(100%-2rem)] max-w-md animate-in fade-in">
      <div className="bg-plutopia-dark border border-plutopia-darker rounded-2xl shadow-2xl p-4 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-plutopia-accent/15">
          <Download size={20} className="text-plutopia-accent" />
        </div>
        <div className="flex-1">
          <p className="text-white font-semibold text-sm">Install Plutopia</p>
          {isIOS ? (
            <p className="text-plutopia-ghost text-xs mt-1 leading-relaxed">
              Tap <Share size={12} className="inline -mt-0.5 text-plutopia-accent" /> Share, then
              <span className="inline-flex items-center gap-1 mx-1 text-white">
                <Plus size={12} className="text-plutopia-accent" />
                Add to Home Screen
              </span>
              to install.
            </p>
          ) : (
            <p className="text-plutopia-ghost text-xs mt-1 leading-relaxed">
              Add Plutopia to your home screen for the full app experience.
            </p>
          )}

          {!isIOS && (
            <button
              onClick={install}
              className="mt-3 inline-flex items-center gap-2 bg-plutopia-accent hover:bg-plutopia-accentHover text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <Download size={16} />
              Install
            </button>
          )}
        </div>
        <button
          onClick={dismiss}
          className="text-plutopia-ghost hover:text-white transition-colors shrink-0"
          aria-label="Dismiss install prompt"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  )
}
