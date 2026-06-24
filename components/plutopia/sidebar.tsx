import { forwardRef } from 'react'
import { Ghost, X } from 'lucide-react'
import { Emoji } from './emoji'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  onNavigateToVods: () => void
  translateX: number
  isDragging: boolean
  overlayOpacity: number
  sidebarWidth: number
  isHydrated?: boolean
}

const channels = [
  { emoji: '🏠', label: 'Living Room' },
  { emoji: '🎬', label: 'Clips' },
  { emoji: '💻', label: 'Set Ups' },
  { emoji: '🐾', label: 'Pets' },
  { emoji: '🍕', label: 'Food' },
  { emoji: '🚗', label: 'Cars' },
  { emoji: '🤳', label: 'Selfies' },
  { emoji: '😂', label: 'Memes' },
  { emoji: '🎮', label: 'Code: PLutovswrld' },
  { emoji: '🔓', label: 'Unban Requests' },
]

export const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  ({ isOpen, onClose, onNavigateToVods, translateX, isDragging, overlayOpacity, sidebarWidth, isHydrated = false }, ref) => {
    const transitionStyle = !isHydrated || isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)'

    return (
      <>
        <div
          ref={ref}
          className="fixed top-0 left-0 h-full bg-plutopia-darker border-r border-plutopia-dark z-50 md:hidden"
          style={{
            width: `${sidebarWidth}px`,
            transform: `translateX(${translateX}px)`,
            transition: transitionStyle,
            willChange: 'transform',
            paddingTop: 'env(safe-area-inset-top)',
          }}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-plutopia-dark mt-4">
              <div className="flex items-center gap-2">
                <Ghost size={24} className="text-plutopia-accent" />
                <span className="text-white font-semibold">Plutopia</span>
              </div>
              <button
                onClick={onClose}
                className="md:hidden text-plutopia-ghost hover:text-white transition-colors"
                aria-label="Close sidebar"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                <div className="bg-plutopia-dark rounded-lg p-3 mb-6 flex items-center gap-3">
                  <Emoji char="📋" size={22} />
                  <span className="text-white font-semibold">START-HERE</span>
                </div>

                <div className="mb-6">
                  <h3 className="text-plutopia-ghost text-xs font-semibold mb-4 uppercase tracking-wide">
                    Important Stuff
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={onNavigateToVods}
                      className="flex items-center gap-3 text-plutopia-ghost hover:text-white transition-colors w-full"
                    >
                      <Emoji char="📹" size={20} />
                      <span className="text-sm">VOD</span>
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-plutopia-ghost text-xs font-semibold mb-4 uppercase tracking-wide">
                    Channels
                  </h3>
                  <div className="space-y-3">
                    {channels.map((ch, index) => (
                      <button
                        key={index}
                        className="flex items-center gap-3 text-plutopia-ghost hover:text-white transition-colors w-full"
                      >
                        <Emoji char={ch.emoji} size={20} />
                        <span className="text-sm">{ch.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          style={{
            opacity: overlayOpacity,
            pointerEvents: isOpen || isDragging ? 'auto' : 'none',
            transition: isDragging ? 'none' : 'opacity 0.3s ease',
          }}
          onClick={onClose}
        />
      </>
    )
  }
)

Sidebar.displayName = 'Sidebar'
