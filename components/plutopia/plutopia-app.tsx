'use client'

import { useState, useEffect } from 'react'
import { Header } from './header'
import { VideoPlayer } from './video-player'
import { BottomNav } from './bottom-nav'
import { Sidebar } from './sidebar'
import { DesktopSidebar } from './sidebar-desktop'
import { UnderConstructionModal } from './under-construction-modal'
import { InstallPrompt } from './install-prompt'
import { UpdatePrompt } from './update-prompt'
import { ChatPage } from './chat-page'
import { useLatestVod } from '@/hooks/use-latest-vod'
import { useDraggableSidebar } from '@/hooks/use-draggable-sidebar'

export function PlutopiaApp() {
  const { vodId, loading: vodLoading } = useLatestVod()
  const [activeTab, setActiveTab] = useState('headquarters')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        console.log('Service Worker registration failed or not supported')
      })
    }
  }, [])

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768)
    }

    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  const { sidebarRef, translateX, isDragging, bottomNavTranslate, overlayOpacity, sidebarWidth, isHydrated } =
    useDraggableSidebar({
      onOpen: () => setSidebarOpen(true),
      onClose: () => setSidebarOpen(false),
      isOpen: sidebarOpen,
    })

  const handleTabChange = (tab: string) => {
    if (tab === 'headquarters') {
      setActiveTab(tab)
    } else if (tab === 'shop' || tab === 'profile') {
      setActiveTab(tab)
      const titles: Record<string, string> = {
        shop: 'Shop',
        profile: 'Profile',
      }
      setModalTitle(titles[tab])
      setModalOpen(true)
    } else if (tab === 'chat') {
      setActiveTab(tab)
      setSidebarOpen(false)
    } else {
      setActiveTab(tab)
      setSidebarOpen(false)
    }
  }

  const handleCloseSidebar = () => {
    setSidebarOpen(false)
  }

  const handleNavigateToVods = () => {
    setActiveTab('vods')
    setSidebarOpen(false)
  }

  return (
    <div className="h-screen bg-plutopia-darker text-white flex overflow-hidden">
      {/* Mobile sidebar drawer */}
      <Sidebar
        ref={sidebarRef}
        isOpen={sidebarOpen}
        onClose={handleCloseSidebar}
        onNavigateToVods={handleNavigateToVods}
        onChannelClick={handleTabChange}
        translateX={translateX}
        isDragging={isDragging}
        overlayOpacity={overlayOpacity}
        sidebarWidth={sidebarWidth}
        isHydrated={isHydrated}
      />

      {/* Desktop sidebar */}
      <DesktopSidebar
        onNavigateToVods={handleNavigateToVods}
        onChannelClick={handleTabChange}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} channelName={activeTab} />

        <main className={`flex-1 flex flex-col overflow-hidden ${activeTab === 'chat' ? '' : 'items-center justify-start pb-32 px-4 py-2 md:pb-4'}`}>
          {activeTab === 'chat' && <ChatPage />}
          {activeTab === 'vods' && (
            <div className="w-full max-w-2xl mx-auto overflow-y-auto">
              <div className="flex flex-col gap-4">
                <p className="text-plutopia-ghost text-base text-center pt-2">
                  {"Watch Pluto's V.O.D within 24 hrs to grow your stream streak 🔥"}
                </p>
                {vodLoading ? (
                  <div className="flex items-center justify-center h-48">
                    <div className="w-8 h-8 border-2 border-plutopia-accent border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : vodId ? (
                  <VideoPlayer videoId={vodId} />
                ) : (
                  <p className="text-plutopia-ghost text-center">No VOD available right now.</p>
                )}
              </div>
            </div>
          )}
          {activeTab === 'headquarters' && !isDesktop && (
            <div className="w-full max-w-2xl mx-auto text-center overflow-y-auto">
              <p className="text-plutopia-ghost">Headquarters content</p>
            </div>
          )}
        </main>

        {activeTab !== 'chat' && <BottomNav activeTab={activeTab} onTabChange={handleTabChange} translateY={bottomNavTranslate} isDragging={isDragging} />}
      </div>

      <UnderConstructionModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setActiveTab('headquarters')
        }}
        title={modalTitle}
      />

      <InstallPrompt />
      <UpdatePrompt />
    </div>
  )
}
