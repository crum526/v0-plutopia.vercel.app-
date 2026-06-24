'use client'

import { Emoji } from './emoji'

interface EmojiPickerModalProps {
  onSelectEmoji: (emoji: string) => void
  onClose: () => void
}

const emojis = [
  { emoji: '🏠', label: 'Living Room' },
  { emoji: '🎬', label: 'Clips' },
  { emoji: '💻', label: 'Set Ups' },
  { emoji: '🐾', label: 'Pets' },
  { emoji: '🍕', label: 'Food' },
  { emoji: '🚗', label: 'Cars' },
  { emoji: '🤳', label: 'Selfies' },
  { emoji: '😂', label: 'Memes' },
  { emoji: '🎮', label: 'Code' },
  { emoji: '🔓', label: 'Requests' },
  { emoji: '📋', label: 'Start' },
  { emoji: '📹', label: 'VOD' },
  { emoji: '💎', label: 'Diamond' },
  { emoji: '❤️', label: 'Heart' },
]

export function EmojiPickerModal({ onSelectEmoji, onClose }: EmojiPickerModalProps) {
  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/50 z-40" />

      {/* Modal */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-plutopia-dark border border-plutopia-darker rounded-lg p-4 z-50 max-w-sm md:max-w-md">
        <div className="grid grid-cols-5 md:grid-cols-7 gap-3">
          {emojis.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                onSelectEmoji(item.emoji)
              }}
              className="hover:bg-plutopia-darker rounded p-2 transition-colors flex items-center justify-center"
              title={item.label}
              aria-label={item.label}
            >
              <Emoji char={item.emoji} size={28} />
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
