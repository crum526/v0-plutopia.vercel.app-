'use client'

import { useState, useMemo } from 'react'
import { X } from 'lucide-react'
import { iosEmojiCategories } from '@/lib/ios-emojis'

interface EmojiPickerModalProps {
  onSelectEmoji: (emoji: string) => void
  onClose: () => void
}

const categoryIcons: Record<string, string> = {
  'Smileys & People': '🙂',
  'Animals & Nature': '🐾',
  'Food & Drink': '🍎',
  'Travel & Places': '✈️',
  'Activities': '⚽',
  'Objects': '💡',
  'Symbols': '❤️',
  'Flags': '🇺🇸',
  'Recent': '🕐'
}

export function EmojiPickerModal({ onSelectEmoji, onClose }: EmojiPickerModalProps) {
  const [activeTab, setActiveTab] = useState('Smileys & People')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = useMemo(() => {
    if (searchQuery.trim()) {
      return [
        {
          name: 'Search Results',
          emojis: iosEmojiCategories
            .flatMap((cat) => cat.emojis)
            .filter((_, i, arr) => arr.indexOf(_) === i),
        },
      ]
    }
    return iosEmojiCategories
  }, [searchQuery])

  const currentCategory = categories.find((cat) => cat.name === activeTab) || categories[0]

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/50 z-40" />

      {/* Modal */}
      <div className="fixed bottom-20 right-4 left-4 sm:left-auto sm:right-4 sm:w-96 bg-plutopia-dark border border-plutopia-darker rounded-lg z-50 flex flex-col max-h-96 shadow-xl">
        {/* Search Bar */}
        <div className="p-3 border-b border-plutopia-darker">
          <input
            type="text"
            placeholder="Search Emoji"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-plutopia-darker border border-plutopia-dark rounded px-3 py-2 text-white placeholder-plutopia-ghost focus:outline-none focus:border-plutopia-accent text-sm"
          />
        </div>

        {/* Emojis Grid */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="grid grid-cols-8 gap-1">
            {currentCategory.emojis.map((emoji, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onSelectEmoji(emoji)
                }}
                className="hover:bg-plutopia-darker rounded p-1.5 transition-colors text-xl flex items-center justify-center"
                title={emoji}
                aria-label={emoji}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="border-t border-plutopia-darker p-2 flex gap-1 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveTab(cat.name)}
              className={`flex-shrink-0 text-xl p-2 rounded transition-colors ${
                activeTab === cat.name
                  ? 'bg-plutopia-darker text-plutopia-accent'
                  : 'text-plutopia-ghost hover:text-white'
              }`}
              title={cat.name}
              aria-label={cat.name}
            >
              {categoryIcons[cat.name] || '◇'}
            </button>
          ))}
          <button
            onClick={onClose}
            className="flex-shrink-0 ml-auto text-plutopia-ghost hover:text-white p-2 rounded transition-colors"
            aria-label="Close emoji picker"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </>
  )
}
