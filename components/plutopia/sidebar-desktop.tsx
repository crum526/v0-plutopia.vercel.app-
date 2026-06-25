import { Emoji } from './emoji'

interface DesktopSidebarProps {
  onNavigateToVods: () => void
  onChannelClick?: (channelLabel: string) => void
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
  { src: '/sprites-emoji.png', label: 'Sprites' },
  { emoji: '🎮', label: 'Code: Plutovswrld' },
  { emoji: '🔓', label: 'Unban Requests' },
]

export function DesktopSidebar({ onNavigateToVods, onChannelClick }: DesktopSidebarProps) {
  return (
    <div className="hidden md:flex md:w-64 bg-plutopia-darker border-r border-plutopia-dark flex-col h-screen sticky top-0">
      <div className="flex items-center gap-2 p-4 border-b border-plutopia-dark mt-4">
        <img src="/icon-512x512.png" alt="Plutopia icon" className="w-6 h-6 rounded" />
        <span className="text-white font-semibold">Plutopia</span>
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
                  onClick={() => {
                    if (ch.label === 'Living Room') {
                      onChannelClick?.('chat')
                    } else {
                      onChannelClick?.(ch.label)
                    }
                  }}
                  className="flex items-center gap-3 text-plutopia-ghost hover:text-white transition-colors w-full"
                >
                  <Emoji char={(ch as any).emoji} src={(ch as any).src} size={20} />
                  <span className="text-sm">{ch.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
