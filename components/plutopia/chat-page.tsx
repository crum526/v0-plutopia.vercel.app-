'use client'

import { useState, useRef } from 'react'
import { Plus, Smile, X } from 'lucide-react'
import { EmojiPickerModal } from './emoji-picker-modal'

interface Message {
  id: string
  username: string
  avatar: string
  text: string
  images: string[]
  reactions: Record<string, number>
  timestamp: Date
}

const mockAvatars = [
  '👤', '👨', '👩', '🧑', '👦', '👧', '🧒', '👶', '👴', '👵'
]

const mockUsers = ['GooseFoomoser', 'GraeDogs', 'MarvinRaven', 'JasonRose', 'poc02', 'AkirE', 'DN80', 'JayM']

function getRandomUser() {
  return {
    username: mockUsers[Math.floor(Math.random() * mockUsers.length)],
    avatar: mockAvatars[Math.floor(Math.random() * mockAvatars.length)]
  }
}

export function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target?.result) {
            setSelectedImages((prev) => [...prev, event.target.result as string])
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleSendMessage = () => {
    if (inputText.trim() || selectedImages.length > 0) {
      const user = getRandomUser()
      const newMessage: Message = {
        id: Date.now().toString(),
        username: user.username,
        avatar: user.avatar,
        text: inputText,
        images: selectedImages,
        reactions: {},
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, newMessage])
      setInputText('')
      setSelectedImages([])
    }
  }

  const handleEmojiSelect = (emoji: string) => {
    setInputText((prev) => prev + emoji)
    setShowEmojiPicker(false)
  }

  const handleAddReaction = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          return {
            ...msg,
            reactions: {
              ...msg.reactions,
              [emoji]: (msg.reactions[emoji] || 0) + 1,
            },
          }
        }
        return msg
      })
    )
  }

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col w-full h-full bg-plutopia-darker text-white">
      {/* Chat Header */}
      <div className="border-b border-plutopia-dark px-4 py-3 flex-shrink-0">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <span className="text-plutopia-accent">#</span>
          Living Room
        </h2>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 min-h-0">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-plutopia-ghost">
            <div className="text-center">
              <p className="text-lg mb-2">Welcome to Living Room</p>
              <p className="text-sm">Start a conversation</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="group hover:bg-plutopia-dark/30 px-2 py-1 rounded transition-colors">
              <div className="flex gap-3">
                {/* Avatar */}
                <div className="text-2xl flex-shrink-0">{message.avatar}</div>

                {/* Message Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-white text-sm">{message.username}</span>
                    <span className="text-xs text-plutopia-ghost">Today at {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  {/* Text */}
                  {message.text && <p className="text-sm text-plutopia-ghost mt-0.5 break-words">{message.text}</p>}

                  {/* Images */}
                  {message.images.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {message.images.map((image, idx) => (
                        <img key={idx} src={image} alt={`message-img-${idx}`} className="max-w-xs h-auto rounded" />
                      ))}
                    </div>
                  )}

                  {/* Reactions */}
                  {Object.keys(message.reactions).length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {Object.entries(message.reactions).map(([emoji, count]) => (
                        <button
                          key={emoji}
                          onClick={() => handleAddReaction(message.id, emoji)}
                          className="bg-plutopia-dark hover:bg-plutopia-darker rounded px-2 py-1 text-xs flex items-center gap-1 transition-colors"
                        >
                          {emoji} {count}
                        </button>
                      ))}
                      <button
                        onClick={() => handleAddReaction(message.id, '👍')}
                        className="text-plutopia-ghost hover:text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Image Preview Area */}
      {selectedImages.length > 0 && (
        <div className="flex-shrink-0 px-4 py-3 border-t border-plutopia-dark bg-plutopia-darker/50">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {selectedImages.map((image, index) => (
              <div key={index} className="relative flex-shrink-0">
                <img src={image} alt="preview" className="h-20 w-20 rounded object-cover" />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full p-0.5 hover:bg-red-600"
                  aria-label="Remove image"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="flex-shrink-0 border-t border-plutopia-dark px-4 py-3 bg-plutopia-darker">
        <div className="flex items-center gap-2">
          {/* Attachment Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-plutopia-ghost hover:text-plutopia-accent transition-colors flex-shrink-0"
            aria-label="Add attachment"
          >
            <Plus size={20} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleAddImage}
            className="hidden"
            aria-label="Image input"
          />

          {/* Message Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Message #Living Room..."
            className="flex-1 bg-plutopia-dark border border-plutopia-dark rounded px-3 py-2 text-white placeholder-plutopia-ghost focus:outline-none focus:border-plutopia-accent text-sm"
          />

          {/* Close/Emoji Picker Button */}
          {showEmojiPicker ? (
            <button
              onClick={() => setShowEmojiPicker(false)}
              className="text-plutopia-ghost hover:text-plutopia-accent transition-colors flex-shrink-0"
              aria-label="Close emoji picker"
            >
              <X size={20} />
            </button>
          ) : (
            <button
              onClick={() => setShowEmojiPicker(true)}
              className="text-plutopia-ghost hover:text-plutopia-accent transition-colors flex-shrink-0"
              aria-label="Emoji picker"
            >
              <Smile size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Emoji Picker Modal */}
      {showEmojiPicker && <EmojiPickerModal onSelectEmoji={handleEmojiSelect} onClose={() => setShowEmojiPicker(false)} />}
    </div>
  )
}
